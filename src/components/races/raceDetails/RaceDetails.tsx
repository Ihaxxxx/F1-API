import React, { useEffect, useState } from 'react'
import { getRaceDetails } from '@/utils/api-calls';

type RaceDetailsProps = {
  year: string;
  round: string;
};


export default function RaceDetails({ year, round }: RaceDetailsProps) {
  const [raceDetails, setRaceDetails] = useState<any>(null);

  useEffect(() => { 
    const fetchRaceDetails = async () => {
      try {
        const details = await getRaceDetails(year, round);
        console.log(details);
        setRaceDetails(details);
      } catch (error) {
        console.error("Error fetching")
      }
    }
    fetchRaceDetails();
  }, []);

  return (
    <div>RaceDetails</div>
  )
}


