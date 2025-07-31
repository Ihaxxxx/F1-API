'use client'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { useEffect, useState } from 'react';

import { dataForDriverListDriversPage } from "@/utils/api-calls"

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

  useEffect(() => {
  let cancelled = false;
  async function fetchDrivers() {
    const rawData = await dataForDriverListDriversPage(year);
    const typedData: Driver[] = rawData.map((d: any) => ({
      driverId: d.driverId,
      permanentNumber: d.permanentNumber,
      driver_number: Number(d.driver_number),
      full_name: d.full_name,
      image: d.headshot_url,
      nationality: d.nationality,
      team_name: d.team_name,
    }));
    if (!cancelled) setDrivers(typedData);
  }

  fetchDrivers();
  return () => {
    cancelled = true;
  };
}, [year]);


  useEffect(() => {
    console.log(drivers[2])
  }, [drivers])
  

  return (
    <ul role="list" className="divide-y divide-gray-200">
      {drivers.map((driver) => (
        <li key={driver.driverId} className="relative bg-white flex justify-between gap-x-6 py-5">
          <div className="flex min-w-0 gap-x-4">
            <img
              className="h-12 w-12 flex-none rounded-full bg-gray-50 object-cover"
              src={driver.image}
              alt={driver.full_name}
            />
            <div className="min-w-0 flex-auto">
              <p className="text-sm font-semibold text-gray-900">{driver.full_name}</p>
              <p className="mt-1 text-xs text-gray-500">{driver.nationality}</p>
              <p className="mt-1 text-xs text-gray-500">{driver.team_name}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-x-4">
            <div className="hidden sm:flex sm:flex-col sm:items-end">
              {/* <p className="text-sm text-gray-900">#{driver.driver_number}</p> */}
              <p className="mt-1 text-xs text-gray-500">Permanent #{driver.permanentNumber}</p>
            </div>
            <ChevronRightIcon aria-hidden="true" className="h-5 w-5 text-gray-400" />
          </div>
        </li>
      ))}
    </ul>
  );
}