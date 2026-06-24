import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Trophy, Eye, EyeOff, Shield, User as UserIcon, Sun, Moon } from 'lucide-react';
import { authApi } from '../../api/auth';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import type { UserRole } from '../../types';
import toast from 'react-hot-toast';

interface FormValues {
  email: string;
  password: string;
  userName: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { theme, toggle } = useTheme();
  const [role, setRole] = useState<UserRole>('contestant');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  async function onSubmit(values: FormValues) {
    setLoading(true);
    try {
      const userId = await authApi.login({
        email: values.email,
        password: values.password,
      });
      login(userId, values.email.split('@')[0], values.email, role);
      toast.success('Welcome back!');
      navigate(role === 'admin' ? '/admin' : '/competitions', { replace: true });
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      {/* Theme toggle — top-right corner */}
      <button
        onClick={toggle}
        title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          zIndex: 100,
          width: 40,
          height: 40,
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border)',
          background: 'var(--surface)',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'background var(--ease), border-color var(--ease), color var(--ease)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
      </button>
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <Trophy size={22} />
          </div>
          <div>
            <div className="auth-title">CompetitionHub</div>
            <div className="auth-subtitle">Sign in to your account</div>
          </div>
        </div>

        {/* Role selector */}
        <div>
          <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
            I am a…
          </label>
          <div className="role-toggle">
            <button
              type="button"
              className={`role-btn${role === 'contestant' ? ' active' : ''}`}
              onClick={() => setRole('contestant')}
            >
              <UserIcon size={15} style={{ display: 'inline', marginRight: 6 }} />
              Contestant
            </button>
            <button
              type="button"
              className={`role-btn${role === 'admin' ? ' active' : ''}`}
              onClick={() => setRole('admin')}
            >
              <Shield size={15} style={{ display: 'inline', marginRight: 6 }} />
              Administrator
            </button>
          </div>
        </div>

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className={`form-input${errors.email ? ' error' : ''}`}
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && <span className="form-error">{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className={`form-input${errors.password ? ' error' : ''}`}
                style={{ paddingRight: '2.75rem' }}
                {...register('password', { required: 'Password is required' })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={{
                  position: 'absolute', right: '0.875rem', top: '50%',
                  transform: 'translateY(-50%)', background: 'none',
                  border: 'none', color: 'var(--text-subtle)', padding: 0,
                  cursor: 'pointer',
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <span className="form-error">{errors.password.message}</span>}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg w-full"
            disabled={loading}
            style={{ justifyContent: 'center', marginTop: '0.25rem' }}
          >
            {loading ? <span className="spinner" /> : null}
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account?{' '}
          <Link to="/register">Create one</Link>
        </div>
      </div>
    </div>
  );
}
