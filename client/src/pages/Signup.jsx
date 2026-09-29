import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../api/client';
import { validateName, validateEmail, validatePassword, validateAddress } from '../lib/validators';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', address: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    const newErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      address: validateAddress(formData.address),
      password: validatePassword(formData.password),
    };

    if (Object.values(newErrors).some(Boolean)) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      await apiFetch('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      navigate('/login');
    } catch (err) {
      setSubmitError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center pt-12">
      <Card className="w-full max-w-sm">
        <h1 className="mb-6 text-center font-bold">Sign Up</h1>
        {submitError && <div className="text-danger mb-4 text-center">{submitError}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block font-medium">Name</label>
            <Input name="name" value={formData.name} onChange={handleChange} error={errors.name} />
          </div>
          <div>
            <label className="mb-1 block font-medium">Email</label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />
          </div>
          <div>
            <label className="mb-1 block font-medium">Address</label>
            <Input
              name="address"
              value={formData.address}
              onChange={handleChange}
              error={errors.address}
            />
          </div>
          <div>
            <label className="mb-1 block font-medium">Password</label>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
            />
          </div>
          <Button type="submit" disabled={loading} className="mt-2">
            {loading ? 'Signing up...' : 'Sign Up'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
