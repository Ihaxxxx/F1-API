"use client";

import { useEffect, useState } from "react";
import React from "react";
import { lapTimes } from "@/utils/api-calls";
import type { driverAndRoundDetail } from "@/components/drivers/driverDetails/raceResults/RaceDetails";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Spinner from "@/components/drivers/spinner";


// Tooltip component
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-black border border-gray-600 p-2 text-white rounded-md text-sm">
        <p>Lap: {data.lap}</p>
        <p>Time: {data.displayTime}</p>
        {data.pitStop && (
          <>
            <p className="text-yellow-400">Pit Stop: Yes</p>
            <p>Duration: {data.pitStop.duration}s</p>
          </>
        )}
      </div>
    );
  }
  return null;
};

export default function LapTimingGraph({
  driverAndRoundDetail,
}: {
  driverAndRoundDetail: driverAndRoundDetail;
}) {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading,setLoading] = useState<boolean>(true)
  useEffect(() => {
    const fetchData = async () => {
      const data = await lapTimes(
        driverAndRoundDetail.driverNameId,
        driverAndRoundDetail.round,
        Number(driverAndRoundDetail.year)
      );
      setChartData(data);
      setLoading(false)
    };
    fetchData().catch((err) => console.error("Error fetching lap times", err));
  }, [driverAndRoundDetail]);

  if (loading) {
    <Spinner text="Loading Graphs"/>
  }

  return (
    <Card className="w-full bg-black border border-white rounded-2xl shadow-md mt-4">
      <CardHeader>
        <CardTitle className="capitalize text-white font-f1bold text-xl md:text-2xl">
          {driverAndRoundDetail.driverNameId.replace("-", " ")} -{" "}
          {driverAndRoundDetail.year} - Lap Times
        </CardTitle>
      </CardHeader>

      <CardContent className="w-full px-2 md:px-4 pb-6">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 20, bottom: 10, left: 0 }}
          >
            <CartesianGrid
              stroke="#333"
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              dataKey="lap"
              tick={{ fill: "#ccc", fontFamily: "F1 Regular", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              label={{
                value: "Lap",
                position: "insideBottom",
                offset: -5,
                fill: "#aaa",
                fontSize: 12,
              }}
            />
            <YAxis
              tick={{ fill: "#ccc", fontFamily: "F1 Regular", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              label={{
                value: "Lap Time (s)",
                angle: -90,
                position: "insideLeft",
                offset: 10,
                fill: "#aaa",
                fontSize: 12,
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="timeInSeconds"
              stroke="#FF1801"
              strokeWidth={2}
              dot={({ cx, cy, payload }) => {
                const color = payload.pitStop ? "#FFD700" : "#FF1801";
                return (
                  <circle
                    key={`lap-dot-${payload.lap}`} // ✅ Add key
                    cx={cx}
                    cy={cy}
                    r={4}
                    fill={color}
                    stroke="none"
                  />
                );
              }}
              activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>

      <CardFooter className="text-xs text-muted-foreground text-gray-400 px-4 pb-4">
        Yellow dots indicate laps with pit stops.
      </CardFooter>
    </Card>
  );
}
