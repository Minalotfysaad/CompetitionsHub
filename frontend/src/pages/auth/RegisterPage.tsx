import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Trophy, Eye, EyeOff, Sun, Moon } from 'lucide-react';
import { authApi } from '../../api/auth';
import { useTheme } from '../../contexts/ThemeContext';
import toast from 'react-hot-toast';

interface FormValues {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  const password = watch('password');

  async function onSubmit(values: FormValues) {
    setLoading(true);
    try {
      await authApi.register({
        userName: values.userName,
        email: values.email,
        password: values.password,
      });
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ??
        err?.response?.data?.[0]?.description ??
        'Registration failed.';
      toast.error(msg);
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
            <div className="auth-title">Create Account</div>
            <div className="auth-subtitle">Join CompetitionHub today</div>
          </div>
        </div>

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label className="form-label" htmlFor="userName">Username</label>
            <input
              id="userName"
              type="text"
              placeholder="johndoe"
              className={`form-input${errors.userName ? ' error' : ''}`}
              {...register('userName', { required: 'Username is required', minLength: { value: 3, message: 'Minimum 3 characters' } })}
            />
            {errors.userName && <span className="form-error">{errors.userName.message}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">Email address</label>
            <input
              id="reg-email"
              type="email"
              placeholder="you@example.com"
              className={`form-input${errors.email ? ' error' : ''}`}
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
              })}
            />
            {errors.email && <span className="form-error">{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 6 characters"
                className={`form-input${errors.password ? ' error' : ''}`}
                style={{ paddingRight: '2.75rem' }}
                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min. 6 characters' } })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={{
                  position: 'absolute', right: '0.875rem', top: '50%',
                  transform: 'translateY(-50%)', background: 'none',
                  border: 'none', color: 'var(--text-subtle)', padding: 0, cursor: 'pointer',
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <span className="form-error">{errors.password.message}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirm">Confirm Password</label>
            <input
              id="confirm"
              type="password"
              placeholder="Repeat your password"
              className={`form-input${errors.confirmPassword ? ' error' : ''}`}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (v) => v === password || 'Passwords do not match',
              })}
            />
            {errors.confirmPassword && <span className="form-error">{errors.confirmPassword.message}</span>}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg w-full"
            disabled={loading}
            style={{ justifyContent: 'center', marginTop: '0.25rem' }}
          >
            {loading ? <span className="spinner" /> : null}
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
