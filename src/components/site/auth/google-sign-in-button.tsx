"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { signInWithGoogle, authErrorMessage } from "@/lib/site/auth";

export function GoogleSignInButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      await signInWithGoogle();
      router.push("/account");
    } catch (err) {
      toast.error(authErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleClick}
      disabled={loading}
      className="w-full"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4">
        <path
          fill="#4285F4"
          d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47c-.29 1.49-1.14 2.76-2.6 3.6v3.03h2.6c2.36-2.17 3.62-5.5 3.62-8.87z"
        />
        <path
          fill="#34A853"
          d="M12 24c2.7 0 4.97-.9 6.63-2.42l-2.6-3.03c-.93.63-2.12 1.06-4.03 1.06-3.07 0-5.67-2.05-6.62-4.83H1.66v3.13C3.5 21.3 7.43 24 12 24z"
        />
        <path
          fill="#FBBC05"
          d="M5.38 14.78c-.24-.69-.38-1.43-.38-2.18 0-.75.14-1.49.38-2.18V7.29H1.66A11.94 11.94 0 0 0 0 12.6c0 1.92.46 3.74 1.66 5.31l3.72-3.13z"
        />
        <path
          fill="#EA4335"
          d="M12 4.75c1.62 0 2.97.55 4.04 1.59l2.4-2.4C16.96.99 14.7 0 12 0 7.43 0 3.5 2.7 1.66 6.69l3.72 3.13c.95-2.78 3.55-5.07 6.62-5.07z"
        />
      </svg>
      {loading ? "Signing in…" : "Continue with Google"}
    </Button>
  );
}
