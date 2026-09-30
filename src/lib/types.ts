import { usersList } from "./constants";

export type User = (typeof usersList)[number];

export type Slot = "332" | "27" | "28";

export type SlotAssignment = {
  primary: User | null;
  backup: User | null;
} | null;

type SlotState = SlotAssignment | null;

export type DaySlots = Record<Slot, SlotState>;

export type DaySchedule = {
  date: string; // YYYY-MM-DD
  day: string; // e.g., "Monday"
  slots: DaySlots;
  unavailableSlots: Slot[];
};

export type UserStats = {
  primaryCount: number;
  backupCount: number;
  fairnessScore: number;
};

export type CostStats = {
  estimatedCost: number;
  savings: number;
  benefitScore: number;
};

export type SVGType = {
  size?: number;
  fill?: string;
};