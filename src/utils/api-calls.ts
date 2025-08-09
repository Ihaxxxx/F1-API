'use server'
import { countryNameToCode } from "../lib/countryNameToCode";
import { teamColors } from "./teamColors";
import { getCachedDrivers, setCachedDrivers } from './cache';
import { getRoundsOfRacesOfYear } from "./getRoundsOfRacesOfYear";
import { asyncPool } from "./asyncPool";
import { fetchWithRetries } from "./fetchWithRetries";
import { nationalityToCountryCode } from "@/lib/nationalityToCountryCode";
import { delay } from "./delay";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

// main page
export async function fetchNextRaceHomePage() {
  const now = new Date();
  const res = await fetch(`https://api.jolpi.ca/ergast/f1/${now.getFullYear()}/races/`);
  const data = await res.json();
  const races = data.MRData.RaceTable.Races;
  const nextRace = races.find((race: any) => {
    const raceDateTime = new Date(`${race.date}T${race.time || '00:00:00Z'}`); // Handles missing time
    return raceDateTime > now;
  });
  const country = nextRace.Circuit.Location.country;
  const countryCode = countryNameToCode[country];
  const flagUrl = countryCode
    ? `https://flagsapi.com/${countryCode}/flat/64.png`
    : null;
  return {
    ...nextRace,
    flagUrl,
  };
}

// main page
export async function dataForBarChartMainPage(year: number) {
  const response = await fetch(
    `https://api.jolpi.ca/ergast/f1/${year}/last/driverstandings?limit=3`
  );
  const dataDrivers = await response.json();
  const standings =
    dataDrivers.MRData.StandingsTable.StandingsLists[0].DriverStandings;
  const combinedData = [];
  for (const driver of standings.slice(0, 3)) {
    try {
      const driverId = driver.Driver.driverId;
      const constructorRes = await fetch(
        `https://api.jolpi.ca/ergast/f1/${year}/drivers/${driverId}/driverstandings/`
      );
      const constructorData = await constructorRes.json();
      const constructorObj = constructorData.MRData.StandingsTable.StandingsLists[0]?.DriverStandings[0]?.Constructors?.[0];
      if (!constructorObj) {
        console.warn(`Constructor info missing for driver ${driverId} in year ${year}`);
        continue;
      }
      const constructorId = constructorObj.constructorId;
      const constructorName = constructorObj.name;
      const teamColor = teamColors[constructorName];
      combinedData.push({
        name: `${driver.Driver.givenName} ${driver.Driver.familyName}`,
        position: driver.position,
        points: parseFloat(driver.points),
        constructor: constructorName,
        color: teamColor,
      });
    } catch (err) {
      console.error(
        `❌ Error processing driver ${driver.Driver.familyName}:`,
        err
      );
    }
  }
  return combinedData;
}



type EnrichedDriver = {
  full_name: string;
  team_name: string;
  headshot_url: string | null;
  driver_number: number | null;
  [key: string]: any;
};

