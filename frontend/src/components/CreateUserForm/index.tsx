'use client';

import { UserRoundIcon } from 'lucide-react';
import Link from 'next/link';

export default function CreateUserForm() {
  return (
    <div className="flex items-center justify-center mx-auto mt-16 mb-32 max-w-sm rounded-xl border border-(--card-border) bg-(--card-background) p-8 shadow-lg text-center">
      <form className="flex flex-1 flex-col gap-6">
        <h2 className="text-2xl font-bold tracking-tight">Create Account</h2>

        <div className="relative">
          <input
            id="name"
            name="name"
            type="text"
            placeholder=" "
            required
            className="peer w-full rounded-md border border-(--control-border) bg-(--control-background) px-3 pt-3.5 pb-2 text-inherit outline-none transition-colors focus:border-blue-500"
          />
          <label
            htmlFor="name"
            className="pointer-events-none absolute left-3 top-2.5 z-10 origin-left -translate-y-4 scale-75 bg-(--control-background) px-1 text-sm text-(--muted-text-color) transition-all duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-blue-500"
          >
            Full Name
          </label>
        </div>

        <div className="relative">
          <input
            id="email"
            name="email"
            type="email"
            placeholder=" "
            required
            className="peer w-full rounded-md border border-(--control-border) bg-(--control-background) px-3 pt-3.5 pb-2 text-inherit outline-none transition-colors focus:border-blue-500"
          />
          <label
            htmlFor="email"
            className="pointer-events-none absolute left-3 top-2.5 z-10 origin-left -translate-y-4 scale-75 bg-(--control-background) px-1 text-sm text-(--muted-text-color) transition-all duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-blue-500"
          >
            Email Address
          </label>
        </div>

        <div className="relative">
          <input
            id="password"
            name="password"
            type="password"
            placeholder=" "
            required
            className="peer w-full rounded-md border border-(--control-border) bg-(--control-background) px-3 pt-3.5 pb-2 text-inherit outline-none transition-colors focus:border-blue-500"
          />
          <label
            htmlFor="password"
            className="pointer-events-none absolute left-3 top-2.5 z-10 origin-left -translate-y-4 scale-75 bg-(--control-background) px-1 text-sm text-(--muted-text-color) transition-all duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-blue-500"
          >
            Password
          </label>
        </div>

        <div className="relative">
          <input
            id="password2"
            name="password2"
            type="password"
            placeholder=" "
            required
            className="peer w-full rounded-md border border-(--control-border) bg-(--control-background) px-3 pt-3.5 pb-2 text-inherit outline-none transition-colors focus:border-blue-500"
          />
          <label
            htmlFor="password2"
            className="pointer-events-none absolute left-3 top-2.5 z-10 origin-left -translate-y-4 scale-75 bg-(--control-background) px-1 text-sm text-(--muted-text-color) transition-all duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-blue-500"
          >
            Repeat Password
          </label>
        </div>

        <button
          type="submit"
          className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-blue-700"
        >
          <UserRoundIcon size={18} />
          Create Account
        </button>

        <p className="text-sm text-(--muted-text-color)">
          Already have an account?{' '}
          <Link href="/sign-in" className="font-semibold text-inherit underline hover:text-(--text-color)">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}