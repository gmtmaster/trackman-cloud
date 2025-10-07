"use client";

import { useState, useEffect, useMemo } from "react";
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import Link from "next/link";

export default function DriverPage() {
    const [tab, setTab] = useState<"DRIVER" | "WOOD_3" | "WOOD_5" | "HYBRID">("DRIVER");
    const [shots, setShots] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchShots = async () => {
            try {
                const res = await fetch("/api/driver");
                const data = await res.json();
                setShots(data || []);
            } catch (err) {
                console.error("Error fetching driver data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchShots();
    }, []);

    const filtered = useMemo(() => {
        if (shots.length === 0) return [];
        const normalize = (club: string) => club?.trim()?.toUpperCase().replace(/\s+/g, "_");
        return shots
            .filter((s) => normalize(s.club) === tab)
            .map((s) => ({
                session: new Date(s.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                }),
                carry: s.carry,
                total: s.total,
                ballSpeed: s.ballSpeed,
                spin: s.spin,
                clubSpeed: s.clubSpeed,
                smash: s.smash,
                offline: s.offlineM ? Math.abs(s.offlineM) : 0,
            }));
    }, [shots, tab]);

    const stats = useMemo(() => {
        if (filtered.length === 0) return null;
        const carryArr = filtered.map((s) => s.carry || 0);
        const avg = (carryArr.reduce((a, b) => a + b, 0) / carryArr.length).toFixed(1);
        const max = Math.max(...carryArr);
        const min = Math.min(...carryArr);
        const consistency = Math.max(0, (1 - (max - min) / Number(avg)) * 100).toFixed(0);
        return { avg, max, min, consistency };
    }, [filtered]);

    return (
        <div className="min-h-screen bg-zinc-900 text-white p-8 font-sans">
            <h1 className="text-3xl font-oswald text-brand-orange mb-6">
                Driver & Woods Performance
            </h1>

            <div className="flex flex-wrap gap-3 mb-10">
                {["DRIVER", "3W", "5W", "HYBRID"].map((club) => (
                    <button
                        key={club}
                        onClick={() => setTab(club as any)}
                        className={`px-4 py-2 rounded-md font-oswald tracking-wide ${
                            tab === club
                                ? "bg-brand-orange text-white"
                                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                        }`}
                    >
                        {club}
                    </button>
                ))}
            </div>

            {loading ? (
                <p className="text-zinc-400">Loading data...</p>
            ) : filtered.length === 0 ? (
                <p className="text-zinc-500">No data for {tab} yet.</p>
            ) : (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <KPI label="Average Carry" value={`${stats?.avg} m`} />
                        <KPI label="Max Carry" value={`${stats?.max} m`} />
                        <KPI label="Min Carry" value={`${stats?.min} m`} />
                        <KPI label="Consistency" value={`${stats?.consistency}%`} highlight />
                    </div>

                    <div className="bg-zinc-950/70 rounded-xl p-6 border border-zinc-800 mb-8 ">
                        <h2 className="font-oswald text-xl mb-3 text-brand-orange">Quick Insights</h2>
                        <ul className="space-y-2 text-sm text-zinc-300">
                            <li>🏌️‍♂️ <b>Ball Speed:</b> {(filtered.reduce((a, b) => a + (b.ballSpeed || 0), 0) / filtered.length).toFixed(1)} km/h average.</li>
                            <li>⚡ <b>Club Speed:</b> {(filtered.reduce((a, b) => a + (b.clubSpeed || 0), 0) / filtered.length).toFixed(1)} km/h average.</li>
                            <li>🔥 <b>Smash Factor:</b> {(filtered.reduce((a, b) => a + (b.smash || 0), 0) / filtered.length).toFixed(2)} average.</li>
                            <li>🎯 <b>Offline Accuracy:</b> {(filtered.reduce((a, b) => a + (b.offline || 0), 0) / filtered.length).toFixed(1)} m average deviation.</li>
                        </ul>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 mb-10">
                        <ChartBox title="Carry Distance (m)">
                            <LineGraph data={filtered} dataKey="carry" color="#f97316" />
                        </ChartBox>
                        <ChartBox title="Ball Speed (km/h)">
                            <LineGraph data={filtered} dataKey="ballSpeed" color="#22c55e" />
                        </ChartBox>
                        <ChartBox title="Club Speed (km/h)">
                            <LineGraph data={filtered} dataKey="clubSpeed" color="#eab308" />
                        </ChartBox>
                        <ChartBox title="Smash Factor">
                            <LineGraph data={filtered} dataKey="smash" color="#3b82f6" />
                        </ChartBox>
                    </div>
                </>
            )}

            <div className="mt-10 text-right">
                <Link
                    href="/dashboard/driver/database"
                    className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md font-oswald text-brand-orange border border-zinc-700 inline-block"
                >
                    View Raw Database
                </Link>
            </div>
        </div>
    );
}

/* --- Shared Components --- */
function KPI({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
    return (
        <div
            className={`rounded-xl p-4 text-center border ${
                highlight
                    ? "bg-emerald-500/10 border-emerald-400/30 text-emerald-300"
                    : "bg-zinc-950/60 border-zinc-800"
            }`}
        >
            <div className="text-sm text-zinc-400">{label}</div>
            <div className="text-2xl font-bold mt-1">{value}</div>
        </div>
    );
}

function ChartBox({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="bg-zinc-950/80 p-6 rounded-xl border border-zinc-800 shadow-md">
            <h2 className="text-lg font-oswald mb-4">{title}</h2>
            {children}
        </div>
    );
}

function LineGraph({ data, dataKey, color }: { data: any[]; dataKey: string; color: string }) {
    return (
        <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="session" stroke="#999" />
                <YAxis stroke="#999" />
                <Tooltip
                    contentStyle={{ backgroundColor: "#18181b", borderColor: "#3f3f46" }}
                    labelStyle={{ color: "#e5e5e5" }}
                    itemStyle={{ color }}
                />
                <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={false} />
            </LineChart>
        </ResponsiveContainer>
    );
}