export async function fetchEnrichedDriversForYear(year: number): Promise<EnrichedDriver[]> {
  const cached = await getCachedDrivers(year);
  if (cached) return cached;

  // 1. Fetch Ergast driver list
  const ergastRes = await fetch(`https://api.jolpi.ca/ergast/f1/${year}/drivers/`);
  const ergastData = await ergastRes.json();
  const jolpiDrivers = ergastData.MRData.DriverTable.Drivers;

  // 2. Fetch driver standings (to get points)
  const standingsRes = await fetch(`https://api.jolpi.ca/ergast/f1/${year}/driverStandings.json`);
  const standingsData = await standingsRes.json();
  const standingsList = standingsData.MRData.StandingsTable.StandingsLists[0]?.DriverStandings || [];

  // Create map of driverId -> points
  const pointsMap = new Map<string, number>();
  for (const entry of standingsList) {
    pointsMap.set(entry.Driver.driverId, parseFloat(entry.points));
  }

  // 3. Fetch OpenF1 meeting keys
  const meetingsRes = await fetch(`https://api.openf1.org/v1/meetings?year=${year}`);
  const meetingData = await meetingsRes.json();
  const meetingKeys = [...new Set(meetingData.map((m: any) => m.meeting_key))];

  async function findFullDriverData(driver: any) {
    for (const meetingKey of meetingKeys.slice().reverse()) {
      const res = await fetch(`https://api.openf1.org/v1/drivers?meeting_key=${meetingKey}`);
      if (!res.ok) continue;
      const meetingDrivers = await res.json();
      const match = meetingDrivers.find((d: any) =>
        d.driver_number == driver.permanentNumber ||
        d.full_name?.toLowerCase().includes(driver.familyName.toLowerCase())
      );
      if (match && match.team_name && match.headshot_url && match.driver_number) {
        return match;
      }
    }
    return null;
  }

  // 4. Enrich driver data
  const enriched = [];

  for (const driver of jolpiDrivers) {
    const openf1Match = await findFullDriverData(driver);
    const points = pointsMap.get(driver.driverId) || 0;

    enriched.push({
      ...driver,
      full_name: `${driver.givenName} ${driver.familyName}`,
      team_name: openf1Match?.team_name ?? "Unknown",
      headshot_url: openf1Match?.headshot_url ?? null,
      driver_number: openf1Match?.driver_number ?? null,
      points, // ✅ Added points here
    });
  }
  await setCachedDrivers(year, enriched);
  return enriched;
}



export async function dataForDriverHeading(year: number, driverNameId: string) {

  const driverData = await fetch(
    `https://api.jolpi.ca/ergast/f1/${year}/drivers/${driverNameId}/driverstandings/`
  );
  let res = await driverData.json()
  let dataOfJolpi = res.MRData.StandingsTable.StandingsLists[0]


  // Fetch driver image and number from OpenF1 API by using the driver code
  const driverCode = res.MRData.StandingsTable.StandingsLists[0].DriverStandings[0].Driver.code;
  const driverNationality = res.MRData.StandingsTable.StandingsLists[0].DriverStandings[0].Driver.nationality;
  const code = nationalityToCountryCode[driverNationality]?.toLowerCase();
  const flagUrl = `https://flagcdn.com/w80/${code}.png`;
  // Fetch driver data from OpenF1 API
  let driverOpenF1 = await fetch(`https://api.openf1.org/v1/drivers?name_acronym=${driverCode}&meeting_key=latest`)
  let driverOpenF1Data = await driverOpenF1.json();


  let combinedData = {
    ...dataOfJolpi,
    driverImage: driverOpenF1Data[0]?.headshot_url || null,
    driverNumberOpenF1: driverOpenF1Data[0]?.driver_number || null,
    flagUrl: flagUrl,
  }
  return combinedData
}


export async function dataForDriverLineChart(driverId: string, year: number) {
  let rounds = await getRoundsOfRacesOfYear(year);
  const enrichedRounds = await asyncPool(1, rounds, async (round: any) => {
    try {
      // Fetch race result
      const raceResultUrl = `https://api.jolpi.ca/ergast/f1/${year}/${round.round}/drivers/${driverId}/results/`;
      const raceResultRes = await fetchWithRetries(raceResultUrl, 3, 500);
      const raceResultData = await raceResultRes.json();

      const race = raceResultData.MRData.RaceTable.Races?.[0];
      // Fetch driver standings after this round
      const standingsUrl = `https://api.jolpi.ca/ergast/f1/${year}/${round.round}/driverStandings/`;
      const standingsRes = await fetchWithRetries(standingsUrl, 3, 500);
      const standingsData = await standingsRes.json();

      const standingsList = standingsData.MRData.StandingsTable.StandingsLists?.[0];
      const driverStanding = standingsList?.DriverStandings?.find(
        (d: any) => d.Driver.driverId === driverId
      );

      if (!race || !race.Results?.[0] || !driverStanding) {
        return {
          round: round.round,
          raceName: round.raceName,
          country: null,
          flag: null,
          position: null,
          championshipPosition: null,
          points: null,
        };
      }
      const country = race.Circuit?.Location?.country ?? "Unknown";
      const raceDate = race.date
      const countryCode = countryNameToCode[country] || "unknown";
      const flag = `https://flagcdn.com/w80/${countryCode.toLowerCase()}.png`;

      // Race finishing position
      const position = race.Results[0].position ?? null;

      // Championship position and points after this round
      const championshipPosition = Number(driverStanding.position) ?? null;
      const points = driverStanding.points ?? null;


      // Optional delay between requests
      await new Promise((res) => setTimeout(res, 400));

      return {
        round: round.round,
        raceName: round.raceName,
        country,
        flag,
        position,
        championshipPosition,
        points,
        raceDate,
      };

    } catch (err) {
      console.error(`Failed to fetch data for round ${round.round}:`, err);
      return {
        round: round.round,
        raceName: round.raceName,
        country: null,
        flag: null,
        position: null,
        championshipPosition: null,
        points: null,
        raceDate: null,
      };
    }
  });

  return enrichedRounds;
}

