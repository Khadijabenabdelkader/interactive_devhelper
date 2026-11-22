
import { useEffect, useMemo, useState } from "react";
import {
    History as HistoryIcon,
    Search,
    Trash2,
    Download,
    Eye,
    FileText,
    Code,
    Bug,
    FolderSearch,
    MessageSquare,
    RefreshCw,
    X,
    Clock,
    Filter
} from "lucide-react";

import {
    getHistory,
    getHistoryById,
    deleteHistory,
    downloadHistoryFile
} from "../services/historyService";

const tools = [
    { value: "ALL", label: "All Activities" },
    { value: "AI_CHAT", label: "AI Chat" },
    { value: "CODE_REVIEWER", label: "Code Reviewer" },
    { value: "DEBUG_ASSISTANT", label: "Debug Assistant" },
    { value: "README_GENERATOR", label: "README Generator" },
    { value: "PORTFOLIO_ANALYZER", label: "Portfolio Analyzer" }
];

const toolInfo = {
    AI_CHAT: {
        label: "AI Chat",
        icon: MessageSquare,
        color: "text-cyan-400",
        bg: "bg-cyan-500/10"
    },
    CODE_REVIEWER: {
        label: "Code Reviewer",
        icon: Code,
        color: "text-green-400",
        bg: "bg-green-500/10"
    },
    DEBUG_ASSISTANT: {
        label: "Debug Assistant",
        icon: Bug,
        color: "text-red-400",
        bg: "bg-red-500/10"
    },
    README_GENERATOR: {
        label: "README Generator",
        icon: FileText,
        color: "text-yellow-400",
        bg: "bg-yellow-500/10"
    },
    PORTFOLIO_ANALYZER: {
        label: "Portfolio Analyzer",
        icon: FolderSearch,
        color: "text-purple-400",
        bg: "bg-purple-500/10"
    }
};

