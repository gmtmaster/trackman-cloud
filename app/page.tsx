"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false, // we handle redirect manually
        });

        setLoading(false);

        if (res?.ok) {
            router.push("/dashboard");
        } else {
            alert("Invalid email or password");
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-zinc-900 font-sans">
            {/* wallpaper background */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/login.jpg"
                    alt="Golf course background"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0" />
            </div>

            {/* login card */}
            <div className="absolute z-10 w-full max-w-sm bg-zinc-950/90 p-8 rounded-xl shadow-lg border border-zinc-800">
                <div className="flex justify-center mb-6">
                    <Image
                        src="/trackman-logo-white.svg"
                        alt="Trackman Cloud"
                        width={120}
                        height={40}
                    />
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-zinc-300 mb-1 font-oswald uppercase">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 rounded-md bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-brand-orange"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-zinc-300 mb-1 font-oswald uppercase">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 rounded-md bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-brand-orange"
                            required
                        />
                        <a
                            href="#"
                            className="text-xs text-brand-orange hover:underline mt-1 inline-block font-lato"
                        >
                            Forgot password?
                        </a>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-brand-orange hover:bg-orange-600 text-white font-oswald tracking-wide py-2 rounded-md transition disabled:opacity-60"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <div className="my-6 flex items-center gap-2">
                    <div className="flex-1 h-px bg-zinc-700" />
                    <span className="text-zinc-400 text-xs font-lato">or continue with</span>
                    <div className="flex-1 h-px bg-zinc-700" />
                </div>

                <button className="w-full flex items-center justify-center gap-2 border border-zinc-700 text-white py-2 rounded-md hover:bg-zinc-800 font-lato">
                    <Image
                        src="/apple-logo-black.png"
                        alt="Apple login"
                        width={20}
                        height={20}
                    />
                    Continue with Apple
                </button>

                <p className="text-sm text-center text-zinc-400 mt-6 font-lato">
                    New user?{" "}
                    <a
                        href="/register"
                        className="text-brand-orange hover:underline font-oswald"
                    >
                        Create account
                    </a>
                </p>
            </div>
        </div>
    );
}
