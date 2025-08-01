'use server'
import { countryNameToCode } from "./countryNameToCode";
import { teamColors } from "./teamColors";
import { getCachedDrivers, setCachedDrivers } from './cache';
import { getRoundsOfRacesOfYear } from "./getRoundsOfRacesOfYear";
import { asyncPool } from "./asyncPool";
import { fetchWithRetries } from "./fetchWithRetries";
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

  // 5. Cache and return
  await setCachedDrivers(year, enriched);
  return enriched;
}



export async function dataForDriverHeading(year: number, driverNameId : string) {
  
  const driverData = await fetch(
    `https://api.jolpi.ca/ergast/f1/${year}/drivers/${driverNameId}/driverstandings/`
  );
  let res = await driverData.json()
  let dataOfJolpi = res.MRData.StandingsTable.StandingsLists[0]
  

  // Fetch driver image and number from OpenF1 API by using the driver code
  const driverCode = res.MRData.StandingsTable.StandingsLists[0].DriverStandings[0].Driver.code;
  

  // Fetch driver data from OpenF1 API
  let driverOpenF1 = await fetch(`https://api.openf1.org/v1/drivers?name_acronym=${driverCode}&session_key=latest`)
  let driverOpenF1Data = await driverOpenF1.json();

  
  let combinedData = {
    ...dataOfJolpi,
    driverImage: driverOpenF1Data[0]?.headshot_url || null,
    driverNumberOpenF1 : driverOpenF1Data[0]?.driver_number || null }
  return combinedData
}


export async function dataForDriverLineChart(driverId: string, year: number) {
  let rounds = await getRoundsOfRacesOfYear(year);
  
  const enrichedRounds = await asyncPool(1, rounds, async (round: any) => {
    const url = `https://api.jolpi.ca/ergast/f1/${year}/${round.round}/drivers/${driverId}/driverstandings/`;
    
    try {
      const response = await fetchWithRetries(url, 3, 500);

      const data = await response.json();
      const standingsList = data.MRData.StandingsTable.StandingsLists;

      if (
        !standingsList ||
        standingsList.length === 0 ||
        !standingsList[0].DriverStandings ||
        standingsList[0].DriverStandings.length === 0
      ) {
        console.warn(`No standings data for round ${round.round} (${round.raceName})`);
        return { ...round, points: 0, position: "N/A" };
      }

      const standings = standingsList[0].DriverStandings[0];
      return {
        ...round,
        points: Number(standings.points),
        position: Number(standings.position),
      };
    } catch (err) {
      console.error(`Failed after retries for round ${round.round}:`, err);
      return { ...round, points: 0, position: "N/A" };
    }
  });

  return enrichedRounds;
}

