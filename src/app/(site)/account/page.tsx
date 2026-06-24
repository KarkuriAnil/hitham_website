"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { RequireAuth } from "@/components/site/account/require-auth";
import { useAuth } from "@/components/site/auth/auth-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateUserProfile } from "@/lib/site/profile";
import { signOut } from "@/lib/site/auth";

function AccountContent() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState(profile?.fullName || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [saving, setSaving] = useState(false);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      await updateUserProfile(user.uid, { fullName, phone });
      toast.success("Profile updated");
    } catch (err) {
      console.error(err);
      toast.error("Couldn't save your profile.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="growth-line inline font-display text-3xl font-medium text-ink">
          My account
        </h1>
        <Button variant="ghost" onClick={handleSignOut}>
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Link href="/account/orders">
          <Card className="h-full p-5 transition-colors hover:border-sage">
            <p className="font-display text-lg text-ink">Orders</p>
            <p className="mt-1 text-sm text-ink-soft">Track and review past purchases</p>
          </Card>
        </Link>
        <Link href="/account/subscriptions">
          <Card className="h-full p-5 transition-colors hover:border-sage">
            <p className="font-display text-lg text-ink">Subscriptions</p>
            <p className="mt-1 text-sm text-ink-soft">Manage your active plans</p>
          </Card>
        </Link>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="flex flex-col gap-4 max-w-md">
            <div className="flex flex-col gap-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user?.email || ""} disabled />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <Button type="submit" disabled={saving} className="mt-1 w-fit">
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AccountPage() {
  return (
    <RequireAuth>
      <AccountContent />
    </RequireAuth>
  );
}
