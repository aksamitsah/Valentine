"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  if (status === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center relative z-10">
        <div className="spinner" />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 relative z-10">
      <div className="text-center max-w-2xl mx-auto">
        {/* Hero */}
        <h1 className="text-6xl md:text-8xl font-bold mb-6 heartbeat">
          💕
        </h1>
        <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
          Be My Valentine?
        </h2>
        <p className="text-xl text-gray-400 mb-6 leading-relaxed">
          Create a special personalized proposal link for your loved one.
          Watch them try to escape the inevitable YES! 💘
        </p>
        <p className="text-lg text-gray-500 mb-8 leading-relaxed">
          Upload photos, track views, celebrate with confetti, and see detailed analytics - all in one magical experience! ✨
        </p>

        {/* Auth */}
        {session ? (
          <div className="flex flex-col items-center gap-4 mb-12">
            <p className="text-gray-400">
              Signed in as {session.user?.name}
            </p>
            <button onClick={() => router.push("/dashboard")} className="btn-primary">
              Go to Dashboard →
            </button>
            <button onClick={() => signOut()} className="btn-secondary">
              Sign Out
            </button>
          </div>
        ) : (
          <div className="mb-12">
            <button
              onClick={() => signIn("google")}
              className="btn-primary text-lg"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign in with Google
            </button>
          </div>
        )}

        {/* Features */}
        <div className="glass-card p-8 mb-12">
          <h3 className="text-2xl font-bold gradient-text mb-6 text-center">✨ All Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-center">
            <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="font-semibold mb-1">Personalized Links</h3>
              <p className="text-sm text-gray-400">Add your names and a custom message</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
              <div className="text-3xl mb-2">😂</div>
              <h3 className="font-semibold mb-1">Playful NO Button</h3>
              <p className="text-sm text-gray-400">Watch it escape on hover/tap!</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
              <div className="text-3xl mb-2">📊</div>
              <h3 className="font-semibold mb-1">Fun Analytics</h3>
              <p className="text-sm text-gray-400">See how long they tried to say no</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
              <div className="text-3xl mb-2">📷</div>
              <h3 className="font-semibold mb-1">Image Uploads</h3>
              <p className="text-sm text-gray-400">Upload photos when creating proposals and after saying YES</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
              <div className="text-3xl mb-2">👁️</div>
              <h3 className="font-semibold mb-1">View Tracking</h3>
              <p className="text-sm text-gray-400">Track total views and unique visitors per proposal</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
              <div className="text-3xl mb-2">🎉</div>
              <h3 className="font-semibold mb-1">Success Celebration</h3>
              <p className="text-sm text-gray-400">Beautiful confetti and stats page after saying YES</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
              <div className="text-3xl mb-2">📈</div>
              <h3 className="font-semibold mb-1">Response Analytics</h3>
              <p className="text-sm text-gray-400">Track time to YES, NO attempts, and response history</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
              <div className="text-3xl mb-2">📱</div>
              <h3 className="font-semibold mb-1">Dashboard</h3>
              <p className="text-sm text-gray-400">Manage all proposals, edit, delete, and view analytics</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
              <div className="text-3xl mb-2">💕</div>
              <h3 className="font-semibold mb-1">Beautiful Design</h3>
              <p className="text-sm text-gray-400">Modern UI with animations and responsive layout</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 text-center text-gray-500 text-sm">
        Made with 💕 for Valentine&apos;s Day 2026
      </footer>
    </main>
  );
}
