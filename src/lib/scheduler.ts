import {
  User,
  Slot,
  DaySchedule,
  SlotAssignment,
} from "./types";
import {
  getDaysInMonth,
  isAvailable,
  getDayName,
  isWeekend,
  isHoliday,
} from "./utils";

import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { parkingConfig, usersList } from "./config";

const slots = ["332", "27", "28"] as const;

type UnavailableSlotsByDate = Record<string, Slot[]>;

const unavailableSlotsByDate: UnavailableSlotsByDate = {};

function getCombinations<T>(arr: T[], k: number): T[][] {
  const result: T[][] = [];
  const current: T[] = [];
  function backtrack(start: number) {
    if (current.length === k) {
      result.push([...current]);
      return;
    }
    for (let i = start; i < arr.length; i++) {
      current.push(arr[i]);
      backtrack(i + 1);
      current.pop();
    }
  }
  backtrack(0);
  return result;
}

function getPermutations<T>(arr: T[]): T[][] {
  const result: T[][] = [];
  const used = new Array<boolean>(arr.length).fill(false);
  const current: T[] = [];

  function backtrack() {
    if (current.length === arr.length) {
      result.push([...current]);
      return;
    }
    for (let i = 0; i < arr.length; i++) {
      if (used[i]) continue;
      used[i] = true;
      current.push(arr[i]);
      backtrack();
      current.pop();
      used[i] = false;
    }
  }

  backtrack();
  return result;
}

function getPartialPermutations<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  const used = new Array<boolean>(arr.length).fill(false);
  const current: T[] = [];

  function backtrack() {
    if (current.length === size) {
      result.push([...current]);
      return;
    }
    for (let i = 0; i < arr.length; i++) {
      if (used[i]) continue;
      used[i] = true;
      current.push(arr[i]);
      backtrack();
      current.pop();
      used[i] = false;
    }
  }

  backtrack();
  return result;
}

function evaluateFairnessScore(
  stats: Record<User, { primary: number; backup: number; slot332: number }>,
): number {
  const fairness = parkingConfig.fairness;
  const userValues = usersList.map(
    (user) =>
      stats[user].primary * fairness.primaryWeight +
      stats[user].backup * fairness.backupWeight -
      stats[user].slot332 * fairness.slot332Penalty,
  );

  const maxValue = Math.max(...userValues);
  const minValue = Math.min(...userValues);

  const primaryCounts = usersList.map((user) => stats[user].primary);
  const backupCounts = usersList.map((user) => stats[user].backup);
  const slot332Counts = usersList.map((user) => stats[user].slot332);

  const rangePrimary = Math.max(...primaryCounts) - Math.min(...primaryCounts);
  const rangeBackup = Math.max(...backupCounts) - Math.min(...backupCounts);
  const range332 = Math.max(...slot332Counts) - Math.min(...slot332Counts);

  // Weight by how close the composite score is across users first, then by distribution stability.
  return (
    (maxValue - minValue) * fairness.compositeRangeWeight +
    rangePrimary * fairness.primaryRangeWeight +
    rangeBackup * fairness.backupRangeWeight +
    range332 * fairness.slot332RangeWeight
  );
}

function violatesAssignmentRule(
  slot: Slot,
  assignedUsers: (User | null)[],
  date: Date,
): boolean {
  return parkingConfig.scheduler.rules.some((rule) => {
    if (!rule.slots.includes(slot)) return false;
    if (rule.weekdays && !rule.weekdays.includes(date.getDay())) return false;
    if (
      rule.dates &&
      !rule.dates.some((ruleDate) => dayjs(date).isSame(dayjs(ruleDate)))
    ) {
      return false;
    }
    if (
      rule.afterDateExclusive &&
      !dayjs(date).isAfter(dayjs(rule.afterDateExclusive))
    ) {
      return false;
    }
    const has = (user: string) =>
      assignedUsers.some((assignedUser) => assignedUser === user);

    return (
      rule.forbiddenUsers?.some(has) === true ||
      rule.forbiddenPairs?.some(([first, second]) => has(first) && has(second)) ===
        true
    );
  });
}

