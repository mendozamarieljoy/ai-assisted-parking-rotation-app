import { useMemo, useState } from "react";
import { parkingConfig } from "@/lib/config";

export default function ParkingFeeCalculator() {
  const { baseHours, baseFee, extraFeePerHour } = parkingConfig.parkingFee;
  const [hours, setHours] = useState<number>(baseHours);

  const result = useMemo(() => {
    if (!hours || hours <= 0) return 0;

    const extraHours = Math.max(0, hours - baseHours);
    const extraFee = extraHours * extraFeePerHour;

    return baseFee + extraFee;
  }, [baseFee, baseHours, extraFeePerHour, hours]);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3 space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span>💰</span>
        <p className=" font-semibold text-zinc-800">Pay Parking Fee by hour</p>
      </div>

      {/* Inputs */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={baseHours}
            step={1}
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="rounded-lg border border-zinc-200 px-3 py-1"
            style={{ width: "60px" }}
          />
          <span className=" text-zinc-600">hours intended stay</span>
        </div>
      </div>

      <div className="space-y-1 text-zinc-600 mt-4">
        <div className="flex justify-between items-center">
          <p>Base (first {baseHours} hours)</p>
          <p>₱{baseFee}</p>
        </div>
        <div className="flex justify-between items-center">
          <p>
            Extra hours({Math.max(0, hours - baseHours)} hr × ₱{extraFeePerHour}
            )
          </p>
          <p>₱{Math.max(0, hours - baseHours) * extraFeePerHour}</p>
        </div>
        <div className="flex justify-between items-center font-bold border-t border-zinc-800 pt-2 mt-2">
          <p>Total Fee</p>
          <p>₱{result}</p>
        </div>
      </div>
    </div>
  );
}
