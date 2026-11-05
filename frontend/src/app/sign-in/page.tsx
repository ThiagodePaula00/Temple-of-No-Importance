import CreateUserForm from '@/components/CreateUserForm';
import LoginForm from '@/components/LoginForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create you account',
};

export default async function CreateUserPage() {
  return <LoginForm />;
}