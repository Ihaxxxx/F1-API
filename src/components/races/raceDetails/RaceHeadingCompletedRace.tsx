import React from 'react'

export default function RaceHeadingCompletedRace({raceDetails} : any) {
  return (
    <div className="flex flex-col gap-6 md:gap-0 md:flex-row justify-between items-start md:items-center border border-gray-700 p-6 rounded-xl shadow-xl bg-black text-white">
      {/* Left: Circuit & Race Info */}
      <div className="flex flex-col gap-3 flex-1">
        <div className="flex items-center gap-3 text-2xl font-extrabold text-f1red-600">
          <img
            src={raceDetails?.flag}
            alt={raceDetails?.circuit.Location.country}
            className="w-12 h-7 rounded-sm object-cover shadow-md"
          />
          <span>
            {raceDetails?.raceInfo.raceName} — Round{" "}
            {raceDetails?.raceInfo.round}
          </span>
        </div>

        <p className="text-sm text-gray-400">
          Location:{" "}
          <span className="text-white font-semibold">
            {raceDetails?.raceInfo.Circuit.Location.locality},{" "}
            {raceDetails?.raceInfo.Circuit.Location.country}
          </span>{" "}
          | Date:{" "}
          <span className="text-white font-semibold">
            {new Date(raceDetails?.raceInfo.date).toLocaleDateString()}
          </span>
        </p>

        <p className="text-sm text-gray-400">
          Total Laps:{" "}
          <span className="text-f1red-600 font-bold">
            {raceDetails?.raceResults[0].laps}
          </span>
        </p>
      </div>

      {/* Right: Race Results */}
      <div className="flex flex-col sm:flex-row gap-8 w-full md:w-auto md:text-right text-sm justify-end">
        <div className="flex flex-col gap-2 flex-1 max-w-xs">
          <p className="text-gray-400">
            Race Winner:{" "}
            <span className="text-green-500 font-semibold">
              {raceDetails?.raceResults[0].Driver.givenName}{" "}
              {raceDetails?.raceResults[0].Driver.familyName}
            </span>
          </p>

          <p className="text-gray-400">
            Fastest Lap By Driver:{" "}
            <span className="text-yellow-400 font-semibold">
              {raceDetails?.fastestLap.Driver.givenName}{" "}
              {raceDetails?.fastestLap.Driver.familyName}
            </span>
          </p>

          <p className="text-gray-400">
            Fastest Lap Time:{" "}
            <span className="text-yellow-400 font-semibold">
              {raceDetails?.fastestLap.FastestLap.Time.time || "N/A"}
            </span>
          </p>

          <p className="text-gray-400">
            Pole Position:{" "}
            <span className="text-f1red-600 font-semibold">
              {raceDetails?.qualifyingResults[0]?.Driver.givenName || "N/A"}{" "}
              {raceDetails?.qualifyingResults[0]?.Driver.familyName || ""} -{" "}
              {raceDetails?.qualifyingResults[0]?.Q3 || "N/A"}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
