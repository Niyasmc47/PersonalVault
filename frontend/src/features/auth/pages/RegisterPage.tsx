import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      setError(null);
      await registerUser({ name: data.name, email: data.email, password: data.password });
      navigate('/home');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      setError(e.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="pv-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--sp-48) var(--card-pad)' }}>
      <div className="pv-card" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ fontSize: 'var(--text-heading)', letterSpacing: 'var(--tracking-heading)', marginBottom: 'var(--sp-24)', textAlign: 'center' }}>
          Create an Account
        </h2>
        {error && (
          <div style={{ color: 'var(--color-hot-pink)', fontWeight: 'var(--weight-medium)', marginBottom: 'var(--sp-16)', textAlign: 'center' }}>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ marginBottom: 'var(--sp-16)' }}>
            <label style={{ display: 'block', marginBottom: 'var(--sp-8)', fontWeight: 'var(--weight-medium)' }}>Name</label>
            <input
              type="text"
              {...register('name')}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid var(--color-mist-divider)',
                borderRadius: 'var(--r-xs)',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                fontSize: 'var(--text-body)',
              }}
            />
            {errors.name && <span style={{ color: 'var(--color-hot-pink)', fontSize: 'var(--text-caption)', marginTop: 4, display: 'block' }}>{errors.name.message}</span>}
          </div>

          <div style={{ marginBottom: 'var(--sp-16)' }}>
            <label style={{ display: 'block', marginBottom: 'var(--sp-8)', fontWeight: 'var(--weight-medium)' }}>Email</label>
            <input
              type="email"
              {...register('email')}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid var(--color-mist-divider)',
                borderRadius: 'var(--r-xs)',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                fontSize: 'var(--text-body)',
              }}
            />
            {errors.email && <span style={{ color: 'var(--color-hot-pink)', fontSize: 'var(--text-caption)', marginTop: 4, display: 'block' }}>{errors.email.message}</span>}
          </div>
          
          <div style={{ marginBottom: 'var(--sp-16)' }}>
            <label style={{ display: 'block', marginBottom: 'var(--sp-8)', fontWeight: 'var(--weight-medium)' }}>Password</label>
            <input
              type="password"
              {...register('password')}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid var(--color-mist-divider)',
                borderRadius: 'var(--r-xs)',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                fontSize: 'var(--text-body)',
              }}
            />
            {errors.password && <span style={{ color: 'var(--color-hot-pink)', fontSize: 'var(--text-caption)', marginTop: 4, display: 'block' }}>{errors.password.message}</span>}
          </div>

          <div style={{ marginBottom: 'var(--sp-24)' }}>
            <label style={{ display: 'block', marginBottom: 'var(--sp-8)', fontWeight: 'var(--weight-medium)' }}>Confirm Password</label>
            <input
              type="password"
              {...register('confirmPassword')}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid var(--color-mist-divider)',
                borderRadius: 'var(--r-xs)',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                fontSize: 'var(--text-body)',
              }}
            />
            {errors.confirmPassword && <span style={{ color: 'var(--color-hot-pink)', fontSize: 'var(--text-caption)', marginTop: 4, display: 'block' }}>{errors.confirmPassword.message}</span>}
          </div>
          
          <button type="submit" disabled={isSubmitting} className="pv-btn pv-btn--dark" style={{ width: '100%' }}>
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </form>
        
        <p style={{ marginTop: 'var(--sp-20)', textAlign: 'center', color: 'var(--color-slate-text)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--color-ink-black)', fontWeight: 'var(--weight-medium)' }}>Login here</Link>
        </p>
      </div>
    </div>
  );
}
