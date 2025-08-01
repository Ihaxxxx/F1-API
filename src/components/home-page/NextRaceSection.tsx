"use client";
import React, { useEffect, useState } from "react";
import { getCountdown } from "@/utils/countdown";
import { getNextSession } from "@/utils/getNextSession";
type Session = {
  date: string;
  time: string;
};

type NextRaceProps = {
  race: {
    season: string;
    round: string;
    url: string;
    raceName: string;
    flagUrl: string;
    Circuit: {
      circuitId: string;
      url: string;
      circuitName: string;
      Location: {
        lat: string;
        long: string;
        locality: string;
        country: string;
      };
    };
    date: string; // race day
    time: string; // race time
    FirstPractice?: Session;
    SecondPractice?: Session;
    ThirdPractice?: Session;
    Qualifying?: Session;
    Sprint?: Session;
    SprintQualifying?: Session;
  };
};

export default function NextRaceSection({
  race,
}: {
  race: NextRaceProps["race"];
}) {
  const raceDate = new Date(`${race.date}T${race.time}`);
  const formattedDate = raceDate.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const formattedTime = raceDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });

  const [nextSession, setNextSession] = useState(() => getNextSession(race));
  const [countdown, setCountdown] = useState(
    getCountdown(nextSession?.time || new Date(race.date + "T" + race.time))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const session = getNextSession(race);
      setNextSession(session);

      const updated = session ? getCountdown(session.time) : null;
      setCountdown(updated);
      if (!updated) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [race]);

  return (
    <section className="relative bg-black border-t border-zinc-800">
      <div className="mx-auto w-full max-w-7xl py-16 px-6 md:px-10 grid md:grid-cols-2 gap-10 items-center">
        {/* Left Side - Info */}
        <div className="space-y-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-f1bold text-white">
            Next Race: <span className="text-red-600">{race.raceName}</span>
          </h2>

          {countdown ? (
            <div className="text-white">
              <h3 className="text-lg font-medium text-gray-400">
                {nextSession?.label
                  ? `Countdown to ${nextSession.label}`
                  : "Race Weekend Completed"}
              </h3>
              <div className="flex space-x-4 mt-2 text-center font-f1bold text-3xl sm:text-5xl md:text-6xl text-red-500">
                <div>
                  <div>{countdown.days}</div>
                  <div className="text-xs sm:text-sm text-gray-300">Days</div>
                </div>
                <div>
                  <div>{countdown.hours}</div>
                  <div className="text-xs sm:text-sm text-gray-300">Hours</div>
                </div>
                <div>
                  <div>{countdown.minutes}</div>
                  <div className="text-xs sm:text-sm text-gray-300">
                    Minutes
                  </div>
                </div>
                <div>
                  <div>{countdown.seconds}</div>
                  <div className="text-xs sm:text-sm text-gray-300">
                    Seconds
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-red-500 text-lg font-medium">
              Race Started or Ended!
            </p>
          )}

          <p className="text-gray-300 text-lg">
            <span className="text-white font-medium">Date:</span>{" "}
            {formattedDate}
          </p>

          <p className="text-gray-300 text-lg">
            <span className="text-white font-medium">Time:</span>{" "}
            {formattedTime}
          </p>

          <p className="text-gray-300 text-lg">
            <span className="text-white font-medium">Circuit:</span>{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              className=" text-red-500 transition"
            >
              {race.Circuit.circuitName}
            </a>
          </p>

          <p className="text-gray-300 text-lg">
            <span className="text-white font-medium">Location:</span>{" "}
            {race.Circuit.Location.locality}, {race.Circuit.Location.country}
          </p>

          <div className="pt-4">
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md text-base font-medium transition"
            >
              View Details About Race Have to work on it
            </a>
          </div>
        </div>

        {/* Right Side - Flag */}
        <div className="flex justify-center md:justify-end">
          <div className="text-center space-y-4">
            <img
              src={race.flagUrl}
              alt={`${race.Circuit.Location.country} flag`}
              className="w-28 md:w-40 mx-auto rounded shadow-md"
              loading="lazy"
            />
            <p className="text-xl font-semibold text-gray-300">
              {race.Circuit.Location.country}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
