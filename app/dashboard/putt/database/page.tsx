"use client";

import { useEffect, useState, useMemo } from "react";

export default function PutterDatabasePage() {
    const [data, setData] = useState<any[]>([]);
    const [query, setQuery] = useState("");
    const [month, setMonth] = useState("");
    const [day, setDay] = useState("");
    const [showModal, setShowModal] = useState(false);

    const [form, setForm] = useState({
        distance: "",
        totalPutts: 20,
        perfectMakes: "",
        goodMakes: "",
        misses: "",
        notes: "",
        date: "",
    });

    // 🔹 Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            const url = new URL("/api/putter", window.location.origin);
            if (query) url.searchParams.set("q", query);
            if (month) url.searchParams.set("month", month);
            if (day) url.searchParams.set("day", day);

            const res = await fetch(url.toString());
            const json = await res.json();
            setData(json);
        };
        fetchData();
    }, [query, month, day]);

    // 🔹 Delete Row
    const handleDelete = async (id: string) => {
        if (!confirm("Delete this entry?")) return;
        const res = await fetch(`/api/putter/${id}`, { method: "DELETE" });
        if (res.ok) setData((prev) => prev.filter((s) => s.id !== id));
    };

    // 🔹 Add New Entry
    const handleAdd = async () => {
        try {
            const res = await fetch("/api/putter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (res.ok) {
                const newShot = await res.json();
                setData((prev) => [newShot, ...prev]);
                setShowModal(false);
                setForm({
                    distance: "",
                    totalPutts: 20,
                    perfectMakes: "",
                    goodMakes: "",
                    misses: "",
                    notes: "",
                    date: "",
                });
            } else {
                alert("Failed to add record.");
            }
        } catch (err) {
            console.error("Error adding putter entry:", err);
        }
    };

    // 🔹 Derived stats
    const computed = useMemo(() => {
        return data.map((s) => {
            const total = s.totalPutts || 20;
            const perfectPct = ((s.perfectMakes / total) * 100).toFixed(0);
            const makePct = (((s.perfectMakes + s.goodMakes) / total) * 100).toFixed(0);
            return { ...s, perfectPct, makePct };
        });
    }, [data]);

    return (
        <div className="p-8 text-white">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-oswald text-brand-orange">Putter Practice Log</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-brand-orange hover:bg-orange-500 text-black font-semibold px-4 py-2 rounded-md"
                >
                    + Add Entry
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search notes…"
                    className="px-3 py-2 rounded-md bg-zinc-800 text-white focus:ring-2 focus:ring-brand-orange"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="px-3 py-2 rounded-md bg-zinc-800 text-white"
                >
                    <option value="">All Months</option>
                    {[...Array(12)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                            {new Date(0, i).toLocaleString("default", { month: "long" })}
                        </option>
                    ))}
                </select>
                <input
                    type="date"
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    className="px-3 py-2 rounded-md bg-zinc-800 text-white"
                />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-zinc-800 text-sm">
                    <thead className="bg-zinc-950">
                    <tr>
                        <th className="border border-zinc-800 px-3 py-2">Date</th>
                        <th className="border border-zinc-800 px-3 py-2">Distance</th>
                        <th className="border border-zinc-800 px-3 py-2">Perfect</th>
                        <th className="border border-zinc-800 px-3 py-2">Good</th>
                        <th className="border border-zinc-800 px-3 py-2">Miss</th>
                        <th className="border border-zinc-800 px-3 py-2">% Perfect</th>
                        <th className="border border-zinc-800 px-3 py-2">% Make</th>
                        <th className="border border-zinc-800 px-3 py-2">Notes</th>
                        <th className="border border-zinc-800 px-3 py-2 text-center">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {computed.length === 0 ? (
                        <tr>
                            <td colSpan={9} className="text-center text-zinc-400 py-6">
                                No results found
                            </td>
                        </tr>
                    ) : (
                        computed.map((shot) => (
                            <tr key={shot.id} className="hover:bg-zinc-800/40 transition">
                                <td className="border border-zinc-800 px-3 py-2">
                                    {new Date(shot.createdAt).toLocaleDateString()}
                                </td>
                                <td className="border border-zinc-800 px-3 py-2">{shot.distance}</td>
                                <td className="border border-zinc-800 px-3 py-2 text-emerald-400">
                                    {shot.perfectMakes}
                                </td>
                                <td className="border border-zinc-800 px-3 py-2 text-sky-400">
                                    {shot.goodMakes}
                                </td>
                                <td className="border border-zinc-800 px-3 py-2 text-rose-400">
                                    {shot.misses}
                                </td>
                                <td className="border border-zinc-800 px-3 py-2">{shot.perfectPct}%</td>
                                <td className="border border-zinc-800 px-3 py-2">{shot.makePct}%</td>
                                <td className="border border-zinc-800 px-3 py-2 text-zinc-300">
                                    {shot.notes || "-"}
                                </td>
                                <td className="border border-zinc-800 px-3 py-2 text-center">
                                    <button
                                        onClick={() => handleDelete(shot.id)}
                                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-xs"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-zinc-900 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] flex flex-col">
                        {/* Header */}
                        <div className="flex justify-between items-center p-4 border-b border-zinc-800">
                            <h2 className="text-xl font-semibold text-brand-orange">Add Putter Session</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-zinc-400 hover:text-white text-lg"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Body */}
                        <div className="overflow-y-auto p-6 space-y-3">
                            <div>
                                <label className="block text-sm text-zinc-400 mb-1">Distance</label>
                                <select
                                    value={form.distance}
                                    onChange={(e) => setForm({ ...form, distance: e.target.value })}
                                    className="w-full px-3 py-2 bg-zinc-800 rounded-md text-white focus:ring-2 focus:ring-brand-orange"
                                >
                                    <option value="">Select</option>
                                    {["1m", "1.5m", "2m"].map((d) => (
                                        <option key={d} value={d}>
                                            {d}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <Field label="Perfect Makes" keyName="perfectMakes" form={form} setForm={setForm} />
                                <Field label="Good Makes" keyName="goodMakes" form={form} setForm={setForm} />
                                <Field label="Misses" keyName="misses" form={form} setForm={setForm} />
                            </div>

                            <div>
                                <label className="block text-sm text-zinc-400 mb-1">Notes</label>
                                <input
                                    type="text"
                                    value={form.notes}
                                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                    className="w-full px-3 py-2 bg-zinc-800 rounded-md text-white focus:ring-2 focus:ring-brand-orange"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-zinc-400 mb-1">Date</label>
                                <input
                                    type="datetime-local"
                                    value={form.date}
                                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                                    className="w-full px-3 py-2 bg-zinc-800 rounded-md text-white focus:ring-2 focus:ring-brand-orange"
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-3 p-4 border-t border-zinc-800">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-zinc-700 rounded-md hover:bg-zinc-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAdd}
                                className="px-4 py-2 bg-brand-orange text-black font-semibold rounded-md hover:bg-orange-500"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* Helper component */
function Field({
                   label,
                   keyName,
                   form,
                   setForm,
               }: {
    label: string;
    keyName: string;
    form: any;
    setForm: any;
}) {
    return (
        <div>
            <label className="block text-sm text-zinc-400 mb-1">{label}</label>
            <input
                type="number"
                value={form[keyName]}
                onChange={(e) => setForm({ ...form, [keyName]: e.target.value })}
                className="w-full px-3 py-2 bg-zinc-800 rounded-md text-white focus:ring-2 focus:ring-brand-orange"
            />
        </div>
    );
}
