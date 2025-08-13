import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function PreviousWinners({ raceDetails }: any) {
  return (
    <ul role="list" className="divide-y divide-gray-800">
      {raceDetails.previousWinners.map((driver : any) => (
        <li
          key={driver.year}
          className="bg-black hover:bg-gray-800 transition-colors cursor-pointer"
        >
            {/* Left: Image + Info */}
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="flex flex-col text-left">
                <p className="text-sm font-semibold text-f1red-600">
                  {driver.name}
                </p>
                <p className="text-xs text-white">{driver.constructor}</p>
              </div>
            </div>

        </li>
      ))}
    </ul>
  );
}
