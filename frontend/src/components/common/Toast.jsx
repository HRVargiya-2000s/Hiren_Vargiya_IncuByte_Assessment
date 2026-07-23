export default function Toast({ message, type = "success" }) {
  if (!message) return null;

  const styles = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
    error: "border-red-200 bg-red-50 text-red-800",
  };

  return (
    <div
      className={`fixed right-4 top-20 z-50 flex min-w-64 items-start gap-3 rounded-lg border px-4 py-3 text-sm font-medium shadow-lg ${styles[type]}`}
      role="status"
    >
      <span className="rounded-full bg-white/70 px-2 py-0.5 text-xs uppercase tracking-wide">
        {type}
      </span>
      <span>{message}</span>
    </div>
  );
}
