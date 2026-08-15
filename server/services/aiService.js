const { Model } = require("mongoose");
const ollama  = require("../config/ollama");
const axios = require("axios");

const MODEL =
    process.env.OLLAMA_MODEL || "qwen2.5-coder:3b";

/*const askOllama = async (systemPrompt, userPrompt) => {

    try {

        const response = await ollama.post(
    "/api/chat",
    {
        model: MODEL,

        messages: [
            {
                role: "system",
                content:
                    "You are DevHelper AI, an expert assistant specialized in programming, web development, React, Node.js, JavaScript, databases and software engineering."
            },
            ...history,
            {
                role: "user",
                content: message
            }
        ],

        stream: false
    }
);
        return response.data?.message?.content || "";

    } catch (error) {

        console.error(
            "Ollama Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};*/
const askOllama = async (systemPrompt, userPrompt) => {

    try {

        const response = await ollama.post(
            "/api/chat",
            {
                model: MODEL,

                messages: [
                    {
                        role: "system",
                        content: systemPrompt
                    },
                    {
                        role: "user",
                        content: userPrompt
                    }
                ],

                stream: false
            }
        );

        return response.data?.message?.content || "";

    } catch (error) {

        console.error(
            "Ollama Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};



/* =========================
   AI CHAT
========================= */
const chatAI = async (message, history = []) => {

    try {

       

        const cleanHistory = history
            .filter(
                item =>
                    item.role === "user" ||
                    item.role === "assistant"
            )
            .map(item => ({
                role: item.role,
                content: item.content
            }));


        const response = await ollama.post(
            "/api/chat",
            {
                model: MODEL,

                messages: [
                    {
                        role: "system",
                        content:
                            "You are DevHelper AI, a helpful programming assistant. Give clear and concise answers."
                    },

                    ...cleanHistory,

                    {
                        role: "user",
                        content: message
                    }
                ],

                stream: false,

                options: {
                    temperature: 0.7,
                    num_predict: 300
                }
            }
        );



        return (
            response.data?.message?.content ||
            ""
        );

    } catch (error) {

        console.error(
            "OLLAMA CHAT ERROR:",
            error.response?.data ||
            error.message
        );

        throw error;
    }
};
/* =========================
   CODE REVIEW
========================= */
const reviewCode = async ({ code, language }) => {

    const prompt = `
You are an expert senior ${language} software engineer and code reviewer.

Review this code carefully:

--- CODE START ---
${code}
--- CODE END ---

Identify:

1. Syntax errors
2. Runtime errors
3. Logic errors
4. Security issues
5. Performance issues
6. Code quality problems
7. Improvements

Return ONLY valid JSON.

Use exactly this structure:

{
  "score": 0,
  "summary": "",
  "bugs": [],
  "security": [],
  "performance": [],
  "improvements": [],
  "optimizedCode": ""
}

Rules:

- score must be a number between 0 and 10.
- bugs must contain actual problems found in the code.
- security must contain actual security problems.
- performance must contain actual performance problems.
- improvements must contain useful recommendations.
- optimizedCode must contain the corrected version of the code.
- If there are no security problems, return [].
- If there are no performance problems, return [].
- Do not say "No issues detected" when there is an actual bug.
- Do not use Markdown.
- Do not wrap the JSON in backticks.
- Return ONLY the JSON object.

Important:
If the JavaScript code contains:

console("Hello World");

you MUST identify it as an error because console is an object and console.log() is the correct method.

If the code contains malformed strings, brackets, parentheses, syntax, or other invalid JavaScript, identify those errors explicitly.
`;

    try {

        const response = await ollama.post("/api/chat", {

            model: MODEL,

            messages: [
                {
                    role: "system",
                    content:
                        "You are a strict and accurate code reviewer. Always detect syntax and runtime errors."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],

            stream: false,

            format: "json"
        });

        const content =
            response.data?.message?.content;

        if (!content) {
            throw new Error(
                "Ollama returned an empty response."
            );
        }

        

        const review =
            typeof content === "string"
                ? JSON.parse(content)
                : content;

        return {
            score: Number(review.score) || 0,

            summary:
                review.summary || "",

            bugs:
                Array.isArray(review.bugs)
                    ? review.bugs
                    : [],

            security:
                Array.isArray(review.security)
                    ? review.security
                    : [],

            performance:
                Array.isArray(review.performance)
                    ? review.performance
                    : [],

            improvements:
                Array.isArray(review.improvements)
                    ? review.improvements
                    : [],

            optimizedCode:
                review.optimizedCode || code
        };

    } catch (error) {

        console.error(
            "CODE REVIEW OLLAMA ERROR:"
        );

        console.error(
            error.response?.data ||
            error.message
        );

        throw error;
    }
};

/* =========================
   DEBUG ASSISTANT
========================= */

const debugCodeError = async (errorText) => {

    const prompt = `
You are an expert senior software debugging assistant.

A developer has encountered the following error:

ERROR:
${errorText}

Analyze this error carefully.

Your job is to:

1. Identify the error type.
2. Explain what the error means.
3. Identify the most likely cause.
4. Provide a concrete solution.
5. Give clear step-by-step instructions.
6. Provide corrected code when possible.

IMPORTANT:

- Do not invent information that is not supported by the error.
- If the error is a JavaScript/React/Node.js error, explain it specifically.
- If a stack trace contains file names and line numbers, use them.
- If the exact corrected code cannot be determined, provide the closest safe correction.
- Do not say there are no problems if an error clearly exists.

Return ONLY valid JSON.

Use exactly this structure:

{
    "errorType": "",
    "summary": "",
    "cause": "",
    "solution": "",
    "steps": [],
    "correctedCode": ""
}

Rules:

- errorType must contain the error type.
- summary must briefly explain the error.
- cause must explain why it happened.
- solution must explain how to fix it.
- steps must be an array of strings.
- correctedCode must be a string.
- If corrected code cannot be determined, return an empty string.
- Do NOT use Markdown.
- Do NOT put JSON inside a code block.
- Return ONLY JSON.
`;

    try {

        const response = await ollama.post(
            "/api/chat",
            {
                model: MODEL,

                messages: [
                    {
                        role: "system",
                        content:
                            "You are an expert software debugging assistant specialized in JavaScript, React, Node.js, Python, Java, C++, databases and web development."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],

                stream: false,

                format: "json"
            }
        );

        const rawResponse =
            response.data?.message?.content || "";

        

        if (!rawResponse) {

            throw new Error(
                "Ollama returned an empty response."
            );

        }

        const parsedResponse =
            typeof rawResponse === "string"
                ? JSON.parse(rawResponse)
                : rawResponse;

        return {

            errorType:
                parsedResponse.errorType || "",

            summary:
                parsedResponse.summary || "",

            cause:
                parsedResponse.cause || "",

            solution:
                parsedResponse.solution || "",

            steps:
                Array.isArray(parsedResponse.steps)
                    ? parsedResponse.steps
                    : [],

            correctedCode:
                parsedResponse.correctedCode || ""

        };

    } catch (error) {

        console.error(
            "DEBUG OLLAMA ERROR:",
            error.response?.data ||
            error.message
        );

        throw error;
    }
};

/* =========================
   README GENERATOR
========================= */
const generateReadme = async (project) => {

    try {

        console.log("====================================");
        console.log("README AI SERVICE");
        console.log("====================================");

        if (!project) {
            throw new Error("Project data is missing.");
        }

        const {
            name,
            description,
            technologies,
            features,
            author
        } = project;

        if (!name || !name.trim()) {
            throw new Error("Project name is required.");
        }

        const techList = Array.isArray(technologies)
            ? technologies.join(", ")
            : "";

        const featureList = Array.isArray(features)
            ? features
                .map(feature => `- ${feature}`)
                .join("\n")
            : "";

        const prompt = `
You are a professional software developer and technical writer.

Generate a professional GitHub README.md for this project.

PROJECT INFORMATION

Project name:
${name}

Description:
${description || "No description provided."}

Technologies:
${techList || "Not specified."}

Features:
${featureList || "No features specified."}

Author:
${author || "Not specified."}

README REQUIREMENTS

Create a complete professional README.

Include:

# ${name}

A short project description.

## Features

List the provided features.

## Technologies Used

List the provided technologies.

## Installation

Explain how to install the project.

## Getting Started

Explain how to run the project locally.

## Usage

Explain how the application can be used.

## Project Structure

Provide a simple project structure when appropriate.

## Configuration

Mention environment variables only when appropriate.

## Future Improvements

Suggest realistic future improvements.

## Author

Mention the provided author.

IMPORTANT:

- Return ONLY Markdown.
- Do NOT wrap the complete README in triple backticks.
- Do NOT add explanations before the README.
- Do NOT add explanations after the README.
- Do NOT invent technologies.
- Do NOT invent project features.
- Keep the README professional.
`;

        console.log("Ollama model:", MODEL);
        console.log("Sending request to Ollama...");

        // ==========================================
        // AXIOS REQUEST
        // ==========================================

        const response = await ollama.post(
            "/api/generate",
            {
                model: MODEL,
                prompt,
                stream: false
            }
        );

        console.log(
            "Ollama HTTP status:",
            response.status
        );

        // ==========================================
        // AXIOS RESPONSE
        // ==========================================

        const data = response.data;

        console.log(
            "Ollama response received."
        );

        if (!data) {

            throw new Error(
                "Ollama returned no response data."
            );
        }

        if (!data.response) {

            console.error(
                "Invalid Ollama response:",
                data
            );

            throw new Error(
                "Ollama returned an empty README."
            );
        }

        console.log(
            "README generated successfully."
        );

        return data.response.trim();

    } catch (error) {

        console.error(
            "===================================="
        );

        console.error(
            "README AI SERVICE ERROR:"
        );

        console.error(
            error.response?.data ||
            error.message
        );

        console.error(
            "===================================="
        );

        throw error;
    }
};

/* =========================
   PORTFOLIO ANALYZER
========================= */

const analyzePortfolio = async (portfolio) => {

    const prompt = `
Analyze the following developer portfolio.

PORTFOLIO:

${JSON.stringify(portfolio, null, 2)}

You are an expert senior software engineer, technical recruiter,
and portfolio reviewer.

Evaluate the portfolio based on:

1. Technical skills
2. Project quality
3. Project diversity
4. Practical experience
5. Education
6. Certifications
7. Portfolio presentation
8. Career readiness

Return ONLY valid JSON.

Use exactly this structure:

{
    "overallScore": 0,
    "technicalSkills": 0,
    "projects": 0,
    "presentation": 0,
    "strengths": [],
    "weaknesses": [],
    "recommendations": []
}

Rules:

- overallScore must be between 0 and 100.
- technicalSkills must be between 0 and 100.
- projects must be between 0 and 100.
- presentation must be between 0 and 100.
- strengths must be an array of strings.
- weaknesses must be an array of strings.
- recommendations must be an array of strings.
- Be specific and useful.
- Do not invent experience, skills or projects.
- Base your analysis only on the provided portfolio.
- Do not use Markdown.
- Do not wrap the JSON in backticks.
- Return ONLY the JSON object.
`;

    try {

        const result = await askOllama(
            "You are an expert technical recruiter and senior software engineer specialized in evaluating developer portfolios.",
            prompt
        );

        
        if (!result) {

            throw new Error(
                "Ollama returned an empty response."
            );

        }

        const parsed =
            typeof result === "string"
                ? JSON.parse(result)
                : result;

        return {

            overallScore:
                Math.min(
                    100,
                    Math.max(
                        0,
                        Number(parsed.overallScore) || 0
                    )
                ),

            technicalSkills:
                Math.min(
                    100,
                    Math.max(
                        0,
                        Number(parsed.technicalSkills) || 0
                    )
                ),

            projects:
                Math.min(
                    100,
                    Math.max(
                        0,
                        Number(parsed.projects) || 0
                    )
                ),

            presentation:
                Math.min(
                    100,
                    Math.max(
                        0,
                        Number(parsed.presentation) || 0
                    )
                ),

            strengths:
                Array.isArray(parsed.strengths)
                    ? parsed.strengths
                    : [],

            weaknesses:
                Array.isArray(parsed.weaknesses)
                    ? parsed.weaknesses
                    : [],

            recommendations:
                Array.isArray(parsed.recommendations)
                    ? parsed.recommendations
                    : []

        };

    } catch (error) {

        console.error(
            "PORTFOLIO ANALYZER ERROR:",
            error.response?.data ||
            error.message
        );

        throw error;
    }
};

module.exports = {
    chatAI,
    reviewCode,
    debugCodeError,
    generateReadme,
    analyzePortfolio
};