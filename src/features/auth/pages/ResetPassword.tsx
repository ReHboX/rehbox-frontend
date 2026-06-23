import { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { authApi } from '@/lib/api';

const ResetPassword = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = params.get('token') ?? '';
  const email = params.get('email') ?? '';

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      setMessage('Passwords do not match.');
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const res = await authApi.resetPassword({ token, email, password, password_confirmation: passwordConfirmation });
      setMessage(res.data?.message || 'Password reset successfully.');
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err: any) {
      setMessage(err?.response?.data?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md text-center">
          <p className="text-muted-foreground text-sm mb-4">Invalid or expired reset link.</p>
          <Link to="/forgot-password" className="text-primary font-semibold text-sm">Request a new one</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md">
        <h1 className="font-display font-bold text-2xl mb-2">Reset password</h1>
        <p className="text-muted-foreground text-sm mb-6">Enter your new password below.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">New password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              placeholder="Min. 8 characters"
              className="w-full px-4 py-2.5 rounded-xl border bg-card text-foreground text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Confirm new password</label>
            <input
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
              minLength={8}
              placeholder="Re-enter your new password"
              className="w-full px-4 py-2.5 rounded-xl border bg-card text-foreground text-sm"
            />
          </div>

          {message && (
            <div className={`text-sm text-center ${success ? 'text-green-600' : 'text-muted-foreground'}`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || success}
            className="w-full gradient-primary text-white font-bold py-3 rounded-xl disabled:opacity-50"
          >
            {loading ? 'Resetting…' : success ? 'Done! Redirecting…' : 'Reset password'}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Remembered your password? <Link to="/login" className="text-primary font-semibold">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
