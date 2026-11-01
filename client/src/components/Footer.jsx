import {Link} from "react-router-dom";

function Footer() {
    return (
      <footer className="border-t border-slate-200 bg-slate-100 px-4 py-10 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
            {/* Brand and logo */}
            <div>
              <a
                href="/"
                aria-label="CampusHire home"
                className="inline-flex items-center gap-3"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-700 text-white shadow-sm">
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
  
                <span className="text-2xl font-bold tracking-tight text-slate-900">
                  Campus<span className="text-blue-700">Hire</span>
                </span>
              </a>
  
              <p className="mt-4 max-w-sm text-sm leading-6 text-slate-600">
                Your journey to a successful placement starts here.
                Learn, practice, and grow with confidence.
              </p>
            </div>
  
            {/* Features link */}
            <Link
              to="/#features"
              className="group inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-blue-300 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              Explore features
  
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 transition-transform group-hover:-translate-y-0.5"
                aria-hidden="true"
              >
                <path d="M7 17 17 7" />
                <path d="M7 7h10v10" />
              </svg>
            </Link>
          </div>
  
          {/* Copyright */}
          <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-slate-200 pt-5 text-center text-sm text-slate-500 sm:flex-row sm:text-left">
            <p>
              © {new Date().getFullYear()} CampusHire. All rights reserved.
            </p>
  
            <p className="inline-flex items-center gap-1.5">
              Built for your next opportunity
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1D4ED8"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
              </svg>
            </p>
          </div>
        </div>
      </footer>
    );
  }
  
  export default Footer;
  