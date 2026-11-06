'use client';

import { loginAction } from '@/actions/login/login-action';
import { KeyRoundIcon } from 'lucide-react';
import Link from 'next/link';
import { useActionState } from 'react';

export default function LoginForm() {
  const [state, action, isPending] = useActionState(loginAction, {
    email: '',
    errors: [],
  });

  return (
    <div className="mx-auto my-16 mb-32 max-w-sm rounded-xl border border-(--card-border) bg-(--card-background) p-8 text-center shadow-lg">
      <form action={action} className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold tracking-tight">Sign in</h2>

        <div className="relative">
          <input
            id="email"
            name="email"
            type="email"
            placeholder=" "
            required
            autoComplete="email"
            defaultValue={state.email}
            disabled={isPending}
            className="peer w-full rounded-md border border-(--control-border) bg-(--control-background) px-3 pt-3.5 pb-2 text-inherit outline-none transition-colors focus:border-blue-500 disabled:opacity-60"
          />
          <label
            htmlFor="email"
            className="pointer-events-none absolute left-3 top-2.5 z-10 origin-left -translate-y-4 scale-75 bg-(--control-background) px-1 text-sm text-(--muted-text-color) transition-all duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-blue-500"
          >
            Email Address
          </label>
        </div>

        <div className="flex flex-col gap-1">
          <div className="relative">
            <input
              id="password"
              name="password"
              type="password"
              placeholder=" "
              required
              autoComplete="current-password"
              disabled={isPending}
              className="peer w-full rounded-md border border-(--control-border) bg-(--control-background) px-3 pt-3.5 pb-2 text-inherit outline-none transition-colors focus:border-blue-500 disabled:opacity-60"
            />
            <label
              htmlFor="password"
              className="pointer-events-none absolute left-3 top-2.5 z-10 origin-left -translate-y-4 scale-75 bg-(--control-background) px-1 text-sm text-(--muted-text-color) transition-all duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-blue-500"
            >
              Password
            </label>
          </div>
          
          <div className="text-left">
            <Link
              href="/forgot-password"
              className="text-xs text-(--muted-text-color) hover:text-(--text-color) underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        {state.errors.length > 0 && (
          <ul className="list-inside list-disc text-left text-sm text-red-500" role="alert">
            {state.errors.map((error) => <li key={error}>{error}</li>)}
          </ul>
        )}

        <button
          disabled={isPending}
          type="submit"
          className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60"
        >
          <KeyRoundIcon size={18} />
          {isPending ? 'Signing in…' : 'Sign in'}
        </button>

        <p className="text-sm text-(--muted-text-color)">
          Don&apos;t have an account?{' '}
          <Link href="/sign-up" className="font-semibold text-inherit underline hover:text-(--text-color)">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}