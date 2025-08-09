"use client";
import DriverHeading from "@/components/drivers/driverDetails/DriverHeading";
import DriverPointsGraph from "@/components/ui/drivers/DriverPointsGraph";
import DriverPositionGraph from "@/components/ui/drivers/DriversPositionGraph";
import RaceResultsList from "@/components/drivers/driverDetails/RaceResultsList";
import {
  dataForDriverHeading,
  dataForDriverLineChart,
} from "@/utils/api-calls";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Spinner from "@/components/spinner";

export default function DriverPage() {
  const params = useParams();
  const driverDetails = params?.driverDetails;
  const [driverNameId, driverNumberId] = (driverDetails as string).split("-");
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [driverData, setDriverData] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);

  const [step, setStep] = useState<"idle" | "heading" | "chart" | "done">("idle");

  useEffect(() => {

    const fetchDriverInfoSerially = async () => {
      setStep("heading");
      try {
        const headingData = await dataForDriverHeading(year, driverNameId);
        setDriverData(headingData);
        setStep("chart");

        const pointsData = await dataForDriverLineChart(driverNameId, year);
        setChartData(pointsData);
        setStep("done"); // All steps complete
      } catch (err) {
        console.error("Error loading driver data:", err);
        setStep("done"); // Prevents infinite spinner if an error occurs
      }
    };

    fetchDriverInfoSerially();
  }, [driverNameId, year]);

  return (
    <div className="p-4 text-white">
      <div className="flex items-center gap-2 mb-4">
        <label htmlFor="year-select" className="text-sm text-muted-foreground">
          Select Year:
        </label>
        <select
          id="year-select"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="bg-zinc-900 text-white border border-gray-700 rounded px-3 py-1"
        >
          {[2023, 2024, 2025].map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* Heading */}
      {step === "idle" || step === "heading" ? (
        <div className="p-4 text-center">
          <Spinner text="Loading Driver Details..." />
        </div>
      ) : (
        driverData && <DriverHeading driverData={driverData} />
      )}

      {/* Charts */}
      {step === "chart" && (
        <div className="py-8 text-center text-muted-foreground">
          Loading Graphs...
        </div>
      )}
      {step === "done" && chartData.length > 0 && (
        <>
          <DriverPointsGraph
            driverId={driverNameId}
            year={year}
            chartData={chartData}
          />
          <DriverPositionGraph
            driverId={driverNameId}
            year={year}
            chartData={chartData}
          />
        </>
      )}

      {/* Results List */}
      {step === "done" && (
        <RaceResultsList driverId={driverNameId} chartData={chartData} year={year} driverDetails={driverDetails}/>
      )}
    </div>
  );
}
