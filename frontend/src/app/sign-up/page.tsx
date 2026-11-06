
import CreateUserForm from '@/components/CreateUserForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign up',
};

export default function SignUpPage() {
  return <CreateUserForm />;
}