"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type UserRow = {
  id: string;
  email: string;
  role: string;
  createdAt: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/users", { credentials: "include" });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j?.error || "خطا در دریافت کاربران");
        setUsers([]);
        return;
      }
      const data = await res.json();
      setUsers(data.users || []);
    } catch (e) {
      console.error(e);
      setError("خطا در دریافت کاربران");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">کاربران</h1>
          <p className="text-sm text-muted-foreground">فقط ادمین می‌تواند کاربران را مشاهده کند.</p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          {loading ? "در حال بارگذاری..." : "بروزرسانی"}
        </Button>
      </div>

      {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}

      <div className="rounded-lg border bg-card">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">ایمیل</th>
                <th className="px-4 py-3 font-semibold">نقش</th>
                <th className="px-4 py-3 font-semibold">تاریخ ایجاد</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && (
                <tr>
                  <td className="px-4 py-4 text-center text-muted-foreground" colSpan={3}>
                    {loading ? "در حال بارگذاری..." : "کاربری یافت نشد"}
                  </td>
                </tr>
              )}
              {users.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex items-center rounded-full border px-3 py-1 text-xs"
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">{new Date(u.createdAt).toLocaleString("fa-IR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

