async function load() {
    let data = await fetch("https://api.jolpi.ca/ergast/f1/2025/drivers")
    let response = await data.json()
    console.log(response.MRData.DriverTable.Drivers)
}

load()