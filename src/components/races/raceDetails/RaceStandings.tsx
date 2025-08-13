import React from "react";
import { ChevronDownIcon } from "@/components/HeroIcons/ChevronDownIcon";
import { ChevronUpIcon } from "@/components/HeroIcons/ChevronUpIcon";
import { Bars2Icon } from "@/components/HeroIcons/Bars2Icon";
export default function RaceStandings({ results }: { results: any }) {
  const sorted = [...results.raceResults].sort(
    (a, b) => parseInt(a.position) - parseInt(b.position)
  );

  const podium = sorted.slice(0, 3);
  const podiumHeadShotUrl = results?.top3WithHeadshots;
  const rest = sorted.slice(3);

  return (
    <div className="p-4 text-white">
      {/* Podium */}
      <div className="flex justify-center items-end gap-4 mb-8">
        {/* 2nd place */}
        <PodiumDriver
          driver={podium[1]}
          height="h-48"
          width="w-64"
          place={2}
          image_url={podiumHeadShotUrl[1]?.headshot}
        />
        {/* 1st place */}
        <PodiumDriver
          driver={podium[0]}
          height="h-64"
          width="w-64"
          place={1}
          image_url={podiumHeadShotUrl[0]?.headshot}
        />
        {/* 3rd place */}
        <PodiumDriver
          driver={podium[2]}
          height="h-40"
          width="w-64"
          place={3}
          image_url={podiumHeadShotUrl[2]?.headshot}
        />
      </div>

      {/* Rest of field */}
      <div className="bg-black overflow-hidden">
        <table className="w-full border-collapse table-fixed">
  <thead className="bg-black border-2 border-gray-600">
    <tr>
      <th className="p-2 text-left w-16">Pos</th>
      <th className="p-2 text-left w-48">Driver</th>
      <th className="p-2 text-center w-32">Position Gain/Lost</th>
      <th className="p-2 text-center w-32">Time / Status</th>
      <th className="p-2 text-center w-16">Points</th>
    </tr>
  </thead>
  <tbody>
    {rest.map((driver) => {
      const diff = parseInt(driver.grid) - parseInt(driver.position);
      return (
        <tr key={driver.Driver.driverId} className="border-b border-gray-700">
          <td className="p-2">{driver.positionText}</td>
          <td className="p-2">
            <div className="flex items-center gap-2">
              <span className="font-bold">{driver.Driver.permanentNumber}</span>
              <span>
                {driver.Driver.givenName} {driver.Driver.familyName}
              </span>
            </div>
          </td>
          <td className="p-2">
            <div className="flex items-center justify-center gap-1 font-semibold">
              {diff === 0 && <span className="text-gray-500"><Bars2Icon className="w-4 h-4 text-gray-500"/></span>}
              {diff > 0 && (
                <>
                  <span className="text-green-600">{diff}</span>
                  <ChevronUpIcon className="w-4 h-4 text-green-600" />
                </>
              )}
              {diff < 0 && (
                <>
                  <span className="text-red-600">{diff}</span>
                  <ChevronDownIcon className="w-4 h-4 text-red-600" />
                </>
              )}
            </div>
          </td>
          <td className="p-2 text-center">{driver.Time?.time || driver.status}</td>
          <td className="p-2 text-center">{driver.points}</td>
        </tr>
      );
    })}
  </tbody>
</table>
      </div>
    </div>
  );
}

function PodiumDriver({
  driver,
  height,
  place,
  width,
  image_url,
}: {
  driver: any;
  height: string;
  place: number;
  width: string;
  image_url: string;
}) {
  const bgColors = {
    1: "bg-black text-green-500",
    2: "bg-black text-white",
    3: "bg-black text-white",
  };

  // Size presets based on place
  const sizes = {
    1: {
      containerHeight: "h-60",
      containerWidth: "w-48",
      imgSize: "w-28 h-28",
      fontSizeName: "text-2xl",
      fontSizeNumber: "text-3xl",
      pointsSize: "text-base",
    },
    2: {
      containerHeight: "h-48",
      containerWidth: "w-48",
      imgSize: "w-20 h-20",
      fontSizeName: "text-sm",
      fontSizeNumber: "text-2xl",
      pointsSize: "text-sm",
    },
    3: {
      containerHeight: "h-44",
      containerWidth: "w-48",
      imgSize: "w-16 h-16",
      fontSizeName: "text-sm",
      fontSizeNumber: "text-2xl",
      pointsSize: "text-sm",
    },
  };

  const size = sizes[place as keyof typeof sizes] || sizes[3]; // fallback to 3rd place style

  return (
    <div className="flex flex-col items-center border-2 border-gray-500">
      <div
        className={`${
          bgColors[place as keyof typeof bgColors]
        } rounded-t-md flex flex-col justify-end items-center p-4
        ${size.containerHeight} ${size.containerWidth}`}
      >
        <img
          src={image_url}
          alt={driver.Driver.givenName}
          className={`${size.imgSize} object-contain mb-2 rounded-full`}
        />
        <span className={`${size.fontSizeNumber} font-extrabold select-none`}>
          #{driver.Driver.permanentNumber}
        </span>
        <span
          className={`${size.fontSizeName} font-semibold select-none text-center`}
        >
          {driver.Driver.givenName} {driver.Driver.familyName}
        </span>
        <span className={`${size.pointsSize} mt-2 select-none`}>
          {driver.points} pts
        </span>
      </div>
    </div>
  );
}
