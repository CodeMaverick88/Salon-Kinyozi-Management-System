import { useEffect, useMemo, useState } from 'react'
import {
  CalendarCheck,
  ChevronLeft,
  Download,
  Eye,
  EyeOff,
  FileText,
  LayoutDashboard,
  Lock,
  LogOut,
  Menu,
  Plus,
  Scissors,
  Search,
  Smartphone,
  UserCog,
  Users,
  Wallet,
  X,
  ExternalLink,
} from 'lucide-react'

const ADMIN_NAME = 'Meison Njonjo'
const ADMIN_PASSWORD = '1234'

const STORAGE_KEYS = {
  clients: 'crystal_five_clients',
  appointments: 'crystal_five_appointments',
  transactions: 'crystal_five_transactions',
  records: 'crystal_five_records',
}

const seedData = {
  clients: [
    {
      id: 'client-1',
      name: 'Faith Wanjiru',
      email: 'faith@example.com',
      phone: '254712000001',
      joinedAt: '2026-10-04',
    },
    {
      id: 'client-2',
      name: 'Brian Otieno',
      email: 'brian@example.com',
      phone: '254712000002',
      joinedAt: '2026-10-18',
    },
  ],
  appointments: [
    {
      id: 'apt-1',
      clientId: 'client-1',
      service: 'Braids',
      employee: 'Senior Hairstylist',
      date: '2026-11-05',
      time: '10:00',
      status: 'Completed',
      amount: 2100,
    },
    {
      id: 'apt-2',
      clientId: 'client-2',
      service: 'Mens Haircut',
      employee: 'Professional Barber',
      date: '2026-11-07',
      time: '14:30',
      status: 'Upcoming',
      amount: 1000,
    },
  ],
  transactions: [
    {
      id: 'txn-1',
      receipt: 'SFH82KQ1XZ',
      clientId: 'client-1',
      appointmentId: 'apt-1',
      amount: 2100,
      date: '2026-11-05',
      status: 'Completed',
    },
    {
      id: 'txn-2',
      receipt: 'SFH91LAP2M',
      clientId: 'client-2',
      appointmentId: 'apt-2',
      amount: 1000,
      date: '2026-11-07',
      status: 'Pending',
    },
  ],
  records: [
    {
      id: 'record-1',
      action: 'Client account created',
      details: 'Faith Wanjiru created an account.',
      date: '2026-10-04',
    },
    {
      id: 'record-2',
      action: 'M-Pesa payment received',
      details: 'KSh 2,100 received from Faith Wanjiru.',
      date: '2026-11-05',
    },
  ],
}

const readData = (key, fallback) => {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

const writeData = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}

const formatMoney = (value) =>
  `KSh ${Number(value || 0).toLocaleString('en-KE')}`

