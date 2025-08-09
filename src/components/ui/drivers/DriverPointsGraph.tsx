"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig, 
} from "@/components/ui/chart"



type ChartData = {
  round: string;
    raceName: string;
    position: number;
    raceDate: string;
    country: string;
    champoinshipPosition: string;
}[];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig


function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-white p-2 rounded shadow-md text-sm text-black">
        <p className="font-semibold">{data.raceName}</p>
        <p>Date: {new Date(data.raceDate).toLocaleDateString()}</p>
        <p>Points: {data.points}</p>
      </div>
    )
  }

  return null
}

export default function ChartLineLinear({driverId,year,chartData}: {driverId: string,year: number, chartData: ChartData}) {
  console.log(chartData);
  return (
    <Card className="w-full bg-black border border-white rounded-2xl shadow-md mt-4">
      <CardHeader>
        <CardTitle className="capitalize text-white font-f1bold text-xl md:text-2xl">
          {driverId.replace("-", " ")} - {year} - Points Over Rounds
        </CardTitle>
      </CardHeader>

      <CardContent className="w-full px-2 md:px-4 pb-6">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 20, bottom: 10, left: 0 }}
          >
            <CartesianGrid stroke="#333" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="round"
              tick={{ fill: "#ccc", fontFamily: "F1 Regular", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              label={{
                value: "Round",
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
                value: "Points",
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
              dataKey="points"
              stroke="#FF1801"
              strokeWidth={2}
              dot={{ r: 4, fill: "#FF1801" }}
              activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>

      <CardFooter className="text-xs text-muted-foreground text-gray-400 px-4 pb-4">
        Hover on a point to see race name, date, and points.
      </CardFooter>
    </Card>
  );
}

