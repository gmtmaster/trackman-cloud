import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function DashboardLayout({
                                                  children,
                                              }: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return <meta httpEquiv="refresh" content="0; url=/login" />;
    }

    return (
        <div className="min-h-screen flex bg-zinc-900 font-sans">
            {/* Sidebar */}
            <aside className="fixed top-0 left-0 h-screen w-64 bg-zinc-950/95 border-r border-zinc-800 p-6 flex flex-col">
                <div className="flex items-center gap-2 mb-10">
                    <Image src="/trackman-logo-white.svg" alt="Logo" width={120} height={40} />
                </div>

                <nav className="flex flex-col gap-2 flex-1">
                    <SidebarLink href="/dashboard" title="Dashboard" />
                    <SidebarLink href="/dashboard/wedge" title="Wedge" />
                    <SidebarLink href="/dashboard/irons" title="Irons" />
                    <SidebarLink href="/dashboard/driver" title="Driver" />
                    <SidebarLink href="/dashboard/putt" title="Putt" />
                    <SidebarLink href="/dashboard/rounds" title="Sim Rounds" />
                </nav>

                <div>
                    <form action="/api/auth/signout" method="post">
                        <button
                            type="submit"
                            className="w-full mt-6 py-2 rounded-md bg-zinc-800 hover:bg-zinc-700 text-white font-oswald tracking-wide"
                        >
                            Sign Out
                        </button>
                    </form>
                </div>
            </aside>


            {/* Main content */}
            <main className="flex-1 p-10 ml-64">{children}</main>
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
