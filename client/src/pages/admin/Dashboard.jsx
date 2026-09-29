import { useEffect, useState } from 'react';
import { apiFetch } from '../../api/client';
import Card from '../../components/ui/Card';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await apiFetch('/stats');
        setStats(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="mb-6">Admin Dashboard</h1>
      {error && <div className="text-danger mb-4">{error}</div>}
      {loading && <div className="text-muted">Loading stats...</div>}
      {stats && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <h2 className="text-muted mb-2 font-medium">Total Users</h2>
            <div className="font-semibold">{stats.users}</div>
          </Card>
          <Card>
            <h2 className="text-muted mb-2 font-medium">Total Stores</h2>
            <div className="font-semibold">{stats.stores}</div>
          </Card>
          <Card>
            <h2 className="text-muted mb-2 font-medium">Total Ratings</h2>
            <div className="font-semibold">{stats.ratings}</div>
          </Card>
        </div>
      )}
    </div>
  );
}
