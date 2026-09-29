import { useList } from '../../hooks/useList';
import { apiFetch } from '../../api/client';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Table from '../../components/ui/Table';
import StarRating from '../../components/ui/StarRating';

export default function UserStores() {
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

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSort = (key) => {
    setSort((prev) => ({
      field: key,
      order: prev.field === key && prev.order === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleRate = async (storeId, value) => {
    try {
      await apiFetch(`/stores/${storeId}/rating`, {
        method: 'PUT',
        body: JSON.stringify({ value }),
      });
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { key: 'name', label: 'Store Name', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    {
      key: 'avgRating',
      label: 'Overall Rating',
      sortable: true,
      render: (row) => <StarRating value={row.avgRating || 0} readOnly />,
    },
    {
      key: 'myRating',
      label: 'My Rating',
      render: (row) => (
        <StarRating value={row.myRating || 0} onChange={(val) => handleRate(row.id, val)} />
      ),
    },
  ];

  return (
    <div>
      <h1 className="mb-6">Stores</h1>

      <Card className="mb-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            name="name"
            placeholder="Search by Name"
            value={filters.name || ''}
            onChange={handleFilterChange}
          />
          <Input
            name="address"
            placeholder="Search by Address"
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
    </div>
  );
}
