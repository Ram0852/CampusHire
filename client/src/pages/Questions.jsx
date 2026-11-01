
import { useEffect, useState } from "react";
import api from "../api/axios";
import {Link,useNavigate} from "react-router-dom";
import useDebounce from "../hooks/useDebounce";
import { useAuth } from "../context/AuthContext";
import { Pencil, Trash2 } from "lucide-react";

function Questions() {
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [search,setSearch] =useState("");
    const [company, setCompany] = useState("");
    const debouncedSearch=useDebounce(search,500);
    const debouncedCompany=useDebounce(company,500);
    const [difficulty, setDifficulty] = useState("");
    const [sort, setSort] = useState("");
    const { isAdmin } =useAuth();
    const navigate = useNavigate();
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
    });

    useEffect(() => {
        let cancelled = false;

        async function fetchQuestions() {
            setIsLoading(true);
            setError("");

            try {
                const response = await api.get("/questions", {
                    params: {
                        page: pagination.currentPage,
                        limit: 3,
                        ...(debouncedSearch.trim() && {
                            search: debouncedSearch.trim(),
                        }),
                        sort,
                        order: sort === "createdAt" ? "desc" : "asc",
                        ...(difficulty && { difficulty }),
                        ...(debouncedCompany.trim() && {
                            company: debouncedCompany.trim(),
                        }),
                    },
                });

                if (cancelled) return;

                setQuestions(response.data.questions);
                setPagination(response.data.pagination);
            } catch (err) {
                if (cancelled) return;

                setQuestions([]);
                setError(
                    err.response?.data?.error ??
                        "Something went wrong. Please try again."
                );
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        }

        fetchQuestions();

        return () => {
            cancelled = true;
        };
    }, [
        pagination.currentPage,
        debouncedSearch,
        sort,
        difficulty,
        debouncedCompany,
    ]);

    function resetToFirstPage() {
        setPagination((prev) => ({
            ...prev,
            currentPage: 1,
        }));
    }

    function handleSearchChange(value) {
        setSearch(value);
        resetToFirstPage();
    }

    function handleCompanyChange(value) {
        setCompany(value);
        resetToFirstPage();
    }

    function handleSortChange(value) {
        setSort(value);
        resetToFirstPage();
    }

    function handleDifficultyChange(value) {
        setDifficulty((prev) => (prev === value ? "" : value));
        resetToFirstPage();
    }

    function changePage(page) {
        setPagination((prev) => ({
            ...prev,
            currentPage: page,
        }));
    }

    function handleAddQuestion() {
        navigate("/questions/new");
    }

    const difficultyStyles = {
        Easy: "bg-green-100 text-green-700",
        Medium: "bg-yellow-100 text-yellow-700",
        Hard: "bg-red-100 text-red-700",
      };

    const difficulties = [
        {
            label: "Easy",
            value: "Easy",
            active:
                "border-emerald-500 bg-emerald-50 text-emerald-700",
        },
        {
            label: "Medium",
            value: "Medium",
            active:
                "border-amber-500 bg-amber-50 text-amber-700",
        },
        {
            label: "Hard",
            value: "Hard",
            active: "border-red-500 bg-red-50 text-red-700",
        },
    ];

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl space-y-6">
                {/* Page heading */}
                <header>
                    <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                        CampusHire
                    </p>

                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                        Practice Questions
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Find questions and prepare for your placements.
                    </p>
                </header>

                {/* Search and filters */}
                <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label
                                htmlFor="question-search"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Search questions
                            </label>

                            <input
                                id="question-search"
                                type="text"
                                placeholder="Search by title or description..."
                                value={search}
                                onChange={(e) =>
                                    handleSearchChange(e.target.value)
                                }
                                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="company-search"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Search by company
                            </label>

                            <input
                                id="company-search"
                                type="text"
                                placeholder="e.g. Amazon, Google..."
                                value={company}
                                onChange={(e) =>
                                    handleCompanyChange(e.target.value)
                                }
                                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>
                    </div>

                    <div>
                        <p className="mb-3 text-sm font-medium text-slate-700">
                            Filter by difficulty
                        </p>

                        <div className="flex flex-wrap gap-2">
                            {difficulties.map((item) => {
                                const isActive =
                                    difficulty === item.value;

                                return (
                                    <button
                                        key={item.value}
                                        type="button"
                                        disabled={isLoading}
                                        aria-pressed={isActive}
                                        onClick={() =>
                                            handleDifficultyChange(
                                                item.value
                                            )
                                        }
                                        className={`rounded-lg border px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                            isActive
                                                ? item.active
                                                : "border-slate-200 bg-white text-slate-600 hover:border-slate-400 hover:bg-slate-50"
                                        }`}
                                    >
                                        {item.label}
                                    </button>
                                );
                            })}

                            {difficulty && (
                                <button
                                    type="button"
                                    disabled={isLoading}
                                    onClick={() =>
                                        handleDifficultyChange(difficulty)
                                    }
                                    className="rounded-lg px-3 py-2 text-sm text-slate-500 underline hover:text-slate-800 disabled:opacity-50"
                                >
                                    Clear filter
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                        <label
                            htmlFor="sort-questions"
                            className="text-sm font-medium text-slate-700"
                        >
                            Sort questions
                        </label>

                        <select
                            id="sort-questions"
                            value={sort}
                            disabled={isLoading}
                            onChange={(e) =>
                                handleSortChange(e.target.value)
                            }
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:opacity-50 sm:w-56"
                        >
                            <option value="">Default order</option>
                            <option value="title">Title (A–Z)</option>
                            <option value="createdAt">Newest first</option>
                        </select>
                    </div>
                </section>

                {/* Results heading */}
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Questions
                    </h2>

                    <div className="flex items-center gap-3">
                        {isLoading && (
                            <span
                                role="status"
                                className="text-sm text-slate-500"
                            >
                                Loading...
                            </span>
                        )}

                        {isAdmin && (
                            <button
                                type="button"
                                onClick={handleAddQuestion}
                                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                            >
                                + Add Question
                            </button>
                        )}
                    </div>
                </div>

                {/* Error message */}
                {error && (
                    <div
                        role="alert"
                        className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                    >
                        {error}
                    </div>
                )}

                {/* Questions list */}
                <section className="space-y-3">
                    {!isLoading &&
                        !error &&
                        questions.map((que) => (
                            <article
                                key={que._id}
                                className="relative rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
                            >
                                {/* Admin actions: top-right corner */}
                                {isAdmin && (
                                    <div className="absolute right-4 top-4 flex gap-1">
                                        <button
                                            type="button"
                                            onClick={() => handleEditQuestion(que._id)}
                                            aria-label={`Edit ${que.title}`}
                                            title="Edit question"
                                            className="rounded-lg p-2 text-indigo-600 transition hover:bg-indigo-50"
                                        >
                                            <Pencil size={17} />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleDeleteQuestion(que._id)}
                                            aria-label={`Delete ${que.title}`}
                                            title="Delete question"
                                            className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                                        >
                                            <Trash2 size={17} />
                                        </button>
                                    </div>
                                )}

                                {/* Question title */}
                                <h3 className="pr-20 font-semibold text-slate-900">
                                    <Link
                                        to={`/questions/${que._id}`}
                                        className="transition hover:text-indigo-600"
                                    >
                                        {que.title}
                                    </Link>
                                </h3>

                                {/* Question metadata */}
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {que.difficulty && (
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                difficultyStyles[que.difficulty]
                                            }`}
                                        >
                                            {que.difficulty}
                                        </span>
                                    )}

                                    {que.topic && (
                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                                            {que.topic}
                                        </span>
                                    )}

                                    {que.company && (
                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                                            {que.company}
                                        </span>
                                    )}
                                </div>
                            </article>
                        ))}

                    {/* Empty state */}
                    {!isLoading &&
                        !error &&
                        questions.length === 0 && (
                            <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-12 text-center">
                                <h3 className="font-semibold text-slate-800">
                                    No questions found
                                </h3>

                                <p className="mt-2 text-sm text-slate-500">
                                    Try another search term or clear your filters.
                                </p>
                            </div>
                        )}
                </section>

                {/* Pagination */}
                <div className="flex items-center justify-center gap-5 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    <button
                        type="button"
                        disabled={
                            isLoading ||
                            !pagination.hasPreviousPage
                        }
                        onClick={() =>
                            changePage(pagination.currentPage - 1)
                        }
                        aria-label="Previous page"
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-xl text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        ←
                    </button>

                    <span className="min-w-20 text-center text-sm font-medium text-slate-700">
                        {pagination.totalPages === 0
                            ? 0
                            : pagination.currentPage}{" "}
                        / {pagination.totalPages}
                    </span>

                    <button
                        type="button"
                        disabled={
                            isLoading ||
                            !pagination.hasNextPage
                        }
                        onClick={() =>
                            changePage(pagination.currentPage + 1)
                        }
                        aria-label="Next page"
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-xl text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        →
                    </button>
                </div>
            </div>
        </main>
    );
}

export default Questions;
