const express = require("express");
const app = express();
const redis = require("redis");

// async function connectRedis() {
//   // Create Redis client
//   redisClient = redis.createClient();

//   // Error handling for Redis
//   redisClient.on("error", (err) => {
//     console.error("Redis Client Error:", err);
//   });

//   // Connect to Redis
//   await redisClient.connect();
//   console.log("Redis connected");
// }
// connectRedis();

//Invoke function immediately
(async () => {
  // Create Redis client
  redisClient = redis.createClient();
  // Error handling for Redis
  redisClient.on("err", (err) => {
    console.log(err);
  });
  // Connect to Redis
  await redisClient.connect();
  console.log("Redis connected");
})();

app.get("/", (req, res) => {
  res.send("Redis is all set");
});

app.listen(3000, () => {
  console.log(`Server is listening at port 3000`);
});

app.get("/count", async (req, res) => {
  try {
    let data = 0;
    // Retrieve cached data from Redis for the key "data"
    // If no data is found, cachedData will be null
    let cachedData = await redisClient.get("data");
    if (cachedData) {
      return res.json(cachedData);
    }
    for (let i = 0; i < 10000000000; i++) {
      data = +i;
    }
    // Store new data in Redis with the key "data" for future access
    await redisClient.set("data", data);
    return res.json(data);
  } catch (error) {
    return res.json(error);
  }
});
