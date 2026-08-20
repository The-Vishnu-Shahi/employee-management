import { useEffect, useState } from 'react';
import { listEmployees } from '../services/employeeService';
import { departmentService } from '../services/lookupService';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totals, setTotals] = useState({ total: 0, active: 0, inactive: 0 });
  const [byDepartment, setByDepartment] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const [allRes, activeRes, inactiveRes, departments] = await Promise.all([
          listEmployees({ limit: 1 }),
          listEmployees({ limit: 1, status: 'active' }),
          listEmployees({ limit: 1, status: 'inactive' }),
          departmentService.list(),
        ]);

        // Each department's count reuses the same list endpoint with limit=1 -
        // pagination.total gives the count without fetching every row.
        const counts = await Promise.all(
          departments.map((dept) =>
            listEmployees({ limit: 1, departmentId: dept.id }).then((res) => ({
              id: dept.id,
              name: dept.name,
              count: res.pagination.total,
            }))
          )
        );

        if (cancelled) return;
        setTotals({
          total: allRes.pagination.total,
          active: activeRes.pagination.total,
          inactive: inactiveRes.pagination.total,
        });
        setByDepartment(counts);
      } catch {
        if (!cancelled) setError('Could not load dashboard data.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="page-subtitle">Welcome back, {user?.username}.</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <p className="page-subtitle">Loading…</p>
      ) : (
        <>
          <div className="stat-grid">
            <div className="stat-card">
              <span className="stat-value">{totals.total}</span>
              <span className="stat-label">Total employees</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{totals.active}</span>
              <span className="stat-label">Active</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{totals.inactive}</span>
              <span className="stat-label">Inactive</span>
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: 16, fontSize: 16 }}>By department</h3>
            {byDepartment.length === 0 ? (
              <p className="page-subtitle">No departments yet.</p>
            ) : (
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr><th>Department</th><th>Employees</th></tr>
                  </thead>
                  <tbody>
                    {byDepartment.map((d) => (
                      <tr key={d.id}>
                        <td>{d.name}</td>
                        <td className="cell-mono">{d.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}