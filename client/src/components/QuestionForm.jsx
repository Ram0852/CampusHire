
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function QuestionForm() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        difficulty: "Easy",
        topic: "",
        company: "",
        externalLink: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    function handleChange(e) {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();

        setError("");
        setSuccess("");

        try {
            setIsSubmitting(true);

            await api.post("/questions", formData);

            setSuccess("Question added successfully!");

            // Return to the questions list after success.
            navigate("/questions");
        } catch (err) {
            setError(
                err.response?.data?.error ??
                err.response?.data?.message ??
                "Failed to add question. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    const inputClass =
        "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6">
            <div className="mx-auto max-w-2xl">
                <header className="mb-6">
                    <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                        CampusHire Admin
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-slate-900">
                        Add Question
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Add a practice question to the question bank.
                    </p>
                </header>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
                >
                    <div>
                        <label
                            htmlFor="title"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Question title
                        </label>

                        <input
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Two Sum"
                            className={inputClass}
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="description"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Description
                        </label>

                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter the problem statement..."
                            rows={5}
                            className={inputClass}
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="difficulty"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Difficulty
                        </label>

                        <select
                            id="difficulty"
                            name="difficulty"
                            value={formData.difficulty}
                            onChange={handleChange}
                            className={inputClass}
                            required
                        >
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="topic"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Topic
                        </label>

                        <input
                            id="topic"
                            name="topic"
                            value={formData.topic}
                            onChange={handleChange}
                            placeholder="e.g. Arrays, DBMS"
                            className={inputClass}
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="company"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Company
                        </label>

                        <input
                            id="company"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            placeholder="e.g. Amazon"
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="externalLink"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            External problem link
                        </label>

                        <input
                            id="externalLink"
                            name="externalLink"
                            type="url"
                            value={formData.externalLink}
                            onChange={handleChange}
                            placeholder="https://leetcode.com/..."
                            className={inputClass}
                        />
                    </div>

                    {error && (
                        <p
                            role="alert"
                            className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
                        >
                            {error}
                        </p>
                    )}

                    {success && (
                        <p
                            role="status"
                            className="rounded-lg bg-green-50 p-3 text-sm text-green-700"
                        >
                            {success}
                        </p>
                    )}

                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={() => navigate("/questions")}
                            disabled={isSubmitting}
                            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isSubmitting
                                ? "Adding question..."
                                : "Add Question"}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}

export default QuestionForm;
