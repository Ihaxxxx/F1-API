import React from "react";

export default function RaceHeadingIncompleted({ raceDetails }: any) {
  console.log(raceDetails);
  return (
    <div className="flex flex-col gap-6 md:gap-0 md:flex-row justify-between items-start md:items-center border border-gray-700 p-6 rounded-xl shadow-xl bg-black text-white">
      {/* Left: Circuit & Race Info */}
      <div className="flex flex-col gap-3 flex-1">
        <div className="flex items-center gap-3 text-2xl font-extrabold text-f1red-600">
          <img
            src={raceDetails?.flag}
            alt={raceDetails?.circuit.Location.country}
            className="w-12 h-7 object-cover shadow-md"
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
            {new Date(
              `${raceDetails?.raceInfo.date}T${raceDetails?.raceInfo.time}`
            ).toLocaleDateString()}{" "}
            {new Date(
              `${raceDetails?.raceInfo.date}T${raceDetails?.raceInfo.time}`
            ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </p>
      </div>

      {/* Right: Race Results */}
      <div className="flex flex-col sm:flex-row gap-8 w-full md:w-auto md:text-right text-sm justify-end">
        <div className="flex flex-col gap-2 flex-1 max-w-xs">
          {raceDetails?.raceInfo &&
            Object.entries(raceDetails.raceInfo)
              // Only keep keys that are sessions (end with "Practice", "Qualifying", or contain "Sprint", "Race")
              .filter(([key]) => /(Practice|Qualifying|Sprint)/i.test(key))
              .map(([sessionName, sessionData]: [string, any]) => (
                <p key={sessionName} className="text-gray-400">
                  {sessionName.replace(/([A-Z])/g, " $1").trim()}:{" "}
                  <span className="text-f1red-600 font-semibold">
                    {new Date(
                      `${sessionData.date}T${sessionData.time}`
                    ).toLocaleString("en-GB", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZone: "Europe/Amsterdam", // Optional — use local race time
                    })}
                  </span>
                </p>
              ))}
        </div>
      </div>
    </div>
  );
}
