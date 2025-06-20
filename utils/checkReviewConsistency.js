require("dotenv").config();
let classifier = null;

async function loadModel() {
  if (!classifier) {
    const { pipeline } = await import("@xenova/transformers");
    classifier = await pipeline(
      "sentiment-analysis",
      "Xenova/bert-base-multilingual-uncased-sentiment"
    );
  }
  return classifier;
}

async function checkConsistency(title, ratings) {
  try {
    const model = await loadModel();
    const result = await model(title);
    console.log(result);

    const starsFromModel = parseInt(result[0].label[0]); // "4 stars" => 4
    const score = result[0].score;

    if (!starsFromModel) {
      return {
        consistent: null,
        reason: "could not parse model rating",
        modelRating: null,
        score,
        diff: null,
      };
    }

    //Low confidence => لا يمكن الحكم
    if (score < 0.6) {
      return {
        consistent: null,
        reason: "cannot determine consistency",
        modelRating: starsFromModel,
        score: Math.round(score * 10000) / 10000,
        diff: null,
      };
    }

    const diff = Math.abs(starsFromModel - ratings);

    return {
      consistent: diff <= 2,
      modelRating: starsFromModel,
      score: Math.round(score * 10000) / 10000,
      diff,
    };
  } catch (err) {
    return {
      consistent: null,
      reason: "error during model evaluation",
      error: err.message,
    };
  }
}

module.exports = checkConsistency;
