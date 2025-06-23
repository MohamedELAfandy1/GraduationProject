const { spawn } = require("child_process");
const path = require("path");
const userModel = require("../models/userModel");
const attractionModel = require("../models/attractionModel");

async function getRecommendationsForUser(userId) {
  const user = await userModel.findById(userId);
  if (!user || !user.preferences)
    return new Error("User not found or missing preferences");

  const attractions = await attractionModel
    .find({ preferences: { $exists: true, $ne: null } })
    .lean();

  const users = await userModel.find({ _id: { $ne: userId } }).lean();
  const allUsers = users.map((u) => ({
    preferences:
      u.preferences instanceof Map
        ? Object.fromEntries(u.preferences.entries())
        : u.preferences || {},
    likedAttractions: (u.likedAttractions || []).map((id) => id.toString()),
  }));

  const input = {
    userPreferences:
      user.preferences instanceof Map
        ? Object.fromEntries(user.preferences.entries())
        : user.preferences || {},
    attractions: attractions.map((a) => ({
      _id: a._id.toString(),
      preferences:
        a.preferences instanceof Map
          ? Object.fromEntries(a.preferences.entries())
          : a.preferences || {},
      description: a.description || "",
    })),
    allUsers,
  };
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, "../scripts/recommender5.py");
    const python = spawn("python3", [scriptPath]);

    let data = "";
    python.stdin.write(JSON.stringify(input));
    python.stdin.end();

    python.stdout.on("data", (chunk) => {
      data += chunk.toString();
    });

    python.stderr.on("data", (err) => {
      console.log("Python error:", err.toString());
    });

    python.on("close", (code) => {
      console.log("Python Finished", code);
      if (code !== 0) return reject(new Error("Python script failed"));
      try {
        const results = JSON.parse(data);
        const sorted = results.sort((a, b) => b.score - a.score).slice(0, 10);
        const ids = sorted.map((r) => r.attractionId);

        // const results2 = JSON.parse(data);
        // console.log(" Results from Python:", results2);

        resolve(ids);
      } catch (err) {
        reject(err);
      }
    });
  });
}
module.exports = getRecommendationsForUser;
