"use client";

import { useEffect, useState } from "react";


export default function IronsDatabasePage() {




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
        smash: "", // 👈 új mező
        spin: "",
        launchDeg: "",
        result: "",
        date: "", // <-- ide jön a kézi dátum (ISO-ish string)
    });

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            const url = new URL("/api/irons", window.location.origin);
            if (query) url.searchParams.set("q", query);
            if (month) url.searchParams.set("month", month);
            if (day) url.searchParams.set("day", day);

            const res = await fetch(url.toString());
            const json = await res.json();
            setData(json);
        };
        fetchData();
    }, [query, month, day]);

    // Delete row
    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this shot?")) return;

        const res = await fetch(`/api/irons/${id}`, { method: "DELETE" });

        if (res.ok) {
            setData((prev) => prev.filter((s) => s.id !== id));
        } else {
            alert("Failed to delete record.");
        }
    };

    // Add new shot
    const handleAdd = async () => {
        try {
            const res = await fetch("/api/irons", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form), // 👈 az egész form-ot küldjük
            });

            if (res.ok) {
                const newShot = await res.json();
                setData((prev) => [newShot, ...prev]);
                setShowModal(false);

                // ✅ Itt ne használj "club" stb. változókat, hanem reseteld direkt
                setForm({
                    club: "",
                    carry: "",
                    total: "",
                    ballSpeed: "",
                    clubSpeed: "",
                    smash: "",
                    spin: "",
                    launchDeg: "",
                    result: "",
                    date: "", // ha van dátummező

                });
            } else {
                alert("Failed to add record.");
            }
        } catch (err) {
            console.error("Error adding shot:", err);
            alert("Error adding shot");
        }
    };

    return (
        <div className="p-8 text-white">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-oswald text-brand-orange">Irons Database</h1>
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
                    className="px-3 py-2 rounded-md bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-brand-orange"
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
                        <th className="border border-zinc-800 px-3 py-2">Club</th>
                        <th className="border border-zinc-800 px-3 py-2">Carry</th>
                        <th className="border border-zinc-800 px-3 py-2">Total</th>
                        <th className="border border-zinc-800 px-3 py-2">Ball Speed</th>
                        <th className="border border-zinc-800 px-3 py-2">Club Speed</th>
                        <th className="border border-zinc-800 px-3 py-2">Smash</th>
                        <th className="border border-zinc-800 px-3 py-2">Spin</th>
                        <th className="border border-zinc-800 px-3 py-2">Launch</th>
                        <th className="border border-zinc-800 px-3 py-2">Result</th>
                        <th className="border border-zinc-800 px-3 py-2">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.length === 0 && (
                        <tr>
                            <td colSpan={9} className="text-center text-zinc-400 py-6">
                                No results found
                            </td>
                        </tr>
                    )}
                    {data.map((shot) => (
                        <tr key={shot.id} className="hover:bg-zinc-800/40 transition">
                            <td className="border border-zinc-800 px-3 py-2">
                                {new Date(shot.createdAt).toLocaleDateString()}
                            </td>
                            <td className="border border-zinc-800 px-3 py-2">{shot.club}</td>
                            <td className="border border-zinc-800 px-3 py-2">{shot.carry}</td>
                            <td className="border border-zinc-800 px-3 py-2">{shot.total}</td>
                            <td className="border border-zinc-800 px-3 py-2">{shot.ballSpeed}</td>
                            <td className="border border-zinc-800 px-3 py-2">{shot.clubSpeed}</td>
                            <td className="border border-zinc-800 px-3 py-2">{shot.smash}</td>
                            <td className="border border-zinc-800 px-3 py-2">{shot.spin}</td>
                            <td className="border border-zinc-800 px-3 py-2">{shot.launchDeg}</td>
                            <td className="border border-zinc-800 px-3 py-2">{shot.result}</td>
                            <td className="border border-zinc-800 px-3 py-2 text-center">
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

            {showModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div
                        className="bg-zinc-900 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center p-4 border-b border-zinc-800">
                            <h2 className="text-xl font-semibold text-brand-orange">Add New Shot</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-zinc-400 hover:text-white text-lg"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Scrollable body */}
                        <div className="overflow-y-auto p-6 space-y-3">
                            {/* Club */}
                            <div>
                                <label className="block text-sm text-zinc-400 mb-1">Club</label>
                                <select
                                    value={form.club}
                                    onChange={(e) => setForm({ ...form, club: e.target.value })}
                                    className="w-full px-3 py-2 bg-zinc-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-brand-orange"
                                >
                                    <option value="">Select Club</option>
                                    {["IRON_5", "IRON_6", "IRON_7", "IRON_8", "IRON_9", "PW"].map((club) => (
                                        <option key={club} value={club}>{club}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Carry */}
                            <div>
                                <label className="block text-sm text-zinc-400 mb-1">Carry</label>
                                <input
                                    type="number"
                                    value={form.carry}
                                    onChange={(e) => setForm({ ...form, carry: e.target.value })}
                                    className="w-full px-3 py-2 bg-zinc-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-brand-orange"
                                />
                            </div>

                            {/* Total */}
                            <div>
                                <label className="block text-sm text-zinc-400 mb-1">Total</label>
                                <input
                                    type="number"
                                    value={form.total}
                                    onChange={(e) => setForm({ ...form, total: e.target.value })}
                                    className="w-full px-3 py-2 bg-zinc-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-brand-orange"
                                />
                            </div>

                            {/* Club Speed */}
                            <div>
                                <label className="block text-sm text-zinc-400 mb-1">Club Speed</label>
                                <input
                                    type="number"
                                    value={form.clubSpeed}
                                    onChange={(e) => setForm({ ...form, clubSpeed: e.target.value })}
                                    className="w-full px-3 py-2 bg-zinc-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-brand-orange"
                                />
                            </div>

                            {/* Ball Speed */}
                            <div>
                                <label className="block text-sm text-zinc-400 mb-1">Ball Speed</label>
                                <input
                                    type="number"
                                    value={form.ballSpeed}
                                    onChange={(e) => setForm({ ...form, ballSpeed: e.target.value })}
                                    className="w-full px-3 py-2 bg-zinc-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-brand-orange"
                                />
                            </div>


                            {/* Smash Factor */}
                            <div>
                                <label className="block text-sm text-zinc-400 mb-1">Smash</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={form.smash}
                                    onChange={(e) => setForm({ ...form, smash: e.target.value })}
                                    className="w-full px-3 py-2 bg-zinc-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-brand-orange"
                                />
                            </div>

                            {/* Launch */}
                            <div>
                                <label className="block text-sm text-zinc-400 mb-1">Launch</label>
                                <input
                                    type="number"
                                    value={form.launchDeg}
                                    onChange={(e) => setForm({ ...form, launchDeg: e.target.value })}
                                    className="w-full px-3 py-2 bg-zinc-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-brand-orange"
                                />
                            </div>

                            {/* Spin */}
                            <div>
                                <label className="block text-sm text-zinc-400 mb-1">Spin</label>
                                <input
                                    type="number"
                                    value={form.spin}
                                    onChange={(e) => setForm({ ...form, spin: e.target.value })}
                                    className="w-full px-3 py-2 bg-zinc-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-brand-orange"
                                />
                            </div>


                            {/* Result */}
                            <div>
                                <label className="block text-sm text-zinc-400 mb-1">Result</label>
                                <input
                                    type="text"
                                    value={form.result}
                                    onChange={(e) => setForm({ ...form, result: e.target.value })}
                                    className="w-full px-3 py-2 bg-zinc-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-brand-orange"
                                />
                            </div>

                            {/* Date */}
                            <div>
                                <label className="block text-sm text-zinc-400 mb-1">Date</label>
                                <input
                                    type="datetime-local"
                                    value={form.date}
                                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                                    className="w-full px-3 py-2 bg-zinc-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-brand-orange"
                                />
                            </div>
                        </div>

                        {/* Footer buttons */}
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
