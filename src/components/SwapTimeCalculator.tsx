import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { parkingConfig } from "@/lib/config";

export default function SwapTimeCalculator() {
  const { maxPayParkingHours, suggestedSwapBufferMinutes } =
    parkingConfig.swapGuidance;
  const [time, setTime] = useState(
    parkingConfig.swapGuidance.samplePayParkingArrivalTime,
  );

  const result = useMemo(() => {
    if (!time) return null;

    const base = dayjs(`2026-01-01 ${time}`);
    const deadline = base.add(maxPayParkingHours, "hour");
    const suggested = deadline.subtract(suggestedSwapBufferMinutes, "minute");

    return {
      base,
      deadline,
      suggested,
    };
  }, [maxPayParkingHours, suggestedSwapBufferMinutes, time]);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span>⏱️</span>
        <p className="font-bold text-zinc-800">Swap Time</p>
      </div>

      {/* Input */}
      <div className="flex items-center gap-2">
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="rounded-lg border border-zinc-200 px-3 py-1"
        />
      </div>

      {/* Output */}
      {result && (
        <div className="mt-4 space-y-2 text-zinc-600">
          <p>
            📥 Arrival Time:{" "}
            <span className="font-bold text-zinc-800">
              {result.base.format("h:mm A")}
            </span>
          </p>

          <p>
            ⏳ +{maxPayParkingHours} Hours Deadline:{" "}
            <span className="font-bold text-zinc-800">
              {result.deadline.format("h:mm A")}
            </span>
          </p>

          <p>
            💡 Suggested Swap Time ({suggestedSwapBufferMinutes} mins before
            deadline):{" "}
            <span className="font-bold text-amber-600">
              {result.suggested.format("h:mm A")}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
