export default function StartingGrid({ QualifyingResults }: any) {
  // Sort drivers by position ascending just in case
  const sortedDrivers = [...QualifyingResults].sort(
    (a, b) => parseInt(a.position) - parseInt(b.position)
  );

  // Split positions by odd and even
  const oddPositions = sortedDrivers.filter(
    (d) => parseInt(d.position) % 2 === 1
  );
  const evenPositions = sortedDrivers.filter(
    (d) => parseInt(d.position) % 2 === 0
  );

  return (
    <div className="max-w-5xl mx-auto bg-black rounded-xl p-6 shadow-lg text-white">
      <h2 className="text-3xl font-bold mb-8 text-f1red-600 text-center">
        Starting Grid
      </h2>

      {/* Desktop layout: two rows stacked vertically with stagger */}
      <div className="hidden md:flex flex-col items-center space-y-8 relative">
        {/* Odd positions row */}
        <div className="flex justify-center gap-4">
          {oddPositions.map((driver: any) => (
            <DriverBlock
              key={driver.position}
              driver={driver}
              highlight={driver.position === "1"}
            />
          ))}
        </div>

        {/* Even positions row (staggered) */}
        <div className="flex justify-center gap-4 ml-12">
          {evenPositions.map((driver: any) => (
            <DriverBlock key={driver.position} driver={driver} />
          ))}
        </div>
      </div>

      {/* Mobile layout: vertical stack */}
      <div className="md:hidden flex flex-col gap-4">
        {sortedDrivers.map((driver: any) => (
          <DriverBlock
            key={driver.position}
            driver={driver}
            highlight={driver.position === "1"}
          />
        ))}
      </div>
    </div>
  );
}

function DriverBlock({
  driver,
  highlight = false,
}: {
  driver: any;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-md p-4 w-40 h-30 shadow-md
        bg-gray-800 transition-transform duration-200
        ${highlight ? "bg-f1red-700 shadow-lg border-2 border-f1red-500" : "hover:scale-105"}`}
    >
      <div className="text-lg font-bold text-f1red-600 mb-1">
        {driver.position}
      </div>
      <div className="flex flex-col items-center">
        <p className="font-bold text-center leading-tight">
          <span className="text-sm">{driver.Driver.givenName}</span>
          <br />
          <span className="text-base">{driver.Driver.familyName}</span>
        </p>
        <p className="text-xs mt-1 text-center">{driver.Constructor.name}</p>
        {/* Add qualifying time */}
        {driver.Q3 || driver.Q2 || driver.Q1 ? (
          <p className="text-xs mt-1 text-center text-gray-300">
            {/* Prefer Q3, fallback to Q2 or Q1 */}
            Time: {driver.Q3 || driver.Q2 || driver.Q1}
          </p>
        ) : (
          <p className="text-xs mt-1 text-center text-gray-500 italic">
            No time
          </p>
        )}
      </div>
    </div>
  );
}

