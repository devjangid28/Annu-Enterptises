import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) =>
    location.pathname === path || (path === '/orders' && location.pathname.startsWith('/invoice'))
      ? 'nav-link active'
      : 'nav-link';

  const closeMobile = () => setMobileOpen(false);

  return (
    <div className={`app-layout ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''} ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <span className="brand-badge">AE</span>
            <span className="brand-name">ANNU ENTERPRISES</span>
          </div>
          <button className="sidebar-close-mobile" onClick={closeMobile}>✕</button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-title">Invoice</div>
          <Link to="/" className={isActive('/')} onClick={closeMobile}>
            <span className="nav-icon">
              <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
            </span>
            <span className="nav-label">Create Invoice</span>
          </Link>
          <div className="nav-section-title">Manage</div>
          <Link to="/orders" className={isActive('/orders')} onClick={closeMobile}>
            <span className="nav-icon">
              <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            </span>
            <span className="nav-label">All Orders</span>
          </Link>
          <div className="nav-section-title">General</div>
          <Link to="/settings" className={isActive('/settings')} onClick={closeMobile}>
            <span className="nav-icon">
              <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            </span>
            <span className="nav-label">Settings</span>
          </Link>
        </nav>

        <div className="sidebar-footer">
          <button className="collapse-toggle" onClick={() => setCollapsed(!collapsed)}>
            <span className="collapse-icon">{collapsed ? '▶' : '◀'}</span>
            <span className="nav-label">Collapse</span>
          </button>
        </div>
      </aside>

      {mobileOpen && <div className="sidebar-overlay" onClick={closeMobile} />}

      <div className="sidebar-mobile-toggle" onClick={() => setMobileOpen(true)}>
        <span />
        <span />
        <span />
      </div>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
