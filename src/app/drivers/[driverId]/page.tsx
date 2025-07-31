'use client'
import { Dirent } from 'fs';
import { notFound } from 'next/navigation';
import DriverHeading from '@/components/drivers/driverId/driverHeading';
import { dataForDriverHeading } from '@/utils/api-calls';
import { useEffect, useState } from 'react';

type Props = {
  params: {
    driverId: string;
  };
};

export default async function DriverPage({ params }: Props) {
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [loading, setLoading] = useState(true);
    const { driverId } = params;

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
    
  
  const driverData = await dataForDriverHeading(year , driverId)
//   const driver = await res.json();
//   if (!driver) return notFound();

  return (
    <div className="p-4 text-white">
        <DriverHeading driverData={driverData}/>
      <h1 className="text-xl font-bold">Driver #{driverId}</h1>
      {/* <p>{driver.full_name}</p>
      <img src={driver.image} alt={driver.full_name} className="w-24 h-24 rounded-full mt-2" /> */}
      {/* Add more details as needed */}
    </div>
  );
}
