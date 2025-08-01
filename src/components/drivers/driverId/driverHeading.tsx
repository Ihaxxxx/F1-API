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
  if (!driverData?.DriverStandings?.length) {
    return (
      <div className="p-4 text-center text-red-500 font-semibold">
        <Spinner text="Loading Driver Data"></Spinner>
      </div>
    );
  }

  const standing = driverData.DriverStandings[0];
  const driver = standing.Driver;
  const team = standing.Constructors[0];

  return (
  <div className="md:flex md:items-center md:justify-between md:space-x-5 border p-5 rounded-xl shadow-xl bg-foreground text-background">
    <div className="flex items-start space-x-5">
      {/* Driver Image */}
      <div className="shrink-0">
        <div className="relative size-20 rounded-full overflow-hidden border-4 border-black shadow-md">
          <img
            alt={`${driver.givenName} ${driver.familyName}`}
            src={driverData.driverImage}
            className="object-cover w-full h-full"
          />
        </div>
      </div>

      {/* Driver Info */}
      <div className="pt-1.5">
        <h1 className="text-3xl font-f1bold tracking-wide">
          {driver.givenName} {driver.familyName}{" "}
          <span className="text-muted-foreground text-lg">#{driver.permanentNumber}</span>
        </h1>
        <p className="text-sm mt-1 text-muted-foreground">
          Nationality:{" "}
          <span className="font-semibold text-background">{driver.nationality}</span> | Team:{" "}
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
      </div>
    </div>

    {/* Stats */}
    <div className="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-3 sm:space-y-0 sm:space-x-reverse md:mt-0 md:flex-row md:space-x-3">
      <div className="flex flex-col items-end text-right pr-2">
        <p className="text-sm text-muted-foreground">Points</p>
        <p className="text-2xl font-bold text-yellow-600">{standing.points}</p>
        <p className="text-sm text-muted-foreground">Position</p>
        <p className="text-2xl font-bold text-green-600">#{standing.position}</p>
      </div>
    </div>
  </div>
);

}
