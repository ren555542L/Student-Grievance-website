import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const CATEGORIES = ['Academic', 'Hostel', 'Transport', 'Other'];
const STATUSES = ['Pending', 'Resolved'];

// ─────────────── Axios helper ───────────────
const api = (token) =>
  axios.create({
    baseURL: '/api',
    headers: { Authorization: `Bearer ${token}` },
  });

// ─────────────── Submit Form Panel ───────────────
const SubmitForm = ({ token, onSubmitted }) => {
  const [form, setForm] = useState({ title: '', description: '', category: 'Academic' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) {
      toast.error('Title and description are required');
      return;
    }
    setLoading(true);
    try {
      await api(token).post('/grievances', form);
      toast.success('✅ Grievance submitted successfully!');
      setForm({ title: '', description: '', category: 'Academic' });
      onSubmitted();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit grievance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title">📋 Submit a Grievance</span>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="g-title">Title</label>
          <input
            id="g-title"
            type="text"
            name="title"
            placeholder="Brief title of the issue..."
            value={form.title}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="g-category">Category</label>
          <select id="g-category" name="category" value={form.category} onChange={handleChange}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="g-description">Description</label>
          <textarea
            id="g-description"
            name="description"
            placeholder="Describe your issue in detail..."
            value={form.description}
            onChange={handleChange}
            rows={4}
          />
        </div>
        <button id="btn-submit-grievance" type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? '⏳ Submitting...' : '🚀 Submit Grievance'}
        </button>
      </form>
    </div>
  );
};

