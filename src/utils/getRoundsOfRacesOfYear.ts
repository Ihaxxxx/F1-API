export async function getRoundsOfRacesOfYear(year: number) {
  let response = await fetch(`https://api.jolpi.ca/ergast/f1/${year}/races`);
  if (!response.ok) {
    throw new Error(`Failed to fetch rounds for year ${year}`);
  }
  const data = await response.json();
  const allRaces = data.MRData.RaceTable.Races;
  const today = new Date();
  const completedRaces = allRaces
    .filter((race: any) => new Date(race.date) < today)
    .map((race: any) => ({
      round: race.round,
      raceName: race.raceName,
      date: race.date,
    }));

  return completedRaces;
}
