import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { ArrowRight } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setError(null);
      await login(data);
      navigate('/home');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      setError(e.response?.data?.error || 'Failed to login');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    border: '2px solid var(--color-carbon)',
    borderRadius: '12px',
    boxSizing: 'border-box' as const,
    fontFamily: 'inherit',
    fontSize: '15px',
    fontWeight: 'var(--font-weight-bold)',
    background: 'var(--surface-paper-white)',
    outline: 'none',
    boxShadow: '2px 2px 0px var(--color-carbon)',
    transition: 'all 0.1s'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'var(--font-weight-bold)',
    fontSize: '14px'
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-sky-wash)', padding: 'var(--sp-48) var(--card-pad)' }}>
      <div className="pv-card" style={{ width: '100%', maxWidth: '440px', padding: '40px 32px', boxShadow: '8px 8px 0px var(--color-carbon)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '50%', background: 'var(--color-sunburst)', border: '2px solid var(--color-carbon)', marginBottom: '16px' }}>
            <span style={{ fontFamily: 'var(--font-lateral)', fontSize: '20px' }}>PV</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-lateral)', fontSize: '32px', textTransform: 'uppercase', lineHeight: 1 }}>
            Welcome Back
          </h2>
          <p style={{ marginTop: '8px', color: 'var(--color-carbon)', opacity: 0.8, fontWeight: 'bold' }}>Login to access your PersonalVault.</p>
        </div>

        {error && (
          <div style={{ background: 'var(--color-ember)', color: 'var(--color-paper-white)', padding: '12px', borderRadius: '8px', fontWeight: 'bold', marginBottom: '24px', textAlign: 'center', border: '2px solid var(--color-carbon)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Email Address</label>
            <input type="email" {...register('email')} style={inputStyle} placeholder="you@example.com" />
            {errors.email && <span style={{ color: 'var(--color-ember)', fontSize: '13px', marginTop: '6px', display: 'block', fontWeight: 'bold' }}>{errors.email.message}</span>}
          </div>
          
          <div style={{ marginBottom: '32px' }}>
            <label style={labelStyle}>Password</label>
            <input type="password" {...register('password')} style={inputStyle} placeholder="••••••••" />
            {errors.password && <span style={{ color: 'var(--color-ember)', fontSize: '13px', marginTop: '6px', display: 'block', fontWeight: 'bold' }}>{errors.password.message}</span>}
          </div>
          
          <button type="submit" disabled={isSubmitting} className="pv-btn pv-btn--dark" style={{ width: '100%', padding: '14px', fontSize: '16px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
            {isSubmitting ? 'Logging in...' : (
              <>Login Securely <ArrowRight size={18} /></>
            )}
          </button>
        </form>
        
        <div style={{ display: 'flex', alignItems: 'center', margin: '32px 0', gap: '16px' }}>
          <div style={{ flex: 1, height: '2px', background: 'var(--color-carbon)' }}></div>
          <span style={{ fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase' }}>OR</span>
          <div style={{ flex: 1, height: '2px', background: 'var(--color-carbon)' }}></div>
        </div>

        <button 
          onClick={() => window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/oauth2/authorization/google`}
          className="pv-btn pv-btn--light"
          style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '12px', padding: '14px', fontSize: '15px' }}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
            <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
              <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
              <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
              <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
              <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
            </g>
          </svg>
          Continue with Google
        </button>

        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <p style={{ fontWeight: 'bold' }}>
            New here?{' '}
            <Link to="/register" style={{ color: 'var(--color-electric-blue)', textDecoration: 'underline', textUnderlineOffset: '4px' }}>
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
