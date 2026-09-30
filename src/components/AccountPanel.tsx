"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
type CurrentUser = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  role: "USER" | "ADMIN";
  status: string;
};
export function AccountPanel() {
  const [user, setUser] = useState<CurrentUser>({
    firstName: "John",
    lastName: "Doe",
    email: "test@mail.com",
    username: "johndoe",
    role: "USER",
    status: "ACTIVE",
  });
  const [error, setError] = useState<string>();
  // useEffect(() => {
  //   fetch("/api/auth/me")
  //     .then(async (res) => {
  //       if (!res.ok) {
  //         setError(
  //           res.status === 401
  //             ? "Please log in to view your account."
  //             : "Your account is not active.",
  //         );
  //         return;
  //       }
  //       setUser((await res.json()) as CurrentUser);
  //     })
  //     .catch(() => setError("We could not load your account."));
  // }, []);
  // if (error)
  //   return (
  //     <main className="mx-auto max-w-2xl px-4 py-12">
  //       <p className="rounded-lg bg-amber-50 p-4 text-amber-900">
  //         {error}{" "}
  //         <Link href="/login" className="font-semibold underline">
  //           Log in
  //         </Link>
  //       </p>
  //     </main>
  //   );
  // if (!user)
  //   return (
  //     <main className="mx-auto max-w-2xl px-4 py-12 text-slate-600">
  //       Loading account…
  //     </main>
  //   );
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <section className="rounded-xl bg-white p-6 shadow">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-mono text-2xl font-bold text-slate-800">
              MY ACCOUNT
            </h1>
          </div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-800">
            {user.status}
          </span>
        </div>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <Detail label="Name" value={`${user.firstName} ${user.lastName}`} />
          <Detail label="Username" value={user.username} />
          <Detail label="Email" value={user.email} />
          <Detail label="Role" value={user.role} />
        </dl>
        {user.role === "ADMIN" && (
          <Link
            href="/admin/users"
            className="mt-6 inline-block rounded-md bg-slate-800 px-4 py-2 text-sm font-semibold text-white"
          >
            Manage users
          </Link>
        )}
      </section>
    </main>
  );
}
function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 text-slate-800">{value}</dd>
    </div>
  );
}
