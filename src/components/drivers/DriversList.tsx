'use client'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchEnrichedDriversForYear } from "@/utils/api-calls"
import Spinner from '../spinner';

type Driver = {
  driverId : string,
  permanentNumber : string,
  driver_number : Number,
  full_name : string,
  image : string ,
  nationality : string,
  team_name : string
}

export default function DriverList() {
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading,setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
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
    }));
    if (!cancelled) setDrivers(typedData) ; setLoading(false);
  }

  fetchDrivers();
  return () => {
    cancelled = true;
  };
}, [year]);


  useEffect(() => {
    console.log(drivers[5])
  }, [drivers])

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
        <label htmlFor="year" className="block text-sm font-medium text-f1red-600 mb-1">
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
      <ul role="list" className="divide-y divide-gray-200">
        {drivers.map((driver) => (
          <li
            key={driver.driverId}
            className="bg-black hover:bg-gray-800 transition cursor-pointer"
          >
            <Link
              href={`/drivers/${driver.driverId}`}
              className="flex items-center justify-between gap-x-6 py-5"
            >
              <div className="flex min-w-0 gap-x-4">
                <img
                  className="h-12 w-12 rounded-full object-cover bg-black flex-none"
                  src={driver.image}
                  alt={driver.full_name}
                />
                <div className="min-w-0 flex-auto">
                  <p className="text-sm text-f1red-600 font-semibold">{driver.full_name}</p>
                  <p className="mt-1 text-xs text-white">{driver.nationality}</p>
                  <p className="mt-1 text-xs text-f1red-600">{driver.team_name}</p>
                </div>
              </div>
              <div className="hidden sm:flex sm:flex-col sm:items-end">
                <p className="mt-1 text-xs text-white">Permanent #{driver.permanentNumber}</p>
                <ChevronRightIcon aria-hidden="true" className="h-5 w-5 text-gray-400 mt-2" />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