export function generateSchedule(year: number, month: number): DaySchedule[] {
  const days = getDaysInMonth(year, month).filter(
    (date) => !isWeekend(date) && !isHoliday(date),
  );
  const schedule: DaySchedule[] = [];

  // Track usage for fairness
  const userStats = {} as Record<
    User,
    { primary: number; backup: number; slot332: number }
  >;
  usersList.forEach((user) => {
    userStats[user] = { primary: 0, backup: 0, slot332: 0 };
  });

  for (const date of days) {
    const availableUsers = usersList.filter((user) => isAvailable(user, date));
    if (availableUsers.length < 6) {
      continue;
    }

    dayjs.extend(utc);
    dayjs.extend(timezone);
    const phtDate = dayjs(date)
      .tz(parkingConfig.timezone)
      .format("YYYY-MM-DD");

    const unavailableSlots = unavailableSlotsByDate[phtDate] ?? [];

    const assignments: Record<Slot, SlotAssignment> = {} as Record<
      Slot,
      SlotAssignment
    >;

    let bestAssignment: {
      slots: Record<Slot, SlotAssignment>;
      score: number;
    } | null = null;

    const candidateGroups = getCombinations(
      availableUsers,
      slots.length * 2,
    );

    for (const group of candidateGroups) {
      const primaryOptions = getPartialPermutations(
        group,
        slots.length,
      );

      for (const primarySet of primaryOptions) {
        const remainingForBackup = group.filter(
          (user) => !primarySet.includes(user),
        );
        const backupOptions = getPermutations(remainingForBackup);

        for (const backupSet of backupOptions) {
          let invalid = false;
          const daySlots: Record<Slot, SlotAssignment> = {
            332: { primary: primarySet[0], backup: backupSet[0] },
            27: { primary: primarySet[1], backup: backupSet[1] },
            28: { primary: primarySet[2], backup: backupSet[2] },
          };

          // THEN validate per slot safely
          for (const slot of slots) {
            if (slot === "332") {
              daySlots[slot] = null;
              continue;
            }
            const primary = daySlots[slot]?.primary ?? null;
            const backup = daySlots[slot]?.backup ?? null;

            if (primary === backup) {
              invalid = true;
              break;
            }
            if (
              violatesAssignmentRule(slot, [primary, backup], date)
            ) {
              invalid = true;
              break;
            }
          }

          if (invalid) {
            continue;
          }

          const projectedStats = usersList.reduce(
            (acc, user) => {
              acc[user] = { ...userStats[user] };
              return acc;
            },
            {} as Record<
              User,
              { primary: number; backup: number; slot332: number }
            >,
          );

          slots.forEach((slot, i) => {
            const primary = primarySet[i];
            const backup = backupSet[i];

            projectedStats[primary].primary += 1;
            projectedStats[backup].backup += 1;

            if (slot === "332") {
              projectedStats[primary].slot332 += 1;
            }
            if (unavailableSlots.includes(slot)) {
              daySlots[slot] = null;
              return;
            }
          });

          const score = evaluateFairnessScore(projectedStats);

          if (!bestAssignment || score < bestAssignment.score) {
            bestAssignment = { slots: daySlots, score };
          }
        }
      }
    }

    if (!bestAssignment) {
      continue;
    }

    Object.entries(bestAssignment.slots).forEach(([slotKey, slotValue]) => {
      const slot = slotKey as Slot;
      assignments[slot] = slotValue;
      if (slotValue) {
        userStats[slotValue.primary!].primary += 1;
        userStats[slotValue.backup!].backup += 1;
        if (slot === "332") {
          userStats[slotValue.primary!].slot332 += 1;
        }
      }
    });

    const dateOverride = parkingConfig.scheduler.dateOverrides.find(
      (override) => override.date === phtDate,
    );
    if (dateOverride) {
      Object.entries(dateOverride.assignments).forEach(([slot, assignment]) => {
        assignments[slot as Slot] = assignment as SlotAssignment;
      });
    }

    schedule.push({
      date: phtDate,
      day: getDayName(date),
      slots: assignments,
      unavailableSlots: [],
    });
  }

  return schedule;
}
