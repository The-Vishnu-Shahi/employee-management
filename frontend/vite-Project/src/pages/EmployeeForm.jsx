import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { createEmployee, updateEmployee, getEmployee } from '../services/employeeService';
import { departmentService, designationService } from '../services/lookupService';
import { useAuth } from '../context/AuthContext';

export default function EmployeeForm() {
  const { user } = useAuth();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      first_name: '', last_name: '', email: '', phone: '',
      department_id: '', designation_id: '', date_of_joining: '', salary: '', status: 'active',
    },
  });

  useEffect(() => {
    departmentService.list().then(setDepartments).catch(() => {});
    designationService.list().then(setDesignations).catch(() => {});
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    getEmployee(id)
      .then((emp) => {
        reset({
          first_name: emp.first_name || '',
          last_name: emp.last_name || '',
          email: emp.email || '',
          phone: emp.phone || '',
          department_id: emp.department_id || '',
          designation_id: emp.designation_id || '',
          date_of_joining: emp.date_of_joining ? emp.date_of_joining.slice(0, 10) : '',
          salary: emp.salary || '',
          status: emp.status || 'active',
        });
      })
      .finally(() => setLoading(false));
  }, [id, isEdit, reset]);

  // Server enforces this too - this just avoids showing a form only to have it rejected.
  if (user.role !== 'admin' && user.role !== 'hr') {
    return <Navigate to="/employees" replace />;
  }

  async function onSubmit(values) {
    setServerError('');
    const payload = {
      ...values,
      department_id: values.department_id ? Number(values.department_id) : null,
      designation_id: values.designation_id ? Number(values.designation_id) : null,
      salary: values.salary ? Number(values.salary) : null,
      date_of_joining: values.date_of_joining || null,
    };

    try {
      if (isEdit) {
        await updateEmployee(id, payload);
      } else {
        await createEmployee(payload);
      }
      navigate('/employees');
    } catch (err) {
      setServerError(
        err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Could not save this employee.'
      );
    }
  }

  if (loading) return <p className="page-subtitle">Loading…</p>;

  return (
    <>
      <div className="page-header">
        <div>
          <h1>{isEdit ? 'Edit employee' : 'Add employee'}</h1>
          <p className="page-subtitle">
            {isEdit ? 'Update this personnel record.' : 'Add a new record to the registry.'}
          </p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 640 }}>
        {serverError && <div className="alert alert-error">{serverError}</div>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="field-row">
            <div className="field">
              <label htmlFor="first_name">First name</label>
              <input id="first_name" {...register('first_name', { required: 'First name is required' })} />
              {errors.first_name && <div className="field-error">{errors.first_name.message}</div>}
            </div>
            <div className="field">
              <label htmlFor="last_name">Last name</label>
              <input id="last_name" {...register('last_name')} />
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
                })}
              />
              {errors.email && <div className="field-error">{errors.email.message}</div>}
            </div>
            <div className="field">
              <label htmlFor="phone">Phone</label>
              <input id="phone" {...register('phone')} />
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="department_id">Department</label>
              <select id="department_id" {...register('department_id')}>
                <option value="">—</option>
                {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="designation_id">Designation</label>
              <select id="designation_id" {...register('designation_id')}>
                <option value="">—</option>
                {designations.map((d) => <option key={d.id} value={d.id}>{d.title}</option>)}
              </select>
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="date_of_joining">Date of joining</label>
              <input id="date_of_joining" type="date" {...register('date_of_joining')} />
            </div>
            <div className="field">
              <label htmlFor="salary">Salary (₹)</label>
              <input id="salary" type="number" step="0.01" min="0" {...register('salary')} />
            </div>
          </div>

          <div className="field" style={{ maxWidth: 200 }}>
            <label htmlFor="status">Status</label>
            <select id="status" {...register('status')}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : isEdit ? 'Save changes' : 'Add employee'}
            </button>
            <button type="button" className="btn" onClick={() => navigate('/employees')}>Cancel</button>
          </div>
        </form>
      </div>
    </>
  );
}