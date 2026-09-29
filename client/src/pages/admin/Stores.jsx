import { useState, useEffect } from 'react';
import { useList } from '../../hooks/useList';
import { apiFetch } from '../../api/client';
import { validateName, validateEmail, validateAddress } from '../../lib/validators';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import StarRating from '../../components/ui/StarRating';

export default function AdminStores() {
  const {
    data: stores,
    loading,
    error,
    filters,
    setFilters,
    sort,
    setSort,
    refetch,
  } = useList('/stores');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [users, setUsers] = useState([]);

  // Add Store Form State
  const [formData, setFormData] = useState({ name: '', email: '', address: '', ownerId: '' });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    // Fetch users who are owners to populate the select dropdown
    const fetchOwners = async () => {
      try {
        const res = await apiFetch('/users?role=OWNER');
        setUsers(res.users);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOwners();
  }, []);

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSort = (key) => {
    setSort((prev) => ({
      field: key,
      order: prev.field === key && prev.order === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    const newErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      address: validateAddress(formData.address),
    };

    if (Object.values(newErrors).some(Boolean)) {
      setFormErrors(newErrors);
      return;
    }
    setFormErrors({});
    setSubmitting(true);

    try {
      const body = { ...formData };
      if (body.ownerId) {
        body.ownerId = parseInt(body.ownerId, 10);
      } else {
        delete body.ownerId;
      }

      await apiFetch('/stores', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      setAddModalOpen(false);
      setFormData({ name: '', email: '', address: '', ownerId: '' });
      refetch();
    } catch (err) {
      setSubmitError(err.message || 'Failed to create store');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    {
      key: 'avgRating',
      label: 'Rating',
      sortable: true,
      render: (row) => <StarRating value={row.avgRating || 0} readOnly />,
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1>Stores Management</h1>
        <Button onClick={() => setAddModalOpen(true)}>Add Store</Button>
      </div>

      <Card className="mb-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Input
            name="name"
            placeholder="Filter by Name"
            value={filters.name || ''}
            onChange={handleFilterChange}
          />
          <Input
            name="email"
            placeholder="Filter by Email"
            value={filters.email || ''}
            onChange={handleFilterChange}
          />
          <Input
            name="address"
            placeholder="Filter by Address"
            value={filters.address || ''}
            onChange={handleFilterChange}
          />
        </div>
      </Card>

      <Card>
        {error && <div className="text-danger mb-4">{error}</div>}
        {loading && <div className="text-muted mb-4">Loading stores...</div>}
        <Table columns={columns} rows={stores} sort={sort} onSort={handleSort} />
      </Card>

      <Modal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} title="Add Store">
        {submitError && <div className="text-danger mb-4">{submitError}</div>}
        <form onSubmit={handleAddSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block font-medium">Name</label>
            <Input
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={formErrors.name}
            />
          </div>
          <div>
            <label className="mb-1 block font-medium">Email</label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={formErrors.email}
            />
          </div>
          <div>
            <label className="mb-1 block font-medium">Address</label>
            <Input
              name="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              error={formErrors.address}
            />
          </div>
          <div>
            <label className="mb-1 block font-medium">Owner (Optional)</label>
            <Select
              name="ownerId"
              value={formData.ownerId}
              onChange={(e) => setFormData({ ...formData, ownerId: e.target.value })}
            >
              <option value="">No Owner</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
