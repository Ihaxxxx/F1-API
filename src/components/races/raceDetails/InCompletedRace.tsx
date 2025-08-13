import React from 'react'
import RaceHeadingIncompleted from './RaceHeadingIncompleted'
import PreviousWinners from './PreviousWinners'
export default function InCompletedRace({raceDetails} : any) {
  return (
    <>
      <RaceHeadingIncompleted raceDetails={raceDetails}/>
      <PreviousWinners raceDetails={raceDetails}/>
      
    </>
  )
}
