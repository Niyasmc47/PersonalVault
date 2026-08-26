import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { ArrowRight } from 'lucide-react';

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
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '50%', background: 'var(--color-mint-pop)', border: '2px solid var(--color-carbon)', marginBottom: '16px' }}>
            <span style={{ fontFamily: 'var(--font-lateral)', fontSize: '20px' }}>PV</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-lateral)', fontSize: '32px', textTransform: 'uppercase', lineHeight: 1 }}>
            Join Us
          </h2>
          <p style={{ marginTop: '8px', color: 'var(--color-carbon)', opacity: 0.8, fontWeight: 'bold' }}>Create your PersonalVault account.</p>
        </div>

        {error && (
          <div style={{ background: 'var(--color-ember)', color: 'var(--color-paper-white)', padding: '12px', borderRadius: '8px', fontWeight: 'bold', marginBottom: '24px', textAlign: 'center', border: '2px solid var(--color-carbon)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Full Name</label>
            <input type="text" {...register('name')} style={inputStyle} placeholder="Name" />
            {errors.name && <span style={{ color: 'var(--color-ember)', fontSize: '13px', marginTop: '6px', display: 'block', fontWeight: 'bold' }}>{errors.name.message}</span>}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Email Address</label>
            <input type="email" {...register('email')} style={inputStyle} placeholder="you@example.com" />
            {errors.email && <span style={{ color: 'var(--color-ember)', fontSize: '13px', marginTop: '6px', display: 'block', fontWeight: 'bold' }}>{errors.email.message}</span>}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Password</label>
            <input type="password" {...register('password')} style={inputStyle} placeholder="••••••••" />
            {errors.password && <span style={{ color: 'var(--color-ember)', fontSize: '13px', marginTop: '6px', display: 'block', fontWeight: 'bold' }}>{errors.password.message}</span>}
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={labelStyle}>Confirm Password</label>
            <input type="password" {...register('confirmPassword')} style={inputStyle} placeholder="••••••••" />
            {errors.confirmPassword && <span style={{ color: 'var(--color-ember)', fontSize: '13px', marginTop: '6px', display: 'block', fontWeight: 'bold' }}>{errors.confirmPassword.message}</span>}
          </div>

          <button type="submit" disabled={isSubmitting} className="pv-btn pv-btn--dark" style={{ width: '100%', padding: '14px', fontSize: '16px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
            {isSubmitting ? 'Registering...' : (
              <>Create Account <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <p style={{ fontWeight: 'bold' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--color-electric-blue)', textDecoration: 'underline', textUnderlineOffset: '4px' }}>
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
