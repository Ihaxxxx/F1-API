'use client';
import { useParams } from "next/navigation";
import RaceDetails from "@/components/races/raceDetails/RaceDetails";
export default function page() {
    const params = useParams();
    const [year, round] = (params?.raceDetails as string).split("-");
  return (
    <>
        <div>page</div>
        <RaceDetails year={year} round={round}/>
    </>
  )
}
