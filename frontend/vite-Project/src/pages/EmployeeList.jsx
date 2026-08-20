import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { listEmployees, deleteEmployee } from '../services/employeeService';
import { departmentService, designationService } from '../services/lookupService';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import Pagination from '../components/Pagination';

function formatSalary(value) {
  if (!value) return '—';
  return `₹${Number(value).toLocaleString('en-IN')}`;
}

export default function EmployeeList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const canWrite = user.role === 'admin' || user.role === 'hr';
  const canDelete = user.role === 'admin';

  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [designationId, setDesignationId] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    departmentService.list().then(setDepartments).catch(() => {});
    designationService.list().then(setDesignations).catch(() => {});
  }, []);

  const fetchEmployees = useCallback(() => {
    setLoading(true);
    setError('');
    listEmployees({ search, departmentId, designationId, status, page, limit: 10 })
      .then((res) => {
        setRows(res.data);
        setPagination(res.pagination);
      })
      .catch(() => setError('Could not load employees.'))
      .finally(() => setLoading(false));
  }, [search, departmentId, designationId, status, page]);

  // Small debounce so search/filter changes don't fire a request per keystroke.
  useEffect(() => {
    const timer = setTimeout(fetchEmployees, 250);
    return () => clearTimeout(timer);
  }, [fetchEmployees]);

  async function handleDelete(id, name) {
    if (!window.confirm(`Remove ${name} from the registry?`)) return;
    try {
      await deleteEmployee(id);
      fetchEmployees();
    } catch {
      setError('Could not delete that employee.');
    }
  }

  function handleFilterChange(setter) {
    return (e) => {
      setPage(1);
      setter(e.target.value);
    };
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Employees</h1>
          <p className="page-subtitle">{pagination.total} on record</p>
        </div>
        {canWrite && <Link to="/employees/new" className="btn btn-primary">Add employee</Link>}
      </div>

      <div className="toolbar">
        <input placeholder="Search name or email…" value={search} onChange={handleFilterChange(setSearch)} />
        <select value={departmentId} onChange={handleFilterChange(setDepartmentId)}>
          <option value="">All departments</option>
          {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <select value={designationId} onChange={handleFilterChange(setDesignationId)}>
          <option value="">All designations</option>
          {designations.map((d) => <option key={d.id} value={d.id}>{d.title}</option>)}
        </select>
        <select value={status} onChange={handleFilterChange(setStatus)}>
          <option value="">Any status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Salary</th>
                <th>Status</th>
                {canWrite && <th></th>}
              </tr>
            </thead>
            <tbody>
              {rows.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.first_name} {emp.last_name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.department_name || '—'}</td>
                  <td>{emp.designation_title || '—'}</td>
                  <td className="cell-mono">{formatSalary(emp.salary)}</td>
                  <td><StatusBadge status={emp.status} /></td>
                  {canWrite && (
                    <td className="row-actions">
                      <button type="button" className="btn btn-sm" onClick={() => navigate(`/employees/${emp.id}/edit`)}>Edit</button>
                      {canDelete && (
                        <button type="button" className="btn btn-sm btn-danger" onClick={() => handleDelete(emp.id, emp.first_name)}>Delete</button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && rows.length === 0 && <div className="empty-state">No employees match these filters yet.</div>}
      </div>

      <Pagination page={pagination.page} totalPages={pagination.totalPages} onChange={setPage} />
    </>
  );
}