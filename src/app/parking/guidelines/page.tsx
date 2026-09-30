"use client";

import ParkingFeeTimeCalculator from "@/components/ParkingFeeByTimeCalculator";
import ParkingFeeCalculator from "@/components/ParkingFeeCalculator";
import SwapTimeCalculator from "@/components/SwapTimeCalculator";
import Link from "next/link";
import dayjs from "dayjs";
import { parkingConfig } from "@/lib/config";

export default function Guidelines() {
  const {
    maxPayParkingHours,
    suggestedSwapBufferMinutes,
    samplePayParkingArrivalTime,
  } = parkingConfig.swapGuidance;
  const sampleArrival = dayjs(`2026-01-01 ${samplePayParkingArrivalTime}`);
  const sampleDeadline = sampleArrival.add(maxPayParkingHours, "hour");
  const sampleSuggestedSwap = sampleDeadline
    .subtract(suggestedSwapBufferMinutes, "minute")
    .format("h:mm A");

  return (
    <>
      <div className="sticky top-22.25 md:hidden bg-zinc-100 flex items-center gap-2 p-2 shadow">
        <Link
          className="text-center text-sm uppercase w-full"
          href="/parking/guidelines#guidelines"
        >
          Parking Guidelines
        </Link>
        <Link
          className="text-center text-sm uppercase w-full"
          href="/parking/guidelines#calculator"
        >
          Calculator
        </Link>
      </div>
      <div className="flex flex-col md:flex-row mx-auto max-w-7xl p-6 gap-4">
        <div id="guidelines">
          <div className="flex items-center gap-2 mb-4">
            <span>📌</span>
            <p className="text-xl font-black text-zinc-800 uppercase font-mono">
              Parking Guidelines
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow font-mono space-y-4">
            {/* Rules */}
            <div className="space-y-1">
              <p className=" font-black uppercase text-zinc-700">Rules</p>

              <ul className="space-y-1  text-zinc-600 leading-relaxed">
                <li>
                  • Please inform early if you won’t use your scheduled slot so
                  others can use it.
                </li>
                <li>
                  • You may negotiate or swap schedules with others as long as
                  both parties clearly communicate.
                </li>
              </ul>
            </div>

            {/* Divider */}
            <div className="border-t border-zinc-100" />

            {/* Swapping Guide */}
            <div className="space-y-1">
              <p className=" font-black uppercase text-zinc-700">
                Swapping Guide
              </p>

              <ul className="space-y-1  text-zinc-600 leading-relaxed">
                <li>
                  • Morning Shift: Park in your assigned slot upon arrival in
                  the morning.
                </li>
                <li>
                  • Afternoon Shift: Park in pay parking first, then swap with
                  the morning shift before reaching {maxPayParkingHours} hours
                  in pay parking.
                </li>
                <li>
                  • Afternoon shift must inform the morning shift in advance
                  about the exact swap time (before the {maxPayParkingHours}
                  -hour limit).
                </li>
              </ul>
            </div>
            <div className="border-t border-zinc-100" />

            <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3 space-y-4">
              <div className="">
                <div className="flex items-center gap-2">
                  <span>📘</span>
                  <p className="text-sm font-semibold text-zinc-800">
                    Sample Swapping Scenario
                  </p>
                </div>
                <div className="mt-3 rounded-lg bg-zinc-50 px-3 py-2 text-sm text-zinc-600 leading-relaxed">
                  ⚠️ This is only a{" "}
                  <span className="font-medium text-zinc-700">
                    recommended guide
                  </span>
                  , not a strict rule. The goal is to help users minimize pay
                  parking cost, ideally around{" "}
                  <span className="font-medium">
                    ₱{parkingConfig.parkingFee.baseFee} per use
                  </span>{" "}
                  whenever possible through proper coordination.
                </div>
              </div>

              {/* Setup */}
              <div className="mt-3 space-y-2  text-zinc-600 leading-relaxed">
                <p>
                  <span className="font-medium text-zinc-800">User 1:</span>{" "}
                  Arrives 6:00 AM — parks in assigned slot
                </p>

                <p>
                  <span className="font-medium text-zinc-800">User 2:</span>{" "}
                  Arrives {sampleArrival.format("h:mm A")} — parks in pay
                  parking
                </p>

                <p className="text-zinc-500">
                  ⏱ Rule: Swap must happen before {maxPayParkingHours}-hour
                  limit →{" "}
                  <span className="font-medium text-zinc-700">
                    {sampleDeadline.format("h:mm A")} deadline
                  </span>
                </p>
              </div>

              <div className="border-t border-zinc-100" />

              {/* Steps */}
              <div className="space-y-2 text-zinc-600 leading-relaxed">
                <p>
                  1. User 2 tells User 1 the proposed swap time (e.g. “Let’s
                  swap at {sampleSuggestedSwap}” — must be before{" "}
                  {sampleDeadline.format("h:mm A")})
                </p>

                <p>2. User 1 confirms the swap time</p>

                <p>3. At the agreed time, User 1 vacates the assigned slot</p>

                <p>
                  4. User 2 moves from pay parking to the assigned slot at the
                  same time
                </p>
                <p className="text-zinc-500">
                  Note: Other swap setups are allowed as long as both parties
                  clearly agree and coordinate properly.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div id="calculator" className="space-y-4">
          <p className="text-xl font-black text-zinc-800 uppercase font-mono mb-4">
            Calculator
          </p>
          <SwapTimeCalculator />
          <ParkingFeeCalculator />
          <ParkingFeeTimeCalculator />
        </div>
      </div>
    </>
  );
}
