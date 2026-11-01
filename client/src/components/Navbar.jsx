import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { isLoggedIn, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  function handleLogout() {
    logout();
    setShowLogoutConfirm(false);
    navigate("/");
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <nav
          aria-label="Main navigation"
          className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-8"
        >
          <Link
            to="/"
            aria-label="CampusHire home"
            className="inline-flex shrink-0 items-center gap-2.5"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <path d="m2 9 10-5 10 5-10 5L2 9Z" />
                <path d="M6 11v5c3.5 2.7 8.5 2.7 12 0v-5" />
                <path d="M22 9v6" />
              </svg>
            </span>

            <span className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Campus<span className="text-blue-700">Hire</span>
            </span>
          </Link>

          <div className="flex items-center gap-4 sm:gap-8">
            {isLoggedIn ? (
              <>
                <Link
                  to="/questions"
                  className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-700"
                >
                  Questions
                </Link>

                <Link
                  to="/dashboard"
                  className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-700"
                >
                  Dashboard
                </Link>

                {!isAdmin && (
                  <Link
                    to="/bookmarks"
                    className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-700"
                  >
                    Bookmarks
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(true)}
                  className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-700"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 sm:px-5"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
            aria-describedby="logout-description"
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <path d="M10 17l5-5-5-5" />
                <path d="M15 12H3" />
                <path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" />
              </svg>
            </div>

            <h2
              id="logout-title"
              className="mt-4 text-xl font-bold text-slate-900"
            >
              Confirm Logout
            </h2>

            <p
              id="logout-description"
              className="mt-2 text-sm leading-6 text-slate-600"
            >
              Are you sure you want to log out of CampusHire?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;