import LoginForm from './LoginForm';

export const dynamic = 'force-dynamic';

export default function AdminLoginPage() {
  return (
    <main className="mx-auto mt-24 max-w-sm">
      <h1 className="text-xl font-medium">Admin login</h1>
      <LoginForm />
    </main>
  );
}
