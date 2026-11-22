require("dotenv").config();
const ai = require("./config/gemini");

(async () => {
  const pager = await ai.models.list();
  for await (const m of pager) {
    if (m.supportedActions?.includes("generateContent")) {
      console.log(m.name.replace("models/", ""));
    }
  }
})();