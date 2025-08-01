export function getNextSession(race: any) {
  const now = new Date();

  const sessionMap = [
    { key: "FirstPractice", label: "Free Practice 1" },
    { key: "SecondPractice", label: "Free Practice 2" },
    { key: "ThirdPractice", label: "Free Practice 3" },
    { key: "SprintQualifying", label: "Sprint Qualifying" }, // aka Sprint Shootout
    { key: "Sprint", label: "Sprint" },
    { key: "Qualifying", label: "Qualifying" },
    { key: "date", label: "Race" }, // Main Race, using top-level `date` and `time`
  ];

  for (const session of sessionMap) {
    const isMainRace = session.key === "date";
    const date = isMainRace ? race.date : race[session.key]?.date;
    const time = isMainRace ? race.time : race[session.key]?.time;

    if (!date || !time) continue;

    const sessionTime = new Date(`${date}T${time}`);
    if (sessionTime > now) {
      return {
        label: session.label,
        time: sessionTime,
      };
    }
  }

  return null; // All sessions are in the past
}
