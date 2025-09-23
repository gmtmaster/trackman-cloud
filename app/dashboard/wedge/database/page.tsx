"use client";

import { useEffect, useState } from "react";

export default function WedgeDatabasePage() {
    const [data, setData] = useState<any[]>([]);
    const [query, setQuery] = useState("");
    const [month, setMonth] = useState("");
    const [day, setDay] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const url = new URL("/api/wedge", window.location.origin);
            if (query) url.searchParams.set("q", query);
            if (month) url.searchParams.set("month", month);
            if (day) url.searchParams.set("day", day);

            const res = await fetch(url.toString());
            const json = await res.json();
            setData(json);
        };
        fetchData();
    }, [query, month, day]);

    return (
        <div className="p-8 text-white">
            <h1 className="text-2xl font-oswald text-brand-orange mb-6">Wedge Database</h1>

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
                        <th className="border border-zinc-800 px-3 py-2">Spin</th>
                        <th className="border border-zinc-800 px-3 py-2">Launch</th>
                        <th className="border border-zinc-800 px-3 py-2">Result</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.length === 0 && (
                        <tr>
                            <td
                                colSpan={8}
                                className="text-center text-zinc-400 py-6"
                            >
                                No results found
                            </td>
                        </tr>
                    )}
                    {data.map((shot, i) => (
                        <tr key={i} className="hover:bg-zinc-800/40 transition">
                            <td className="border border-zinc-800 px-3 py-2">
                                {new Date(shot.createdAt).toLocaleDateString()}
                            </td>
                            <td className="border border-zinc-800 px-3 py-2">{shot.club}</td>
                            <td className="border border-zinc-800 px-3 py-2">{shot.carry}</td>
                            <td className="border border-zinc-800 px-3 py-2">{shot.total}</td>
                            <td className="border border-zinc-800 px-3 py-2">{shot.ballSpeed}</td>
                            <td className="border border-zinc-800 px-3 py-2">{shot.spin}</td>
                            <td className="border border-zinc-800 px-3 py-2">{shot.launchDeg}</td>
                            <td className="border border-zinc-800 px-3 py-2">{shot.result}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