export default function History() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [selectedTool, setSelectedTool] = useState("ALL");

    const [selectedActivity, setSelectedActivity] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);

    const [deletingId, setDeletingId] = useState(null);

    async function loadHistory() {
        try {
            setLoading(true);
            setError("");
const response = await getHistory();

setHistory(
    Array.isArray(response)
        ? response
        : []
);
        } catch (err) {
            console.error("History error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to load your history."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadHistory();
    }, []);

    const filteredHistory = useMemo(() => {
        return history.filter((item) => {
            const matchesTool =
                selectedTool === "ALL" ||
                item.tool === selectedTool;

            const searchText = search.toLowerCase();

            const matchesSearch =
                (item.title || "").toLowerCase().includes(searchText) ||
                (item.action || "").toLowerCase().includes(searchText) ||
                (item.tool || "").toLowerCase().includes(searchText);

            return matchesTool && matchesSearch;
        });
    }, [history, selectedTool, search]);

    async function openDetails(id) {
        try {
            setLoadingDetails(true);

            const response = await getHistoryById(id);

            setSelectedActivity(response.history || response);
        } catch (err) {
            console.error("Details error:", err);

            alert(
                err.response?.data?.message ||
                "Unable to load activity details."
            );
        } finally {
            setLoadingDetails(false);
        }
    }

    async function handleDelete(id) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this activity?"
        );

        if (!confirmed) return;

        try {
            setDeletingId(id);

            await deleteHistory(id);

            setHistory((prev) =>
                prev.filter((item) => item._id !== id)
            );

            if (selectedActivity?._id === id) {
                setSelectedActivity(null);
            }
        } catch (err) {
            console.error("Delete error:", err);

            alert(
                err.response?.data?.message ||
                "Unable to delete this activity."
            );
        } finally {
            setDeletingId(null);
        }
    }

    async function handleDownload(id) {
        try {
            const blob = await downloadHistoryFile(id);

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = url;

            const activity = history.find(
                (item) => item._id === id
            );

            link.download =
                activity?.file?.name || "history-file";

            document.body.appendChild(link);
            link.click();

            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Download error:", err);

            alert(
                err.response?.data?.message ||
                "Unable to download this file."
            );
        }
    }

    function formatDate(date) {
        if (!date) return "Unknown date";

        return new Date(date).toLocaleString();
    }

    function formatTool(tool) {
        return toolInfo[tool] || {
            label: tool || "Activity",
            icon: HistoryIcon,
            color: "text-cyan-400",
            bg: "bg-cyan-500/10"
        };
    }

    function renderContent(value) {
        if (value === null || value === undefined) {
            return "No information available.";
        }

        if (typeof value === "string") {
            return value;
        }

        return JSON.stringify(value, null, 2);
    }

    return (
        <div className="text-white space-y-8">

            {/* Header */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div>
                    <h1 className="text-4xl font-bold text-cyan-400">
                        <HistoryIcon className="inline mr-2" size={34} />
                        Activity History
                    </h1>

                    <p className="text-slate-400 mt-3">
                        Keep track of everything you have done with DevHelper AI.
                    </p>
                </div>

                <button
                    onClick={loadHistory}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 bg-cyan-500 text-black px-5 py-3 rounded-lg font-bold hover:bg-cyan-400 disabled:opacity-50"
                >
                    <RefreshCw size={18} />
                    Refresh
                </button>

            </div>


            {/* Statistics */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

                <div className="bg-slate-900 p-5 rounded-xl">
                    <div className="flex items-center gap-3">
                        <div className="bg-cyan-500/10 p-3 rounded-lg">
                            <HistoryIcon className="text-cyan-400" />
                        </div>

                        <div>
                            <p className="text-slate-400 text-sm">
                                Total Activities
                            </p>

                            <h2 className="text-3xl font-bold text-cyan-400">
                                {history.length}
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 p-5 rounded-xl">
                    <div className="flex items-center gap-3">
                        <div className="bg-green-500/10 p-3 rounded-lg">
                            <Code className="text-green-400" />
                        </div>

                        <div>
                            <p className="text-slate-400 text-sm">
                                Code Reviews
                            </p>

                            <h2 className="text-3xl font-bold text-green-400">
                                {history.filter(
                                    item => item.tool === "CODE_REVIEWER"
                                ).length}
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 p-5 rounded-xl">
                    <div className="flex items-center gap-3">
                        <div className="bg-purple-500/10 p-3 rounded-lg">
                            <FileText className="text-purple-400" />
                        </div>

                        <div>
                            <p className="text-slate-400 text-sm">
                                Generated READMEs
                            </p>

                            <h2 className="text-3xl font-bold text-purple-400">
                                {history.filter(
                                    item => item.tool === "README_GENERATOR"
                                ).length}
                            </h2>
                        </div>
                    </div>
                </div>

            </div>


            {/* Search and Filters */}

            <div className="bg-slate-900 p-5 rounded-xl space-y-5">

                <div className="flex items-center gap-2">
                    <Filter className="text-cyan-400" />

                    <h2 className="text-xl font-bold">
                        Find an Activity
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4">

                    <div className="relative">

                        <Search
                            className="absolute left-3 top-3 text-slate-400"
                            size={20}
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search activities..."
                            className="w-full bg-slate-800 text-white pl-11 pr-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-cyan-500"
                        />

                    </div>

                    <select
                        value={selectedTool}
                        onChange={(e) => setSelectedTool(e.target.value)}
                        className="bg-slate-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                        {tools.map((tool) => (
                            <option key={tool.value} value={tool.value}>
                                {tool.label}
                            </option>
                        ))}
                    </select>

                </div>

            </div>


            {/* History List */}

            <div className="bg-slate-900 p-6 rounded-xl">

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-green-400">
                        Your Activities
                    </h2>

                    <span className="text-slate-400 text-sm">
                        {filteredHistory.length} result(s)
                    </span>
                </div>


                {loading ? (

                    <div className="text-center py-16 text-cyan-400">
                        <RefreshCw className="animate-spin mx-auto mb-3" size={32} />
                        Loading history...
                    </div>

                ) : error ? (

                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-5 rounded-xl">
                        {error}
                    </div>

                ) : filteredHistory.length === 0 ? (

                    <div className="text-center py-16">

                        <HistoryIcon
                            size={55}
                            className="mx-auto text-slate-600 mb-4"
                        />

                        <h3 className="text-xl font-bold text-slate-300">
                            No activities found
                        </h3>

                        <p className="text-slate-500 mt-2">
                            Your AI activities will appear here.
                        </p>

                    </div>

                ) : (

                    <div className="space-y-4">

                        {filteredHistory.map((item) => {

                            const info = formatTool(item.tool);
                            const Icon = info.icon;

                            return (

                                <div
                                    key={item._id}
                                    className="bg-slate-800 p-5 rounded-xl border border-slate-700 hover:border-cyan-500/50 transition"
                                >

                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                                        <div className="flex items-start gap-4">

                                            <div className={`${info.bg} p-3 rounded-lg`}>
                                                <Icon className={info.color} size={24} />
                                            </div>

                                            <div>

                                                <h3 className="font-bold text-lg">
                                                    {item.title || info.label}
                                                </h3>

                                                <p className={`${info.color} text-sm mt-1`}>
                                                    {info.label}
                                                </p>

                                                <p className="text-slate-400 text-sm mt-2">
                                                    <Clock size={14} className="inline mr-1" />
                                                    {formatDate(item.createdAt)}
                                                </p>

                                                <p className="text-slate-400 text-sm mt-2">
                                                    {item.action?.replaceAll("_", " ") || "Activity completed"}
                                                </p>

                                            </div>

                                        </div>


                                        <div className="flex flex-wrap gap-2">

                                            <button
                                                onClick={() => openDetails(item._id)}
                                                className="flex items-center gap-2 bg-cyan-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-cyan-400"
                                            >
                                                <Eye size={17} />
                                                View
                                            </button>

                                            {item.file?.path && (
                                                <button
                                                    onClick={() => handleDownload(item._id)}
                                                    className="flex items-center gap-2 bg-green-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-green-400"
                                                >
                                                    <Download size={17} />
                                                    Download
                                                </button>
                                            )}

                                            <button
                                                onClick={() => handleDelete(item._id)}
                                                disabled={deletingId === item._id}
                                                className="flex items-center gap-2 bg-red-500/10 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg hover:bg-red-500/20 disabled:opacity-50"
                                            >
                                                <Trash2 size={17} />
                                                Delete
                                            </button>

                                        </div>

                                    </div>

                                </div>

                            );
                        })}

                    </div>

                )}

            </div>


            {/* Details Modal */}

            {selectedActivity && (

                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">

                    <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-auto p-6">

                        <div className="flex justify-between items-center mb-6">

                            <div>
                                <h2 className="text-2xl font-bold text-cyan-400">
                                    Activity Details
                                </h2>

                                <p className="text-slate-400 text-sm mt-1">
                                    {selectedActivity.title}
                                </p>
                            </div>

                            <button
                                onClick={() => setSelectedActivity(null)}
                                className="text-slate-400 hover:text-white"
                            >
                                <X size={25} />
                            </button>

                        </div>

                        <div className="space-y-5">

                            <div className="bg-slate-800 p-4 rounded-xl">
                                <p className="text-cyan-400 font-bold mb-2">
                                    Tool
                                </p>

                                <p>
                                    {formatTool(selectedActivity.tool).label}
                                </p>
                            </div>

                            <div className="bg-slate-800 p-4 rounded-xl">
                                <p className="text-cyan-400 font-bold mb-2">
                                    Date
                                </p>

                                <p>
                                    {formatDate(selectedActivity.createdAt)}
                                </p>
                            </div>

                            <div className="bg-slate-800 p-4 rounded-xl">
                                <p className="text-cyan-400 font-bold mb-2">
                                    Input
                                </p>

                                <pre className="text-sm text-slate-300 whitespace-pre-wrap break-words overflow-auto max-h-72">
                                    {renderContent(selectedActivity.input)}
                                </pre>
                            </div>

                            <div className="bg-slate-800 p-4 rounded-xl">
                                <p className="text-green-400 font-bold mb-2">
                                    AI Result
                                </p>

                                <pre className="text-sm text-slate-300 whitespace-pre-wrap break-words overflow-auto max-h-96">
                                    {renderContent(selectedActivity.result)}
                                </pre>
                            </div>

                            {selectedActivity.file?.name && (
                                <div className="bg-slate-800 p-4 rounded-xl">
                                    <p className="text-cyan-400 font-bold mb-2">
                                        Generated File
                                    </p>

                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-slate-300">
                                            {selectedActivity.file.name}
                                        </span>

                                        <button
                                            onClick={() => handleDownload(selectedActivity._id)}
                                            className="bg-green-500 text-black px-4 py-2 rounded-lg font-bold hover:bg-green-400"
                                        >
                                            <Download size={16} className="inline mr-2" />
                                            Download
                                        </button>
                                    </div>
                                </div>
                            )}

                        </div>

                    </div>

                </div>

            )}

            {loadingDetails && (
                <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center">
                    <div className="bg-slate-900 p-6 rounded-xl text-cyan-400">
                        <RefreshCw className="animate-spin inline mr-2" />
                        Loading details...
                    </div>
                </div>
            )}

        </div>
    );
}
