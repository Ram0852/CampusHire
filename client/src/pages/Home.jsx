import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
const features = [
    {
        title: "Practice Smarter",
        description:
            "Explore interview questions across DSA, JavaScript, React, Node.js, DBMS, OS, and more.",
        icon: "🎯",
    },
    {
        title: "Track Your Progress",
        description:
            "Keep track of solved questions, bookmark important problems, and monitor your preparation.",
        icon: "📈",
    },
    {
        title: "Prepare with Confidence",
        description:
            "Build consistency, strengthen your fundamentals, and get ready for placement interviews.",
        icon: "🚀",
    },
];

function Home() {
    const { isLoggedIn } = useAuth();
    return (
        <main className="overflow-x-clip bg-white text-slate-900">
            {/* Hero Section */}
            <section className="relative isolate overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
                <div className="absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl" />
                <div className="absolute -bottom-32 -left-24 -z-10 h-80 w-80 rounded-full bg-indigo-200/30 blur-3xl" />

                <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
                    <div className="mx-auto max-w-3xl text-center">
                        <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-4 py-2 text-sm font-medium text-blue-700 shadow-sm">
                            <span className="h-2 w-2 rounded-full bg-blue-600" />
                            Your placement journey starts here
                        </span>

                        <h1 className="mt-8 text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                            Prepare for placements.
                            <span className="mt-2 block text-blue-700">
                                Build your future.
                            </span>
                        </h1>

                        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                            CampusHire helps you prepare for technical interviews
                            with curated questions, progress tracking, and a
                            structured approach to mastering the skills
                            companies look for.
                        </p>

                        <div className="mt-9 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center">
                            {isLoggedIn? <Link
                                to="/questions"
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-700/20 transition hover:-translate-y-0.5 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200"
                            >
                                Start Preparing
                                <span aria-hidden="true">→</span>
                            </Link> :
                            
                            <Link
                                to="/login"
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-700/20 transition hover:-translate-y-0.5 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200"
                            >
                                Start Preparing
                                <span aria-hidden="true">→</span>
                            </Link>}

                            <a
                                href="#features"
                                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-7 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
                            >
                                Explore Features
                            </a>
                        </div>

                        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-slate-500">
                            <span className="flex items-center gap-2">
                                <span className="text-green-600">✓</span>
                                Structured practice
                            </span>
                            <span className="flex items-center gap-2">
                                <span className="text-green-600">✓</span>
                                Track your progress
                            </span>
                            <span className="flex items-center gap-2">
                                <span className="text-green-600">✓</span>
                                Prepare at your pace
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section
                id="features"
                className="scroll-mt-24 border-t border-slate-100 bg-white"
            >
                <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
                    <div className="mx-auto max-w-2xl text-center">
                        <span className="text-sm font-semibold uppercase tracking-widest text-blue-700">
                            Why CampusHire?
                        </span>

                        <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            Everything you need to prepare
                        </h2>

                        <p className="mt-4 text-base leading-7 text-slate-600">
                            Make your placement preparation more organized,
                            consistent, and effective.
                        </p>
                    </div>

                    <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature, index) => (
                            <article
                                key={feature.title}
                                className="group rounded-2xl border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-200/50"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl transition group-hover:bg-blue-100">
                                    {feature.icon}
                                </div>

                                <h3 className="mt-6 text-lg font-semibold text-slate-900">
                                    {feature.title}
                                </h3>

                                <p className="mt-3 text-sm leading-7 text-slate-600">
                                    {feature.description}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            {!isLoggedIn && (
                    <section className="px-4 py-16 sm:px-8 sm:py-20">
                    <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 rounded-2xl bg-slate-900 px-6 py-10 sm:flex-row sm:items-center sm:px-10">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-white">
                                Ready to start preparing?
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-slate-300">
                                Build a consistent practice routine with CampusHire.
                            </p>
                        </div>
            
                        <Link
                            to="/register"
                            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        >
                            Create your account
                        </Link>
                    </div>
                </section>
            )}
        </main>
    );
}

export default Home;