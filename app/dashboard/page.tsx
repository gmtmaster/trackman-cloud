import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";

export default async function Dashboard() {
    const session = await getServerSession(authOptions);


    return (
        <div className="min-h-screen flex bg-zinc-900 font-sans">

            {/* Main content */}
            <main className="flex-1 p-10 space-y-10">
                {/* Greeting */}
                <h1 className="text-3xl font-oswald text-brand-orange">
                    Welcome back, {session.user?.name || session.user?.email}
                </h1>

                {/* Quick stats */}
                <section>
                    <h2 className="text-xl font-oswald text-white mb-4">Your Practice Overview</h2>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard label="Shots this week" value="126" />
                        <StatCard label="Avg. Carry Distance" value="152 m" />
                        <StatCard label="Fairway Hit %" value="68%" />
                        <StatCard label="Putting Accuracy" value="87%" />
                    </div>
                </section>

                {/* Recent activity */}
                <section>
                    <h2 className="text-xl font-oswald text-white mb-4">Recent Sessions</h2>
                    <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-6 shadow-md">
                        <ul className="divide-y divide-zinc-800">
                            <li className="py-3 flex justify-between">
                                <span className="text-zinc-300 font-lato">Wedge practice – 50 balls</span>
                                <span className="text-sm text-zinc-400">2 days ago</span>
                            </li>
                            <li className="py-3 flex justify-between">
                                <span className="text-zinc-300 font-lato">Driver session – Avg. 245m</span>
                                <span className="text-sm text-zinc-400">4 days ago</span>
                            </li>
                            <li className="py-3 flex justify-between">
                                <span className="text-zinc-300 font-lato">Putting drill – 30 putts</span>
                                <span className="text-sm text-zinc-400">1 week ago</span>
                            </li>
                        </ul>
                        <div className="mt-4 text-right">
                            <Link
                                href="/sessions"
                                className="text-brand-orange font-oswald hover:underline"
                            >
                                View all →
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

        </div>
    );
}

function SidebarLink({ href, title }: { href: string; title: string }) {
    return (
        <Link
            href={href}
            className="px-3 py-2 rounded-md text-zinc-300 hover:bg-zinc-800 hover:text-brand-orange font-lato transition"
        >
            {title}
        </Link>
    );
}

function StatCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-6 shadow-md text-center">
            <p className="text-3xl font-oswald text-brand-orange">{value}</p>
            <p className="text-sm text-zinc-400 font-lato">{label}</p>
        </div>
    );
}

function Card({ title, href }: { title: string; href: string }) {
    return (
        <Link
            href={href}
            className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-6 shadow-md hover:shadow-lg transition flex flex-col"
        >
            <h2 className="text-lg font-oswald text-white mb-2">{title}</h2>
            <p className="text-sm text-zinc-400 font-lato">
                Detailed statistics and reports
            </p>
        </Link>
    );
}
