"use client";
import DriverHeading from "@/components/drivers/driverDetails/DriverHeading";
import DriverPointsGraph from "@/components/ui/drivers/DriverPointsGraph";
import DriverPositionGraph from "@/components/ui/drivers/DriversPositionGraph";
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
  const [loading, setLoading] = useState(true);

  // Fetch driver data based on the driverNameId and year
  const [driverData, setDriverData] = useState();
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [driverInfo, chartPoints] = await Promise.all([
          dataForDriverHeading(year, driverNameId),
          dataForDriverLineChart(driverNameId, year),
        ]);
        console.log(chartPoints);
        setDriverData(driverInfo);
        setChartData(chartPoints);
      } catch (err) {
        console.error("Error loading driver details or chart:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [year]);

  if (loading) {
    return (
      <div className="p-4 text-center">
        <Spinner text="Loading Driver Data..." />
      </div>
    );
  }

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
      <DriverHeading driverData={driverData!} />
      
      <DriverPointsGraph
        driverId={driverNameId as string}
        year={year}
        chartData={chartData}
      />
      <DriverPositionGraph
        driverId={driverNameId as string}
        year={year}
        chartData={chartData}
      />
    </div>
  );
}
