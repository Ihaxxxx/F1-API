"use client";
import React from "react";
import { useParams } from "next/navigation";
import RaceResultPageHeading from "@/components/drivers/driverDetails/raceResults/RaceDetails";
import LapTimingGraph from "@/components/ui/drivers/raceResults/LapTimingGraph";
import PositionGraph from "@/components/ui/drivers/raceResults/PositionGraph";

export default function RaceResultPage() {
  const params = useParams();
  const [driverNameId, driverNumberId] = (
    params?.driverDetails as string
  ).split("-");
  const [year, round] = (params?.raceResult as string).split("-");
  const driverAndRoundDetail = {
    driverNameId,
    driverNumberId,
    year,
    round,
  };


  return (
    <>
      <RaceResultPageHeading driverAndRoundDetail={driverAndRoundDetail}/>
      <LapTimingGraph driverAndRoundDetail={driverAndRoundDetail}/>
      <PositionGraph driverAndRoundDetail={driverAndRoundDetail}/>
    </>
  );
}
