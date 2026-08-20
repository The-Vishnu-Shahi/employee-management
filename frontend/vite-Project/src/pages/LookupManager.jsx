import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LookupManager({ title, subtitle, itemLabel, fieldKey, service }) {
  const { user } = useAuth();
  const canWrite = user.role === 'admin' || user.role === 'hr';
  const canDelete = user.role === 'admin';

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newValue, setNewValue] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState('');

  function load() {
    setLoading(true);
    service.list()
      .then(setItems)
      .catch(() => setError(`Could not load ${title.toLowerCase()}.`))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleCreate(e) {
    e.preventDefault();
    if (!newValue.trim()) return;
    try {
      await service.create(newValue.trim());
      setNewValue('');
      load();
    } catch (err) {
      setError(err.response?.data?.message || `Could not add that ${itemLabel.toLowerCase()}.`);
    }
  }

  async function handleUpdate(id) {
    if (!editingValue.trim()) return;
    try {
      await service.update(id, editingValue.trim());
      setEditingId(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || `Could not update that ${itemLabel.toLowerCase()}.`);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm(`Remove this ${itemLabel.toLowerCase()}?`)) return;
    try {
      await service.remove(id);
      load();
    } catch {
      setError(`Could not remove that ${itemLabel.toLowerCase()}. It may still be assigned to employees.`);
    }
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1>{title}</h1>
          <p className="page-subtitle">{subtitle}</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {canWrite && (
        <form onSubmit={handleCreate} className="toolbar">
          <input
            placeholder={`New ${itemLabel.toLowerCase()} name…`}
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Add</button>
        </form>
      )}

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr><th>{itemLabel}</th>{canWrite && <th></th>}</tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    {editingId === item.id ? (
                      <input value={editingValue} onChange={(e) => setEditingValue(e.target.value)} autoFocus />
                    ) : (
                      item[fieldKey]
                    )}
                  </td>
                  {canWrite && (
                    <td className="row-actions">
                      {editingId === item.id ? (
                        <>
                          <button type="button" className="btn btn-sm btn-primary" onClick={() => handleUpdate(item.id)}>Save</button>
                          <button type="button" className="btn btn-sm" onClick={() => setEditingId(null)}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            className="btn btn-sm"
                            onClick={() => { setEditingId(item.id); setEditingValue(item[fieldKey]); }}
                          >
                            Edit
                          </button>
                          {canDelete && (
                            <button type="button" className="btn btn-sm btn-danger" onClick={() => handleDelete(item.id)}>Delete</button>
                          )}
                        </>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && items.length === 0 && <div className="empty-state">No {title.toLowerCase()} yet.</div>}
      </div>
    </>
  );
}