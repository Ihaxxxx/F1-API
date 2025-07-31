const fs = require("fs");
const path = require("path");
const https = require("https");

const API_URL = "https://api.openf1.org/v1/drivers";
const OUTPUT_FILE = path.join(__dirname, "../data/driverMetadata.json");

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          try {
            const json = JSON.parse(data);
            resolve(json);
          } catch (err) {
            reject("Failed to parse JSON");
          }
        });
      })
      .on("error", (err) => reject(err));
  });
}

async function fetchAndStoreDrivers() {
  try {
    const allDrivers = await fetchJSON(API_URL);

    // Save entire response as-is
    fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
    fs.writeFileSync(
      OUTPUT_FILE,
      JSON.stringify(allDrivers, null, 2),
      "utf-8"
    );

    console.log(`✅ Saved ${allDrivers.length} drivers to ${OUTPUT_FILE}`);
  } catch (err) {
    console.error("❌ Error fetching drivers:", err);
  }
}

fetchAndStoreDrivers();
