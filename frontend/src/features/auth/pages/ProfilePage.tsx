import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../../contexts/AuthContext';
import { authService } from '../services/authService';

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

const passwordSchema = z.object({
  oldPassword: z.string().optional(),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your new password')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ProfileForm = z.infer<typeof profileSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const { user, updateUser } = useAuth();

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [pwdSuccess, setPwdSuccess] = useState(false);
  const [pwdError, setPwdError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || ''
    }
  });

  const { register: registerPwd, handleSubmit: handlePwdSubmit, formState: { errors: pwdErrors, isSubmitting: isPwdSubmitting }, reset: resetPwd } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema)
  });

  const onSubmit = async (data: ProfileForm) => {
    try {
      setSuccess(false);
      setError(null);
      const updatedUser = await authService.updateProfile({ name: data.name });
      updateUser(updatedUser);
      setSuccess(true);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      setError(e.response?.data?.error || 'Failed to update profile');
    }
  };

  const onPasswordSubmit = async (data: PasswordForm) => {
    try {
      setPwdSuccess(false);
      setPwdError(null);
      await authService.updatePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword
      });
      setPwdSuccess(true);
      resetPwd();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string, message?: string } } };
      setPwdError(e.response?.data?.message || e.response?.data?.error || 'Failed to update password');
    }
  };

  if (!user) return <div className="pv-container" style={{ padding: 'var(--sp-48)' }}>Loading profile...</div>;

  return (
    <div className="pv-container" style={{ padding: 'var(--sp-48) var(--sp-24)', background: 'var(--surface-sky-wash)', minHeight: '100vh' }}>
      <div className="pv-card" style={{ maxWidth: 600, margin: '0 auto', background: 'var(--color-paper-white)', borderRadius: 'var(--r-3xl)', padding: 'var(--sp-32)', border: '1px solid var(--color-carbon)' }}>
        <h2 style={{ fontFamily: 'var(--font-lateral)', fontSize: 'var(--text-heading)', letterSpacing: 'var(--tracking-heading)', marginBottom: 'var(--sp-24)', color: 'var(--color-carbon)', lineHeight: '0.8', textTransform: 'uppercase' }}>
          Profile
        </h2>

        {success && (
          <div style={{ color: 'var(--color-carbon)', background: 'var(--color-mint-pop)', padding: 'var(--sp-12)', borderRadius: 'var(--r-full)', fontWeight: 'var(--font-weight-medium)', marginBottom: 'var(--sp-16)', border: '1px solid var(--color-carbon)', textAlign: 'center' }}>
            Profile updated successfully!
          </div>
        )}
        {error && (
          <div style={{ color: 'var(--color-carbon)', background: 'var(--color-ember)', padding: 'var(--sp-12)', borderRadius: 'var(--r-full)', fontWeight: 'var(--font-weight-medium)', marginBottom: 'var(--sp-16)', border: '1px solid var(--color-carbon)', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ marginBottom: 'var(--sp-20)' }}>
            <label style={{ display: 'block', marginBottom: 'var(--sp-8)', fontWeight: 'var(--font-weight-medium)', fontFamily: 'var(--font-aeonik-pro)' }}>
              Email (Read Only)
            </label>
            <input
              type="email"
              value={user.email}
              disabled
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'var(--color-soft-mist)',
                border: 'none',
                borderBottom: '2px solid var(--color-carbon)',
                color: 'var(--color-carbon)',
                boxSizing: 'border-box',
                fontFamily: 'var(--font-aeonik-pro)',
                fontSize: 'var(--text-body-lg)',
              }}
            />
          </div>

          <div style={{ marginBottom: 'var(--sp-24)' }}>
            <label style={{ display: 'block', marginBottom: 'var(--sp-8)', fontWeight: 'var(--font-weight-medium)', fontFamily: 'var(--font-aeonik-pro)' }}>
              Name
            </label>
            <input
              type="text"
              {...register('name')}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: 'none',
                borderBottom: '2px solid var(--color-carbon)',
                background: 'var(--color-soft-mist)',
                boxSizing: 'border-box',
                fontFamily: 'var(--font-aeonik-pro)',
                fontSize: 'var(--text-body-lg)',
                color: 'var(--color-carbon)',
              }}
            />
            {errors.name && (
              <span style={{ color: 'var(--color-carbon)', background: 'var(--color-ember)', padding: '2px var(--sp-8)', borderRadius: 'var(--r-full)', fontSize: 'var(--text-caption)', marginTop: 'var(--sp-8)', display: 'inline-block', border: '1px solid var(--color-carbon)' }}>
                {errors.name.message}
              </span>
            )}
          </div>

          <button type="submit" disabled={isSubmitting} style={{ width: '100%', padding: '12px 24px', background: 'var(--color-carbon)', color: 'var(--color-paper-white)', border: '1px solid var(--color-carbon)', borderRadius: 'var(--r-full)', fontFamily: 'var(--font-aeonik-pro)', fontWeight: 'var(--font-weight-bold)', cursor: 'pointer', fontSize: 'var(--text-body-lg)' }}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </form>

        <>
          <hr style={{ margin: 'var(--sp-32) 0', border: 'none', borderTop: '1px solid var(--color-carbon)' }} />

          <h3 style={{ fontFamily: 'var(--font-lateral)', fontSize: 'var(--text-heading-sm)', margin: 'var(--sp-32) 0 var(--sp-24) 0', color: 'var(--color-carbon)', textTransform: 'uppercase' }}>Change Password</h3>

            {pwdSuccess && (
              <div style={{ color: 'var(--color-carbon)', background: 'var(--color-mint-pop)', padding: 'var(--sp-12)', borderRadius: 'var(--r-full)', fontWeight: 'var(--font-weight-medium)', marginBottom: 'var(--sp-16)', border: '1px solid var(--color-carbon)', textAlign: 'center' }}>
                Password changed successfully!
              </div>
            )}
            {pwdError && (
              <div style={{ color: 'var(--color-carbon)', background: 'var(--color-ember)', padding: 'var(--sp-12)', borderRadius: 'var(--r-full)', fontWeight: 'var(--font-weight-medium)', marginBottom: 'var(--sp-16)', border: '1px solid var(--color-carbon)', textAlign: 'center' }}>
                {pwdError}
              </div>
            )}

            <form onSubmit={handlePwdSubmit(onPasswordSubmit)}>
              <div style={{ marginBottom: 'var(--sp-20)' }}>
                <label style={{ display: 'block', marginBottom: 'var(--sp-8)', fontWeight: 'var(--font-weight-medium)', fontFamily: 'var(--font-aeonik-pro)' }}>
                  Old Password
                </label>
                <input
                  type="password"
                  {...registerPwd('oldPassword')}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: 'none',
                    borderBottom: '2px solid var(--color-carbon)',
                    background: 'var(--color-soft-mist)',
                    boxSizing: 'border-box',
                    fontFamily: 'var(--font-aeonik-pro)',
                    fontSize: 'var(--text-body-lg)',
                    color: 'var(--color-carbon)',
                  }}
                />
                {pwdErrors.oldPassword && (
                  <span style={{ color: 'var(--color-carbon)', background: 'var(--color-ember)', padding: '2px var(--sp-8)', borderRadius: 'var(--r-full)', fontSize: 'var(--text-caption)', marginTop: 'var(--sp-8)', display: 'inline-block', border: '1px solid var(--color-carbon)' }}>
                    {pwdErrors.oldPassword.message}
                  </span>
                )}
              </div>

              <div style={{ marginBottom: 'var(--sp-20)' }}>
                <label style={{ display: 'block', marginBottom: 'var(--sp-8)', fontWeight: 'var(--font-weight-medium)', fontFamily: 'var(--font-aeonik-pro)' }}>
                  New Password
                </label>
                <input
                  type="password"
                  {...registerPwd('newPassword')}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: 'none',
                    borderBottom: '2px solid var(--color-carbon)',
                    background: 'var(--color-soft-mist)',
                    boxSizing: 'border-box',
                    fontFamily: 'var(--font-aeonik-pro)',
                    fontSize: 'var(--text-body-lg)',
                    color: 'var(--color-carbon)',
                  }}
                />
                {pwdErrors.newPassword && (
                  <span style={{ color: 'var(--color-carbon)', background: 'var(--color-ember)', padding: '2px var(--sp-8)', borderRadius: 'var(--r-full)', fontSize: 'var(--text-caption)', marginTop: 'var(--sp-8)', display: 'inline-block', border: '1px solid var(--color-carbon)' }}>
                    {pwdErrors.newPassword.message}
                  </span>
                )}
              </div>

              <div style={{ marginBottom: 'var(--sp-24)' }}>
                <label style={{ display: 'block', marginBottom: 'var(--sp-8)', fontWeight: 'var(--font-weight-medium)', fontFamily: 'var(--font-aeonik-pro)' }}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  {...registerPwd('confirmPassword')}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: 'none',
                    borderBottom: '2px solid var(--color-carbon)',
                    background: 'var(--color-soft-mist)',
                    boxSizing: 'border-box',
                    fontFamily: 'var(--font-aeonik-pro)',
                    fontSize: 'var(--text-body-lg)',
                    color: 'var(--color-carbon)',
                  }}
                />
                {pwdErrors.confirmPassword && (
                  <span style={{ color: 'var(--color-carbon)', background: 'var(--color-ember)', padding: '2px var(--sp-8)', borderRadius: 'var(--r-full)', fontSize: 'var(--text-caption)', marginTop: 'var(--sp-8)', display: 'inline-block', border: '1px solid var(--color-carbon)' }}>
                    {pwdErrors.confirmPassword.message}
                  </span>
                )}
              </div>

              <button type="submit" disabled={isPwdSubmitting} style={{ width: '100%', padding: '12px 24px', background: 'var(--color-paper-white)', color: 'var(--color-carbon)', border: '1px solid var(--color-carbon)', borderRadius: 'var(--r-full)', fontFamily: 'var(--font-aeonik-pro)', fontWeight: 'var(--font-weight-bold)', cursor: 'pointer', fontSize: 'var(--text-body-lg)' }}>
                {isPwdSubmitting ? 'Updating...' : 'Update Password'}
              </button>
            </form>
        </>
      </div>
    </div>
  );
}
