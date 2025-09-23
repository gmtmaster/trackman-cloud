"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });
        if (res.ok) router.push("/login");
        else alert("Registration failed");
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-zinc-900 font-sans">
            {/* wallpaper background */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/login.jpg" // reuse same background
                    alt="Golf course background"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0" />
            </div>

            {/* register card */}
            <div className="absolute z-10 w-full max-w-sm bg-zinc-950/90 p-8 rounded-xl shadow-lg border border-zinc-800">
                <div className="flex justify-center mb-6">
                    <Image src="/trackman-logo-white.svg" alt="Trackman Cloud" width={120} height={40} />
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-zinc-300 mb-1 font-oswald uppercase">
                            Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full px-3 py-2 rounded-md bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-brand-orange"
                            placeholder="Your name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-zinc-300 mb-1 font-oswald uppercase">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full px-3 py-2 rounded-md bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-brand-orange"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-zinc-300 mb-1 font-oswald uppercase">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full px-3 py-2 rounded-md bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-brand-orange"
                            placeholder="Minimum 8 characters"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-brand-orange hover:bg-orange-600 text-white font-oswald tracking-wide py-2 rounded-md transition"
                    >
                        Create Account
                    </button>
                </form>

                <p className="text-sm text-center text-zinc-400 mt-6 font-lato">
                    Already have an account?{" "}
                    <a href="/public" className="text-brand-orange hover:underline font-oswald">
                        Sign In
                    </a>
                </p>
            </div>
        </div>
    );
}
