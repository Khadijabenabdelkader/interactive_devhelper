const path = require("path");
const mammoth = require("mammoth");
const pdfParse = require("pdf-parse");

const MAX_CHARS = 30000; // limite envoyée à l'IA
const TEXT_EXT = [
  ".txt", ".md", ".json", ".csv", ".xml", ".yml", ".yaml", ".sql",
  ".js", ".jsx", ".ts", ".tsx", ".py", ".java", ".c", ".cpp", ".html", ".css",
];

const fail = (message, status = 400) =>
  Object.assign(new Error(message), { status });

async function extractText(file) {
  const ext = path.extname(file.originalname).toLowerCase();
  let text = "";

  if (ext === ".pdf") {
    text = (await pdfParse(file.buffer)).text;
  } else if (ext === ".docx") {
    text = (await mammoth.extractRawText({ buffer: file.buffer })).value;
  } else if (TEXT_EXT.includes(ext)) {
    text = file.buffer.toString("utf8");
  } else {
    throw fail("Unsupported file type. Use PDF, DOCX, TXT or a code file.");
  }

  text = text.replace(/\u0000/g, "").trim();

  if (!text) {
    throw fail("No readable text found in this file (scanned PDF?).");
  }

  return {
    name: file.originalname,
    text: text.slice(0, MAX_CHARS),
    truncated: text.length > MAX_CHARS,
  };
}

module.exports = { extractText };