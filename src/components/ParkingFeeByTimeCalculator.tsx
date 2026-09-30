import { useMemo, useState } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { parkingConfig } from "@/lib/config";

dayjs.extend(duration);

export default function ParkingFeeTimeCalculator() {
  const { baseHours, baseFee, extraFeePerHour } = parkingConfig.parkingFee;
  const [timeIn, setTimeIn] = useState("08:00");
  const [timeOut, setTimeOut] = useState("11:30");

  const result = useMemo(() => {
    if (!timeIn || !timeOut) return null;

    const start = dayjs(`2026-01-01 ${timeIn}`);
    let end = dayjs(`2026-01-01 ${timeOut}`);

    // handle overnight parking
    if (end.isBefore(start)) {
      end = end.add(1, "day");
    }

    const hours = end.diff(start, "minute") / 60;

    const chargedBaseHours = Math.min(baseHours, hours);
    const extraHours = Math.max(0, hours - baseHours);

    const extraFee = Math.ceil(extraHours) * extraFeePerHour;

    const total = baseFee + extraFee;

    return {
      hours,
      baseHours: chargedBaseHours,
      extraHours,
      total,
      start,
      end,
    };
  }, [baseFee, baseHours, extraFeePerHour, timeIn, timeOut]);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3 space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span>💰</span>
        <p className=" font-semibold text-zinc-800">Parking Fee by time</p>
      </div>

      {/* Inputs */}
      <div className="flex gap-3 py-2">
        <div className="space-y-1">
          <p className="text-sm text-zinc-500">Time In</p>
          <input
            type="time"
            value={timeIn}
            onChange={(e) => setTimeIn(e.target.value)}
            className="rounded-lg border border-zinc-200 px-2 py-1"
          />
        </div>

        <div className="space-y-1">
          <p className="text-sm text-zinc-500">Time Out</p>
          <input
            type="time"
            value={timeOut}
            onChange={(e) => setTimeOut(e.target.value)}
            className="rounded-lg border border-zinc-200 px-2 py-1"
          />
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-2 border-zinc-100 py-2  text-zinc-600">
          <div className="flex justify-between items-center">
            <p>⏱ Duration</p>
            <p>{result.hours.toFixed(2)} hrs</p>
          </div>
          <div className="flex justify-between items-center">
            <p>Base (first {baseHours} hours)</p>
            <p>₱{baseFee}</p>
          </div>
          <div className="flex justify-between items-center">
            <p>
              Extra hours(
              {Math.max(0, Math.ceil(result.extraHours)).toFixed(2)} hr × ₱
              {extraFeePerHour})
            </p>
            <p>
              ₱{Math.max(0, Math.ceil(result.extraHours)) * extraFeePerHour}
            </p>
          </div>
          <div className="flex justify-between items-center font-bold border-t border-zinc-800 pt-2 mt-2">
            <p>Total Fee</p>
            <p>₱{result.total}</p>
          </div>
        </div>
      )}
    </div>
  );
}
