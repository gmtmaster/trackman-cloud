"use client";

import { useEffect, useMemo, useState } from "react";
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

export default function PutterPage() {
    const [shots, setShots] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/putter");
                const data = await res.json();
                setShots(data || []);
            } catch (err) {
                console.error("Error fetching putter data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // ✅ Process data per date and distance
    const processed = useMemo(() => {
        if (!shots.length) return [];
        return shots.map((s) => {
            const total = s.totalPutts || 20;
            const perfectPct = ((s.perfectMakes / total) * 100).toFixed(0);
            const makePct = (((s.perfectMakes + s.goodMakes) / total) * 100).toFixed(0);
            return {
                session: new Date(s.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                }),
                distance: s.distance,
                perfectPct: Number(perfectPct),
                makePct: Number(makePct),
            };
        });
    }, [shots]);

    // ✅ Separate data by distance
    const byDistance = useMemo(() => {
        const groups: Record<string, any[]> = {};
        for (const s of processed) {
            if (!groups[s.distance]) groups[s.distance] = [];
            groups[s.distance].push(s);
        }
        return groups;
    }, [processed]);

    // ✅ Summary KPIs (averages per distance)
    const stats = useMemo(() => {
        const distances = ["1m", "1.5m", "2m"];
        return distances.map((dist) => {
            const filtered = processed.filter((s) => s.distance === dist);
            if (!filtered.length) return { distance: dist, perfect: 0, make: 0 };
            const avgPerfect =
                filtered.reduce((a, b) => a + b.perfectPct, 0) / filtered.length;
            const avgMake =
                filtered.reduce((a, b) => a + b.makePct, 0) / filtered.length;
            return { distance: dist, perfect: avgPerfect, make: avgMake };
        });
    }, [processed]);

    return (
        <div className="min-h-screen bg-zinc-900 text-white p-8 font-sans">
            <h1 className="text-3xl font-oswald text-brand-orange mb-6">
                Putter Practice Overview
            </h1>

            {loading ? (
                <p className="text-zinc-400">Loading data...</p>
            ) : !shots.length ? (
                <p className="text-zinc-500">No putter data yet.</p>
            ) : (
                <>
                    {/* 🔹 KPI Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                        {stats.map((s) => (
                            <div
                                key={s.distance}
                                className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-4 text-center"
                            >
                                <h2 className="text-xl font-oswald text-brand-orange mb-2">
                                    {s.distance}
                                </h2>
                                <div className="text-zinc-300 text-sm mb-1">
                                    Avg Perfect %
                                </div>
                                <div className="text-3xl font-bold text-emerald-400">
                                    {s.perfect.toFixed(0)}%
                                </div>
                                <div className="text-zinc-300 text-sm mt-2 mb-1">
                                    Avg Make %
                                </div>
                                <div className="text-2xl font-bold text-sky-400">
                                    {s.make.toFixed(0)}%
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 🔹 Line Charts per distance */}
                    <div className="grid md:grid-cols-3 gap-8">
                        {Object.keys(byDistance).map((dist) => (
                            <ChartBox key={dist} title={`${dist} — % Perfect`}>
                                <LineGraph
                                    data={byDistance[dist]}
                                    dataKey="perfectPct"
                                    color="#22c55e"
                                />
                            </ChartBox>
                        ))}

                        {Object.keys(byDistance).map((dist) => (
                            <ChartBox key={dist + "-make"} title={`${dist} — % Make`}>
                                <LineGraph
                                    data={byDistance[dist]}
                                    dataKey="makePct"
                                    color="#3b82f6"
                                />
                            </ChartBox>
                        ))}
                    </div>

                    {/* 🔹 Quick Insights */}
                    <div className="bg-zinc-950/70 rounded-xl p-6 border border-zinc-800 mt-10">
                        <h2 className="font-oswald text-xl mb-3 text-brand-orange">
                            Practice Summary
                        </h2>
                        <ul className="space-y-2 text-sm text-zinc-300">
                            <li>
                                🎯 You’ve logged{" "}
                                <b>{shots.length}</b> total sessions with recorded distances.
                            </li>
                            <li>
                                🟢 Your best average perfect rate:{" "}
                                <b>
                                    {
                                        stats.reduce(
                                            (a, b) =>
                                                a.perfect > b.perfect ? a : b,
                                            stats[0]
                                        ).distance
                                    }
                                </b>{" "}
                                at{" "}
                                {
                                    stats.reduce(
                                        (a, b) =>
                                            a.perfect > b.perfect ? a : b,
                                        stats[0]
                                    ).perfect.toFixed(0)
                                }
                                %.
                            </li>
                            <li>
                                ⚪ Your most practiced distance:{" "}
                                {
                                    Object.entries(byDistance).sort(
                                        (a, b) => b[1].length - a[1].length
                                    )[0][0]
                                }{" "}
                                ({Object.entries(byDistance).sort(
                                (a, b) => b[1].length - a[1].length
                            )[0][1].length}{" "}
                                sessions)
                            </li>
                        </ul>
                    </div>
                </>
            )}

            {/* 🔹 Database Link */}
            <div className="mt-10 text-right">
                <Link
                    href="/dashboard/putt/database"
                    className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md font-oswald text-brand-orange border border-zinc-700 inline-block"
                >
                    View Raw Database
                </Link>
            </div>
        </div>
    );
}

/* ---------- Helper Components ---------- */

function ChartBox({
                      title,
                      children,
                  }: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="bg-zinc-950/80 p-6 rounded-xl border border-zinc-800 shadow-md">
            <h2 className="text-lg font-oswald mb-4">{title}</h2>
            {children}
        </div>
    );
}

function LineGraph({
                       data,
                       dataKey,
                       color,
                   }: {
    data: any[];
    dataKey: string;
    color: string;
}) {
    return (
        <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="session" stroke="#999" />
                <YAxis domain={[0, 100]} stroke="#999" />
                <Tooltip
                    contentStyle={{
                        backgroundColor: "#18181b",
                        borderColor: "#3f3f46",
                    }}
                    labelStyle={{ color: "#e5e5e5" }}
                    itemStyle={{ color }}
                />
                <Line
                    type="monotone"
                    dataKey={dataKey}
                    stroke={color}
                    strokeWidth={2}
                    dot
                    activeDot={{ r: 4 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}
