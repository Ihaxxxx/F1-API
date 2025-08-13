'use client';
import { raceResultsPageHeading } from "@/utils/api-calls";
import { useEffect, useState } from "react";
import Spinner from "@/components/spinner";

export type driverAndRoundDetail = {
  driverNameId: string;
  driverNumberId: string;
  year: string;
  round: string;
};

type RaceResult = {
  circuit: {
    name: string;
    city: string;
    country: string;
    lat: string;
    long: string;
    flag: string;
  };
  constructor: string;
  driver: {
    fullName: string;
    nationality: string;
    image_url: string;
  };
  race: {
    name: string;
    round: string;
    date: string;
    totalLaps: string;
  };
  fastestLap: {
    time: string | null;
    rank: string | null;
  };
  result: {
    position: string | null;
    points: string | null;
    gapToLeader: string | null;
  };
  qualifying: {
    position: string | null;
    Q1: string | null;
    Q2: string | null;
    Q3: string | null;
  } | null;
};

export default function RaceResultPageHeading({
  driverAndRoundDetail,
}: {
  driverAndRoundDetail: driverAndRoundDetail;
}) {
  const [results, setResults] = useState<RaceResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await raceResultsPageHeading(
          Number(driverAndRoundDetail.year),
          driverAndRoundDetail.driverNameId,
          driverAndRoundDetail.round
        );
        setResults(data ? [data] : []);
      } catch (err) {
        console.error("Error fetching", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [driverAndRoundDetail]);

  if (loading) {
    return <Spinner text="Loading Results" />;
  }

  // Only render content when loading is false
  if (results.length === 0) {
    return <p className="text-white">No results found.</p>;
  }

  const result = results[0];

  return (
    <div className="flex flex-col gap-6 md:gap-0 md:flex-row justify-between items-start md:items-center border p-4 md:p-6 rounded-xl shadow-xl bg-black text-white">
      <div className="flex flex-col gap-3 flex-1">
        <div className="flex items-center gap-2 text-xl font-bold text-f1red-600">
          <img
            src={result.circuit.flag}
            alt={result.circuit.country}
            className="w-10 h-6"
          />
          <span>
            {result.race.name} — Round {result.race.round}
          </span>
        </div>

        <p className="text-sm text-gray-400">
          Location:{" "}
          <span className="font-medium">
            {result.circuit.city}, {result.circuit.country}
          </span>{" "}
          | Date:{" "}
          <span className="font-medium">
            {new Date(result.race.date).toLocaleDateString()}{" "}
            {new Date(result.race.date).toLocaleTimeString()}
          </span>
        </p>

        <p className="text-sm text-gray-400">
          Total Laps:{" "}
          <span className="font-semibold">{result.race.totalLaps}</span>
        </p>
      </div>

      {/* Right Side: Driver + Results */}
      <div className="flex flex-col sm:flex-row gap-6 w-full md:w-auto md:text-right text-sm justify-end">
        {/* Driver Info */}
        <div className="flex flex-col gap-1 flex-1">
          <div className="flex items-center gap-2">
            <img
              className="h-8 w-8 rounded-full object-cover"
              src={result.driver.image_url}
              alt={result.driver.fullName}
            />
            <h3 className="text-lg font-semibold text-accent">
              {result.driver.fullName}
            </h3>
          </div>

          <p className="text-gray-400">
            Nationality: <span className="font-medium">{result.driver.nationality}</span>
          </p>
          <p className="text-gray-400">
            Constructor: <span className="font-medium">{result.constructor}</span>
          </p>
        </div>

        {/* Results Info */}
        <div className="flex flex-col gap-1 text-sm flex-1">
          <p className="text-gray-400">
            Position: <span className="text-green-500 font-semibold">{result.result.position || "N/A"}</span>
          </p>
          <p className="text-gray-400">
            Points: <span className="text-yellow-500 font-semibold">{result.result.points || "0"}</span>
          </p>
          <p className="text-gray-400">
            Gap to Leader: <span className="font-medium">{result.result.gapToLeader || "N/A"}</span>
          </p>
        </div>

        {/* Fastest Lap Info */}
        <div className="flex flex-col gap-1 text-sm flex-1">
          <p className="text-gray-400">
            Fastest Lap Time: <span className="font-semibold">{result.fastestLap.time || "N/A"}</span>
          </p>
          <p className="text-gray-400">
            Qualifying Time:{" "}
            <span className="font-semibold">
              {(() => {
                const q = result.qualifying;
                const times = [q?.Q1, q?.Q2, q?.Q3].filter(Boolean);
                if (times.length === 0) return "N/A";
                return times.sort(
                  (a, b) =>
                    parseFloat(a!.replace(":", ".")) -
                    parseFloat(b!.replace(":", "."))
                )[0];
              })()}
            </span>
          </p>

          <p className="text-gray-400">
            Fastest Lap Rank: <span className="text-f1red-600 font-bold">{result.fastestLap.rank || "N/A"}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
