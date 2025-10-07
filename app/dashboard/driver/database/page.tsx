"use client";

import { useEffect, useState } from "react";

export default function DriverDatabasePage() {
    const [data, setData] = useState<any[]>([]);
    const [query, setQuery] = useState("");
    const [month, setMonth] = useState("");
    const [day, setDay] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        club: "",
        carry: "",
        total: "",
        ballSpeed: "",
        clubSpeed: "",
        smash: "",
        spin: "",
        launchDeg: "",
        offlineM: "",
        result: "",
        date: "",
    });

    // Fetch
    useEffect(() => {
        const fetchData = async () => {
            const url = new URL("/api/driver", window.location.origin);
            if (query) url.searchParams.set("q", query);
            if (month) url.searchParams.set("month", month);
            if (day) url.searchParams.set("day", day);

            const res = await fetch(url.toString());
            const json = await res.json();
            setData(json);
        };
        fetchData();
    }, [query, month, day]);

    // Delete
    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this shot?")) return;
        const res = await fetch(`/api/driver/${id}`, { method: "DELETE" });
        if (res.ok) setData((prev) => prev.filter((s) => s.id !== id));
    };

    // Add new
    const handleAdd = async () => {
        try {
            const res = await fetch("/api/driver", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                const newShot = await res.json();
                setData((prev) => [newShot, ...prev]);
                setShowModal(false);
                setForm({
                    club: "",
                    carry: "",
                    total: "",
                    ballSpeed: "",
                    clubSpeed: "",
                    smash: "",
                    spin: "",
                    launchDeg: "",
                    offlineM: "",
                    result: "",
                    date: "",
                });
            } else alert("Failed to add record.");
        } catch (err) {
            console.error(err);
            alert("Error adding shot");
        }
    };

    return (
        <div className="p-8 text-white">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-oswald text-brand-orange">Driver Database</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-brand-orange hover:bg-orange-500 text-black font-semibold px-4 py-2 rounded-md"
                >
                    + Add New Shot
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search…"
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
                        <th className="border px-3 py-2">Date</th>
                        <th className="border px-3 py-2">Club</th>
                        <th className="border px-3 py-2">Carry</th>
                        <th className="border px-3 py-2">Total</th>
                        <th className="border px-3 py-2">Ball Speed</th>
                        <th className="border px-3 py-2">Club Speed</th>
                        <th className="border px-3 py-2">Smash</th>
                        <th className="border px-3 py-2">Spin</th>
                        <th className="border px-3 py-2">Launch</th>
                        <th className="border px-3 py-2">Offline</th>
                        <th className="border px-3 py-2">Result</th>
                        <th className="border px-3 py-2">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.length === 0 && (
                        <tr>
                            <td colSpan={12} className="text-center text-zinc-400 py-6">
                                No results found
                            </td>
                        </tr>
                    )}
                    {data.map((shot) => (
                        <tr key={shot.id} className="hover:bg-zinc-800/40 transition">
                            <td className="border px-3 py-2">{new Date(shot.createdAt).toLocaleDateString()}</td>
                            <td className="border px-3 py-2">{shot.club}</td>
                            <td className="border px-3 py-2">{shot.carry}</td>
                            <td className="border px-3 py-2">{shot.total}</td>
                            <td className="border px-3 py-2">{shot.ballSpeed}</td>
                            <td className="border px-3 py-2">{shot.clubSpeed}</td>
                            <td className="border px-3 py-2">{shot.smash}</td>
                            <td className="border px-3 py-2">{shot.spin}</td>
                            <td className="border px-3 py-2">{shot.launchDeg}</td>
                            <td className="border px-3 py-2">{shot.offlineM}</td>
                            <td className="border px-3 py-2">{shot.result}</td>
                            <td className="border px-3 py-2 text-center">
                                <button
                                    onClick={() => handleDelete(shot.id)}
                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-xs"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <Modal form={form} setForm={setForm} setShowModal={setShowModal} handleAdd={handleAdd} />
            )}
        </div>
    );
}

/* --- Modal Component --- */
function Modal({ form, setForm, setShowModal, handleAdd }: any) {
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-zinc-900 rounded-lg w-full max-w-md max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b border-zinc-800">
                    <h2 className="text-xl font-semibold text-brand-orange">Add New Shot</h2>
                    <button onClick={() => setShowModal(false)} className="text-zinc-400 hover:text-white text-lg">
                        ✕
                    </button>
                </div>

                <div className="overflow-y-auto p-6 space-y-3">
                    {[
                        { label: "Club", key: "club", type: "select", options: ["DRIVER", "3W", "5W", "HYBRID"] },
                        { label: "Carry", key: "carry" },
                        { label: "Total", key: "total" },
                        { label: "Club Speed", key: "clubSpeed" },
                        { label: "Ball Speed", key: "ballSpeed" },

                        { label: "Smash", key: "smash" },
                        { label: "Launch (°)", key: "launchDeg" },
                        { label: "Spin", key: "spin" },

                        { label: "Offline (m)", key: "offlineM" },
                        { label: "Result", key: "result" },
                        { label: "Date", key: "date", type: "datetime-local" },
                    ].map((f) => (
                        <div key={f.key}>
                            <label className="block text-sm text-zinc-400 mb-1">{f.label}</label>
                            {f.type === "select" ? (
                                <select
                                    value={form[f.key]}
                                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                                    className="w-full px-3 py-2 bg-zinc-800 rounded-md text-white focus:ring-2 focus:ring-brand-orange"
                                >
                                    <option value="">Select</option>
                                    {f.options?.map((opt) => (
                                        <option key={opt} value={opt}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type={f.type || "number"}
                                    step="0.01"
                                    value={form[f.key]}
                                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                                    className="w-full px-3 py-2 bg-zinc-800 rounded-md text-white focus:ring-2 focus:ring-brand-orange"
                                />
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex justify-end gap-3 p-4 border-t border-zinc-800">
                    <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-zinc-700 rounded-md hover:bg-zinc-600">
                        Cancel
                    </button>
                    <button onClick={handleAdd} className="px-4 py-2 bg-brand-orange text-black font-semibold rounded-md hover:bg-orange-500">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
