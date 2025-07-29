"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import Spinner from "../spinner";
import { dataForBarChartMainPage } from "@/utils/api-calls";

export function BarChartDriversStandings() {

  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [year, setYear] = useState<number>(new Date().getFullYear());


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await dataForBarChartMainPage(year);

        console.log(data)
        const formattedData = data.map((item: any) => {
          const name = item.name || "Unknown";
          const points = Number(item.points) || 0;
          const color = item.color;
          const constructor =
            item.constructor ||
            "Unknown Team";
          return { name, points, color, constructor };
        });

        setChartData(formattedData);
        setError("");
      } catch (err) {
        console.error("Error loading bar chart:", err);
        setError("Failed to load chart data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year]);


  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <Spinner text="Loading Bar Chart..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center text-red-500 font-bold">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl tracking-wide text-f1red-600">
                Driver Standings
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground mt-1">
                Breakdown of championship points for the selected season
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="year-select" className="text-xs text-gray-400">
                Season:
              </label>
              <select
                id="year-select"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="bg-zinc-800 text-white text-xs font-semibold px-3 py-1 rounded-md border border-zinc-600 focus:outline-none"
              >
                {Array.from({ length: 2025 - 1980 + 1 }, (_, i) => 1980 + i).map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}

              </select>
            </div>
          </div>
        </CardHeader>
        {error}
      </div>
    );
  }
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0].payload;
      return (
        <div className="bg-zinc-900 border border-zinc-700 p-3 rounded-md shadow-md text-white text-sm">
          <p className="font-semibold text-f1red-600">{data.name}</p>
          <p className="text-gray-300">Points: {data.points}</p>
          <p className="text-gray-400">Constructor: {data.constructor}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <Card className="bg-black text-white shadow-lg border border-zinc-800">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl tracking-wide text-f1red-600">
              Driver Standings
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-1">
              Breakdown of championship points for the selected season
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="year-select" className="text-xs text-gray-400">
              Season:
            </label>
            <select
              id="year-select"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="bg-zinc-800 text-white text-xs font-semibold px-3 py-1 rounded-md border border-zinc-600 focus:outline-none"
            >
              {Array.from({ length: 2025 - 1980 + 1 }, (_, i) => 1980 + i).map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}

            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-[500px] pt-4">
        <h3 className="text-base font-semibold mb-4 text-gray-300 uppercase tracking-wider">
          Top 3 Drivers In The  Season {year}
        </h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 20, right: 40, left: 80, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis type="number" stroke="#ccc" />
            <YAxis dataKey="name" type="category" width={150} stroke="#ccc" />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#33333355" }} />
            <Bar dataKey="points">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={`${entry.color}`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>

      <CardFooter className="flex justify-between items-center border-t border-zinc-800 pt-4 mt-4 text-muted-foreground text-xs">
        <span>Updated automatically after every race</span>
        <span className="italic text-zinc-500">Data Source: Ergast + OpenF1</span>
      </CardFooter>
    </Card>
  );
}
