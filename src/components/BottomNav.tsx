import { Check, Folder, Home, Plus, User, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../store/AppProvider';

export function BottomNav() {
  const { t, createOpen, setCreateOpen } = useApp();

  return (
    <nav className="bottom-nav">
      <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive && !createOpen ? 'active' : ''}`}>
        <span className="nav-ic home">
          <Home size={20} strokeWidth={1.8} />
        </span>
        {t('nav.home')}
      </NavLink>
      <NavLink to="/spaces" className={({ isActive }) => `nav-item ${isActive && !createOpen ? 'active' : ''}`}>
        <span className="nav-ic" style={{ color: '#E2B340' }}>
          <Folder size={20} strokeWidth={1.8} />
        </span>
        {t('nav.spaces')}
      </NavLink>
      <button
        type="button"
        className="nav-item"
        onClick={() => setCreateOpen(!createOpen)}
        aria-label={createOpen ? t('common.close') : t('create.title')}
      >
        <span className={`nav-plus ${createOpen ? 'open' : ''}`}>
          {createOpen ? <X size={22} /> : <Plus size={22} />}
        </span>
      </button>
      <NavLink to="/tasks" className={({ isActive }) => `nav-item ${isActive && !createOpen ? 'active' : ''}`}>
        <span className="nav-ic" style={{ color: '#32C86A' }}>
          <Check size={20} strokeWidth={2.2} />
        </span>
        {t('nav.tasks')}
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive && !createOpen ? 'active' : ''}`}>
        <span className="nav-ic" style={{ color: '#4E86E8' }}>
          <User size={20} strokeWidth={1.8} />
        </span>
        {t('nav.profile')}
      </NavLink>
    </nav>
  );
}
