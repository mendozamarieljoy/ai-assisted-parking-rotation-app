"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type ApiError = { error?: { message?: string } };

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const isRegister = mode === "register";
  const [message, setMessage] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(undefined);
    setSubmitting(true);
    const form = new FormData(event.currentTarget);
    const body = isRegister
      ? Object.fromEntries(form)
      : {
          emailOrUsername: form.get("username"),
          password: form.get("password"),
        };
    try {
      const response = await fetch(
        isRegister ? "/api/auth/register" : "/api/auth/login",
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(body),
        },
      );
      const payload = (await response.json().catch(() => ({}))) as ApiError;
      if (!response.ok) {
        setMessage(
          payload.error?.message ?? "Something went wrong. Please try again.",
        );
        return;
      }
      if (isRegister) {
        setMessage(
          "Your account was created and is waiting for administrator approval.",
        );
        return;
      }
      router.push("/account");
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <main className="mx-auto w-full max-w-md px-4 py-12">
      <section className="overflow-hidden rounded-xl bg-white shadow-lg">
        <header className="bg-slate-800 px-6 py-5 text-white">
          <h1 className="font-mono text-2xl font-bold">
            {isRegister ? "CREATE ACCOUNT" : "LOG IN"}
          </h1>
          <p className="mt-1 text-sm text-slate-200">
            {isRegister
              ? "Register for the parking rotation."
              : "Access your parking rotation account."}
          </p>
        </header>
        <form onSubmit={submit} className="space-y-4 p-6">
          {isRegister && (
            <div className="grid grid-cols-2 gap-4">
              <Field label="First name" name="firstName" required />
              <Field label="Last name" name="lastName" required />
            </div>
          )}
          {isRegister && (
            <Field label="Email" name="email" type="email" required />
          )}
          <Field
            label="Username"
            name="username"
            autoComplete="username"
            required
          />
          <Field
            label="Password"
            name="password"
            type="password"
            autoComplete={isRegister ? "new-password" : "current-password"}
            minLength={isRegister ? 12 : undefined}
            required
          />
          {isRegister && (
            <p className="text-xs text-slate-500">
              Use at least 12 characters for your password.
            </p>
          )}
          {message && (
            <p
              role="status"
              className="rounded-md bg-slate-100 p-3 text-sm text-slate-700"
            >
              {message}
            </p>
          )}
          <button
            disabled={submitting}
            className="w-full rounded-md bg-slate-800 px-4 py-2.5 font-semibold text-white hover:bg-slate-700 disabled:opacity-60"
          >
            {submitting
              ? "Please wait…"
              : isRegister
                ? "Create account"
                : "Log in"}
          </button>
          <p className="text-center text-sm text-slate-600">
            {isRegister ? "Already have an account?" : "Need an account?"}{" "}
            <Link
              className="font-semibold text-blue-700 hover:underline"
              href={isRegister ? "/login" : "/register"}
            >
              {isRegister ? "Log in" : "Register"}
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}

function Field({
  label,
  name,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
}) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <input
        name={name}
        {...props}
        className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
      />
    </label>
  );
}
