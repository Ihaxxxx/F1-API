'use client'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import Link from 'next/link';
import { useState } from 'react'



export default function RaceResultsList({driverId,year,chartData,driverDetails}: {driverId: string,year: number,chartData: any[],driverDetails: any}) {
    const [results, setResults] = useState<any[]>(chartData);
  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h2 className="text-lg font-semibold text-f1red-600 mb-4">Race Results</h2>
      <ul role="list" className="divide-y divide-gray-800">
        {results.map((result) => (
            <Link href={`/drivers/${driverDetails}/${year}-${result.round}`} key={result.round}>
          <li
            className="bg-black hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 py-4 gap-4 sm:gap-6">
              {/* Left: Flag + Race Info */}
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <img
                  className="h-10 w-10 object-cover flex-none"
                  src={result.flag}
                  alt={result.country}
                />
                <div className="flex flex-col text-left">
                  <p className="text-sm font-semibold text-f1red-600">{result.raceName}</p>
                  <p className="text-xs text-white">{result.country}</p>
                  <p className="text-xs text-f1red-600">Round {result.round}</p>
                </div>
              </div>

              {/* Right: Driver Position + Icon */}
              <div className="flex items-center sm:flex-col sm:items-end gap-2 text-xs text-white">
                <span className="sm:mt-1">Position: {result.position}</span>
                <ChevronRightIcon className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}