const formatDate = (value) => {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const styles = `
.admin-root {
  --admin-bg: #0c1218;
  --admin-surface: rgba(255, 255, 255, 0.045);
  --admin-border: rgba(255, 255, 255, 0.09);
  --admin-text: #e8edf2;
  --admin-muted: #8b9aab;
  --admin-green: #2e7d6b;
  --admin-green-light: #7be0ae;
  --admin-gold: #c99a45;
  --admin-gold-light: #f3c86b;
  --sidebar-w: 72px;
  --sidebar-expanded: 240px;

  min-height: 100vh;
  color: var(--admin-text);
  font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
  background:
    radial-gradient(900px circle at 8% -10%, rgba(46, 125, 107, 0.16), transparent 50%),
    radial-gradient(700px circle at 92% 0%, rgba(201, 154, 69, 0.1), transparent 45%),
    var(--admin-bg);
}

.admin-root *,
.admin-root *::before,
.admin-root *::after {
  box-sizing: border-box;
}

.admin-root h1,
.admin-root h2,
.admin-root h3 {
  margin: 0;
  line-height: 1.2;
  font-weight: 650;
}

.admin-root p {
  margin: 0;
}

.admin-root button,
.admin-root input,
.admin-root select {
  font-family: inherit;
}

/* ========== LOGIN ========== */
.admin-login-wrap {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 1.5rem;
}

.admin-login-card {
  width: min(420px, 100%);
  padding: 2.25rem 2rem;
  background: var(--admin-surface);
  border: 1px solid var(--admin-border);
  border-radius: 22px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
  animation: adminIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.admin-login-icon {
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  border-radius: 15px;
  margin-bottom: 1.25rem;
  color: #0f1711;
  background: linear-gradient(135deg, var(--admin-green-light), var(--admin-green));
  box-shadow: 0 10px 28px rgba(46, 125, 107, 0.35);
}

.admin-login-card h1 {
  font-size: 1.65rem;
  color: #fff;
  letter-spacing: -0.02em;
}

.admin-login-card > p {
  margin-top: 0.45rem;
  color: var(--admin-muted);
  font-size: 0.92rem;
  line-height: 1.5;
}

.admin-field {
  display: grid;
  gap: 0.4rem;
  margin-top: 1.05rem;
}

.admin-field label {
  color: #c5d0d9;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.03em;
}

.admin-input {
  width: 100%;
  min-height: 46px;
  padding: 0.75rem 2.7rem 0.75rem 0.95rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 11px;
  color: #fff;
  background: rgba(255, 255, 255, 0.06);
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
}

.admin-input::placeholder {
  color: rgba(232, 237, 242, 0.38);
}

.admin-input:focus {
  outline: none;
  border-color: rgba(46, 125, 107, 0.75);
  background: rgba(255, 255, 255, 0.09);
  box-shadow: 0 0 0 3px rgba(46, 125, 107, 0.18);
}

.admin-password-wrap {
  position: relative;
}

.admin-eye {
  position: absolute;
  top: 50%;
  right: 0.5rem;
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 8px;
  color: var(--admin-muted);
  background: transparent;
  cursor: pointer;
  transform: translateY(-50%);
  transition: color 0.15s, background 0.15s;
}

.admin-eye:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.08);
}

.admin-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  min-height: 46px;
  padding: 0.7rem 1.15rem;
  border: 1px solid transparent;
  border-radius: 11px;
  color: #fff;
  font-weight: 650;
  font-size: 0.92rem;
  cursor: pointer;
  background: linear-gradient(135deg, #37a184, var(--admin-green));
  box-shadow: 0 8px 22px rgba(46, 125, 107, 0.28);
  transition: transform 0.2s, filter 0.2s, box-shadow 0.2s;
}

.admin-btn:hover {
  transform: translateY(-1px);
  filter: brightness(1.05);
  box-shadow: 0 12px 28px rgba(46, 125, 107, 0.38);
}

.admin-btn:active {
  transform: translateY(0) scale(0.985);
}

.admin-btn-ghost {
  color: var(--admin-text);
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.12);
  box-shadow: none;
}

.admin-btn-ghost:hover {
  border-color: rgba(201, 154, 69, 0.45);
  background: rgba(255, 255, 255, 0.09);
  box-shadow: none;
  filter: none;
}

.admin-btn-danger {
  background: rgba(255, 90, 90, 0.12);
  border-color: rgba(255, 120, 120, 0.3);
  box-shadow: none;
  color: #ffb4ac;
}

.admin-btn-danger:hover {
  background: rgba(255, 90, 90, 0.2);
  box-shadow: none;
  filter: none;
}

.admin-error {
  margin-top: 0.85rem;
  padding: 0.7rem 0.85rem;
  border: 1px solid rgba(255, 120, 120, 0.3);
  border-radius: 10px;
  color: #ffb4ac;
  background: rgba(255, 90, 90, 0.1);
  font-size: 0.86rem;
}

.admin-note {
  margin-top: 1.15rem;
  padding: 0.8rem 0.95rem;
  border: 1px solid rgba(201, 154, 69, 0.28);
  border-radius: 11px;
  color: #e7d4a8;
  background: rgba(201, 154, 69, 0.08);
  font-size: 0.82rem;
  line-height: 1.45;
}

/* ========== SHELL + SIDEBAR ========== */
.admin-shell {
  display: flex;
  min-height: 100vh;
}

.admin-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 40;
  height: 100vh;
  width: var(--sidebar-w);
  display: flex;
  flex-direction: column;
  background: rgba(10, 14, 20, 0.92);
  border-right: 1px solid var(--admin-border);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  transition: width 0.28s cubic-bezier(0.22, 1, 0.36, 1);
  overflow: hidden;
}

.admin-sidebar:hover,
.admin-sidebar.is-open {
  width: var(--sidebar-expanded);
}

.admin-sidebar-brand {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 1.15rem 1rem;
  min-height: 72px;
  border-bottom: 1px solid var(--admin-border);
  white-space: nowrap;
}

.admin-sidebar-brand-icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  color: #0f1711;
  background: linear-gradient(135deg, var(--admin-gold-light), var(--admin-gold));
}

.admin-sidebar-brand-text {
  opacity: 0;
  transform: translateX(-6px);
  transition: opacity 0.2s, transform 0.2s;
  pointer-events: none;
}

.admin-sidebar:hover .admin-sidebar-brand-text,
.admin-sidebar.is-open .admin-sidebar-brand-text {
  opacity: 1;
  transform: none;
  pointer-events: auto;
}

.admin-sidebar-brand h2 {
  font-size: 0.95rem;
  color: #fff;
  letter-spacing: -0.01em;
}

.admin-sidebar-brand span {
  display: block;
  font-size: 0.7rem;
  color: var(--admin-muted);
  margin-top: 0.1rem;
}

.admin-sidebar-nav {
  flex: 1;
  padding: 0.85rem 0.65rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  overflow-y: auto;
  overflow-x: hidden;
}

.admin-nav-item {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  min-height: 44px;
  padding: 0 0.85rem;
  border: 0;
  border-radius: 11px;
  color: var(--admin-muted);
  background: transparent;
  font-size: 0.9rem;
  font-weight: 550;
  cursor: pointer;
  white-space: nowrap;
  transition: color 0.18s, background 0.18s;
}

.admin-nav-item svg {
  flex-shrink: 0;
}

.admin-nav-item span {
  opacity: 0;
  transform: translateX(-4px);
  transition: opacity 0.2s, transform 0.2s;
}

.admin-sidebar:hover .admin-nav-item span,
.admin-sidebar.is-open .admin-nav-item span {
  opacity: 1;
  transform: none;
}

.admin-nav-item:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.06);
}

.admin-nav-item.active {
  color: #0f1711;
  background: linear-gradient(135deg, var(--admin-green-light), var(--admin-green));
  box-shadow: 0 6px 18px rgba(46, 125, 107, 0.28);
}

.admin-sidebar-footer {
  padding: 0.75rem 0.65rem 1rem;
  border-top: 1px solid var(--admin-border);
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.admin-main {
  flex: 1;
  margin-left: var(--sidebar-w);
  min-width: 0;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.28s cubic-bezier(0.22, 1, 0.36, 1);
}

.admin-topbar {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.9rem 1.5rem;
  background: rgba(12, 18, 24, 0.85);
  border-bottom: 1px solid var(--admin-border);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.admin-topbar-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.admin-mobile-toggle {
  display: none;
  width: 40px;
  height: 40px;
  place-items: center;
  border: 1px solid var(--admin-border);
  border-radius: 10px;
  color: var(--admin-text);
  background: rgba(255, 255, 255, 0.05);
  cursor: pointer;
}

.admin-topbar h1 {
  font-size: 1.1rem;
  color: #fff;
  letter-spacing: -0.015em;
}

.admin-topbar-sub {
  font-size: 0.75rem;
  color: var(--admin-muted);
  margin-top: 0.1rem;
}

.admin-topbar-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.admin-content {
  flex: 1;
  padding: 1.35rem 1.5rem 2.5rem;
  animation: adminIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
}

/* ========== CONTENT ========== */
.admin-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr));
  gap: 0.9rem;
  margin-bottom: 1.35rem;
}

.admin-stat {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 1.1rem 1.15rem;
  background: var(--admin-surface);
  border: 1px solid var(--admin-border);
  border-radius: 16px;
  backdrop-filter: blur(12px);
}

.admin-stat-icon {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  color: var(--admin-green-light);
  background: rgba(46, 125, 107, 0.14);
  border: 1px solid rgba(46, 125, 107, 0.28);
}

.admin-stat-value {
  font-size: 1.35rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.02em;
}

.admin-stat-label {
  font-size: 0.78rem;
  color: var(--admin-muted);
  margin-top: 0.15rem;
}

.admin-panel {
  padding: 1.25rem 1.35rem;
  background: var(--admin-surface);
  border: 1px solid var(--admin-border);
  border-radius: 18px;
  backdrop-filter: blur(12px);
  margin-bottom: 1.15rem;
}

.admin-panel-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.15rem;
  flex-wrap: wrap;
}

.admin-panel-head h2 {
  font-size: 1.1rem;
  color: #fff;
}

.admin-panel-head p {
  margin-top: 0.25rem;
  color: var(--admin-muted);
  font-size: 0.84rem;
}

.admin-tools {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  align-items: center;
}

.admin-search {
  position: relative;
  flex: 1 1 220px;
  max-width: 320px;
}

.admin-search svg {
  position: absolute;
  top: 50%;
  left: 0.8rem;
  color: #7a8794;
  transform: translateY(-50%);
  pointer-events: none;
}

.admin-search input {
  padding-left: 2.5rem;
}

.admin-table-wrap {
  width: 100%;
  overflow-x: auto;
  border-radius: 12px;
}

.admin-table {
  width: 100%;
  min-width: 680px;
  border-collapse: collapse;
}

.admin-table th {
  padding: 0.7rem 0.85rem;
  color: var(--admin-muted);
  font-size: 0.72rem;
  font-weight: 650;
  letter-spacing: 0.055em;
  text-align: left;
  text-transform: uppercase;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  white-space: nowrap;
}

.admin-table td {
  padding: 0.8rem 0.85rem;
  color: #d4dce4;
  font-size: 0.88rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  white-space: nowrap;
}

.admin-table tbody tr {
  transition: background 0.15s;
}

.admin-table tbody tr:hover {
  background: rgba(255, 255, 255, 0.03);
}

.admin-pill {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  font-size: 0.74rem;
  font-weight: 650;
}

.admin-pill-green {
  color: #b8f3d6;
  background: rgba(46, 125, 107, 0.16);
  border: 1px solid rgba(46, 125, 107, 0.35);
}

.admin-pill-gold {
  color: #f6d791;
  background: rgba(201, 154, 69, 0.14);
  border: 1px solid rgba(201, 154, 69, 0.32);
}

.admin-empty {
  padding: 2rem 1rem;
  color: var(--admin-muted);
  text-align: center;
  font-size: 0.9rem;
}

.admin-form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr));
  gap: 0.75rem;
  margin-top: 0.25rem;
}

.admin-form-grid .admin-field {
  margin-top: 0;
}

.admin-overlay {
  display: none;
  position: fixed;
  inset: 0;
  z-index: 35;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(3px);
}

@keyframes adminIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

/* ========== RESPONSIVE ========== */
@media (max-width: 900px) {
  .admin-sidebar {
    transform: translateX(-100%);
    width: var(--sidebar-expanded);
  }

  .admin-sidebar.is-open {
    transform: translateX(0);
  }

  .admin-sidebar:hover {
    width: var(--sidebar-expanded);
  }

  .admin-sidebar .admin-sidebar-brand-text,
  .admin-sidebar .admin-nav-item span {
    opacity: 1;
    transform: none;
    pointer-events: auto;
  }

  .admin-main {
    margin-left: 0;
  }

  .admin-mobile-toggle {
    display: grid;
  }

  .admin-overlay.is-visible {
    display: block;
  }
}

@media (max-width: 640px) {
  .admin-content {
    padding: 1rem 1rem 2rem;
  }

  .admin-topbar {
    padding: 0.8rem 1rem;
  }

  .admin-panel {
    padding: 1.05rem;
  }

  .admin-table {
    min-width: 620px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .admin-root *,
  .admin-root *::before,
  .admin-root *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
`

function AdminLogin({ onLogin }) {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const submit = (event) => {
    event.preventDefault()

    if (name.trim() !== ADMIN_NAME || password !== ADMIN_PASSWORD) {
      setError('Incorrect admin name or password. Access restricted to Meison Njonjo only.')
      return
    }

    sessionStorage.setItem('crystal_five_admin', 'authenticated')
    onLogin(true)
  }

  return (
    <div className="admin-root">
      <style>{styles}</style>
      <div className="admin-login-wrap">
        <section className="admin-login-card">
          <div className="admin-login-icon">
            <Lock size={24} />
          </div>

          <h1>Admin Access</h1>
          <p>
            Restricted area for Crystal Five management. Sign in to manage clients,
            appointments, employees and M-Pesa records.
          </p>

          <form onSubmit={submit}>
            <div className="admin-field">
              <label htmlFor="admin-name">Admin name</label>
              <input
                id="admin-name"
                className="admin-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Meison Njonjo"
                autoComplete="username"
                required
              />
            </div>

            <div className="admin-field">
              <label htmlFor="admin-password">Password</label>
              <div className="admin-password-wrap">
                <input
                  id="admin-password"
                  className="admin-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="admin-eye"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {error ? <div className="admin-error">{error}</div> : null}

            <button
              type="submit"
              className="admin-btn"
              style={{ width: '100%', marginTop: '1.3rem' }}
            >
              <Lock size={17} />
              Sign In
            </button>
          </form>

          <div className="admin-note">
            Development access — Name: <strong>Meison Njonjo</strong>, Password:{' '}
            <strong>1234</strong>. Change these before going live.
          </div>
        </section>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <article className="admin-stat">
      <div className="admin-stat-icon">
        <Icon size={20} />
      </div>
      <div>
        <div className="admin-stat-value">{value}</div>
        <div className="admin-stat-label">{label}</div>
      </div>
    </article>
  )
}

function Admin({ onLogout }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [clients, setClients] = useState(() => readData(STORAGE_KEYS.clients, seedData.clients))
  const [appointments, setAppointments] = useState(() =>
    readData(STORAGE_KEYS.appointments, seedData.appointments),
  )
  const [transactions, setTransactions] = useState(() =>
    readData(STORAGE_KEYS.transactions, seedData.transactions),
  )
  const [records, setRecords] = useState(() => readData(STORAGE_KEYS.records, seedData.records))
  const [form, setForm] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    service: '',
    employee: '',
    date: '',
    time: '',
    amount: '',
    receipt: '',
  })

  useEffect(() => {
    writeData(STORAGE_KEYS.clients, clients)
    writeData(STORAGE_KEYS.appointments, appointments)
    writeData(STORAGE_KEYS.transactions, transactions)
    writeData(STORAGE_KEYS.records, records)
  }, [clients, appointments, transactions, records])

  const clientName = (clientId) =>
    clients.find((c) => c.id === clientId)?.name || 'Unknown client'

  const totalRevenue = transactions
    .filter((t) => t.status === 'Completed')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0)

  const stats = [
    { icon: Users, label: 'Registered clients', value: clients.length },
    { icon: CalendarCheck, label: 'Total appointments', value: appointments.length },
    { icon: Wallet, label: 'Completed M-Pesa revenue', value: formatMoney(totalRevenue) },
    {
      icon: Smartphone,
      label: 'Pending M-Pesa payments',
      value: transactions.filter((t) => t.status === 'Pending').length,
    },
  ]

  const filteredAppointments = useMemo(() => {
    const q = search.trim().toLowerCase()
    return appointments.filter((a) => {
      const text = [clientName(a.clientId), a.service, a.employee, a.status]
        .join(' ')
        .toLowerCase()
      return !q || text.includes(q)
    })
  }, [appointments, clients, search])

  const addRecord = (action, details) => {
    setRecords((prev) => [
      {
        id: `record-${Date.now()}`,
        action,
        details,
        date: new Date().toISOString(),
      },
      ...prev,
    ])
  }

  const addClient = (e) => {
    e.preventDefault()
    if (!form.clientName.trim() || !form.clientEmail.trim()) return

    const newClient = {
      id: `client-${Date.now()}`,
      name: form.clientName.trim(),
      email: form.clientEmail.trim(),
      phone: form.clientPhone.trim(),
      joinedAt: new Date().toISOString(),
    }

    setClients((prev) => [newClient, ...prev])
    addRecord('Client account created', `${newClient.name} was added as a client.`)
    setForm((prev) => ({ ...prev, clientName: '', clientEmail: '', clientPhone: '' }))
  }

  const addAppointment = (e) => {
    e.preventDefault()
    if (!form.clientName.trim() || !form.service || !form.employee || !form.date) return

    const existing = clients.find(
      (c) => c.name.toLowerCase() === form.clientName.trim().toLowerCase(),
    )

    const client =
      existing ||
      {
        id: `client-${Date.now()}`,
        name: form.clientName.trim(),
        email: form.clientEmail.trim() || 'Not provided',
        phone: form.clientPhone.trim() || 'Not provided',
        joinedAt: new Date().toISOString(),
      }

    if (!existing) {
      setClients((prev) => [client, ...prev])
      addRecord('Client account created', `${client.name} was added during booking.`)
    }

    const newApt = {
      id: `apt-${Date.now()}`,
      clientId: client.id,
      service: form.service,
      employee: form.employee,
      date: form.date,
      time: form.time || 'Not set',
      status: 'Upcoming',
      amount: Number(form.amount || 0),
    }

    setAppointments((prev) => [newApt, ...prev])
    addRecord(
      'Appointment created',
      `${client.name} booked ${form.service} with ${form.employee}.`,
    )
    setForm((prev) => ({
      ...prev,
      service: '',
      employee: '',
      date: '',
      time: '',
      amount: '',
    }))
  }

  const addTransaction = (e) => {
    e.preventDefault()
    if (!form.receipt.trim() || !form.clientName.trim() || !form.amount) return

    const client = clients.find(
      (c) => c.name.toLowerCase() === form.clientName.trim().toLowerCase(),
    )

    const newTxn = {
      id: `txn-${Date.now()}`,
      receipt: form.receipt.trim(),
      clientId: client?.id || '',
      appointmentId: '',
      amount: Number(form.amount),
      date: new Date().toISOString(),
      status: 'Completed',
    }

    setTransactions((prev) => [newTxn, ...prev])
    addRecord(
      'M-Pesa transaction recorded',
      `${formatMoney(newTxn.amount)} received from ${client?.name || form.clientName}.`,
    )
    setForm((prev) => ({ ...prev, receipt: '', amount: '' }))
  }

  const markPaid = (appointmentId) => {
    const apt = appointments.find((a) => a.id === appointmentId)
    if (!apt) return

    setAppointments((prev) =>
      prev.map((a) => (a.id === appointmentId ? { ...a, status: 'Completed' } : a)),
    )

    setTransactions((prev) => [
      {
        id: `txn-${Date.now()}`,
        receipt: `MANUAL-${Date.now()}`,
        clientId: apt.clientId,
        appointmentId: apt.id,
        amount: apt.amount,
        date: new Date().toISOString(),
        status: 'Completed',
      },
      ...prev,
    ])

    addRecord(
      'Payment marked complete',
      `${clientName(apt.clientId)} paid ${formatMoney(apt.amount)} for ${apt.service}.`,
    )
  }

  const exportCsv = () => {
    const rows = [
      ['Client', 'Service', 'Employee', 'Date', 'Time', 'Status', 'Amount', 'M-Pesa Receipt'],
      ...appointments.map((a) => {
        const txn = transactions.find((t) => t.appointmentId === a.id)
        return [
          clientName(a.clientId),
          a.service,
          a.employee,
          a.date,
          a.time,
          a.status,
          a.amount,
          txn?.receipt || 'Not recorded',
        ]
      }),
    ]

    const csv = rows
      .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'crystal-five-salon-records.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: LayoutDashboard },
    { id: 'clients', name: 'Clients', icon: Users },
    { id: 'appointments', name: 'Appointments', icon: CalendarCheck },
    { id: 'mpesa', name: 'M-Pesa', icon: Smartphone },
    { id: 'employees', name: 'Employees', icon: UserCog },
    { id: 'records', name: 'Records', icon: FileText },
  ]

  const currentTab = tabs.find((t) => t.id === activeTab)

  const goToSite = () => {
    window.location.href = '/'
  }

  const selectTab = (id) => {
    setActiveTab(id)
    setSidebarOpen(false)
  }

  return (
    <div className="admin-root">
      <style>{styles}</style>

      <div
        className={`admin-overlay ${sidebarOpen ? 'is-visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden={!sidebarOpen}
      />

      <div className="admin-shell">
        {/* SIDEBAR */}
        <aside className={`admin-sidebar ${sidebarOpen ? 'is-open' : ''}`}>
          <div className="admin-sidebar-brand">
            <div className="admin-sidebar-brand-icon">
              <Scissors size={20} />
            </div>
            <div className="admin-sidebar-brand-text">
              <h2>Crystal Five</h2>
              <span>Admin Console</span>
            </div>
          </div>

          <nav className="admin-sidebar-nav" aria-label="Admin sections">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  type="button"
                  className={`admin-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => selectTab(tab.id)}
                >
                  <Icon size={19} />
                  <span>{tab.name}</span>
                </button>
              )
            })}
          </nav>

          <div className="admin-sidebar-footer">
            <button type="button" className="admin-nav-item" onClick={goToSite}>
              <ExternalLink size={18} />
              <span>Back to Site</span>
            </button>
            <button type="button" className="admin-nav-item" onClick={onLogout}>
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <div className="admin-main">
          <header className="admin-topbar">
            <div className="admin-topbar-left">
              <button
                type="button"
                className="admin-mobile-toggle"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={20} />
              </button>
              <div>
                <h1>{currentTab?.name || 'Overview'}</h1>
                <div className="admin-topbar-sub">Meison Njonjo · Crystal Five Admin</div>
              </div>
            </div>

            <div className="admin-topbar-actions">
              <button type="button" className="admin-btn admin-btn-ghost" onClick={goToSite}>
                <ChevronLeft size={17} />
                Exit to Site
              </button>
              <button type="button" className="admin-btn admin-btn-ghost" onClick={onLogout}>
                <LogOut size={17} />
                Sign Out
              </button>
            </div>
          </header>

          <div className="admin-content">
            {activeTab === 'overview' && (
              <section>
                <div className="admin-stats">
                  {stats.map((s) => (
                    <StatCard key={s.label} {...s} />
                  ))}
                </div>

                <article className="admin-panel">
                  <div className="admin-panel-head">
                    <div>
                      <h2>Recent activity</h2>
                      <p>Latest client, booking and payment activity.</p>
                    </div>
                    <button type="button" className="admin-btn admin-btn-ghost" onClick={exportCsv}>
                      <Download size={16} />
                      Export records
                    </button>
                  </div>

                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Action</th>
                          <th>Details</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {records.slice(0, 8).map((r) => (
                          <tr key={r.id}>
                            <td>{r.action}</td>
                            <td>{r.details}</td>
                            <td>{formatDate(r.date)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </article>
              </section>
            )}

            {activeTab === 'clients' && (
              <section>
                <article className="admin-panel">
                  <div className="admin-panel-head">
                    <div>
                      <h2>Clients</h2>
                      <p>People who have created an account or booked with Crystal Five.</p>
                    </div>
                  </div>

                  <form className="admin-form-grid" onSubmit={addClient}>
                    <div className="admin-field">
                      <label htmlFor="client-name">Full name</label>
                      <input
                        id="client-name"
                        className="admin-input"
                        value={form.clientName}
                        onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                        placeholder="Enter client name"
                        required
                      />
                    </div>
                    <div className="admin-field">
                      <label htmlFor="client-email">Email</label>
                      <input
                        id="client-email"
                        className="admin-input"
                        type="email"
                        value={form.clientEmail}
                        onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
                        placeholder="client@email.com"
                        required
                      />
                    </div>
                    <div className="admin-field">
                      <label htmlFor="client-phone">Phone number</label>
                      <input
                        id="client-phone"
                        className="admin-input"
                        value={form.clientPhone}
                        onChange={(e) => setForm({ ...form, clientPhone: e.target.value })}
                        placeholder="2547XXXXXXXX"
                      />
                    </div>
                    <button type="submit" className="admin-btn">
                      <Plus size={17} />
                      Add Client
                    </button>
                  </form>

                  <div className="admin-table-wrap" style={{ marginTop: '1.25rem' }}>
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Joined</th>
                          <th>Appointments</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clients.map((c) => (
                          <tr key={c.id}>
                            <td>{c.name}</td>
                            <td>{c.email}</td>
                            <td>{c.phone}</td>
                            <td>{formatDate(c.joinedAt)}</td>
                            <td>
                              <span className="admin-pill admin-pill-green">
                                {appointments.filter((a) => a.clientId === c.id).length}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </article>
              </section>
            )}

            {activeTab === 'appointments' && (
              <section>
                <article className="admin-panel">
                  <div className="admin-panel-head">
                    <div>
                      <h2>Appointments</h2>
                      <p>See which client booked which service and which employee served them.</p>
                    </div>
                    <div className="admin-tools">
                      <div className="admin-search">
                        <Search size={16} />
                        <input
                          className="admin-input"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          placeholder="Search client, service or employee"
                          aria-label="Search appointments"
                        />
                      </div>
                    </div>
                  </div>

                  <form className="admin-form-grid" onSubmit={addAppointment}>
                    <div className="admin-field">
                      <label htmlFor="booking-client">Client name</label>
                      <input
                        id="booking-client"
                        className="admin-input"
                        value={form.clientName}
                        onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                        placeholder="Enter client name"
                        required
                      />
                    </div>
                    <div className="admin-field">
                      <label htmlFor="booking-service">Service</label>
                      <input
                        id="booking-service"
                        className="admin-input"
                        value={form.service}
                        onChange={(e) => setForm({ ...form, service: e.target.value })}
                        placeholder="Braids, haircut, nails..."
                        required
                      />
                    </div>
                    <div className="admin-field">
                      <label htmlFor="booking-employee">Employee</label>
                      <input
                        id="booking-employee"
                        className="admin-input"
                        value={form.employee}
                        onChange={(e) => setForm({ ...form, employee: e.target.value })}
                        placeholder="Stylist or barber"
                        required
                      />
                    </div>
                    <div className="admin-field">
                      <label htmlFor="booking-date">Date</label>
                      <input
                        id="booking-date"
                        className="admin-input"
                        type="date"
                        value={form.date}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                        required
                      />
                    </div>
                    <div className="admin-field">
                      <label htmlFor="booking-time">Time</label>
                      <input
                        id="booking-time"
                        className="admin-input"
                        type="time"
                        value={form.time}
                        onChange={(e) => setForm({ ...form, time: e.target.value })}
                      />
                    </div>
                    <div className="admin-field">
                      <label htmlFor="booking-amount">Amount</label>
                      <input
                        id="booking-amount"
                        className="admin-input"
                        type="number"
                        min="0"
                        value={form.amount}
                        onChange={(e) => setForm({ ...form, amount: e.target.value })}
                        placeholder="0"
                      />
                    </div>
                    <button type="submit" className="admin-btn">
                      <Plus size={17} />
                      Add Appointment
                    </button>
                  </form>

                  <div className="admin-table-wrap" style={{ marginTop: '1.25rem' }}>
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Client</th>
                          <th>Service</th>
                          <th>Employee</th>
                          <th>Date</th>
                          <th>Status</th>
                          <th>Amount</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAppointments.map((a) => (
                          <tr key={a.id}>
                            <td>{clientName(a.clientId)}</td>
                            <td>{a.service}</td>
                            <td>{a.employee}</td>
                            <td>{formatDate(a.date)}</td>
                            <td>
                              <span
                                className={`admin-pill ${
                                  a.status === 'Completed' ? 'admin-pill-green' : 'admin-pill-gold'
                                }`}
                              >
                                {a.status}
                              </span>
                            </td>
                            <td>{formatMoney(a.amount)}</td>
                            <td>
                              {a.status !== 'Completed' ? (
                                <button
                                  type="button"
                                  className="admin-btn admin-btn-ghost"
                                  onClick={() => markPaid(a.id)}
                                >
                                  Mark paid
                                </button>
                              ) : (
                                <span className="admin-pill admin-pill-green">Paid</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredAppointments.length === 0 && (
                      <div className="admin-empty">No appointments match your search.</div>
                    )}
                  </div>
                </article>
              </section>
            )}

            {activeTab === 'mpesa' && (
              <section>
                <article className="admin-panel">
                  <div className="admin-panel-head">
                    <div>
                      <h2>M-Pesa Transactions</h2>
                      <p>Track payments, match them to clients and monitor completed revenue.</p>
                    </div>
                    <button type="button" className="admin-btn admin-btn-ghost" onClick={exportCsv}>
                      <Download size={16} />
                      Export CSV
                    </button>
                  </div>

                  <form className="admin-form-grid" onSubmit={addTransaction}>
                    <div className="admin-field">
                      <label htmlFor="transaction-client">Client name</label>
                      <input
                        id="transaction-client"
                        className="admin-input"
                        value={form.clientName}
                        onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                        placeholder="Enter client name"
                        required
                      />
                    </div>
                    <div className="admin-field">
                      <label htmlFor="transaction-receipt">M-Pesa receipt</label>
                      <input
                        id="transaction-receipt"
                        className="admin-input"
                        value={form.receipt}
                        onChange={(e) => setForm({ ...form, receipt: e.target.value })}
                        placeholder="e.g. SFH82KQ1XZ"
                        required
                      />
                    </div>
                    <div className="admin-field">
                      <label htmlFor="transaction-amount">Amount</label>
                      <input
                        id="transaction-amount"
                        className="admin-input"
                        type="number"
                        min="0"
                        value={form.amount}
                        onChange={(e) => setForm({ ...form, amount: e.target.value })}
                        placeholder="0"
                        required
                      />
                    </div>
                    <button type="submit" className="admin-btn">
                      <Plus size={17} />
                      Record Payment
                    </button>
                  </form>

                  <div className="admin-table-wrap" style={{ marginTop: '1.25rem' }}>
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Receipt</th>
                          <th>Client</th>
                          <th>Amount</th>
                          <th>Date</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((t) => (
                          <tr key={t.id}>
                            <td>{t.receipt}</td>
                            <td>{clientName(t.clientId)}</td>
                            <td>{formatMoney(t.amount)}</td>
                            <td>{formatDate(t.date)}</td>
                            <td>
                              <span
                                className={`admin-pill ${
                                  t.status === 'Completed' ? 'admin-pill-green' : 'admin-pill-gold'
                                }`}
                              >
                                {t.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="admin-note">
                    For a live system, connect this section to a secure backend and Safaricom
                    Daraja API. Never expose M-Pesa credentials or customer payment data in
                    frontend code.
                  </div>
                </article>
              </section>
            )}

            {activeTab === 'employees' && (
              <section>
                <article className="admin-panel">
                  <div className="admin-panel-head">
                    <div>
                      <h2>Employees</h2>
                      <p>See which professional served each client and their completed work.</p>
                    </div>
                  </div>

                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Employee</th>
                          <th>Clients served</th>
                          <th>Services completed</th>
                          <th>Revenue from completed work</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from(new Set(appointments.map((a) => a.employee))).map(
                          (employee) => {
                            const empApts = appointments.filter((a) => a.employee === employee)
                            const completed = empApts.filter((a) => a.status === 'Completed')
                            const revenue = completed.reduce(
                              (sum, a) => sum + Number(a.amount || 0),
                              0,
                            )
                            return (
                              <tr key={employee}>
                                <td>{employee}</td>
                                <td>{new Set(empApts.map((a) => a.clientId)).size}</td>
                                <td>{completed.length}</td>
                                <td>{formatMoney(revenue)}</td>
                              </tr>
                            )
                          },
                        )}
                      </tbody>
                    </table>
                  </div>
                </article>
              </section>
            )}

            {activeTab === 'records' && (
              <section>
                <article className="admin-panel">
                  <div className="admin-panel-head">
                    <div>
                      <h2>Salon records</h2>
                      <p>A running history of accounts, bookings, payments and admin actions.</p>
                    </div>
                    <button type="button" className="admin-btn admin-btn-ghost" onClick={exportCsv}>
                      <Download size={16} />
                      Export CSV
                    </button>
                  </div>

                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Action</th>
                          <th>Details</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {records.map((r) => (
                          <tr key={r.id}>
                            <td>{r.action}</td>
                            <td>{r.details}</td>
                            <td>{formatDate(r.date)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </article>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function AdminPage() {
  const [authenticated, setAuthenticated] = useState(
    () => sessionStorage.getItem('crystal_five_admin') === 'authenticated',
  )

  const logout = () => {
    sessionStorage.removeItem('crystal_five_admin')
    setAuthenticated(false)
  }

  if (!authenticated) {
    return <AdminLogin onLogin={setAuthenticated} />
  }

  return <Admin onLogout={logout} />
}

export default AdminPage