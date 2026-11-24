
import { Routes, Route } from "react-router-dom";

import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";

import MainLayout from "../components/layout/MainLayout";
import ProtectedRoute from "../components/common/ProtectedRoute";

import Chat from "../pages/Chat";
import CodeReviewer from "../pages/CodeReview";
import AICenter from "../pages/AICenter";
import DebugAssistant from "../pages/DebugAssistant";
import ReadmeGenerator from "../pages/ReadmeGenerator";
import PortfolioAnalyzer from "../pages/PortfolioAnalyzer";
import History from "../pages/History";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >

        <Route path="/chat" element={<Chat />} />
        <Route path="/code-review" element={<CodeReviewer />} />
        <Route path="/ai" element={<AICenter />} />
        <Route path="/debug" element={<DebugAssistant />} />
        <Route path="/readme" element={<ReadmeGenerator />} />
        <Route path="/portfolio" element={<PortfolioAnalyzer />} />
        <Route path="/history" element={<History />} />
      </Route>
    </Routes>
  );
}
