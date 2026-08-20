import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TABS = [
  { to: '/', label: 'Dashboard' },
  { to: '/employees', label: 'Employees' },
  { to: '/departments', label: 'Departments' },
  { to: '/designations', label: 'Designations' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <nav className="sidebar">
      <div className="sidebar-brand">Personnel</div>
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === '/'}
          className={({ isActive }) => `sidebar-tab${isActive ? ' active' : ''}`}
        >
          {tab.label}
        </NavLink>
      ))}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <strong>{user?.username}</strong>
          {user?.role}
        </div>
        <button type="button" className="btn btn-sm" onClick={logout} style={{ width: '100%' }}>
          Sign out
        </button>
      </div>
    </nav>
  );
}