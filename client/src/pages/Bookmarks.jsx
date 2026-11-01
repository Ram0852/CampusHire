
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchBookmarks() {
      setIsLoading(true);
      setError("");

      try {
        const response = await api.get("/progress", {
            params: { isBookmarked: true },
          });
          
          console.log("Bookmarks response:", response.data.progress);

        if (!cancelled) {
          setBookmarks(response.data.progress);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.error ||
              "Failed to fetch bookmarked questions."
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchBookmarks();

    return () => {
      cancelled = true;
    };
  }, []);

  const difficultyStyles = {
    Easy: "bg-green-100 text-green-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Hard: "bg-red-100 text-red-700",
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/questions"
            className="text-sm font-medium text-slate-500 transition hover:text-indigo-600"
          >
            ← Back to Questions
          </Link>

          <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900">
            My Bookmarks
          </h1>

          <p className="mt-2 text-slate-600">
            Your saved questions, all in one place.
          </p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6"
              >
                <div className="h-5 w-1/2 rounded bg-slate-200" />
                <div className="mt-4 h-4 w-1/3 rounded bg-slate-200" />
                <div className="mt-5 h-4 w-full rounded bg-slate-200" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!isLoading && error && (
          <div className="rounded-2xl border border-red-200 bg-white p-6">
            <p className="font-medium text-red-700">{error}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && bookmarks.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="text-4xl" aria-hidden="true">
              ☆
            </div>

            <h2 className="mt-4 text-xl font-semibold text-slate-900">
              No bookmarks yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Save questions you want to revisit. They will appear here.
            </p>

            <Link
              to="/questions"
              className="mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Explore Questions
            </Link>
          </div>
        )}

        {/* Bookmark cards */}
        {!isLoading && !error && bookmarks.length > 0 && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                {bookmarks.length} saved{" "}
                {bookmarks.length === 1 ? "question" : "questions"}
              </p>
            </div>

            <div className="space-y-4">
              {bookmarks.map((item) => {
                const question = item.question;

                // Handle deleted or unavailable question references.
                if (!question || typeof question !== "object") {
                  return null;
                }

                return (
                  <article
                    key={item._id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md sm:p-6"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          {question.difficulty && (
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                difficultyStyles[question.difficulty] ||
                                "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {question.difficulty}
                            </span>
                          )}

                          {question.topic && (
                            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                              {question.topic}
                            </span>
                          )}

                          {item.isSolved && (
                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                              ✓ Solved
                            </span>
                          )}
                        </div>

                        <h2 className="mt-3 text-lg font-semibold text-slate-900">
                          <Link
                            to={`/questions/${question._id}`}
                            className="transition hover:text-indigo-600"
                          >
                            {question.title}
                          </Link>
                        </h2>

                        {question.company && (
                          <p className="mt-1 text-sm font-medium text-slate-500">
                            Company: {question.company}
                          </p>
                        )}

                        {question.description && (
                          <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
                            {question.description}
                          </p>
                        )}
                      </div>

                      <Link
                        to={`/questions/${question._id}`}
                        className="inline-flex shrink-0 items-center justify-center rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                      >
                        View Question →
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Bookmarks;
