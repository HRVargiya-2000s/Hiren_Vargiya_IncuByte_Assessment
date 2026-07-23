export default function SearchBar({ value, onChange }) {
  return (
    <label className="grid gap-1 text-sm font-medium text-slate-700" htmlFor="vehicle-search">
      Search vehicles
      <input
        id="vehicle-search"
        className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 shadow-sm outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
        placeholder="Search by make, model or category"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
