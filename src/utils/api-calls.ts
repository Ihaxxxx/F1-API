import { countryNameToCode } from "./countryNameToCode";
import { teamColors } from "./teamColors";
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


