const mongoose = require('mongoose');
const fs = require('fs');
const http = require('http');
const https = require('https');

function loadEnv() {
    try {
        const envFile = fs.readFileSync('.env.local', 'utf8');
        const env = {};
        envFile.split('\n').forEach(line => {
            const [key, ...values] = line.split('=');
            if (key && values.length > 0) {
                env[key.trim()] = values.join('=').trim();
            }
        });
        return env;
    } catch (e) {
        console.error("Could not read .env.local");
        return {};
    }
}

const env = loadEnv();
const MONGODB_URI = env.MONGODB_URI;
const OPENWEATHER_API_KEY = env.OPENWEATHER_API_KEY;

console.log("Testing Connections...");
console.log(`URI Found: ${!!MONGODB_URI}`);
console.log(`Key Found: ${!!OPENWEATHER_API_KEY}`);

async function testMongo() {
    console.log("\n1. Testing MongoDB...");
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("✅ MongoDB Connected Successfully!");
        await mongoose.disconnect();
    } catch (error) {
        console.error("❌ MongoDB Connection Failed:");
        console.error(error.message);
    }
}

function testWeather() {
    console.log("\n2. Testing OpenWeatherMap...");
    const url = `https://api.openweathermap.org/data/2.5/weather?q=Colombo&appid=${OPENWEATHER_API_KEY}&units=metric`;
    
    https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
            if (res.statusCode === 200) {
                console.log("✅ Weather API Works!");
            } else {
                console.error(`❌ Weather API Failed with status: ${res.statusCode}`);
                try {
                    const json = JSON.parse(data);
                    console.error("Message:", json.message);
                } catch(e) {
                    console.error("Body:", data);
                }
            }
        });
    }).on('error', (err) => {
        console.error("❌ Weather API Request Error:", err.message);
    });
}

(async () => {
    if (MONGODB_URI) await testMongo();
    if (OPENWEATHER_API_KEY) testWeather();
})();
