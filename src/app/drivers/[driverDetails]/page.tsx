'use client'
import DriverHeading from '@/components/drivers/driverId/driverHeading';
import { dataForDriverHeading } from '@/utils/api-calls';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';



export default function DriverPage() {
    const params = useParams();
    const driverDetails = params?.driverDetails
    const [driverNameId, driverNumberId] = (driverDetails as string).split("-");
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [loading, setLoading] = useState(true);
    const [driverData,setDriverData] = useState()
    

    

    useEffect(() => {
        const fetchData = async () => {
          setLoading(true);
          try {
            const data = await dataForDriverHeading(year,driverNameId);
            setDriverData(data)
            console.log(data)
          } catch (err) {
            console.error("Error loading bar chart:", err);
          } finally {
            setLoading(false);
          }
        };
        fetchData();
      }, [year]);
    
  return (
    <div className="p-4 text-white">
        <DriverHeading driverData={driverData!}/>
      {/* <h1 className="text-xl font-bold">Driver #{driverNumberId}</h1> */}
      {/* <p>{driver.full_name}</p>
      <img src={driver.image} alt={driver.full_name} className="w-24 h-24 rounded-full mt-2" /> */}
      {/* Add more details as needed */}
    </div>
  );
}
