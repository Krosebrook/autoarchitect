import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoginForm } from '../components/auth/LoginForm';

// Mock useAuth hook
vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    signIn: vi.fn(),
    signInWithGithub: vi.fn(),
    loading: false,
    isAuthenticated: false,
  }),
}));

describe('Authentication', () => {
  it('renders login form', () => {
    render(<LoginForm onSwitchToSignup={() => {}} />);
    
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('has sign up link', () => {
    render(<LoginForm onSwitchToSignup={() => {}} />);
    
    expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
  });
});
