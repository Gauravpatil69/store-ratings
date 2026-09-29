import { useState } from 'react';
import { apiFetch } from '../api/client';
import { validatePassword } from '../lib/validators';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSuccess(false);

    const newPwdErr = validatePassword(newPassword);
    if (!currentPassword || newPwdErr) {
      setErrors({
        currentPassword: !currentPassword ? 'Required' : null,
        newPassword: newPwdErr,
      });
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      await apiFetch('/auth/password', {
        method: 'PATCH',
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setSubmitError(err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center pt-12">
      <Card className="w-full max-w-sm">
        <h1 className="mb-6 text-center font-bold">Change Password</h1>
        {submitError && <div className="text-danger mb-4 text-center">{submitError}</div>}
        {success && (
          <div className="text-accent mb-4 text-center">Password changed successfully</div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block font-medium">Current Password</label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              error={errors.currentPassword}
            />
          </div>
          <div>
            <label className="mb-1 block font-medium">New Password</label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              error={errors.newPassword}
            />
          </div>
          <Button type="submit" disabled={loading} className="mt-2">
            {loading ? 'Changing...' : 'Change Password'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
