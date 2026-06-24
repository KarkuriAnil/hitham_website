"use client";

import { useEffect, useMemo, useState } from "react";
import { Users as UsersIcon, Search } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/layout/page-header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/admin/empty-state";
import { UserDetailDialog } from "@/components/admin/users/user-detail-dialog";
import { getUsers } from "@/lib/services/users";
import type { AppUser } from "@/types";

export default function UsersPage() {
  const [users, setUsers] = useState<AppUser[] | null>(null);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<AppUser | null>(null);

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .catch((err) => {
        console.error(err);
        toast.error("Couldn't load users.");
        setUsers([]);
      });
  }, []);

  const filtered = useMemo(() => {
    if (!users) return [];
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) => u.fullName?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
    );
  }, [users, search]);

  return (
    <div>
      <PageHeader title="Users" description="Everyone who has signed up on HITHAM." />

      <div className="mb-4 relative w-full max-w-xs">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email…"
          className="pl-9"
        />
      </div>

      {users && users.length === 0 ? (
        <EmptyState
          icon={UsersIcon}
          title="No users yet"
          description="Customers will appear here once they create an account on the storefront."
        />
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-border-soft text-left text-xs uppercase tracking-wide text-ink-soft">
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Condition / goal</th>
                <th className="p-4 font-medium">Subscription</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr
                  key={user.id}
                  onClick={() => setSelected(user)}
                  className="cursor-pointer border-b border-border-soft/60 last:border-0 hover:bg-ivory-dim/60"
                >
                  <td className="p-4 font-medium text-ink">{user.fullName || "—"}</td>
                  <td className="p-4 text-ink-soft">{user.email}</td>
                  <td className="p-4 text-ink-soft">
                    {user.diseaseType || user.healthGoal || "—"}
                  </td>
                  <td className="p-4">
                    {user.activeSubscription ? (
                      <Badge variant="success">Active</Badge>
                    ) : (
                      <Badge variant="outline">None</Badge>
                    )}
                  </td>
                </tr>
              ))}
              {users && filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-ink-soft">
                    No users match &quot;{search}&quot;.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      )}

      <UserDetailDialog
        user={selected}
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
      />
    </div>
  );
}
