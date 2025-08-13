import Spinner from "@/components/spinner";
import CompletedRace from "./CompletedRace";
import InCompletedRace from "./InCompletedRace";
import { getRaceDetails } from "@/utils/api-calls";
import { useEffect, useState } from "react";

interface RaceDetailsProps {
  year: number | string;
  round: number | string;
}

export default function RaceDetails({ year, round }: RaceDetailsProps) {
  const [raceDetails, setRaceDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchRaceDetails = async () => {
      try {
        const details = await getRaceDetails(String(year), String(round));

        if (!details) {
          setRaceDetails({});
          setCompleted(false);
          setLoading(false);
          return;
        }

        setRaceDetails(details);

        if (details?.raceInfo?.date && details?.raceInfo?.time) {
          const raceDateTime = new Date(
            `${details.raceInfo.date}T${details.raceInfo.time}`
          );
          setCompleted(new Date() > raceDateTime);
        } else {
          setCompleted(false);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching race details:", error);
        setRaceDetails({});
        setCompleted(false);
        setLoading(false);
      }
    };

    fetchRaceDetails();
  }, [year, round]);

  if (loading) {
    return <Spinner text="Loading Race Details" />;
  }

  if (!raceDetails) {
    return <p>No race details found.</p>;
  }

  return completed ? (
    <CompletedRace raceDetails={raceDetails} />
  ) : (
    <InCompletedRace raceDetails={raceDetails} />
  );
}
