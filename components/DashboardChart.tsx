"use client";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";

export default function DashboardChart({ data }: { data: any[] }) {
    return (
        <div className="bg-zinc-950/70 border border-zinc-800 rounded-xl p-6 shadow-lg">
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="day" stroke="#999" />
                    <YAxis stroke="#999" />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#18181b",
                            borderColor: "#3f3f46",
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="carry"
                        stroke="#f97316"
                        strokeWidth={2}
                        dot
                        activeDot={{ r: 5 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
