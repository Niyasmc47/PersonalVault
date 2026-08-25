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
    <div className="pv-container" style={{ paddingTop: 'var(--sp-48)', paddingBottom: 'var(--sp-48)' }}>
      <div className="pv-card" style={{ maxWidth: 600, margin: '0 auto' }}>
        <h2 style={{ fontSize: 'var(--text-heading)', letterSpacing: 'var(--tracking-heading)', marginBottom: 'var(--sp-24)' }}>
          Profile
        </h2>

        {success && (
          <div style={{ color: 'var(--color-mint-green)', fontWeight: 'var(--weight-medium)', marginBottom: 'var(--sp-16)' }}>
            Profile updated successfully!
          </div>
        )}
        {error && (
          <div style={{ color: 'var(--color-hot-pink)', fontWeight: 'var(--weight-medium)', marginBottom: 'var(--sp-16)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ marginBottom: 'var(--sp-20)' }}>
            <label style={{ display: 'block', marginBottom: 'var(--sp-8)', fontWeight: 'var(--weight-medium)' }}>
              Email (Read Only)
            </label>
            <input
              type="email"
              value={user.email}
              disabled
              style={{
                width: '100%',
                padding: '10px 12px',
                background: 'var(--surface-canvas)',
                border: '1px solid var(--color-mist-divider)',
                borderRadius: 'var(--r-xs)',
                color: 'var(--color-slate-text)',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                fontSize: 'var(--text-body)',
              }}
            />
          </div>

          <div style={{ marginBottom: 'var(--sp-24)' }}>
            <label style={{ display: 'block', marginBottom: 'var(--sp-8)', fontWeight: 'var(--weight-medium)' }}>
              Name
            </label>
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
            {errors.name && (
              <span style={{ color: 'var(--color-hot-pink)', fontSize: 'var(--text-caption)', marginTop: 4, display: 'block' }}>
                {errors.name.message}
              </span>
            )}
          </div>

          <button type="submit" disabled={isSubmitting} className="pv-btn pv-btn--dark">
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </form>

        <>
          <hr style={{ margin: 'var(--sp-32) 0', border: 'none', borderTop: '1px solid var(--color-mist-divider)' }} />

          <h3 style={{ fontSize: '1.25rem', margin: 'var(--sp-32) 0 var(--sp-24) 0' }}>Change Password</h3>

            {pwdSuccess && (
              <div style={{ color: 'var(--color-mint-green)', fontWeight: 'var(--weight-medium)', marginBottom: 'var(--sp-16)' }}>
                Password changed successfully!
              </div>
            )}
            {pwdError && (
              <div style={{ color: 'var(--color-hot-pink)', fontWeight: 'var(--weight-medium)', marginBottom: 'var(--sp-16)' }}>
                {pwdError}
              </div>
            )}

            <form onSubmit={handlePwdSubmit(onPasswordSubmit)}>
              <div style={{ marginBottom: 'var(--sp-20)' }}>
                <label style={{ display: 'block', marginBottom: 'var(--sp-8)', fontWeight: 'var(--weight-medium)' }}>
                  Old Password
                </label>
                <input
                  type="password"
                  {...registerPwd('oldPassword')}
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
                {pwdErrors.oldPassword && (
                  <span style={{ color: 'var(--color-hot-pink)', fontSize: 'var(--text-caption)', marginTop: 4, display: 'block' }}>
                    {pwdErrors.oldPassword.message}
                  </span>
                )}
              </div>

              <div style={{ marginBottom: 'var(--sp-20)' }}>
                <label style={{ display: 'block', marginBottom: 'var(--sp-8)', fontWeight: 'var(--weight-medium)' }}>
                  New Password
                </label>
                <input
                  type="password"
                  {...registerPwd('newPassword')}
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
                {pwdErrors.newPassword && (
                  <span style={{ color: 'var(--color-hot-pink)', fontSize: 'var(--text-caption)', marginTop: 4, display: 'block' }}>
                    {pwdErrors.newPassword.message}
                  </span>
                )}
              </div>

              <div style={{ marginBottom: 'var(--sp-24)' }}>
                <label style={{ display: 'block', marginBottom: 'var(--sp-8)', fontWeight: 'var(--weight-medium)' }}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  {...registerPwd('confirmPassword')}
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
                {pwdErrors.confirmPassword && (
                  <span style={{ color: 'var(--color-hot-pink)', fontSize: 'var(--text-caption)', marginTop: 4, display: 'block' }}>
                    {pwdErrors.confirmPassword.message}
                  </span>
                )}
              </div>

              <button type="submit" disabled={isPwdSubmitting} className="pv-btn pv-btn--dark">
                {isPwdSubmitting ? 'Updating...' : 'Update Password'}
              </button>
            </form>
        </>
      </div>
    </div>
  );
}
