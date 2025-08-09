'use client'

import { RaceList } from "@/utils/api-calls";
import { useEffect, useState } from "react"
import type {RaceListSeason} from "../../../types/RaceListSeason";
import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";

export default function RaceListForSelectedSeason() {
    const [raceList, setRaceList] = useState<RaceListSeason[]>([]);
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const fetchData = async () => {
    setIsLoading(true);
    const raceList = await RaceList(year);
    setRaceList(raceList);
    setIsLoading(false);
  };
  fetchData();
}, [year]);
  if (isLoading) return <p className="text-white">Loading race calendar...</p>;

  return (
  <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold text-f1red-600">
        Race Calendar For Year {year}
      </h2>
      <select
        className="bg-black text-white border border-gray-700 rounded px-2 py-1"
        value={year}
        onChange={(e) => setYear(Number(e.target.value))}
      >
        {Array.from({ length: 10 }, (_, i) => {
          const yr = new Date().getFullYear() - i;
          return (
            <option key={yr} value={yr}>
              {yr}
            </option>
          );
        })}
      </select>
    </div>

    {isLoading ? (
      <p className="text-white">Loading race calendar...</p>
    ) : (
      <ul role="list" className="divide-y divide-gray-800">
        {raceList.map((race) => {
  const isCompleted = new Date(race.date) < new Date();

  return (
    <Link href={`/races/${year}-${race.round}`} key={race.round}>
      <li
        className={`transition-colors cursor-pointer ${
          isCompleted
            ? " border-l-4 border-green-600"
            : "bg-black hover:bg-gray-800"
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 py-4 gap-4 sm:gap-6">
          {/* Left: Flag + Race Info */}
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <img
              className="h-10 w-16 object-cover flex-none"
              src={race.flag}
              alt={race.country}
            />
            <div className="flex flex-col text-left">
              <p className="text-sm font-semibold text-f1red-600">{race.raceName}</p>
              <p className="text-xs text-white">{race.city}, {race.country}</p>
              <p className="text-xs text-f1red-600">{race.location}</p>
            </div>
          </div>

          {/* Right: Date + Round */}
          <div className="flex items-center sm:flex-col sm:items-end gap-2 text-xs text-white">
            <span className="sm:mt-1">Round {race.round}</span>
            <span>{race.date}</span>
            <ChevronRightIcon className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </li>
    </Link>
  );
})}

      </ul>
    )}
  </div>
);

}
