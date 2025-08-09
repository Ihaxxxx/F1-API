"use client";
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
      const data = await raceResultsPageHeading(
        Number(driverAndRoundDetail.year),
        driverAndRoundDetail.driverNameId,
        driverAndRoundDetail.round
      );
      setLoading(false);
      setResults(data ? [data] : []);
    };
    fetchData().catch((err) => console.error("Error fetching"));
  }, []);

  if (loading) {
    return <Spinner text="Loading Results" />;
  }

  return (
    <div className="flex flex-col gap-6 md:gap-0 md:flex-row justify-between items-start md:items-center border p-4 md:p-6 rounded-xl shadow-xl bg-foreground text-background bg-black">
      <div className="flex flex-col gap-3 flex-1">
        <div className="flex items-center gap-2 text-xl font-bold text-f1red-600">
          <img
            src={results[0]?.circuit.flag}
            alt={results[0]?.circuit.country}
            className="w-10 h-6"
          />
          <span>
            {results[0]?.race.name} — Round {results[0]?.race.round}
          </span>
        </div>

        <p className="text-sm text-muted-foreground">
          Location:{" "}
          <span className="text-background font-medium">
            {results[0]?.circuit.city}, {results[0]?.circuit.country}
          </span>{" "}
          | Date:{" "}
          <span className="text-background font-medium">
            {new Date(results[0]?.race.date).toLocaleDateString()}
          </span>
        </p>

        <p className="text-sm text-muted-foreground">
          Total Laps:{" "}
          <span className="text-background font-semibold">
            {results[0]?.race.totalLaps}
          </span>
        </p>
      </div>

      {/* Right Side: Driver + Results */}
      <div className="flex flex-col sm:flex-row gap-6 w-full md:w-auto md:text-right text-sm justify-end">
        {/* Driver Info */}
        <div className="flex flex-col gap-1 flex-1">
          <div className="flex items-center gap-2">
            <img
              className="h-8 w-8 rounded-full object-cover"
              src={results[0]?.driver.image_url}
              alt=""
            />
            <h3 className="text-lg font-semibold text-accent">
              {results[0]?.driver.fullName}
            </h3>
          </div>

          <p className="text-muted-foreground">
            Nationality:{" "}
            <span className="text-background font-medium">
              {results[0]?.driver.nationality}
            </span>
          </p>
          <p className="text-muted-foreground">
            Constructor:{" "}
            <span className="text-background font-medium">
              {results[0]?.constructor}
            </span>
          </p>
        </div>

        {/* Results Info */}
        <div className="flex flex-col gap-1 text-sm flex-1">
          <p className="text-muted-foreground">
            Position:{" "}
            <span className="text-green-500 font-semibold">
              {results[0]?.result.position || "N/A"}
            </span>
          </p>
          <p className="text-muted-foreground">
            Points:{" "}
            <span className="text-yellow-500 font-semibold">
              {results[0]?.result.points || "0"}
            </span>
          </p>
          <p className="text-muted-foreground">
            Gap to Leader:{" "}
            <span className="text-background font-medium">
              {results[0]?.result.gapToLeader || "N/A"}
            </span>
          </p>
        </div>

        {/* Fastest Lap Info */}
        <div className="flex flex-col gap-1 text-sm flex-1">
          <p className="text-muted-foreground">
            Fastest Lap Time:{" "}
            <span className="text-background font-semibold">
              {results[0]?.fastestLap.time || "N/A"}
            </span>
          </p>
          <p className="text-muted-foreground">
            Qualifying Time:{" "}
          <span className="text-background font-semibold">
            {(() => {
              const q = results[0]?.qualifying;
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

          <p className="text-muted-foreground">
            Fastest Lap Rank:{" "}
            <span className="text-f1red-600 font-bold">
              {results[0]?.fastestLap.rank || "N/A"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
