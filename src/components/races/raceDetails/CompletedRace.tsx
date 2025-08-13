import RaceHeadingCompletedRace from "./RaceHeadingCompletedRace";
import StartingGrid from "./StartingGrid";
import RaceStandings from "./RaceStandings";
export default function CompletedRace({ raceDetails } : any) {
  console.log(raceDetails);
  return (
    <>
      <RaceHeadingCompletedRace raceDetails={raceDetails}></RaceHeadingCompletedRace>
      {/* <StartingGrid QualifyingResults={QualifyingResults} /> */}
      <RaceStandings results={raceDetails}/>
    </>
  );
}
