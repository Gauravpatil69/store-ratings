import { useState } from 'react';
import { useList } from '../../hooks/useList';
import { apiFetch } from '../../api/client';
import {
  validateName,
  validateEmail,
  validatePassword,
  validateAddress,
} from '../../lib/validators';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';

export default function AdminUsers() {
  const {
    data: users,
    loading,
    error,
    filters,
    setFilters,
    sort,
    setSort,
    refetch,
  } = useList('/users');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserDetails, setSelectedUserDetails] = useState(null);

  // Add User Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
    role: 'USER',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

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
      password: validatePassword(formData.password),
    };

    if (Object.values(newErrors).some(Boolean)) {
      setFormErrors(newErrors);
      return;
    }
    setFormErrors({});
    setSubmitting(true);

    try {
      await apiFetch('/users', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      setAddModalOpen(false);
      setFormData({ name: '', email: '', address: '', password: '', role: 'USER' });
      refetch();
    } catch (err) {
      setSubmitError(err.message || 'Failed to create user');
    } finally {
      setSubmitting(false);
    }
  };

  const openDetails = async (id) => {
    setSelectedUserId(id);
    setSelectedUserDetails(null);
    setDetailsModalOpen(true);
    try {
      const res = await apiFetch(`/users/${id}`);
      setSelectedUserDetails(res.user);
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <Button variant="ghost" onClick={() => openDetails(row.id)}>
          Details
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1>Users Management</h1>
        <Button onClick={() => setAddModalOpen(true)}>Add User</Button>
      </div>

      <Card className="mb-6">
        <div className="grid gap-4 md:grid-cols-4">
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
          <Select name="role" value={filters.role || ''} onChange={handleFilterChange}>
            <option value="">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="USER">User</option>
            <option value="OWNER">Owner</option>
          </Select>
        </div>
      </Card>

      <Card>
        {error && <div className="text-danger mb-4">{error}</div>}
        {loading && <div className="text-muted mb-4">Loading users...</div>}
        <Table columns={columns} rows={users} sort={sort} onSort={handleSort} />
      </Card>

      <Modal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} title="Add User">
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
            <label className="mb-1 block font-medium">Password</label>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              error={formErrors.password}
            />
          </div>
          <div>
            <label className="mb-1 block font-medium">Role</label>
            <Select
              name="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
              <option value="OWNER">Owner</option>
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

      <Modal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        title="User Details"
      >
        {!selectedUserDetails ? (
          <div className="text-muted">Loading details...</div>
        ) : (
          <div className="flex flex-col gap-3">
            <div>
              <strong>Name:</strong> {selectedUserDetails.name}
            </div>
            <div>
              <strong>Email:</strong> {selectedUserDetails.email}
            </div>
            <div>
              <strong>Address:</strong> {selectedUserDetails.address}
            </div>
            <div>
              <strong>Role:</strong> {selectedUserDetails.role}
            </div>
            {selectedUserDetails.role === 'OWNER' && selectedUserDetails.store && (
              <div>
                <strong>Store Name:</strong> {selectedUserDetails.store.name} <br />
                <strong>Store Rating:</strong>{' '}
                {selectedUserDetails.store.avgRating?.toFixed(1) || '0.0'}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
