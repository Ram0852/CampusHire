
import { useEffect, useState } from "react";
import api from "../api/axios";
import StatCard from "../components/StatCard";

function Dashboard() {
    // Store all dashboard statistics in one state object
    const [dashboard, setDashboard] = useState({
        totalQuestions: 0,
        totalSolved: 0,
        totalBookmarked: 0,
        difficultyStats: [],
        topicwiseQuestions: [],
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch dashboard data when the component loads
    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get("/progress/stats");

                setDashboard(response.data);
            } catch (err) {
                setError(
                    err.response?.data?.error ||
                    "Failed to load dashboard"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    // Calculate overall completion percentage
    const completionPercentage =
        dashboard.totalQuestions > 0
            ? Math.round(
                  (dashboard.totalSolved /
                      dashboard.totalQuestions) * 100
              )
            : 0;

    // Loading state
    if (loading) {
        return (
            <div className="p-8 text-center text-slate-500">
                Loading dashboard...
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="p-8 text-center text-red-600">
                {error}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
            <div className="mx-auto max-w-7xl space-y-8">

                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                        Dashboard
                    </h1>
                    <p className="mt-2 text-slate-500">
                        Track your interview preparation progress.
                    </p>
                </div>

                {/* Statistics cards */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

                    <StatCard
                        title="Total Questions"
                        value={dashboard.totalQuestions}
                        description="Available in CampusHire"
                    />

                    <StatCard
                        title="Questions Solved"
                        value={dashboard.totalSolved}
                        description="Completed by you"
                    />

                    <StatCard
                        title="Bookmarked"
                        value={dashboard.totalBookmarked}
                        description="Saved for later"
                    />

                    <StatCard
                        title="Overall Progress"
                        value={`${completionPercentage}%`}
                        description="Of all available questions"
                    />

                </div>

                {/* Difficulty-wise progress */}
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-slate-900">
                        Progress by Difficulty
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Compare solved questions with the total available.
                    </p>

                    <div className="mt-6 space-y-6">
                        {dashboard.difficultyStats.map((item) => {
                            const percentage =
                                item.total > 0
                                    ? Math.round(
                                          (item.solved / item.total) * 100
                                      )
                                    : 0;

                            return (
                                <div key={item.difficulty}>
                                    <div className="mb-2 flex items-center justify-between gap-3">
                                        <span className="font-medium text-slate-700">
                                            {item.difficulty}
                                        </span>

                                        <span className="text-sm text-slate-500">
                                            {item.solved} / {item.total} solved
                                            {" "}({percentage}%)
                                        </span>
                                    </div>

                                    <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                                        <div
                                            className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                                            style={{
                                                width: `${percentage}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}

                        {dashboard.difficultyStats.length === 0 && (
                            <p className="text-sm text-slate-500">
                                No questions available yet.
                            </p>
                        )}
                    </div>
                </section>

                {/* Topic-wise progress */}
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-slate-900">
                        Solved Questions by Topic
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        See how many questions you have solved in each topic.
                    </p>

                    {dashboard.topicwiseQuestions.length > 0 ? (
                        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {dashboard.topicwiseQuestions.map((item) => (
                                <div
                                    key={item._id}
                                    className="rounded-xl border border-slate-200 p-4"
                                >
                                    <p className="font-medium text-slate-800">
                                        {item._id || "Uncategorized"}
                                    </p>

                                    <p className="mt-2 text-2xl font-bold text-indigo-600">
                                        {item.count}
                                    </p>

                                    <p className="text-sm text-slate-500">
                                        Questions solved
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="mt-5 text-sm text-slate-500">
                            Solve some questions to see your topic-wise progress.
                        </p>
                    )}
                </section>

            </div>
        </div>
    );
}

export default Dashboard;
