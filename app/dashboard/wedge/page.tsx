"use client";

import Link from "next/link";
import { useState } from "react";
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const dummyData = [
    { session: "Sep 1", carry: 48, ballspeed: 75, spin: 5000, target: 4 },
    { session: "Sep 5", carry: 52, ballspeed: 78, spin: 5200, target: 6 },
    { session: "Sep 10", carry: 50, ballspeed: 76, spin: 5100, target: 2 },
    { session: "Sep 15", carry: 49, ballspeed: 77, spin: 4900, target: 5 },
];

export default function WedgePage() {
    const [tab, setTab] = useState<"50" | "75" | "100">("50");

    return (
        <div className="min-h-screen bg-zinc-900 text-white p-8 font-sans">
            <h1 className="text-3xl font-oswald text-brand-orange mb-6">Wedge Performance</h1>

            {/* Tabs */}
            <div className="flex gap-4 mb-8">
                {["50", "75", "100"].map((dist) => (
                    <button
                        key={dist}
                        onClick={() => setTab(dist as "50" | "75" | "100")}
                        className={`px-4 py-2 rounded-md font-oswald tracking-wide ${
                            tab === dist
                                ? "bg-brand-orange text-white"
                                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                        }`}
                    >
                        {dist}m
                    </button>
                ))}
            </div>

            {/* Graphs */}
            <div className="grid gap-8 md:grid-cols-2">
                <ChartBox title="Carry Distance (m)">
                    <LineGraph data={dummyData} dataKey="carry" color="#f97316" />
                </ChartBox>

                <ChartBox title="Ball Speed (mph)">
                    <LineGraph data={dummyData} dataKey="ballspeed" color="#22c55e" />
                </ChartBox>

                <ChartBox title="Spin Rate (rpm)">
                    <LineGraph data={dummyData} dataKey="spin" color="#3b82f6" />
                </ChartBox>

                <ChartBox title="To Target (ft)">
                    <LineGraph data={dummyData} dataKey="target" color="#eab308" />
                </ChartBox>
            </div>

            {/* Raw Data Button */}
            {/* Raw Data Button */}
            <div className="mt-10 text-right">
                <Link
                    href="/dashboard/wedge/database"
                    className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md font-oswald text-brand-orange border border-zinc-700 inline-block"
                >
                    View Raw Database
                </Link>
            </div>

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
                <Tooltip contentStyle={{ backgroundColor: "#18181b", borderColor: "#3f3f46" }} />
                <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} />
            </LineChart>
        </ResponsiveContainer>
    );
}
