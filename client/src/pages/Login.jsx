import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../api/client';
import { useAuth } from '../hooks/useAuth';
import { validateEmail, validatePassword } from '../lib/validators';
import { HOME_ROUTES } from '../lib/constants';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    const emailErr = validateEmail(email);
    // login validation doesn't strictly need password strength check, but we can do a simple check
    const passwordErr = !password ? 'Password is required' : null;

    if (emailErr || passwordErr) {
      setErrors({ email: emailErr, password: passwordErr });
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      const res = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      login(res.user, res.token);
      navigate(HOME_ROUTES[res.user.role] || '/');
    } catch (err) {
      setSubmitError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center pt-12">
      <Card className="w-full max-w-sm">
        <h1 className="mb-6 text-center font-bold">Log In</h1>
        {submitError && <div className="text-danger mb-4 text-center">{submitError}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block font-medium">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              autoComplete="email"
            />
          </div>
          <div>
            <label className="mb-1 block font-medium">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" disabled={loading} className="mt-2">
            {loading ? 'Logging in...' : 'Log In'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
