export default function Input({ label, id, className = "", ...props }) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-slate-700" htmlFor={id}>
      {label}
      <input
        id={id}
        className={`min-h-10 rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-200 ${className}`}
        {...props}
      />
    </label>
  );
}
