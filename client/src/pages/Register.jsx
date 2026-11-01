
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();

    async function handleRegister(event) {
        event.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Confirm password should be the same as password!");
            return;
        }

        setIsLoading(true);

        try {
            await axios.post(
                "http://localhost:5000/api/auth/register",
                { name, email, password }
            );

            navigate("/login");
        } catch (error) {
            setError(
                error.response?.data?.error ??
                error.response?.data?.message ??
                "Something went wrong! Try again"
            );
        } finally {
            setIsLoading(false);
        }
    }

    const inputClass =
        "w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100";

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-10 sm:py-14">
            <div className="mx-auto w-full max-w-md">
                <div className="mb-8 text-center">
                    <Link
                        to="/"
                        className="text-2xl font-bold tracking-tight text-blue-700"
                    >
                        CampusHire
                    </Link>
                    <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">
                        Create your account
                    </h1>
                    <p className="mt-2 text-sm text-slate-600">
                        Start preparing for your next opportunity.
                    </p>
                </div>

                <form
                    onSubmit={handleRegister}
                    className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
                >
                    <div>
                        <label
                            htmlFor="username"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            autoComplete="username"
                            placeholder="Enter your username"
                            className={inputClass}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Email address
                        </label>
                        <input
                            type="email"
                            id="email"
                            autoComplete="email"
                            placeholder="you@example.com"
                            className={inputClass}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                autoComplete="new-password"
                                placeholder="At least 6 characters"
                                className={`${inputClass} pr-20`}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute inset-y-0 right-3 text-sm font-medium text-slate-500 hover:text-blue-700"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Confirm password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                autoComplete="new-password"
                                placeholder="Re-enter your password"
                                className={`${inputClass} pr-20`}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword((prev) => !prev)
                                }
                                className="absolute inset-y-0 right-3 text-sm font-medium text-slate-500 hover:text-blue-700"
                                aria-label={
                                    showConfirmPassword
                                        ? "Hide confirm password"
                                        : "Show confirm password"
                                }
                            >
                                {showConfirmPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div
                            role="alert"
                            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                        >
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-xl bg-blue-700 px-4 py-3 font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isLoading ? "Creating account..." : "Create account"}
                    </button>

                    <p className="text-center text-sm text-slate-600">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-semibold text-blue-700 hover:text-blue-800 hover:underline"
                        >
                            Login
                        </Link>
                    </p>
                </form>

                <p className="mt-6 text-center text-xs text-slate-500">
                    Build your skills. Track your progress. Get placement-ready.
                </p>
            </div>
        </main>
    );
}

export default Register;
