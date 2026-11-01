
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {Link} from "react-router-dom"
import { useAuth } from "../context/AuthContext";
function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading,setIsLoading] =useState(false);
    const {login} =useAuth();
    const navigate=useNavigate();
    
    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/login",
                { email, password }
            );
            const token = response.data.token;
            login(token,response.data.role);
            navigate("/dashboard");
            console.log("Login successful");
        } catch (err) {
            setError(
                err.response?.data?.error ??
                err.response?.data?.message ??
                "Something went wrong. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-2">

            {/* Left promotional panel */}
            <section className="relative hidden overflow-hidden bg-gradient-to-br from-blue-800 via-blue-700 to-indigo-900 px-12 py-12 text-white lg:flex lg:flex-col lg:justify-between xl:px-20">
                <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl" />
                <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl" />

                <div className="relative">
                    <a href="/" className="inline-flex items-center gap-3 text-2xl font-bold tracking-tight">
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-xl">
                            C
                        </span>
                        Campus<span className="text-blue-300">Hire</span>
                    </a>
                </div>

                <div className="relative max-w-xl py-12">
                    <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-blue-100">
                        Your placement journey starts here
                    </span>

                    <h1 className="mt-7 text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
                        Turn your preparation into your next opportunity.
                    </h1>

                    <p className="mt-5 max-w-lg text-base leading-7 text-blue-100 xl:text-lg">
                        Practice interview questions, track your progress,
                        and build the confidence to take on your dream role.
                    </p>

                    <div className="mt-10 space-y-6">
                        {[
                            {
                                number: "01",
                                title: "Practice with purpose",
                                description: "Explore questions across DSA, web development and core subjects."
                            },
                            {
                                number: "02",
                                title: "Track your progress",
                                description: "Keep track of solved questions and topics you need to revisit."
                            },
                            {
                                number: "03",
                                title: "Prepare with confidence",
                                description: "Build consistent habits before your placement interviews."
                            }
                        ].map((item) => (
                            <div key={item.number} className="flex gap-4">
                                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-sm font-semibold text-blue-200">
                                    {item.number}
                                </span>
                                <div>
                                    <h2 className="font-semibold">{item.title}</h2>
                                    <p className="mt-1 text-sm leading-6 text-blue-100/80">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="relative text-sm text-blue-200/80">
                    Learn consistently. Grow confidently.
                </p>
            </section>

            {/* Login section */}
            <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-10">
                <div className="w-full max-w-md">

                    {/* Mobile branding */}
                    <a href="/" className="mb-10 flex items-center justify-center gap-2 text-2xl font-bold text-slate-900 lg:hidden">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 text-white">
                            C
                        </span>
                        Campus<span className="text-blue-700">Hire</span>
                    </a>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-9">
                        <div className="mb-8">
                            <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">
                                Welcome back
                            </p>

                            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                                Sign in to your account
                            </h2>

                            <p className="mt-3 text-sm leading-6 text-slate-500">
                                Continue your preparation and keep moving
                                towards your career goals.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Email address
                                </label>

                                <input
                                    type="email"
                                    id="email"
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                                />
                            </div>

                            <div>
                                <div className="mb-2 flex items-center justify-between gap-3">
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-semibold text-slate-700"
                                    >
                                        Password
                                    </label>
                                </div>

                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        autoComplete="current-password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-20 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((current) => !current)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        className="absolute inset-y-0 right-3 my-auto h-9 rounded-lg px-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div
                                    role="alert"
                                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700"
                                >
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isLoading ? "Signing in..." : "Sign in"}
                                {!isLoading && <span aria-hidden="true">→</span>}
                            </button>
                            <p className="text-center text-sm text-slate-600">
                                Don't have an account?{" "}
                                <Link
                                    to="/register"
                                    className="font-semibold text-blue-700 hover:text-blue-800 hover:underline"
                                >
                                    Sign up
                                </Link>
                            </p>
                        </form>

                        <div className="mt-7 border-t border-slate-100 pt-6">
                            <p className="text-center text-xs leading-5 text-slate-500">
                                By signing in, you agree to use CampusHire
                                responsibly and keep your account credentials secure.
                            </p>
                        </div>
                    </div>

                    <p className="mt-6 text-center text-xs text-slate-400">
                        © {new Date().getFullYear()} CampusHire. Built for your next opportunity.
                    </p>
                </div>
            </section>
        </main>
    );
}

export default Login;
