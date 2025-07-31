import HeroSection from "../components/home-page/hero-section"
import { fetchNextRaceHomePage } from "@/utils/api-calls"
import NextRaceSection from "@/components/home-page/NextRaceSection"
import { BarChartDriversStandings } from "@/components/ui/BarChartDriversStandings"
export default async function Home() {
const race = await fetchNextRaceHomePage()
  return (
    <>
      <HeroSection/>
      <div className="w-full h-2 bg-gray-500"></div>
        <NextRaceSection race={race}/>
      <div className="w-full h-2 bg-gray-500"></div>
      <BarChartDriversStandings/>
      <div className="w-full h-2 bg-gray-500"></div>
    </>
  )
}
