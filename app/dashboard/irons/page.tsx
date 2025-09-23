"use client";

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
import Link from "next/link";

const dummyData = [
    { session: "Sep 1", carry: 160, ballspeed: 115, spin: 5500, target: 8 },
    { session: "Sep 5", carry: 165, ballspeed: 118, spin: 5300, target: 6 },
    { session: "Sep 10", carry: 162, ballspeed: 116, spin: 5400, target: 7 },
];

export default function IronsPage() {
    const [tab, setTab] = useState<"9i" | "7i" | "5i">("9i");

    return (
        <div className="min-h-screen bg-zinc-900 text-white p-8 font-sans">
            <h1 className="text-3xl font-oswald text-brand-orange mb-6">Irons Performance</h1>

            {/* Tabs */}
            <div className="flex gap-4 mb-8">
                {["9i", "7i", "5i"].map((iron) => (
                    <button
                        key={iron}
                        onClick={() => setTab(iron as "9i" | "7i" | "5i")}
                        className={`px-4 py-2 rounded-md font-oswald tracking-wide ${
                            tab === iron
                                ? "bg-brand-orange text-white"
                                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                        }`}
                    >
                        {iron}
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
            <div className="mt-10 text-right">
                <Link
                    href="/dashboard/irons/database"
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