// ─────────────── Grievance Detail / Edit Panel ───────────────
const GrievanceDetail = ({ grievance, token, onUpdated, onDeleted, onClose }) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: grievance.title,
    description: grievance.description,
    category: grievance.category,
    status: grievance.status,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api(token).put(`/grievances/${grievance._id}`, form);
      toast.success('✏️ Grievance updated!');
      setEditing(false);
      onUpdated(res.data.grievance);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this grievance permanently?')) return;
    setLoading(true);
    try {
      await api(token).delete(`/grievances/${grievance._id}`);
      toast.success('🗑️ Grievance deleted');
      onDeleted(grievance._id);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="panel detail-panel fade-in">
      <div className="panel-header">
        <span className="panel-title">🔍 Grievance Details</span>
        <button className="btn btn-secondary" style={{ padding: '0.3rem 0.7rem', fontSize: '0.8rem' }} onClick={onClose}>✕ Close</button>
      </div>

      {!editing ? (
        <>
          <div className="detail-title">{grievance.title}</div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            <span className={`badge badge-${grievance.status.toLowerCase()}`}>{grievance.status}</span>
            <span className="badge badge-cat">{grievance.category}</span>
          </div>
          <div className="detail-desc">{grievance.description}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            📅 Submitted on {formatDate(grievance.date || grievance.createdAt)}
          </div>
          <div className="detail-actions">
            <button id="btn-edit-grievance" className="btn btn-secondary" onClick={() => setEditing(true)}>✏️ Edit</button>
            <button id="btn-delete-grievance" className="btn btn-danger" onClick={handleDelete} disabled={loading}>
              {loading ? '...' : '🗑️ Delete'}
            </button>
          </div>
        </>
      ) : (
        <form onSubmit={handleUpdate} className="edit-form-inline">
          <div className="form-group">
            <label htmlFor="edit-title">Title</label>
            <input id="edit-title" type="text" name="title" value={form.title} onChange={handleChange} />
          </div>
          <div className="edit-form-inline form-row">
            <div className="form-group">
              <label htmlFor="edit-category">Category</label>
              <select id="edit-category" name="category" value={form.category} onChange={handleChange}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="edit-status">Status</label>
              <select id="edit-status" name="status" value={form.status} onChange={handleChange}>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="edit-description">Description</label>
            <textarea id="edit-description" name="description" value={form.description} onChange={handleChange} rows={4} />
          </div>
          <div className="edit-actions">
            <button id="btn-save-edit" type="submit" className="btn btn-success" disabled={loading}>
              {loading ? '⏳ Saving...' : '💾 Save Changes'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
};

// ─────────────── Main Dashboard ───────────────
const Dashboard = () => {
  const { student, token, logout } = useAuth();
  const [grievances, setGrievances] = useState([]);
  const [selected, setSelected] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [listLoading, setListLoading] = useState(true);

  const fetchGrievances = useCallback(async () => {
    setListLoading(true);
    try {
      const res = await api(token).get('/grievances');
      setGrievances(res.data);
    } catch (err) {
      toast.error('Failed to load grievances');
    } finally {
      setListLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchGrievances(); }, [fetchGrievances]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) { fetchGrievances(); setIsSearching(false); return; }
    setListLoading(true);
    setIsSearching(true);
    try {
      const res = await api(token).get(`/grievances/search?title=${searchQuery}`);
      setGrievances(res.data);
    } catch (err) {
      toast.error('Search failed');
    } finally {
      setListLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    fetchGrievances();
  };

  const handleUpdated = (updated) => {
    setGrievances((prev) => prev.map((g) => (g._id === updated._id ? updated : g)));
    setSelected(updated);
  };

  const handleDeleted = (id) => {
    setGrievances((prev) => prev.filter((g) => g._id !== id));
    setSelected(null);
  };

  const total = grievances.length;
  const pending = grievances.filter((g) => g.status === 'Pending').length;
  const resolved = grievances.filter((g) => g.status === 'Resolved').length;

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="dashboard">
      {/* ── Navbar ── */}
      <nav className="navbar">
        <div className="navbar-inner">
          <div className="navbar-brand">
            <div className="brand-icon">🎓</div>
            <h2>Grievance Portal</h2>
          </div>
          <div className="navbar-user">
            <span className="user-name">👤 <strong>{student?.name}</strong></span>
            <button id="btn-logout" className="btn-logout" onClick={logout}>🚪 Logout</button>
          </div>
        </div>
      </nav>

      <div className="dashboard-body">
        {/* ── Stats Bar ── */}
        <div className="stats-bar">
          <div className="stat-card total">
            <span className="stat-label">📂 Total</span>
            <span className="stat-value">{total}</span>
          </div>
          <div className="stat-card pending">
            <span className="stat-label">⏳ Pending</span>
            <span className="stat-value">{pending}</span>
          </div>
          <div className="stat-card resolved">
            <span className="stat-label">✅ Resolved</span>
            <span className="stat-value">{resolved}</span>
          </div>
        </div>

        {/* ── Main Grid ── */}
        <div className="dashboard-grid">
          {/* Left: Submit Form */}
          <div>
            <SubmitForm token={token} onSubmitted={() => { fetchGrievances(); setSelected(null); }} />
          </div>

          {/* Right: Grievance List + Detail */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* List Panel */}
            <div className="panel">
              <div className="panel-header">
                <span className="panel-title">📄 My Grievances {isSearching && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>— search results</span>}</span>
              </div>

              {/* Search Bar */}
              <div className="search-bar">
                <input
                  id="search-input"
                  type="text"
                  placeholder="Search by title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button id="btn-search" className="btn-search" onClick={handleSearch}>🔍 Search</button>
                {isSearching && (
                  <button id="btn-clear-search" className="btn-clear" onClick={handleClearSearch}>✕</button>
                )}
              </div>

              {/* List */}
              {listLoading ? (
                <div className="loader"><div className="spinner"></div></div>
              ) : grievances.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📭</div>
                  <p>{isSearching ? 'No grievances match your search.' : 'No grievances yet. Submit your first one!'}</p>
                </div>
              ) : (
                <div className="grievance-list">
                  {grievances.map((g) => (
                    <div
                      key={g._id}
                      className={`grievance-card ${selected?._id === g._id ? 'selected' : ''}`}
                      onClick={() => setSelected(g)}
                    >
                      <div className="grievance-card-top">
                        <span className="grievance-title">{g.title}</span>
                        <span className={`badge badge-${g.status.toLowerCase()}`}>{g.status}</span>
                      </div>
                      <div className="grievance-meta">
                        <span className="badge badge-cat">{g.category}</span>
                        <span>📅 {formatDate(g.date || g.createdAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Detail Panel */}
            {selected && (
              <GrievanceDetail
                grievance={selected}
                token={token}
                onUpdated={handleUpdated}
                onDeleted={handleDeleted}
                onClose={() => setSelected(null)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