export async function raceResultsPageHeading(
  year: number,
  driverId: string,
  round: string
) {
  try {
    // 1. Ergast race result
    const res = await fetch(`https://api.jolpi.ca/ergast/f1/${year}/${round}/drivers/${driverId}/results/`);
    const data = await res.json();
    const race = data?.MRData?.RaceTable?.Races?.[0];
    const result = race?.Results?.[0];

    if (!race || !result) return null;

    const fullName = `${result.Driver.givenName} ${result.Driver.familyName}`;
    const permanentNumber = result.Driver.permanentNumber;

    // 2. Country flag
    const location = race?.Circuit?.Location || {};
    const country = location.country || "Unknown";
    const countryCode = countryNameToCode[country] || "unknown";
    const flag = `https://flagcdn.com/w80/${countryCode.toLowerCase()}.png`;

    // 3. Fetch OpenF1 headshot
    const meetingsRes = await fetch(`https://api.openf1.org/v1/meetings?year=${year}`);
    const meetingData = await meetingsRes.json();
    const meetingKeys = [...new Set(meetingData.map((m: any) => m.meeting_key))];

    let openF1Driver = null;
    for (const meetingKey of meetingKeys.slice().reverse()) {
      const driverRes = await fetch(`https://api.openf1.org/v1/drivers?meeting_key=${meetingKey}`);
      if (!driverRes.ok) continue;
      const openF1Drivers = await driverRes.json();
      const match = openF1Drivers.find((d: any) =>
        d.driver_number == permanentNumber ||
        d.full_name?.toLowerCase().includes(result.Driver.familyName.toLowerCase())
      );
      if (match && match.headshot_url) {
        openF1Driver = match;
        break;
      }
    }

    // 4. Qualifying data
    const qualRes = await fetch(`https://api.jolpi.ca/ergast/f1/${year}/${round}/drivers/${driverId}/qualifying/`);
    const qualData = await qualRes.json();
    const qualResult = qualData?.MRData?.RaceTable?.Races?.[0]?.QualifyingResults?.[0];

    const qualifying = qualResult
      ? {
          position: qualResult.position || null,
          Q1: qualResult.Q1 || null,
          Q2: qualResult.Q2 || null,
          Q3: qualResult.Q3 || null,
        }
      : null;

    return {
      circuit: {
        name: race?.Circuit?.circuitName || "",
        city: location?.locality || "",
        country,
        lat: location.lat || "",
        long: location.long || "",
        flag,
      },
      constructor: result.Constructor?.name || "",
      driver: {
        fullName,
        nationality: result.Driver.nationality || "",
        image_url: openF1Driver?.headshot_url || "",
      },
      race: {
        name: race.raceName || "",
        round: race.round || "",
        date: race.date || "",
        totalLaps: result.laps || "",
      },
      fastestLap: {
        time: result.FastestLap?.Time?.time || null,
        rank: result.FastestLap?.rank || null,
      },
      result: {
        position: result.position || null,
        points: result.points || null,
        gapToLeader: result.Time?.time || null,
      },
      qualifying, // Added Qualifying section
    };

  } catch (error) {
    console.error("Failed to fetch race result:", error);
    return null;
  }
}


