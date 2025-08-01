'use server'
import { countryNameToCode } from "./countryNameToCode";
import { teamColors } from "./teamColors";
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
      const teamColor = teamColors[constructorName] ;
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



// drivers
type EnrichedDriver = {
  full_name: string;
  team_name: string;
  headshot_url: string | null;
  driver_number: number | null;
  [key: string]: any;
};
// In-memory cache (per serverless function instance)
const enrichedDriverCache: Map<number, { timestamp: number, data: EnrichedDriver[] }> = new Map();
const CACHE_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

export async function fetchEnrichedDriversForYear(year: number): Promise<EnrichedDriver[]> {
  const cached = enrichedDriverCache.get(year);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const ergastRes = await fetch(`https://api.jolpi.ca/ergast/f1/${year}/drivers/`);
  const ergastData = await ergastRes.json();
  const jolpiDrivers = ergastData.MRData.DriverTable.Drivers;

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

  const enriched = [];

  for (const driver of jolpiDrivers) {
    const openf1Match = await findFullDriverData(driver);

    enriched.push({
      ...driver,
      full_name: `${driver.givenName} ${driver.familyName}`,
      team_name: openf1Match?.team_name ?? "Unknown",
      headshot_url: openf1Match?.headshot_url ?? null,
      driver_number: openf1Match?.driver_number ?? null,
    });
  }

  // Store in cache
  enrichedDriverCache.set(year, {
    timestamp: Date.now(),
    data: enriched,
  });

  return enriched;
}


export async function dataForDriverHeading(year: number, driverNameId : string) {

  const driverData = await fetch(
    `https://api.jolpi.ca/ergast/f1/${year}/drivers/${driverNameId}/driverstandings/`
  );
  let res = await driverData.json()
  const permanentNumber = res.MRData.StandingsTable.StandingsLists[0].DriverStandings[0].Driver.permanentNumber;
  return permanentNumber
  let driverImage = await fetch(`https://api.openf1.org/v1/drivers?driver_number=${permanentNumber}&session_key=latest`)
  let driverImageData = await driverImage.json();
  let data = res.MRData.StandingsTable.StandingsLists[0]
  let combinedData = {
    ...data,
    driverImage: driverImageData[0]?.headshot_url || null,}
  return combinedData
}