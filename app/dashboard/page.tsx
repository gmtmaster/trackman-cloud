import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import DashboardChart from "../../components/DashboardChart";

export default async function Dashboard() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return <p className="text-center mt-20 text-zinc-400">Unauthorized</p>;

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { shots: true },
    });

    if (!user) return <p className="text-center mt-20 text-zinc-400">No user data found</p>;

    const shots = user.shots || [];

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekShots = shots.filter((s) => s.createdAt > weekAgo);

    const ironShots = weekShots.filter((s) => s.club?.startsWith("IRON"));
    const driverShots = weekShots.filter((s) => s.club === "DRIVER");
    const putts = weekShots.filter((s) => s.club === "PUTTER");

    const avgCarry =
        ironShots.length > 0
            ? (ironShots.reduce((a, b) => a + (b.carry || 0), 0) / ironShots.length).toFixed(1)
            : "–";
    const avgBallSpeed =
        driverShots.length > 0
            ? (driverShots.reduce((a, b) => a + (b.ballSpeed || 0), 0) / driverShots.length).toFixed(1)
            : "–";
    const puttAccuracy =
        putts.length > 0
            ? (
                (putts.reduce(
                        (a, b) => a + ((b.perfectMakes || 0) + (b.goodMakes || 0)),
                        0
                    ) /
                    putts.reduce((a, b) => a + (b.totalPutts || 1), 0)) *
                100
            ).toFixed(0)
            : "–";

    const recentSessions = [...shots]
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 5);

    const chartData = Array.from({ length: 7 }).map((_, i) => {
        const day = new Date();
        day.setDate(day.getDate() - (6 - i));
        const label = day.toLocaleDateString("en-US", { weekday: "short" });
        const dayShots = shots.filter(
            (s) => s.createdAt.toDateString() === day.toDateString()
        );
        const avgCarryDay =
            dayShots.length > 0
                ? dayShots.reduce((a, b) => a + (b.carry || 0), 0) / dayShots.length
                : 0;
        return { day: label, carry: avgCarryDay.toFixed(0) };
    });

    return (
        <div className="min-h-screen text-white font-sans">
            <main className="max-w-6xl mx-auto p-10 space-y-12">
                <h1 className="text-4xl font-oswald text-brand-orange">
                    Welcome back, {session.user?.name || session.user?.email}
                </h1>

                {/* KPIs */}
                <section>
                    <h2 className="text-xl font-oswald mb-4">This Week's Highlights</h2>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard label="Total Shots" value={weekShots.length.toString()} />
                        <StatCard label="Avg. Carry" value={`${avgCarry} m`} />
                        <StatCard label="Avg. Ball Speed" value={`${avgBallSpeed} km/h`} />
                        <StatCard label="Putting Accuracy" value={`${puttAccuracy}%`} />
                    </div>
                </section>

                {/* Chart */}
                <section>
                    <h2 className="text-xl font-oswald mb-4">Carry Distance (Last 7 Days)</h2>
                    <DashboardChart data={chartData} />
                </section>

                {/* Recent Sessions */}
                <section>
                    <h2 className="text-xl font-oswald mb-4">Recent Sessions</h2>
                    <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-6 shadow-md">
                        <ul className="divide-y divide-zinc-800">
                            {recentSessions.length === 0 && (
                                <li className="py-3 text-zinc-500">No sessions yet.</li>
                            )}
                            {recentSessions.map((s) => (
                                <li
                                    key={s.id}
                                    className="py-3 flex justify-between items-center hover:bg-zinc-800/40 transition rounded-md px-2"
                                >
                                    <div>
                                        <p className="text-zinc-200 font-oswald">
                                            {s.club.replace("_", " ")}
                                        </p>
                                        <p className="text-sm text-zinc-400">
                                            {s.result || "–"} &middot;{" "}
                                            {new Date(s.createdAt).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-brand-orange text-lg font-semibold">
                                            {s.carry ? `${s.carry}m` : s.totalPutts ? `${s.totalPutts} putts` : "–"}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            </main>
        </div>
    );
}

/* ---------- Helper ---------- */
function StatCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl bg-zinc-950/80 border border-zinc-800 shadow-md p-6 text-center hover:shadow-xl transition">
            <p className="text-3xl font-bold text-brand-orange">{value}</p>
            <p className="text-sm text-zinc-400 mt-1">{label}</p>
        </div>
    );
}
