
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    BookOpen,
    CheckCircle,
    BarChart3,
    Flame,
    Building2,
    Tags,
    Plus,
    ArrowRight,
    RefreshCw
} from "lucide-react";

import api from "../api/axios";

const statCards = [
    {
        key: "totalQuestions",
        label: "Total Questions",
        icon: BookOpen,
        color: "bg-indigo-50 text-indigo-600",
    },
    {
        key: "easyQuestions",
        label: "Easy Questions",
        icon: CheckCircle,
        color: "bg-emerald-50 text-emerald-600",
    },
    {
        key: "mediumQuestions",
        label: "Medium Questions",
        icon: BarChart3,
        color: "bg-amber-50 text-amber-600",
    },
    {
        key: "hardQuestions",
        label: "Hard Questions",
        icon: Flame,
        color: "bg-rose-50 text-rose-600",
    },
    {
        key: "totalTopics",
        label: "Total Topics",
        icon: Tags,
        color: "bg-violet-50 text-violet-600",
    },
    {
        key: "totalCompanies",
        label: "Total Companies",
        icon: Building2,
        color: "bg-sky-50 text-sky-600",
    },
];

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    async function fetchStats() {
        try {
            setIsLoading(true);
            setError("");

            const response = await api.get("/progress/stats/admin");

            setStats(response.data.stats);
        } catch (err) {
            setError(
                err.response?.data?.message ??
                "Unable to load dashboard statistics."
            );
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchStats();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-8">

                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-medium text-indigo-600">
                            CampusHire / Admin
                        </p>

                        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                            Admin Dashboard
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Overview of your interview preparation question bank.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={fetchStats}
                            disabled={isLoading}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <RefreshCw
                                size={16}
                                className={isLoading ? "animate-spin" : ""}
                            />
                            Refresh
                        </button>

                        <Link
                            to="/admin/questions/new"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                        >
                            <Plus size={18} />
                            Add Question
                        </Link>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div
                        role="alert"
                        className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between"
                    >
                        <p>{error}</p>

                        <button
                            type="button"
                            onClick={fetchStats}
                            className="self-start font-semibold underline sm:self-auto"
                        >
                            Try again
                        </button>
                    </div>
                )}

                {/* Statistics */}
                <section>
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Question Bank Overview
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Current totals from your database.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {statCards.map((card) => {
                            const Icon = card.icon;

                            return (
                                <div
                                    key={card.key}
                                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                                >
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-slate-500">
                                            {card.label}
                                        </p>

                                        <div
                                            className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.color}`}
                                        >
                                            <Icon size={21} />
                                        </div>
                                    </div>

                                    <p className="mt-5 text-3xl font-bold tracking-tight text-slate-900">
                                        {isLoading
                                            ? "..."
                                            : (stats?.[card.key] ?? 0).toLocaleString()}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Question Management */}
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">
                                Question Management
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Add, review, edit, and delete interview questions.
                            </p>
                        </div>

                        <Link
                            to="/questions"
                            className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                            Manage Questions
                            <ArrowRight size={17} />
                        </Link>
                    </div>
                </section>

            </div>
        </div>
    );
}
