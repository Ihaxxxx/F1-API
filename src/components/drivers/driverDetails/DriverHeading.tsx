"use client";

import Spinner from "../spinner";

type Props = {
  driverData: {
    DriverStandings: Array<{
      Driver: {
        givenName: string;
        familyName: string;
        nationality: string;
        driverId: string;
        permanentNumber: string;
        code: string;
        dateOfBirth: string;
        url: string;
      };
      Constructors: Array<{
        constructorId: string;
        name: string;
        nationality: string;
        url: string;
      }>;
      points: string;
      position: string;
      wins: string;
    }>;
    round: string;
    season: string;
    driverImage: string;
  };
};

export default function DriverHeading({ driverData }: Props) { 

  const standing = driverData.DriverStandings[0];
  const driver = standing.Driver;
  const team = standing.Constructors[0];

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between border p-4 md:p-6 rounded-xl shadow-xl bg-foreground text-background space-y-6 md:space-y-0 md:space-x-6">
      {/* Left: Driver Image + Info + Stats (on mobile) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
        {/* Driver Image */}
        <div className="relative size-20 rounded-full overflow-hidden border-4 border-black shadow-md">
          <img
            alt={`${driver.givenName} ${driver.familyName}`}
            src={driverData.driverImage}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Info + Stats */}
        <div className="flex flex-col gap-2 w-full">
          <h1 className="text-2xl sm:text-3xl font-f1bold tracking-wide">
            {driver.givenName} {driver.familyName}{" "}
            <span className="text-muted-foreground text-lg">#{driver.permanentNumber}</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Nationality: <span className="font-semibold text-background">{driver.nationality}</span> | Team:{" "}
            <a
              href={team.url}
              className="font-semibold text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {team.name}
            </a>
          </p>
          <p className="text-sm text-muted-foreground">
            Season: <span className="font-semibold text-background">{driverData.season}</span> | Round:{" "}
            <span className="font-semibold text-background">{driverData.round}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Wins: <span className="font-semibold text-background">{standing.wins}</span>
          </p>

          {/* Stats for mobile only */}
          <div className="flex flex-row sm:hidden gap-6 mt-2">
            <div>
              <p className="text-sm text-muted-foreground ">Points</p>
              <p className="text-xl font-bold text-yellow-600">{standing.points}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Position</p>
              <p className="text-xl font-bold text-green-600 ">#{standing.position}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Stats on Desktop only */}
      <div className="hidden sm:flex flex-col items-end text-right gap-2">
        <div>
          <p className="text-sm text-muted-foreground">Points</p>
          <p className="text-2xl font-bold text-yellow-600">{standing.points}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Position</p>
          <p className="text-2xl font-bold text-green-600">#{standing.position}</p>
        </div>
      </div>
    </div>
  );
}


