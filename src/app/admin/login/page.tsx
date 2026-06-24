"use client";

import { useState, type FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Leaf, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Something went wrong. Try again.");
        setLoading(false);
        return;
      }

      const redirectTo = searchParams.get("redirectTo") || "/admin/dashboard";
      router.replace(redirectTo);
      router.refresh();
    } catch {
      setError("Couldn't reach the server. Check your connection.");
      setLoading(false);
    }
  }

  return (
    <div className="relative z-10 w-full max-w-sm">
      <div className="mb-8 flex flex-col items-center gap-3 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sage/15">
          <Leaf className="h-6 w-6 text-sage-light" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-medium text-ivory">HITHAM</h1>
          <p className="text-xs uppercase tracking-[0.2em] text-sage-light">
            House Of Organic Foods
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-white/10 bg-moss-light/60 p-6 backdrop-blur-sm"
      >
        <div className="mb-5 flex items-center gap-2 text-sm text-sage-light">
          <Lock className="h-4 w-4" />
          <span>Admin access</span>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="password" className="text-sage-light">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            className="border-white/10 bg-moss text-ivory placeholder:text-sage-light/40 focus-visible:ring-sage-light"
          />
        </div>

        {error && (
          <p className="mt-3 text-sm text-clay-dim/90" role="alert">
            {error}
          </p>
        )}

        <Button
          type="submit"
          disabled={loading || !password}
          className="mt-6 w-full bg-sage text-ink hover:bg-sage-light"
        >
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-sage-light/60">
        Restricted to HITHAM staff. Contact the founder if you need access.
      </p>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-moss px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-sage/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />
      </div>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
