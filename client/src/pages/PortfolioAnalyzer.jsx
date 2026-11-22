import { useState } from "react";
import {
    Sparkles,
    User,
    FolderGit2,
    Code2,
    Star,
    AlertTriangle,
    Lightbulb,
    Loader2,
    RotateCcw
} from "lucide-react";

import { analyzePortfolio } from "../services/aiService";

export default function PortfolioAnalyzer() {
    const [form, setForm] = useState({
        name: "",
        role: "",
        bio: "",
        skills: "",
        projects: "",
        experience: ""
    });

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

        setError("");
    };

    const handleAnalyze = async () => {
        setError("");

        if (!form.name.trim()) {
            setError("Please enter your name.");
            return;
        }

        if (!form.role.trim()) {
            setError("Please enter your professional role.");
            return;
        }

        if (!form.skills.trim()) {
            setError("Please enter your technical skills.");
            return;
        }

        if (!form.projects.trim()) {
            setError("Please enter at least one project.");
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            const portfolio = {
                name: form.name.trim(),
                role: form.role.trim(),
                bio: form.bio.trim(),

                skills: form.skills
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean),

                projects: form.projects
                    .split("\n")
                    .map((item) => item.trim())
                    .filter(Boolean),

                experience: form.experience.trim()
            };

            console.log("PORTFOLIO DATA:", portfolio);

            const data = await analyzePortfolio(portfolio);

            console.log("PORTFOLIO ANALYSIS:", data);

            setResult(data);
        } catch (err) {
            console.error(
                "Portfolio Analyzer Error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to analyze the portfolio."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setForm({
            name: "",
            role: "",
            bio: "",
            skills: "",
            projects: "",
            experience: ""
        });

        setResult(null);
        setError("");
    };

    const getScoreClass = (score) => {
        if (score >= 80) {
            return "text-emerald-400";
        }

        if (score >= 60) {
            return "text-yellow-400";
        }

        return "text-red-400";
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white px-4 py-8 md:px-8">
            <div className="max-w-7xl mx-auto">

                {/* HEADER */}

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">

                    <div className="flex items-center gap-4">

                        <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                            <Sparkles
                                size={28}
                                className="text-purple-400"
                            />
                        </div>

                        <div>

<h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">                                AI Portfolio Analyzer
                            </h1>

                            <p className="text-slate-400 mt-1">
                                Analyze your developer portfolio and get AI-powered recommendations.
                            </p>

                        </div>

                    </div>

                    {(result || form.name || form.role) && (
                        <button
                            onClick={handleClear}
                            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 transition"
                        >
                            <RotateCcw size={17} />
                            Clear
                        </button>
                    )}

                </div>


                {/* LOCAL AI BADGE */}

                <div className="mb-6">

                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm">

                        <span className="w-2 h-2 rounded-full bg-green-400" />

                        Powered by gemini Local AI

                    </div>

                </div>


                {/* MAIN GRID */}

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                    {/* LEFT SIDE */}

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">

                        <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">

                            <User
                                size={20}
                                className="text-purple-400"
                            />

                            <div>

                                <h2 className="font-semibold">
                                    Portfolio Information
                                </h2>

                                <p className="text-xs text-slate-500 mt-1">
                                    Provide information about your developer profile.
                                </p>

                            </div>

                        </div>


                        <div className="p-6 space-y-5">

                            {/* NAME */}

                            <div>

                                <label className="block text-sm text-slate-300 mb-2">
                                    Name
                                </label>

                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Name"
                                    className="w-full rounded-xl bg-slate-900 border border-white/10 px-4 py-3 outline-none focus:border-purple-500 transition"
                                />

                            </div>


                            {/* ROLE */}

                            <div>

                                <label className="block text-sm text-slate-300 mb-2">
                                    Professional Role
                                </label>

                                <input
                                    name="role"
                                    value={form.role}
                                    onChange={handleChange}
                                    placeholder="Full Stack Developer"
                                    className="w-full rounded-xl bg-slate-900 border border-white/10 px-4 py-3 outline-none focus:border-purple-500 transition"
                                />

                            </div>


                            {/* BIO */}

                            <div>

                                <label className="block text-sm text-slate-300 mb-2">
                                    Bio
                                </label>

                                <textarea
                                    name="bio"
                                    value={form.bio}
                                    onChange={handleChange}
                                    rows={5}
                                    placeholder="Describe yourself, your interests and your professional goals..."
                                    className="w-full rounded-xl bg-slate-900 border border-white/10 px-4 py-3 outline-none resize-none focus:border-purple-500 transition"
                                />

                            </div>


                            {/* SKILLS */}

                            <div>

                                <label className="block text-sm text-slate-300 mb-2">
                                    Technical Skills
                                </label>

                                <input
                                    name="skills"
                                    value={form.skills}
                                    onChange={handleChange}
                                    placeholder="React, Node.js, MongoDB, Python, Tailwind CSS"
                                    className="w-full rounded-xl bg-slate-900 border border-white/10 px-4 py-3 outline-none focus:border-purple-500 transition"
                                />

                                <p className="text-xs text-slate-500 mt-2">
                                    Separate skills with commas.
                                </p>

                            </div>


                            {/* PROJECTS */}

                            <div>

                                <label className="block text-sm text-slate-300 mb-2">
                                    Projects
                                </label>

                                <textarea
                                    name="projects"
                                    value={form.projects}
                                    onChange={handleChange}
                                    rows={7}
                                    placeholder={`Name of the projects`}
                                    className="w-full rounded-xl bg-slate-900 border border-white/10 px-4 py-3 outline-none resize-none focus:border-purple-500 transition"
                                />

                                <p className="text-xs text-slate-500 mt-2">
                                    Write one project per line.
                                </p>

                            </div>


                            {/* EXPERIENCE */}

                            <div>

                                <label className="block text-sm text-slate-300 mb-2">
                                    Experience
                                </label>

                                <textarea
                                    name="experience"
                                    value={form.experience}
                                    onChange={handleChange}
                                    rows={5}
                                    placeholder="Internship, freelance experience, academic projects..."
                                    className="w-full rounded-xl bg-slate-900 border border-white/10 px-4 py-3 outline-none resize-none focus:border-purple-500 transition"
                                />

                            </div>


                            {/* ERROR */}

                            {error && (
                                <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 px-4 py-3 text-sm">

                                    <AlertTriangle
                                        size={18}
                                        className="flex-shrink-0 mt-0.5"
                                    />

                                    <span>
                                        {error}
                                    </span>

                                </div>
                            )}


                            {/* BUTTON */}

                            <button
                                onClick={handleAnalyze}
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-500 px-5 py-3.5 font-semibold transition"
                            >

                                {loading ? (
                                    <>
                                        <Loader2
                                            size={19}
                                            className="animate-spin"
                                        />

                                        Analyzing Portfolio...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={19} />

                                        Analyze Portfolio
                                    </>
                                )}

                            </button>

                        </div>

                    </div>


                    {/* RIGHT SIDE */}

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden min-h-[700px]">

                        <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">

                            <Sparkles
                                size={20}
                                className="text-purple-400"
                            />

                            <div>

                                <h2 className="font-semibold">
                                    Portfolio Analysis
                                </h2>

                                <p className="text-xs text-slate-500 mt-1">
                                    AI evaluation and recommendations
                                </p>

                            </div>

                        </div>


                        {/* EMPTY */}

                        {!loading && !result && (

                            <div className="min-h-[620px] flex flex-col items-center justify-center text-center px-8">

                                <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-5">

                                    <Sparkles
                                        size={30}
                                        className="text-purple-400"
                                    />

                                </div>

                                <h3 className="text-lg font-semibold text-slate-300">
                                    No analysis yet
                                </h3>

                                <p className="text-sm text-slate-500 max-w-sm mt-2">
                                    Enter your portfolio information and let gemini evaluate your profile.
                                </p>

                            </div>

                        )}


                        {/* LOADING */}

                        {loading && (

                            <div className="min-h-[620px] flex flex-col items-center justify-center text-center">

                                <Loader2
                                    size={42}
                                    className="text-purple-400 animate-spin mb-5"
                                />

                                <h3 className="font-semibold text-slate-300">
                                    AI is analyzing your portfolio...
                                </h3>

                                <p className="text-sm text-slate-500 mt-2">
                                    Evaluating skills, projects and presentation.
                                </p>

                            </div>

                        )}


                        {/* RESULT */}

                        {!loading && result && (

                            <div className="p-6 space-y-6">

                                {/* OVERALL SCORE */}

                                <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-6 text-center">

                                    <p className="text-sm text-slate-400 mb-2">
                                        Overall Portfolio Score
                                    </p>

                                    <div
                                        className={`text-6xl font-bold ${getScoreClass(
                                            result.overallScore
                                        )}`}
                                    >
                                        {result.overallScore || 0}
                                    </div>

                                    <p className="text-xs text-slate-500 mt-2">
                                        out of 100
                                    </p>

                                </div>


                                {/* SCORE CARDS */}

<div className="grid grid-cols-1 sm:grid-cols-2
                lg:grid-cols-3 gap-4">
                                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">

                                        <div className="flex items-center gap-2 mb-3">

                                            <Code2
                                                size={18}
                                                className="text-blue-400"
                                            />

                                            <span className="text-sm text-slate-400">
                                                Technical Skills
                                            </span>

                                        </div>

                                        <div className={`text-3xl font-bold ${getScoreClass(result.technicalSkills)}`}>
                                            {result.technicalSkills || 0}
                                        </div>

                                    </div>


                                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">

                                        <div className="flex items-center gap-2 mb-3">

                                            <FolderGit2
                                                size={18}
                                                className="text-green-400"
                                            />

                                            <span className="text-sm text-slate-400">
                                                Projects
                                            </span>

                                        </div>

<div className={`text-5xl sm:text-6xl font-bold
                 ${getScoreClass(result.overallScore)}`}>
                                                {result.projects || 0}
                                        </div>

                                    </div>


                                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">

                                        <div className="flex items-center gap-2 mb-3">

                                            <Star
                                                size={18}
                                                className="text-yellow-400"
                                            />

                                            <span className="text-sm text-slate-400">
                                                Presentation
                                            </span>

                                        </div>

                                        <div className={`text-3xl font-bold ${getScoreClass(result.presentation)}`}>
                                            {result.presentation || 0}
                                        </div>

                                    </div>

                                </div>


                                {/* STRENGTHS */}

                                {Array.isArray(result.strengths) &&
                                    result.strengths.length > 0 && (

                                        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">

                                            <div className="flex items-center gap-2 mb-4">

                                                <Star
                                                    size={19}
                                                    className="text-emerald-400"
                                                />

                                                <h3 className="font-semibold">
                                                    Strengths
                                                </h3>

                                            </div>

                                            <div className="space-y-3">

                                                {result.strengths.map(
                                                    (item, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-start gap-3"
                                                        >

                                                            <span className="text-emerald-400 mt-1">
                                                                ✓
                                                            </span>

                                                            <p className="text-sm text-slate-300 leading-6">
                                                                {item}
                                                            </p>

                                                        </div>
                                                    )
                                                )}

                                            </div>

                                        </div>

                                    )}


                                {/* WEAKNESSES */}

                                {Array.isArray(result.weaknesses) &&
                                    result.weaknesses.length > 0 && (

                                        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">

                                            <div className="flex items-center gap-2 mb-4">

                                                <AlertTriangle
                                                    size={19}
                                                    className="text-red-400"
                                                />

                                                <h3 className="font-semibold">
                                                    Weaknesses
                                                </h3>

                                            </div>

                                            <div className="space-y-3">

                                                {result.weaknesses.map(
                                                    (item, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-start gap-3"
                                                        >

                                                            <span className="text-red-400 mt-1">
                                                                !
                                                            </span>

                                                            <p className="text-sm text-slate-300 leading-6">
                                                                {item}
                                                            </p>

                                                        </div>
                                                    )
                                                )}

                                            </div>

                                        </div>

                                    )}


                                {/* RECOMMENDATIONS */}

                                {Array.isArray(result.recommendations) &&
                                    result.recommendations.length > 0 && (

                                        <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-5">

                                            <div className="flex items-center gap-2 mb-4">

                                                <Lightbulb
                                                    size={19}
                                                    className="text-purple-400"
                                                />

                                                <h3 className="font-semibold">
                                                    Recommendations
                                                </h3>

                                            </div>

                                            <div className="space-y-3">

                                                {result.recommendations.map(
                                                    (item, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-start gap-3"
                                                        >

                                                            <div className="w-6 h-6 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                                                                {index + 1}
                                                            </div>

                                                            <p className="text-sm text-slate-300 leading-6">
                                                                {item}
                                                            </p>

                                                        </div>
                                                    )
                                                )}

                                            </div>

                                        </div>

                                    )}

                            </div>

                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}