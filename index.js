const { default: axios } = require("axios");
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

app.get("/", async (req, res) => {
  try {
    const cachedData = await redisClient.get("todoData");
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/todos"
    );
    const data = response.data;
    await redisClient.set("todoData", JSON.stringify(data));
    return res.json(data);
  } catch (err) {
    console.error(err);
  }
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
      return res.json({ count: cachedData });
    }
    for (let i = 0; i < 10000000000; i++) {
      data = +i;
    }
    // Store new data in Redis with the key "data" for future access
    await redisClient.set("data", data);
    return res.json({ count: data });
  } catch (error) {
    return res.json(error);
  }
});
