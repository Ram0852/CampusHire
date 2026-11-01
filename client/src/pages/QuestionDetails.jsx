
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";

function QuestionDetails() {
  const { id } = useParams();

  const [questionDetails, setQuestionDetails] = useState(null);
  const [progress, setProgress] = useState({
    isSolved: false,
    isBookmarked: false,
    notes: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchQuestion() {
      setIsLoading(true);
      setError("");

      try {
        const response = await api.get(`/questions/${id}`);

        if (cancelled) return;

        setQuestionDetails(response.data.question);
        setProgress({
          isSolved: response.data.progress?.isSolved ?? false,
          isBookmarked: response.data.progress?.isBookmarked ?? false,
          notes: response.data.progress?.notes ?? "",
        });
      } catch (err) {
        if (cancelled) return;

        setError(
          err.response?.data?.error ||
            "Failed to load question details."
        );
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchQuestion();

    return () => {
      cancelled = true;
    };
  }, [id]);

  async function updateProgress(field) {
    if (isUpdating) return;

    const previousValue = progress[field];
    const nextValue = !previousValue;

    setIsUpdating(true);
    setError("");
    setUpdateMessage("");

    try {
      const response = await api.patch(`/progress/${id}`, {
        [field]: nextValue,
      });

      const updated = response.data.updatedProgress;

      setProgress((current) => ({
        ...current,
        isSolved: updated.isSolved,
        isBookmarked: updated.isBookmarked,
        notes: updated.notes ?? "",
      }));

      setUpdateMessage(
        field === "isSolved"
          ? nextValue
            ? "Question marked as solved!"
            : "Question marked as unsolved."
          : nextValue
            ? "Question bookmarked!"
            : "Bookmark removed."
      );
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Failed to update progress. Please try again."
      );
    } finally {
      setIsUpdating(false);
    }
  }

  const difficultyStyles = {
    Easy: "bg-green-100 text-green-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Hard: "bg-red-100 text-red-700",
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-12">
        <div className="mx-auto max-w-4xl animate-pulse space-y-5">
          <div className="h-5 w-36 rounded bg-slate-200" />
          <div className="h-10 w-2/3 rounded bg-slate-200" />
          <div className="h-48 rounded-2xl bg-slate-200" />
        </div>
      </div>
    );
  }

  if (error && !questionDetails) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-white p-8 text-center">
          <h2 className="text-xl font-semibold text-slate-900">
            Unable to load question
          </h2>
          <p className="mt-2 text-sm text-red-600">{error}</p>
          <Link
            to="/questions"
            className="mt-6 inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Back to Questions
          </Link>
        </div>
      </div>
    );
  }

  if (!questionDetails) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-900">
          Question not found
        </h2>
        <Link
          to="/questions"
          className="mt-5 inline-block text-indigo-600 hover:underline"
        >
          ← Back to Questions
        </Link>
      </div>
    );
  }

  const {
    title,
    description,
    difficulty,
    topic,
    company,
    tags = [],
    externalLink,
  } = questionDetails;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/questions"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-indigo-600"
        >
          <span aria-hidden="true">←</span>
          Back to Questions
        </Link>

        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Question header */}
          <div className="border-b border-slate-200 p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-3">
              {difficulty && (
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    difficultyStyles[difficulty] ||
                    "bg-slate-100 text-slate-700"
                  }`}
                >
                  {difficulty}
                </span>
              )}

              {topic && (
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                  {topic}
                </span>
              )}

              {company && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  {company}
                </span>
              )}
            </div>

            <h1 className="mt-5 text-2xl font-bold leading-tight tracking-tight text-slate-900 sm:text-3xl">
              {title}
            </h1>

            <p className="mt-3 text-sm text-slate-500">
              Review the problem carefully and try solving it before checking
              the external resource.
            </p>
          </div>

          {/* Question content */}
          <div className="p-6 sm:p-8">
            <section>
              <h2 className="text-lg font-semibold text-slate-900">
                Problem Description
              </h2>

              <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600 sm:text-base">
                {description || "No description provided."}
              </p>
            </section>

            {/* Progress actions */}
            <section className="mt-8 border-t border-slate-200 pt-6">
              <h2 className="text-sm font-semibold text-slate-900">
                Your Progress
              </h2>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => updateProgress("isSolved")}
                  aria-pressed={progress.isSolved}
                  className={`rounded-xl px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                    progress.isSolved
                      ? "bg-green-100 text-green-800 hover:bg-green-200"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {progress.isSolved
                    ? "✓ Solved"
                    : "Mark as Solved"}
                </button>

                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => updateProgress("isBookmarked")}
                  aria-pressed={progress.isBookmarked}
                  className={`rounded-xl border px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                    progress.isBookmarked
                      ? "border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100"
                      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {progress.isBookmarked
                    ? "★ Bookmarked"
                    : "☆ Bookmark"}
                </button>
              </div>

              {isUpdating && (
                <p className="mt-3 text-sm text-slate-500">
                  Saving your progress...
                </p>
              )}

              {updateMessage && (
                <p role="status" className="mt-3 text-sm text-green-700">
                  {updateMessage}
                </p>
              )}

              {error && (
                <p role="alert" className="mt-3 text-sm text-red-600">
                  {error}
                </p>
              )}
            </section>

            {/* Tags */}
            {tags.length > 0 && (
              <section className="mt-8">
                <h2 className="text-sm font-semibold text-slate-900">
                  Related Tags
                </h2>

                <div className="mt-3 flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span
                      key={`${tag}-${index}`}
                      className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* External practice link */}
            {externalLink && (
              <section className="mt-8 border-t border-slate-200 pt-6">
                <h2 className="text-sm font-semibold text-slate-900">
                  Practice Resource
                </h2>

                <a
                  href={externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Solve This Question
                  <span aria-hidden="true">↗</span>
                </a>
              </section>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}

export default QuestionDetails;
