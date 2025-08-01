"use client";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchEnrichedDriversForYear } from "@/utils/api-calls";
import Spinner from "../spinner";

type Driver = {
  driverId: string;
  permanentNumber: string;
  driver_number: Number;
  full_name: string;
  image: string;
  nationality: string;
  team_name: string;
  points: string;
};

export default function DriverList() {
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    let cancelled = false;
    async function fetchDrivers() {
      const rawData = await fetchEnrichedDriversForYear(year);
      const typedData: Driver[] = rawData!.map((d: any) => ({
        driverId: d.driverId,
        permanentNumber: d.permanentNumber,
        driver_number: Number(d.driver_number),
        full_name: d.full_name,
        image: d.headshot_url == null ? "./images/default.png" : d.headshot_url,
        nationality: d.nationality,
        team_name: d.team_name,
        points: d.points,
      }));
      typedData.sort(
        (a: Driver, b: Driver) =>
          Number(b.points) - Number(a.points)
      );
      if (!cancelled) setDrivers(typedData);
      setLoading(false);
    }

    fetchDrivers();
    return () => {
      cancelled = true;
    };
  }, [year]);

  useEffect(() => {
    // console.log(drivers[20])
  }, [drivers]);

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <Spinner text={`Loading Drivers for the year ${year} ...`} />
      </div>
    );
  }
  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Dropdown */}
      <div className="mb-6">
        <label
          htmlFor="year"
          className="block text-sm font-medium text-f1red-600 mb-1"
        >
          Select Year
        </label>
        <select
          id="year"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="bg-black text-white border border-f1red-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-f1red-600"
        >
          {[2025, 2024, 2023].map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* Driver List */}
      <ul role="list" className="divide-y divide-gray-800">
  {drivers.map((driver) => (
    <li
      key={driver.driverId}
      className="bg-black hover:bg-gray-800 transition-colors cursor-pointer"
    >
      <Link
        href={`/drivers/${driver.driverId}-${driver.permanentNumber}`}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 py-4 gap-4 sm:gap-6"
      >
        {/* Left: Image + Info */}
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <img
            className="h-12 w-12 rounded-full object-cover bg-black flex-none"
            src={driver.image}
            alt={driver.full_name}
          />
          <div className="flex flex-col text-left">
            <p className="text-sm font-semibold text-f1red-600">{driver.full_name}</p>
            <p className="text-xs text-white">{driver.nationality}</p>
            <p className="text-xs text-f1red-600">{driver.team_name}</p>
          </div>
        </div>

        {/* Right: Driver Number + Icon */}
        <div className="flex items-center sm:flex-col sm:items-end gap-2 text-xs text-white">
          <span className="sm:mt-1">Permanent #{driver.permanentNumber}</span>
          <ChevronRightIcon className="h-5 w-5 text-gray-400" />
        </div>
      </Link>
    </li>
  ))}
</ul>

    </div>
  );
}
