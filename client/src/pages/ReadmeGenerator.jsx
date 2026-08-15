import { useState } from "react";
import {
    Sparkles,
    FileText,
    Copy,
    Download,
    Loader2,
    Check
} from "lucide-react";

import { generateReadme } from "../services/aiService";

export default function ReadmeGenerator() {
    const [form, setForm] = useState({
        name: "",
        description: "",
        technologies: "",
        features: "",
        author: ""
    });

    const [readme, setReadme] = useState("");
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleGenerate = async () => {

    setError("");

    if (!form.name.trim()) {
        setError("Please enter your project name.");
        return;
    }

    if (!form.description.trim()) {
        setError("Please enter a project description.");
        return;
    }

    setLoading(true);
    setReadme("");

    try {

        const project = {
            name: form.name.trim(),

            description: form.description.trim(),

            technologies: form.technologies
                .split(",")
                .map(item => item.trim())
                .filter(Boolean),

            features: form.features
                .split("\n")
                .map(item => item.trim())
                .filter(Boolean),

            author: form.author.trim()
        };

        console.log("README PROJECT:", project);

        const result = await generateReadme(project);

        console.log("README RESPONSE:", result);

        if (!result?.readme) {
            throw new Error("The AI did not return a README.");
        }

        setReadme(result.readme);

    } catch (err) {

        console.error(
            "README GENERATOR ERROR:",
            err
        );

        setError(
            err.response?.data?.message ||
            err.message ||
            "Unable to generate README."
        );

    } finally {

        setLoading(false);

    }
};

    const handleCopy = async () => {
        if (!readme) return;

        await navigator.clipboard.writeText(readme);

        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    const handleDownload = () => {
        if (!readme) return;

        const blob = new Blob(
            [readme],
            { type: "text/markdown" }
        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;
        link.download = "README.md";

        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-6 lg:p-10">

            <div className="max-w-7xl mx-auto">

                {/* HEADER */}

                <div className="mb-8">

                    <div className="flex items-center gap-3 mb-3">

                        <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                            <FileText
                                className="text-purple-400"
                                size={26}
                            />
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold">
                                AI README Generator
                            </h1>

                            <p className="text-slate-400 mt-1">
                                Generate professional GitHub documentation with AI.
                            </p>
                        </div>

                    </div>

                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm">

                        <span className="w-2 h-2 rounded-full bg-green-400" />

                        Powered by Ollama Local AI

                    </div>

                </div>


                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                    {/* FORM */}

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

                        <div className="flex items-center gap-2 mb-6">

                            <Sparkles
                                size={20}
                                className="text-purple-400"
                            />

                            <h2 className="text-xl font-semibold">
                                Project Information
                            </h2>

                        </div>


                        <div className="space-y-5">

                            <div>

                                <label className="block text-sm text-slate-300 mb-2">
                                    Project Name
                                </label>

                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Interactive Developer Portfolio"
                                    className="w-full rounded-xl bg-slate-900 border border-white/10 px-4 py-3 outline-none focus:border-purple-500"
                                />

                            </div>


                            <div>

                                <label className="block text-sm text-slate-300 mb-2">
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    rows={5}
                                    placeholder="Describe your project..."
                                    className="w-full rounded-xl bg-slate-900 border border-white/10 px-4 py-3 outline-none resize-none focus:border-purple-500"
                                />

                            </div>


                            <div>

                                <label className="block text-sm text-slate-300 mb-2">
                                    Technologies
                                </label>

                                <input
                                    name="technologies"
                                    value={form.technologies}
                                    onChange={handleChange}
                                    placeholder="React, Node.js, MongoDB, Tailwind CSS"
                                    className="w-full rounded-xl bg-slate-900 border border-white/10 px-4 py-3 outline-none focus:border-purple-500"
                                />

                                <p className="text-xs text-slate-500 mt-2">
                                    Separate technologies with commas.
                                </p>

                            </div>


                            <div>

                                <label className="block text-sm text-slate-300 mb-2">
                                    Features
                                </label>

                                <textarea
                                    name="features"
                                    value={form.features}
                                    onChange={handleChange}
                                    rows={6}
                                    placeholder={`AI Code Reviewer
Debug Assistant
AI Chat
Portfolio Analyzer`}
                                    className="w-full rounded-xl bg-slate-900 border border-white/10 px-4 py-3 outline-none resize-none focus:border-purple-500"
                                />

                            </div>


                            <div>

                                <label className="block text-sm text-slate-300 mb-2">
                                    Author
                                </label>

                                <input
                                    name="author"
                                    value={form.author}
                                    onChange={handleChange}
                                    placeholder="Your name"
                                    className="w-full rounded-xl bg-slate-900 border border-white/10 px-4 py-3 outline-none focus:border-purple-500"
                                />

                            </div>


                            {error && (
                                <div className="rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 px-4 py-3 text-sm">
                                    {error}
                                </div>
                            )}


                            <button
                                onClick={handleGenerate}
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 px-5 py-3.5 font-semibold transition"
                            >

                                {loading ? (
                                    <>
                                        <Loader2
                                            size={19}
                                            className="animate-spin"
                                        />

                                        Generating README...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={19} />

                                        Generate README
                                    </>
                                )}

                            </button>

                        </div>

                    </div>


                    {/* RESULT */}

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden min-h-[700px]">

                        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">

                            <div className="flex items-center gap-2">

                                <FileText size={20} />

                                <h2 className="font-semibold">
                                    README.md
                                </h2>

                            </div>


                            <div className="flex gap-2">

                                <button
                                    onClick={handleCopy}
                                    disabled={!readme}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 text-sm"
                                >

                                    {copied ? (
                                        <Check size={16} />
                                    ) : (
                                        <Copy size={16} />
                                    )}

                                    {copied ? "Copied" : "Copy"}

                                </button>


                                <button
                                    onClick={handleDownload}
                                    disabled={!readme}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 text-sm"
                                >

                                    <Download size={16} />

                                    Download

                                </button>

                            </div>

                        </div>


                        <div className="p-6 overflow-auto max-h-[700px]">

                            {readme ? (

                                <pre className="whitespace-pre-wrap text-sm leading-7 text-slate-300 font-mono">
                                    {readme}
                                </pre>

                            ) : (

                                <div className="min-h-[600px] flex flex-col items-center justify-center text-center">

                                    <FileText
                                        size={50}
                                        className="text-purple-400 mb-4"
                                    />

                                    <h3 className="text-lg font-semibold mb-2">
                                        Your README will appear here
                                    </h3>

                                    <p className="text-slate-500 max-w-sm text-sm">
                                        Enter your project information and let Ollama generate your documentation.
                                    </p>

                                </div>

                            )}

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}