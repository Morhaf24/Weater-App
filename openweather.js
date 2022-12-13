const axios = require("axios");

const APPID = "4ddbbad2edee055efb90f6765e32f0ae";

async function main() {
  function weatherUrl(city) {
    return `http://api.openweathermap.org/data/2.5/weather?q=${encodeURI(city)}&units=metric&APPID=${APPID}`;
  }

  const url = weatherUrl("Bern");
  try {
    const response = await axios({ url });
    const { main } = response.data;
    const { temp, temp_min, temp_max } = main;
    console.log(temp, temp_min, temp_max);
  } catch (error) {
    console.log(error.message);
  }
}

main();