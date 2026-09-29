import { useEffect, useState } from 'react';
import { apiFetch } from '../../api/client';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import StarRating from '../../components/ui/StarRating';

export default function OwnerDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMyStore() {
      try {
        const res = await apiFetch('/stores/mine');
        setData(res);
      } catch (err) {
        setError(err.message || 'Failed to fetch store details');
      } finally {
        setLoading(false);
      }
    }
    fetchMyStore();
  }, []);

  const columns = [
    { key: 'name', label: 'User Name' },
    { key: 'email', label: 'User Email' },
    {
      key: 'rating',
      label: 'Rating',
      render: (row) => <StarRating value={row.rating} readOnly />,
    },
  ];

  if (loading) return <div className="text-muted">Loading dashboard...</div>;
  if (error) return <div className="text-danger">{error}</div>;

  if (!data || !data.store) {
    return <div className="text-muted">You do not own a store yet.</div>;
  }

  return (
    <div>
      <h1 className="mb-6">Owner Dashboard</h1>

      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <Card>
          <h2 className="text-muted mb-2 font-medium">Store Name</h2>
          <div className="font-semibold">{data.store.name}</div>
          <div className="text-muted">{data.store.address}</div>
        </Card>
        <Card>
          <h2 className="text-muted mb-2 font-medium">Average Rating</h2>
          <div className="flex items-center gap-2">
            <span className="font-semibold">{data.average.toFixed(1)}</span>
            <StarRating value={data.average} readOnly />
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="mb-4">Ratings Received</h2>
        <Table columns={columns} rows={data.raters || []} />
      </Card>
    </div>
  );
}
