'use client';

import { useActionState } from 'react';
import { adminLogin } from '@/app/actions/admin';

export default function LoginForm() {
  const [state, action, pending] = useActionState(adminLogin, null);
  return (
    <form action={action} className="mt-6 space-y-4">
      <input
        type="password"
        name="password"
        required
        autoFocus
        placeholder="Password"
        className="w-full rounded border border-neutral-300 px-3 py-2"
      />
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded bg-neutral-900 px-3 py-2 text-white disabled:opacity-50"
      >
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
