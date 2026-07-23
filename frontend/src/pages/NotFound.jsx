import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 px-4">
      <section className="rounded-lg bg-white p-6 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Page not found</h1>
        <Link className="mt-4 inline-block text-sm font-medium text-slate-900" to="/dashboard">
          Back to dashboard
        </Link>
      </section>
    </main>
  );
}
