const axios = require("axios");
const userModel = require("../models/userModel");
const attractionModel = require("../models/attractionModel");

async function getRecommendationsForUser(userId) {
  const user = await userModel.findById(userId);
  if (!user || !user.preferences)
    throw new Error("User not found or missing preferences");

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

  try {
    const response = await axios.post("https://4e2ad561-bfcf-4f19-a88d-544cc6b27784-00-5ngbpvt422vj.spock.replit.dev/recommend", input); 
    const results = response.data;
    const sorted = results.sort((a, b) => b.score - a.score).slice(0, 10);
    const ids = sorted.map((r) => r.attractionId);
    return ids;
  } catch (error) {
    console.error("Recommendation API error:", error.message);
    throw new Error("Failed to get recommendations");
  }
}

module.exports = getRecommendationsForUser;