export async function lapTimes(driverId: string, round: string, year: number) {
  try {
    const [responseLaps, responsePitStops] = await Promise.all([
      fetch(`https://api.jolpi.ca/ergast/f1/${year}/${round}/drivers/${driverId}/laps/?limit=1000`),
      fetch(`https://api.jolpi.ca/ergast/f1/${year}/${round}/drivers/${driverId}/pitstops/?limit=1000`)
    ]);

    const lapsData = await responseLaps.json();
    const pitStopsData = await responsePitStops.json();

    const laps = lapsData?.MRData?.RaceTable?.Races?.[0]?.Laps || [];
    const pitStops = pitStopsData?.MRData?.RaceTable?.Races?.[0]?.PitStops || [];

    const pitMap: Record<string, { duration: string, stop: string, time: string }> = {};
    for (const pit of pitStops) {
      pitMap[pit.lap] = {
        duration: pit.duration,
        stop: pit.stop,
        time: pit.time
      };
    }

    function parseTimeToSeconds(timeStr: string): number {
      const [min, rest] = timeStr.split(":");
      const [sec, ms] = rest.split(".");
      return parseInt(min) * 60 + parseInt(sec) + parseInt(ms) / 1000;
    }

    function formatToMMSSms(timeStr: string): string {
      const [min, rest] = timeStr.split(":");
      const [sec, ms] = rest.split(".");
      return `${min}:${sec}.${ms}`;
    }

    const enrichedLaps = laps.map((lapObj: any) => {
      const lapNumber = Number(lapObj.number);
      const rawTime = lapObj.Timings?.[0]?.time || null;
      const pitInfo = pitMap[lapObj.number] || null;

      if (!rawTime) return null;

      return {
        lap: lapNumber,
        timeInSeconds: parseTimeToSeconds(rawTime),
        displayTime: formatToMMSSms(rawTime),
        pitStop: pitInfo,
        position: lapObj.Timings?.[0]?.position || null,
      };
    }).filter(Boolean); // remove nulls if any lap has no timing

    return enrichedLaps;
  } catch (error) {
    console.error("lapTimes error:", error);
    return [];
  }
}

export async function RaceList(year: number) {
  const response = await fetch(`https://api.jolpi.ca/ergast/f1/${year}/races/`);
  const data = await response.json();
  const raceList = data.MRData.RaceTable.Races;

  const formattedRaces = raceList.map((race: any) => {
    const country = race.Circuit.Location.country;
    const city = race.Circuit.Location.locality;
    const location = race.Circuit.circuitName;
    const raceName = race.raceName;
    const round = race.round;
    const date = race.date;

    const countryCode = countryNameToCode[country] || "unknown";
    const flag = `https://flagcdn.com/w80/${countryCode.toLowerCase()}.png`;

    return {
      raceName,
      round,
      date,
      city,
      country,
      location,
      flag
    };
  });

  return formattedRaces;
}

export async function getRaceDetails(year: string, round: string) {
  const baseUrl = `https://api.jolpi.ca/ergast/f1/${year}/${round}`;
  const urls = [
    `${baseUrl}.json`,
    `${baseUrl}/qualifying.json`,
    `${baseUrl}/results.json`,
    `${baseUrl}/grid.json`,
    `${baseUrl}/practice1.json`,
    `${baseUrl}/practice2.json`,
    `${baseUrl}/practice3.json`
  ];

  try {
    const data: any[] = [];
    for (const url of urls) {
      const res = await fetch(url);
      data.push(await res.json());
      await delay(300); // prevent hammering the API
    }

    const [raceData, qualifyingData, resultsData, gridData, fp1Data, fp2Data, fp3Data] = data;

    const raceInfo = raceData.MRData?.RaceTable?.Races?.[0] || {};
    const raceResults = resultsData.MRData?.RaceTable?.Races?.[0]?.Results || [];
    const circuit = raceInfo.Circuit || {};

    const fastestLap = raceResults.find(
      (driver: any) => driver.FastestLap?.rank === "1"
    );

    return {
      circuit,
      raceInfo,
      qualifyingResults: qualifyingData.MRData?.RaceTable?.Races?.[0]?.QualifyingResults || [],
      raceResults,
      fastestLap,
    };
  } catch (error) {
    console.error("Error fetching race details:", error);
    return null;
  }
}
