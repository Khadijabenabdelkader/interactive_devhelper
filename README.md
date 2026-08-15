# Interactive Developer Platform

An interactive full-stack developer platform enhanced with local AI capabilities.

The project combines a modern developer portfolio with AI-powered tools that help developers understand code errors, communicate with an AI assistant, analyze their portfolio, and generate professional GitHub README documentation.

The AI features are powered locally through **Ollama**, allowing AI requests to run on the developer's own machine instead of relying on external AI APIs.

---

## ✨ Features

### 💬 AI Chat

An interactive AI assistant that allows users to communicate with a locally running AI model.

Users can:

- Ask technical questions
- Get programming assistance
- Discuss development concepts
- Maintain conversations
- Access previous conversations
- Delete conversations

---

### 🐛 AI Debug Assistant

The Debug Assistant helps developers understand programming errors.

Users can paste:

- Runtime errors
- Compiler errors
- Stack traces
- JavaScript errors
- Other programming errors

The AI provides:

- Error type
- Error summary
- Cause of the problem
- Suggested solution
- Step-by-step instructions
- Corrected code when appropriate

---

### 📄 AI README Generator

The README Generator creates professional GitHub documentation from basic project information.

Users provide:

- Project name
- Project description
- Technologies
- Features
- Author

The AI generates a complete README containing sections such as:

- Project description
- Features
- Technologies Used
- Installation
- Getting Started
- Usage
- Project Structure
- Configuration
- Future Improvements
- Author

---

### 📊 AI Portfolio Analyzer

The Portfolio Analyzer evaluates a developer's portfolio information using AI.

Users can provide:

- Name
- Professional role
- Biography
- Technical skills
- Projects
- Experience

The analyzer can provide feedback about the portfolio and suggestions for improving its presentation and technical profile.

---


## 🧠 Local AI Architecture

The project uses **Ollama** as the local AI runtime.

The general architecture is:

```text
React Frontend
       │
       │ HTTP / Axios
       ▼
Node.js + Express Backend
       │
       │ AI request
       ▼
Ollama
       │
       ▼
Local AI Model
