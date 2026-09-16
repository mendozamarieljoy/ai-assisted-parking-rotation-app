"use client";

import { Fragment, useMemo, useState } from "react";
import { useParkingStore } from "@/lib/store";
import { DaySchedule, Slot } from "@/lib/types";
import dayjs from "dayjs";
import Modal from "@/components/Modal";
import ParkingSlot from "@/components/ParkingSlot";
import IconPreviousDate from "@/assets/icons/calendar-prev.svg";
import IconNextDate from "@/assets/icons/calendar-next.svg";
import Image from "next/image";

export default function TodaySchedulePage() {
  const { schedule, skipPrimary } = useParkingStore();

  const [selectedDate, setSelectedDate] = useState(() => {
    const currentDate = dayjs().format("YYYY-MM-DD");

    if (schedule.length > 0) {
      // Find nearest date
      const nearest = schedule.reduce(
        (closest: DaySchedule | null, item: DaySchedule) => {
          const itemDate = dayjs(item.date);

          if (!closest) return item;

          const closestDiff = Math.abs(dayjs(closest.date).diff(currentDate));
          const itemDiff = Math.abs(itemDate.diff(currentDate));

          return itemDiff < closestDiff ? item : closest;
        },
        null,
      );

      if (schedule.find((s) => s.date === currentDate)) {
        return currentDate;
      }

      if (nearest) return nearest.date;
    }

    return currentDate;
  });

  const [toSkipSlot, setToSkipSlot] = useState<{
    date: string;
    slot: Slot;
  } | null>(null);

  const scheduleForDate = useMemo(
    () => schedule.find((day) => day.date === selectedDate),
    [schedule, selectedDate],
  );

  const availableDates = useMemo(
    () => schedule.map((day) => day.date),
    [schedule],
  );

  const selectedDateIndex = availableDates.indexOf(selectedDate);
  const date = {
    toaday: selectedDate,
    previous:
      selectedDateIndex > 0 ? availableDates[selectedDateIndex - 1] : undefined,
    next:
      selectedDateIndex >= 0 && selectedDateIndex < availableDates.length - 1
        ? availableDates[selectedDateIndex + 1]
        : undefined,
  };

  return (
    <>
      <div className="flex flex-col max-w-2xl mx-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-black font-mono uppercase">
            Schedule Today
          </h1>
          <h2>{dayjs().format("D MMMM YYYY (dddd)")}</h2>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex items-center gap-x-4">
            <div className="flex-1">
              <label
                className="block font-mono font-medium text-gray-700 uppercase text-xs"
                htmlFor="date"
              >
                Select date
              </label>
              <select
                id="date"
                className="w-full outline-none py-2 border-b bg-transparent cursor-pointer text-2xl font-black text-zinc-800 uppercase font-mono rounded-none"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
              >
                {availableDates.map((date) => (
                  <option key={date} value={date} className="text-sm">
                    {dayjs(date).format("D MMMM YYYY (dddd)")}
                  </option>
                ))}
              </select>
            </div>
            {selectedDate === dayjs().format("YYYY-MM-DD") ? null : (
              <button
                className="mt-4 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-md"
                onClick={() => setSelectedDate(dayjs().format("YYYY-MM-DD"))}
              >
                Today
              </button>
            )}
          </div>
          <div className="flex justify-between mt-4 gap-x-4">
            {date.previous && (
              <button
                className="mr-auto uppercase text-sm flex items-center gap-x-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md"
                disabled={!date.previous}
                onClick={() => date.previous && setSelectedDate(date.previous)}
              >
                <Image src={IconPreviousDate} alt="Previous" />
                <span className="hidden md:inline-block">Previous:</span>
                {dayjs(date.previous).format("D MMM")}
              </button>
            )}
            {date.next && (
              <button
                className="ml-auto uppercase text-sm flex items-center gap-x-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md"
                disabled={!date.next}
                onClick={() => date.next && setSelectedDate(date.next)}
              >
                <span className="hidden md:inline-block">Next:</span>
                {dayjs(date.next).format("D MMM")}
                <Image src={IconNextDate} alt="Next" />
              </button>
            )}
          </div>
        </div>

        {scheduleForDate ? (
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4 h-full">
            <div className="flex gap-4 h-32 md:h-42">
              {Object.entries(scheduleForDate.slots).map(
                ([slot, assignment]) => (
                  <Fragment key={slot}>
                    <ParkingSlot slot={slot as Slot} assignment={assignment} />
                  </Fragment>
                ),
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-600">
            No schedule found for {selectedDate}. Please pick another date.
          </div>
        )}
      </div>

      <Modal
        isOpen={!!toSkipSlot}
        title={`Skip parking for ${dayjs(toSkipSlot?.date).format("MMMM D, YYYY")}
              slot ${toSkipSlot?.slot}?`}
        body="If you don't need this slot, we'll swap your assignment to find you a better time later."
        confirmLabel="Skip"
        cancelLabel="Cancel"
        onConfirm={() => {
          if (toSkipSlot) {
            skipPrimary(toSkipSlot.date, toSkipSlot.slot);
            setToSkipSlot(null);
          }
        }}
        onCancel={() => setToSkipSlot(null)}
      />
    </>
  );
}
