import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, BadgeCheck, CalendarCheck, CalendarPlus, Check, ChevronDown, ChevronLeft, ChevronRight,
  Clock, Download, Eye, EyeOff, Info, Lock, Mail, Phone, ShieldCheck, Smartphone, Sparkles, Search, Store, User, Users, X,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Everything on this page is front end only. Each place that will     */
/*  later talk to the backend is marked  [backend].                     */
/* ------------------------------------------------------------------ */

const BUSINESS_NAME = 'Crystal Five'

/* [backend] weekly opening hours come from business settings. null = closed that day. 0 = Sunday */
const OPEN_HOURS = {
  0: { open: '08:00', close: '19:00' }, 1: { open: '08:00', close: '19:00' }, 2: { open: '08:00', close: '19:00' },
  3: { open: '08:00', close: '19:00' }, 4: { open: '08:00', close: '19:00' }, 5: { open: '08:00', close: '19:00' },
  6: { open: '08:00', close: '19:00' },
}
const SLOT_STEP = 30
const BOOK_AHEAD_DAYS = 60

const CATEGORIES = [
  { id: 'hair-salon', name: 'Hair Salon' },
  { id: 'kinyozi', name: 'Kinyozi' },
  { id: 'beauty', name: 'Beauty & Nails' },
  { id: 'hair-care', name: 'Hair Care' },
]

/* [backend] services, prices and availability come from the services database. price: null shows "KSh —" */
const SERVICES = [
  { id: 'braids', category: 'hair-salon', name: 'Braids', durationMin: 240, durationText: '3 – 5 hours', price: null, available: true, image: '/clients/services/braids.jpg' },
  { id: 'hair-styling', category: 'hair-salon', name: 'Hair Styling', durationMin: 60, price: null, available: true, image: '/clients/services/hair-styling.jpg' },
  { id: 'blow-dry', category: 'hair-salon', name: 'Blow-Dry', durationMin: 45, price: null, available: true, image: '/clients/services/blow-dry.jpg' },
  { id: 'mens-haircut', category: 'kinyozi', name: "Men's Haircut", durationMin: 30, price: null, available: true, image: '/clients/services/mens-haircut.jpg' },
  { id: 'fade', category: 'kinyozi', name: 'Fade', durationMin: 40, price: null, available: true, image: '/clients/services/fade.jpg' },
  { id: 'shave', category: 'kinyozi', name: 'Shave', durationMin: 25, price: null, available: true, image: '/clients/services/shave.jpg' },
  { id: 'beard-trim', category: 'kinyozi', name: 'Beard Trim', durationMin: 20, price: null, available: true, image: '/clients/services/beard-trim.jpg' },
  { id: 'makeup', category: 'beauty', name: 'Makeup', durationMin: 60, price: null, available: true, image: '/clients/services/makeup.jpg' },
  { id: 'nails', category: 'beauty', name: 'Nails', durationMin: 60, price: null, available: true, image: '/clients/services/nails.jpg' },
  { id: 'manicure', category: 'beauty', name: 'Manicure & Pedicure', durationMin: 90, price: null, available: true, image: '/clients/services/manicure.jpg' },
  { id: 'hair-wash', category: 'hair-care', name: 'Wash & Condition', durationMin: 30, price: null, available: true, image: '/clients/services/hair-wash.jpg' },
  { id: 'hair-treatment', category: 'hair-care', name: 'Hair Treatment', durationMin: 45, price: null, available: true, image: '/clients/services/hair-treatment.jpg' },
]

/* [backend] packages come from the packages database; only the included services can be booked */
const PACKAGES = [
  { id: 'fresh-look', name: 'Fresh Look', serviceIds: ['mens-haircut', 'beard-trim'], price: null, image: '/clients/packages/fresh-look.jpg' },
  { id: 'hair-care-package', name: 'Hair Care Package', serviceIds: ['hair-wash', 'hair-treatment', 'hair-styling'], price: null, image: '/clients/packages/hair-care.jpg' },
  { id: 'bridal', name: 'Bridal Package', serviceIds: ['hair-styling', 'makeup'], price: null, image: '/clients/packages/bridal.jpg' },
  { id: 'complete-grooming', name: 'Complete Grooming', serviceIds: ['mens-haircut', 'shave', 'beard-trim'], price: null, image: '/clients/packages/complete-grooming.jpg' },
]

/* [backend] offers come from the promotions database. serviceIds pre-selects the included services */
const OFFERS = [
  { id: 'first-visit', title: 'First-visit offer', terms: 'Applies to first appointments only. Show your booking confirmation on arrival.', serviceIds: [], endsAt: '2027-12-31' },
  { id: 'cut-and-beard', title: 'Haircut and beard combo', terms: 'Both services must be booked in the same appointment.', serviceIds: ['mens-haircut', 'beard-trim'], endsAt: '2027-12-31' },
  { id: 'student', title: 'Student offer', terms: 'Valid student ID required at your appointment.', serviceIds: [], endsAt: '2027-12-31' },
]

/* [backend] staff come from staff records and their service assignments */
const STAFF = [
  { id: 'hairstylist', role: 'Senior Hairstylist', speciality: 'Braids, styling and treatments', image: '/clients/team/hairstylist.jpg', serviceIds: ['braids', 'hair-styling', 'blow-dry', 'hair-wash', 'hair-treatment'] },
  { id: 'barber', role: 'Professional Barber', speciality: 'Fades, haircuts and beard grooming', image: '/clients/team/barber.jpg', serviceIds: ['mens-haircut', 'fade', 'shave', 'beard-trim'] },
  { id: 'nails', role: 'Nail Technician', speciality: 'Manicures, pedicures and nail art', image: '/clients/team/nail-technician.jpg', serviceIds: ['nails', 'manicure'] },
  { id: 'beauty', role: 'Beauty Therapist', speciality: 'Makeup and skin care', image: '/clients/team/beauty-therapist.jpg', serviceIds: ['makeup'] },
]

const STEPS = ['Services', 'Professional & time', 'Your details', 'Review']

/* ------------------------------ helpers ------------------------------ */
const pad = (n) => String(n).padStart(2, '0')
const dateKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const parseKey = (k) => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d) }
const toMin = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m }
const fmtTime = (min) => { const h = Math.floor(min / 60); const m = min % 60; return `${h % 12 || 12}:${pad(m)} ${h < 12 ? 'AM' : 'PM'}` }
const fmtDate = (k) => parseKey(k).toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
const fmtDuration = (min, text) => {
  if (text) return text
  if (min < 60) return `${min} minutes`
  const h = Math.floor(min / 60)
  const m = min % 60
  return `${h} hour${h > 1 ? 's' : ''}${m ? ` ${m} minutes` : ''}`
}
const fmtPrice = (n) => (n == null ? 'Price on request' : `KSh ${Number(n).toLocaleString('en-KE')}`)
const serviceById = (id) => SERVICES.find((s) => s.id === id)
const staffById = (id) => STAFF.find((s) => s.id === id)
const eligibleStaff = (serviceIds) => STAFF.filter((s) => serviceIds.every((id) => s.serviceIds.includes(id)))
const offerLive = (o) => new Date() <= new Date(`${o.endsAt}T23:59:59`)

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const normalizePhone = (value) => {
  const m = String(value).replace(/[\s\-()]/g, '').match(/^(?:\+?254|0)?([71]\d{8})$/)
  return m ? `254${m[1]}` : null
}
const showPhone = (p) => (p ? `0${p.slice(3)}` : '')
const passwordScore = (pw) => [pw.length >= 8, /[a-z]/.test(pw) && /[A-Z]/.test(pw), /\d/.test(pw), /[^A-Za-z0-9]/.test(pw)].filter(Boolean).length

/* Browser storage stands in for the account system until the backend exists. [backend] */
const store = {
  read(key, fallback) { try { const v = window.localStorage.getItem(key); return v ? JSON.parse(v) : fallback } catch { return fallback } },
  write(key, value) { try { window.localStorage.setItem(key, JSON.stringify(value)) } catch { /* storage unavailable */ } },
  remove(key) { try { window.localStorage.removeItem(key) } catch { /* storage unavailable */ } },
}
const ACCOUNTS_KEY = 'c5_accounts'
const SESSION_KEY = 'c5_session'
const loadSession = () => {
  const email = store.read(SESSION_KEY, null)
  return email ? store.read(ACCOUNTS_KEY, []).find((a) => a.email === email) || null : null
}

/* Availability stand-in: deterministic "already booked" blocks per professional and day. [backend] */
const hashString = (str) => { let h = 2166136261; for (let i = 0; i < str.length; i += 1) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) } return h >>> 0 }
const seeded = (seed) => () => { seed += 0x6d2b79f5; let t = seed; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }
const busyBlocks = (key, staffId, open, close) => {
  const rand = seeded(hashString(`${key}|${staffId}`))
  const blocks = []
  const count = 3 + Math.floor(rand() * 3)
  const steps = Math.max(1, Math.floor((close - open) / SLOT_STEP) - 1)
  for (let i = 0; i < count; i += 1) {
    const start = open + SLOT_STEP * Math.floor(rand() * steps)
    blocks.push([start, Math.min(close, start + SLOT_STEP * (1 + Math.floor(rand() * 3)))])
  }
  return blocks
}
const buildSlots = (key, minutes, staffList, now = new Date()) => {
  const hours = OPEN_HOURS[parseKey(key).getDay()]
  if (!hours || !staffList.length) return []
  const open = toMin(hours.open)
  const close = toMin(hours.close)
  const earliest = key === dateKey(now) ? now.getHours() * 60 + now.getMinutes() + 60 : 0
  const busy = Object.fromEntries(staffList.map((s) => [s.id, busyBlocks(key, s.id, open, close)]))
  const out = []
  for (let t = open; t + minutes <= close; t += SLOT_STEP) {
    if (t >= earliest) {
      const free = staffList.filter((s) => busy[s.id].every(([a, b]) => t + minutes <= a || t >= b))
      if (free.length) out.push({ min: t, staffIds: free.map((s) => s.id) })
    }
  }
  return out
}

const icsText = (s) => String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
const stamp = (d) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`

/* ------------------------------ styles ------------------------------- */
const STYLES = `/* Fresh appointment-planner visual system: warm paper, direct labels, no glass effects. */
.bk-page { --gold:#9a7027; --green:#255f43; --green-deep:#1d4d35; --red:#a12d22; --ink:#f4f2ec; --ink-2:#fff; --ink-3:#fff; --text:#202722; --muted:#667168; --line:#e1e3dc; --glass:#fff; --ease:cubic-bezier(.2,.7,.2,1); position:relative; min-height:100vh; padding:clamp(1rem,2.5vw,2rem) 0 2.5rem; overflow-x:clip; background:var(--ink); color:var(--text); font:400 16px/1.55 'Outfit',system-ui,sans-serif; }
.bk-page *, .bk-page *::before, .bk-page *::after { box-sizing:border-box; }
.bk-page h1,.bk-page h2,.bk-page h3 { margin:0; color:var(--text); font-family:'Fraunces',Georgia,serif; line-height:1.15; letter-spacing:-.018em; }
.bk-page p { margin:0; } .bk-page a { color:inherit; text-decoration:none; } .bk-page img { display:block; max-width:100%; } .bk-page button,.bk-page input,.bk-page textarea { font:inherit; }
.bk-page :focus-visible { outline:3px solid rgba(37,95,67,.3); outline-offset:3px; }
.bk-wrap { position:relative; z-index:2; width:min(1180px,calc(100% - 2rem)); margin-inline:auto; }
.bk-bg { display:none; }
.bk-top { display:flex; align-items:flex-end; justify-content:space-between; gap:1.25rem; margin-bottom:1.2rem; }
.bk-pill { display:inline-flex; align-items:center; gap:.4rem; color:var(--green); font-size:.76rem; font-weight:700; letter-spacing:.11em; text-transform:uppercase; }
.bk-top h1 { margin-top:.3rem; font-size:clamp(2rem,5vw,3.15rem); font-weight:600; }
.bk-top p { max-width:560px; margin-top:.45rem; color:var(--muted); }
.bk-chip-user { display:inline-flex; align-items:center; gap:.65rem; padding:.35rem .75rem .35rem .35rem; border:1px solid var(--line); border-radius:12px; background:#fff; }
.bk-avatar { display:grid; place-items:center; width:36px; height:36px; flex:none; border-radius:50%; background:var(--green); color:#fff; font-weight:700; }
.bk-chip-user strong { display:block; font-size:.9rem; line-height:1.2; } .bk-chip-user button { padding:0; border:0; background:none; color:var(--green); font-size:.8rem; cursor:pointer; } .bk-chip-guest { display:inline-flex; align-items:center; gap:.4rem; padding:.5rem .7rem; border:1px solid var(--line); border-radius:8px; background:#fff; color:var(--muted); font-size:.84rem; }

/* Four clear stages with a quiet progress rule. */
.bk-stepper { display:flex; align-items:center; margin:0 0 1.15rem; padding:.8rem .15rem; border-bottom:1px solid #dddcd3; list-style:none; }
.bk-stepper li { display:flex; align-items:center; flex:1 1 0; min-width:0; } .bk-stepper li:last-child { flex:0 0 auto; }
.bk-dot { display:flex; align-items:center; gap:.48rem; padding:0; border:0; background:none; color:#7b827a; font-size:.84rem; font-weight:500; white-space:nowrap; cursor:default; } .bk-dot.is-click { cursor:pointer; }
.bk-dot-n { display:grid; place-items:center; width:29px; height:29px; flex:none; border:1px solid #cfd3ca; border-radius:50%; background:#fff; color:#687068; font-size:.8rem; font-weight:600; }
.bk-dot.is-current { color:var(--green); font-weight:700; } .bk-dot.is-current .bk-dot-n { border-color:var(--green); background:var(--green); color:white; }
.bk-dot.is-done .bk-dot-n { border-color:#a8beaa; background:#e8f0e8; color:var(--green); }
.bk-line { flex:1; height:1px; margin:0 .5rem; overflow:hidden; background:#dddcd3; } .bk-line i { display:block; width:100%; height:100%; transform:scaleX(0); transform-origin:left; background:var(--green); transition:transform .2s ease; } .bk-line.is-done i { transform:scaleX(1); }
.bk-layout { display:grid; grid-template-columns:minmax(0,1fr) 290px; gap:1.2rem; align-items:start; }
.bk-glass { position:relative; border:0; border-radius:0; background:#fff; box-shadow:none; }
.bk-main { padding:clamp(1rem,3vw,2rem); overflow:visible; }
.bk-aside { position:sticky; top:90px; border-left:1px solid #d7d8ce; background:#eeeee7; }
.bk-mobile-summary { display:none; }
.bk-step { animation:bk-show .16s ease-out; } @keyframes bk-show { from { opacity:.7; } to { opacity:1; } }
.bk-step-head { margin-bottom:1rem; } .bk-step-head h2 { font-size:clamp(1.45rem,3vw,1.9rem); } .bk-step-head p { margin-top:.35rem; color:var(--muted); }
.bk-booking-divider { height:1px; margin:1.35rem 0; background:#e8e7e0; }
.bk-btn { display:inline-flex; align-items:center; justify-content:center; gap:.5rem; min-height:46px; padding:.72rem 1rem; border:1px solid transparent; border-radius:8px; text-align:center; font-size:.93rem; font-weight:600; cursor:pointer; transition:background .15s,border-color .15s,color .15s; }
.bk-btn:hover { filter:brightness(.97); } .bk-btn:active { transform:translateY(1px); }
.bk-btn-green { border-color:var(--green); background:var(--green); color:white!important; } .bk-btn-green:hover { border-color:var(--green-deep); background:var(--green-deep); }
.bk-btn-glass { border-color:#d4d8d0; background:white; color:var(--text); } .bk-btn-glass:hover { border-color:#91aa96; background:#f5f8f4; color:var(--green); }
.bk-btn:disabled,.bk-btn[aria-disabled='true'] { opacity:.45; cursor:not-allowed; transform:none; } .bk-btn-lg { padding:.78rem 1.15rem; } .bk-pulse:not(:disabled) { box-shadow:none; }
.bk-actions { display:flex; align-items:center; justify-content:space-between; gap:.7rem; margin-top:1.3rem; padding-top:1rem; border-top:1px solid var(--line); }
.bk-actions .bk-btn-green { min-width:170px; margin-left:auto; } .bk-hint { color:var(--muted); font-size:.87rem; }
.bk-tabs { display:flex; gap:.4rem; margin-bottom:.9rem; padding:.1rem 0 .3rem; overflow-x:auto; scrollbar-width:thin; }
.bk-tab { flex:none; min-height:39px; padding:.45rem .75rem; border:1px solid #dedfd8; border-radius:7px; background:white; color:#59625b; font-size:.88rem; font-weight:500; cursor:pointer; }
.bk-tab:hover { border-color:#9bb3a0; color:var(--green); } .bk-tab.is-active { border-color:var(--green); background:var(--green); color:white; }

.bk-service-tools { position:sticky; top:0; z-index:15; padding:.55rem 0 .35rem; background:#fff; }
.bk-search { display:flex; align-items:center; gap:.55rem; min-height:44px; margin-bottom:.45rem; padding:0 .7rem; border:1px solid #d9ddd5; border-radius:8px; background:#fff; color:#687168; }
.bk-search:focus-within { border-color:#789a80; box-shadow:0 0 0 3px rgba(37,95,67,.08); }
.bk-search input { flex:1; min-width:0; min-height:40px; border:0; outline:0; background:transparent; color:var(--text); font-size:.9rem; }
.bk-search input::placeholder { color:#879087; }
.bk-search button { display:grid; place-items:center; width:30px; height:30px; border:0; border-radius:6px; background:#f0f2ed; color:var(--muted); cursor:pointer; }
.bk-visually-hidden { position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0; }
.bk-tabs { gap:.32rem; padding-bottom:.45rem; scrollbar-width:none; }
.bk-tabs::-webkit-scrollbar { display:none; }
.bk-tab { min-height:36px; padding:.38rem .62rem; font-size:.82rem; }
.bk-list { display:grid; grid-template-columns:1fr; gap:0; }
.bk-opt { position:relative; display:flex; align-items:center; gap:.7rem; width:100%; padding:.78rem .35rem; border:0; border-bottom:1px solid #e8e9e3; border-radius:0; background:transparent; color:var(--text); text-align:left; font-size:.96rem; cursor:pointer; transition:background .13s; }
.bk-opt::before { display:none; } .bk-opt:hover:not(:disabled) { background:#f7f8f4; } .bk-opt.is-on { background:#f0f5ef; box-shadow:inset 3px 0 0 var(--green); }
.bk-opt:disabled { opacity:.5; cursor:not-allowed; } .bk-thumb { display:none; }
.bk-opt-body { display:grid; flex:1; min-width:0; gap:.1rem; } .bk-opt-body strong { font-size:.95rem; font-weight:600; } .bk-opt-body span { color:var(--muted); font-size:.83rem; } .bk-opt-body .bk-price { color:var(--green); font-size:.86rem; font-weight:600; }
.bk-check { display:grid; place-items:center; width:23px; height:23px; flex:none; border:1px solid #c4cbc3; border-radius:5px; color:transparent; } .bk-opt.is-on .bk-check { border-color:var(--green); background:var(--green); color:white; } .bk-radio { border-radius:50%; }
.bk-tag { display:inline-flex; width:fit-content; padding:.1rem .45rem; border-radius:4px; background:#f6efd9; color:#785614; font-size:.73rem; font-weight:600; }
.bk-banner { display:flex; align-items:flex-start; gap:.65rem; margin-bottom:.8rem; padding:.7rem .8rem; border-left:3px solid #bc9a53; background:#fbf7eb; } .bk-banner svg { flex:none; margin-top:2px; color:var(--gold); } .bk-banner p { color:#514b3d; font-size:.88rem; } .bk-banner button { flex:none; margin-left:auto; border:0; background:none; color:var(--green); font-size:.82rem; cursor:pointer; }
.bk-pkg-items { display:flex; flex-wrap:wrap; gap:.28rem; margin-top:.2rem; } .bk-pkg-items em { padding:.06rem .38rem; border-radius:4px; background:#f0f1ec; color:#505950; font-size:.72rem; font-style:normal; }
.bk-date-grid { display:grid; grid-template-columns:minmax(0,300px) minmax(0,1fr); gap:1rem; align-items:start; }
.bk-cal { padding:.8rem; border:1px solid #e2e3dc; background:#fff; } .bk-cal-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:.6rem; } .bk-cal-head strong { font-family:'Outfit',sans-serif; font-size:.98rem; }
.bk-round { display:grid; place-items:center; width:35px; height:35px; border:1px solid #e1e3dc; border-radius:7px; background:#fff; color:var(--text); cursor:pointer; } .bk-round:hover:not(:disabled) { border-color:#9bb3a0; background:#f3f7f2; } .bk-round:disabled { opacity:.4; cursor:not-allowed; }
.bk-cal-grid { display:grid; grid-template-columns:repeat(7,1fr); gap:.18rem; } .bk-cal-dow { padding:.25rem 0; color:var(--muted); text-align:center; font-size:.7rem; }
.bk-day { display:grid; aspect-ratio:1; place-items:center; border:1px solid transparent; border-radius:7px; background:transparent; color:var(--text); font-size:.87rem; cursor:pointer; } .bk-day:hover:not(:disabled) { border-color:#d3dfd3; background:#f1f6f1; } .bk-day:disabled { color:#c5cbc4; cursor:not-allowed; } .bk-day.is-today { border-color:#d1bc86; color:#765918; } .bk-day.is-on { border-color:var(--green); background:var(--green); color:white; font-weight:700; }
.bk-slots h3 { margin:.15rem 0; font-family:'Outfit',sans-serif; font-size:1rem; font-weight:600; } .bk-slots>p { margin-bottom:.75rem; color:var(--muted); font-size:.84rem; }
.bk-group { margin-bottom:.8rem; } .bk-group h4 { margin:0 0 .4rem; color:var(--muted); font:600 .75rem 'Outfit',sans-serif; letter-spacing:.04em; text-transform:uppercase; }
.bk-times { display:grid; grid-template-columns:repeat(auto-fill,minmax(82px,1fr)); gap:.4rem; } .bk-time { min-height:39px; border:1px solid #e0e2dc; border-radius:7px; background:#fff; color:var(--text); font-size:.86rem; cursor:pointer; } .bk-time:hover { border-color:#9bb3a0; background:#f6f9f5; } .bk-time.is-on { border-color:var(--green); background:var(--green); color:white; }
.bk-empty { display:grid; justify-items:center; gap:.5rem; padding:1.4rem .8rem; border:1px dashed #d3d8d1; background:#fafbf8; color:var(--muted); text-align:center; } .bk-empty svg { color:var(--green); }
.bk-seg { display:grid; grid-template-columns:1fr 1fr; gap:.25rem; margin-bottom:1rem; padding:.25rem; border:1px solid var(--line); border-radius:8px; background:#f1f2ed; } .bk-seg button { min-height:40px; border:0; border-radius:6px; background:transparent; color:var(--muted); font-size:.91rem; font-weight:600; cursor:pointer; } .bk-seg button.is-on { background:white; color:var(--green); box-shadow:0 1px 3px rgba(30,40,30,.09); }
.bk-form { display:grid; gap:.85rem; } .bk-row { display:grid; grid-template-columns:1fr 1fr; gap:.8rem; } .bk-field { display:grid; gap:.3rem; } .bk-field>span { color:#505a52; font-size:.86rem; } .bk-input { position:relative; } .bk-input>svg { position:absolute; top:50%; left:.8rem; translate:0 -50%; color:#7c877f; pointer-events:none; }
.bk-input input,.bk-field textarea { width:100%; min-height:46px; padding:.65rem .8rem .65rem 2.45rem; border:1px solid #d8ddd6; border-radius:7px; background:white; color:var(--text); font-size:.94rem; } .bk-field textarea { min-height:82px; padding:.65rem .8rem; resize:vertical; } .bk-input input::placeholder,.bk-field textarea::placeholder { color:#89928b; } .bk-input input:focus,.bk-field textarea:focus { outline:none; border-color:#78a084; box-shadow:0 0 0 3px rgba(37,95,67,.1); } .bk-input input[aria-invalid='true'] { border-color:var(--red); }
.bk-eye { position:absolute; top:50%; right:.25rem; display:grid; place-items:center; width:36px; height:36px; translate:0 -50%; border:0; border-radius:6px; background:transparent; color:var(--muted); cursor:pointer; } .bk-eye:hover { color:var(--text); } .bk-input.has-eye input { padding-right:2.8rem; }
.bk-err { color:var(--red); font-size:.82rem; } .bk-meter { display:flex; gap:.22rem; margin-top:.15rem; } .bk-meter i { flex:1; height:4px; border-radius:3px; background:#e4e6e1; } .bk-meter i.on-1 { background:#bd5448; } .bk-meter i.on-2 { background:#cf8a3a; } .bk-meter i.on-3 { background:#b5a142; } .bk-meter i.on-4 { background:var(--green); }
.bk-agree { display:flex; align-items:flex-start; gap:.55rem; color:#535e55; font-size:.86rem; cursor:pointer; } .bk-agree input { width:18px; height:18px; flex:none; margin-top:2px; accent-color:var(--green); } .bk-form-error { padding:.65rem .75rem; border:1px solid #e4c4bf; background:#fff5f3; color:#8e2e24; font-size:.9rem; }
.bk-perks { display:grid; gap:.4rem; margin:0 0 .9rem; padding:0; list-style:none; } .bk-perks li { display:flex; align-items:center; gap:.45rem; color:#536057; font-size:.87rem; } .bk-perks svg { flex:none; color:var(--green); } .bk-signed { display:grid; justify-items:center; gap:.65rem; padding:1.25rem; border:1px solid #dce6dc; background:#f5f8f3; text-align:center; } .bk-signed .bk-avatar { width:54px; height:54px; font-size:1.2rem; } .bk-signed p { color:var(--muted); }
.bk-review { display:grid; gap:.45rem; margin-bottom:.9rem; } .bk-review-row { display:flex; align-items:flex-start; justify-content:space-between; gap:.7rem; padding:.65rem .7rem; border-bottom:1px solid #e7e8e2; background:transparent; } .bk-review-row h4 { margin:0 0 .15rem; color:var(--muted); font:600 .73rem 'Outfit',sans-serif; letter-spacing:.04em; text-transform:uppercase; } .bk-review-row p { color:var(--text); overflow-wrap:anywhere; } .bk-edit { flex:none; padding:.18rem; border:0; background:transparent; color:var(--green); font-weight:600; cursor:pointer; } .bk-edit:hover { text-decoration:underline; }
.bk-pay { display:grid; gap:.65rem; margin:.45rem 0 .9rem; } .bk-pay h3 { font-size:1.08rem; } .bk-pay-opts { display:grid; grid-template-columns:1fr 1fr; gap:.55rem; } .bk-pay-opts .bk-opt { align-items:flex-start; padding:.6rem; border:1px solid var(--line); } .bk-pay-icon { display:grid; place-items:center; width:38px; height:38px; flex:none; border-radius:7px; background:#eef3ed; color:var(--green); }
.bk-expand { display:grid; grid-template-rows:0fr; transition:grid-template-rows .18s ease; } .bk-expand.is-open { grid-template-rows:1fr; } .bk-expand>div { overflow:hidden; } .bk-expand .bk-field { padding:.15rem .1rem .3rem; }
.bk-sum { padding:1.1rem; } .bk-sum h3 { margin-bottom:.75rem; font-size:1.08rem; } .bk-sum-list { display:grid; gap:.5rem; margin:0 0 .8rem; padding:0; list-style:none; } .bk-sum-list li { display:flex; justify-content:space-between; gap:.6rem; font-size:.86rem; } .bk-sum-list span:last-child { color:var(--muted); white-space:nowrap; } .bk-sum-empty { padding:.25rem 0 .75rem; color:var(--muted); font-size:.88rem; }
.bk-sum-meta { display:grid; gap:.45rem; padding:.75rem 0; border-top:1px solid #d8dbd2; font-size:.84rem; } .bk-sum-meta div { display:flex; align-items:flex-start; gap:.45rem; color:#586258; } .bk-sum-meta svg { flex:none; margin-top:3px; color:var(--green); }
.bk-total { display:flex; justify-content:space-between; align-items:baseline; padding-top:.7rem; border-top:1px solid #d8dbd2; } .bk-total span { color:var(--muted); } .bk-total strong { color:var(--text); font:600 1.14rem 'Outfit',sans-serif; }
.bk-mobile-summary summary { display:flex; align-items:center; justify-content:space-between; gap:.7rem; padding:.8rem .9rem; list-style:none; cursor:pointer; font-weight:600; } .bk-mobile-summary summary::-webkit-details-marker { display:none; } .bk-mobile-summary summary svg { color:var(--green); } .bk-mobile-summary[open] summary { border-bottom:1px solid var(--line); } .bk-mobile-summary .bk-sum { padding-top:.7rem; }
.bk-overlay { position:fixed; inset:0; z-index:1000; display:grid; place-items:center; padding:1rem; background:rgba(28,36,30,.46); } .bk-proc { display:grid; justify-items:center; gap:.8rem; width:min(400px,100%); padding:1.5rem; text-align:center; } .bk-spinner { width:40px; height:40px; border:3px solid #e4e9e3; border-top-color:var(--green); border-radius:50%; animation:bk-spin .8s linear infinite; } @keyframes bk-spin { to { transform:rotate(360deg); } } .bk-proc p { color:var(--muted); }
.bk-done { display:grid; justify-items:center; gap:.8rem; max-width:700px; margin:0 auto; padding:clamp(1.2rem,4vw,2rem); background:#fff; text-align:center; } .bk-tick { width:70px; height:70px; } .bk-tick circle { fill:#edf5ef; stroke:var(--green); stroke-width:3; stroke-dasharray:260; stroke-dashoffset:260; animation:bk-draw .65s ease .1s forwards; } .bk-tick path { fill:none; stroke:var(--green); stroke-width:5; stroke-linecap:round; stroke-linejoin:round; stroke-dasharray:70; stroke-dashoffset:70; animation:bk-draw .45s ease .5s forwards; } @keyframes bk-draw { to { stroke-dashoffset:0; } } .bk-done h2 { font-size:clamp(1.6rem,5vw,2.15rem); } .bk-ref { padding:.42rem .8rem; border:1px solid #ded4b8; border-radius:6px; background:#fbf7ec; color:#765714; font-size:.95rem; font-weight:700; letter-spacing:.07em; } .bk-done-card { width:100%; padding:.9rem; border:1px solid var(--line); background:#fafbf8; text-align:left; } .bk-done-actions { display:flex; flex-wrap:wrap; justify-content:center; gap:.55rem; margin-top:.25rem; } .bk-confetti { display:none; } .bk-fallback { background:#eef1ec; }
@media(max-width:1000px) { .bk-layout { grid-template-columns:1fr; } .bk-aside { display:none; } .bk-mobile-summary { display:block; margin-bottom:.75rem; } }
@media(max-width:760px) { .bk-service-tools { top:0; } .bk-wrap { width:min(100% - 1.2rem,620px); } .bk-dot span:not(.bk-dot-n) { display:none; } .bk-dot.is-current span:not(.bk-dot-n) { display:inline; } .bk-stepper { padding:.55rem 0; } .bk-line { margin:0 .25rem; } .bk-row,.bk-pay-opts { grid-template-columns:1fr; } .bk-date-grid { grid-template-columns:minmax(0,1fr); } .bk-cal { max-width:400px; width:100%; margin-inline:auto; } .bk-actions { position:sticky; bottom:0; z-index:20; margin:1rem -1rem -1rem; padding:.65rem 1rem; border-top:1px solid #dedfd8; background:rgba(255,255,255,.97); } .bk-actions .bk-btn { flex:1; min-width:0; } .bk-actions .bk-btn-green { margin-left:0; } }
@media(max-width:420px) { .bk-top { align-items:flex-start; } .bk-top h1 { font-size:1.9rem; } .bk-main { padding:.85rem; } .bk-actions { margin-inline:-.85rem; margin-bottom:-.85rem; padding-inline:.85rem; } .bk-dot-n { width:27px; height:27px; } .bk-done-actions .bk-btn { width:100%; } .bk-opt { gap:.5rem; padding:.68rem .2rem; } .bk-opt-body strong { font-size:.9rem; } }

/* Small-screen refinements: generous tap targets, compact hierarchy, and no sticky footer. */
.bk-service-tools { top:0; z-index:40; border-bottom:1px solid #e7e9e3; box-shadow:0 7px 15px -15px rgba(22,38,27,.45); }
.bk-staff-select { margin:0 0 .8rem; border:1px solid #e0e5de; border-radius:8px; background:#fbfcfa; }
.bk-staff-select summary { display:flex; align-items:center; justify-content:space-between; gap:12px; min-height:60px; padding:.65rem .8rem; list-style:none; cursor:pointer; }
.bk-staff-select summary::-webkit-details-marker { display:none; }
.bk-staff-select summary small { display:block; margin-bottom:2px; color:var(--muted); font-size:.74rem; }
.bk-staff-select summary strong { display:block; color:var(--text); font-size:.9rem; font-weight:600; }
.bk-staff-change { display:flex; flex:none; align-items:center; gap:5px; color:var(--green); font-size:.8rem; font-weight:600; }
.bk-staff-select[open] .bk-staff-change svg { transform:rotate(180deg); }
.bk-staff-change svg { transition:transform .18s ease; }
.bk-staff-panel { padding:0 .8rem .8rem; }
.bk-staff-panel .bk-step-head { display:none; }
.bk-staff-panel .bk-list { margin:0; }
@media(max-width:1000px) {
  .bk-layout { grid-template-columns:minmax(0,1fr); gap:.8rem; }
  .bk-aside { display:none; }
  .bk-mobile-summary { display:block; margin-bottom:.75rem; border:1px solid #e2e5de; border-radius:8px; background:#fff; }
  .bk-mobile-summary summary { min-height:48px; }
}
@media(max-width:760px) {
  .bk-page { padding:1rem 0 1.5rem; }
  .bk-wrap { width:min(calc(100% - 1rem),620px); }
  .bk-top { align-items:flex-start; flex-direction:column; gap:.55rem; margin-bottom:.75rem; }
  .bk-top h1 { font-size:clamp(1.85rem,7vw,2.45rem); }
  .bk-top p { max-width:38rem; font-size:.92rem; }
  .bk-chip-user,.bk-chip-guest { max-width:100%; }
  .bk-stepper { gap:.15rem; margin-bottom:.7rem; padding:.55rem 0; overflow-x:auto; scrollbar-width:none; }
  .bk-stepper::-webkit-scrollbar { display:none; }
  .bk-stepper li { flex:1 0 auto; min-width:0; }
  .bk-stepper li:last-child { flex:0 0 auto; }
  .bk-dot { gap:.32rem; font-size:.78rem; }
  .bk-dot-n { width:27px; height:27px; }
  .bk-dot span:not(.bk-dot-n) { display:none; }
  .bk-dot.is-current span:not(.bk-dot-n) { display:inline; max-width:7.1rem; overflow:hidden; text-overflow:ellipsis; }
  .bk-line { min-width:10px; margin:0 .2rem; }
  .bk-layout { gap:.7rem; }
  .bk-main { padding:.9rem; border:1px solid #e3e6df; border-radius:9px; background:#fff; }
  .bk-mobile-summary { margin-bottom:.65rem; }
  .bk-mobile-summary summary { padding:.65rem .75rem; }
  .bk-mobile-summary .bk-sum { padding:.45rem .75rem .75rem; }
  .bk-step-head { margin-bottom:.8rem; }
  .bk-step-head h2 { font-size:1.45rem; }
  .bk-step-head p { font-size:.88rem; }
  .bk-service-tools { top:0; margin:0 -.9rem; padding:.5rem .9rem .35rem; background:#fff; }
  .bk-search { min-height:43px; }
  .bk-tabs { margin:0; gap:.3rem; padding-bottom:.35rem; }
  .bk-tab { min-height:39px; padding:.42rem .62rem; font-size:.81rem; }
  .bk-opt { min-height:63px; gap:.55rem; padding:.68rem .25rem; }
  .bk-opt-body { overflow-wrap:anywhere; }
  .bk-opt-body strong { font-size:.92rem; }
  .bk-opt-body span { font-size:.81rem; line-height:1.4; }
  .bk-date-grid { grid-template-columns:minmax(0,1fr); gap:.8rem; }
  .bk-cal { width:100%; max-width:390px; margin-inline:auto; padding:.65rem; }
  .bk-cal-grid { gap:.12rem; }
  .bk-day { min-width:0; font-size:.82rem; }
  .bk-times { grid-template-columns:repeat(auto-fit,minmax(70px,1fr)); gap:.38rem; }
  .bk-time { min-height:43px; }
  .bk-row,.bk-pay-opts { grid-template-columns:minmax(0,1fr); }
  .bk-actions { position:static!important; inset:auto!important; display:flex; align-items:stretch; gap:.55rem; margin:1rem 0 0; padding:.85rem 0 0; border-top:1px solid var(--line); background:transparent; }
  .bk-actions > span { display:none; }
  .bk-actions .bk-btn { flex:1 1 0; min-width:0; min-height:46px; margin:0; padding:.68rem .65rem; white-space:normal; line-height:1.25; font-size:.86rem; }
  .bk-actions .bk-btn-green { margin-left:0; }
  .bk-review-row { padding:.65rem 0; }
  .bk-review-row > div { min-width:0; overflow-wrap:anywhere; }
  .bk-done { padding:1rem .8rem; }
}
@media(max-width:480px) {
  .bk-page { padding-top:.75rem; }
  .bk-wrap { width:calc(100% - .75rem); }
  .bk-top h1 { font-size:1.85rem; }
  .bk-top p { font-size:.87rem; }
  .bk-stepper { padding:.4rem 0 .55rem; }
  .bk-dot-n { width:25px; height:25px; font-size:.74rem; }
  .bk-dot.is-current span:not(.bk-dot-n) { max-width:5.8rem; font-size:.73rem; }
  .bk-line { min-width:6px; margin:0 .12rem; }
  .bk-main { padding:.72rem; }
  .bk-service-tools { margin-inline:-.72rem; padding-inline:.72rem; }
  .bk-search { gap:.4rem; padding-inline:.55rem; }
  .bk-search input { font-size:.84rem; }
  .bk-tab { min-height:38px; padding:.4rem .54rem; font-size:.77rem; }
  .bk-opt { gap:.45rem; }
  .bk-check { width:21px; height:21px; }
  .bk-staff-panel { padding-inline:.6rem; }
  .bk-staff-select summary { min-height:57px; padding:.58rem .62rem; }
  .bk-staff-select summary strong { font-size:.85rem; }
  .bk-staff-change { font-size:.75rem; }
  .bk-cal-head strong { font-size:.9rem; }
  .bk-day { border-radius:5px; font-size:.78rem; }
  .bk-cal-dow { font-size:.65rem; }
  .bk-actions .bk-btn { font-size:.8rem; }
  .bk-actions .bk-btn-glass { flex:.72; }
  .bk-actions .bk-btn-green { flex:1.28; }
  .bk-pay-opts .bk-opt { padding:.65rem .5rem; }
}
@media(max-width:350px) {
  .bk-wrap { width:calc(100% - .6rem); }
  .bk-top h1 { font-size:1.7rem; }
  .bk-stepper li { flex:0 0 auto; }
  .bk-dot.is-current span:not(.bk-dot-n) { max-width:4.6rem; }
  .bk-line { min-width:4px; }
  .bk-main { padding:.6rem; }
  .bk-service-tools { margin-inline:-.6rem; padding-inline:.6rem; }
  .bk-actions .bk-btn { padding-inline:.45rem; }
}
@media(prefers-reduced-motion:reduce) { .bk-page *,.bk-page *::before,.bk-page *::after { animation-duration:.01ms!important; animation-iteration-count:1!important; transition-duration:.01ms!important; scroll-behavior:auto!important; } }
`

function Img({ src, alt, className = '', ...rest }) {
  const [failed, setFailed] = useState(false)
  if (failed) return <div className={`bk-fallback ${className}`} role="img" aria-label={alt} />
  return <img src={src} alt={alt} className={className} loading="lazy" onError={() => setFailed(true)} {...rest} />
}

const glow = (e) => {
  if (e.pointerType && e.pointerType !== 'mouse') return
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`)
  e.currentTarget.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`)
}

/* ------------------------------- stepper ------------------------------- */
function Stepper({ step, onJump }) {
  return (
    <ol className="bk-glass bk-stepper" aria-label="Booking progress">
      {STEPS.map((label, i) => {
        const state = i < step ? 'is-done' : i === step ? 'is-current' : ''
        return (
          <li key={label}>
            <button type="button" className={`bk-dot ${state} ${i < step ? 'is-click' : ''}`} onClick={() => i < step && onJump(i)} aria-current={i === step ? 'step' : undefined} disabled={i >= step}>
              <span className="bk-dot-n">{i < step ? <Check size={16} /> : i + 1}</span>
              <span>{label}</span>
            </button>
            {i < STEPS.length - 1 && <span className={`bk-line ${i < step ? 'is-done' : ''}`}><i /></span>}
          </li>
        )
      })}
    </ol>
  )
}

/* ------------------------------- summary ------------------------------- */
function Summary({ chosen, pkg, offer, staff, date, time, minutes, total }) {
  return (
    <div className="bk-sum">
      <h3>Your booking</h3>
      {chosen.length === 0 ? (
        <p className="bk-sum-empty">Choose a service or package to start your booking.</p>
      ) : (
        <ul className="bk-sum-list">
          {pkg ? (
            <li><span>{pkg.name} package</span><span>{fmtPrice(pkg.price)}</span></li>
          ) : (
            chosen.map((s) => <li key={s.id}><span>{s.name}</span><span>{fmtPrice(s.price)}</span></li>)
          )}
        </ul>
      )}
      <div className="bk-sum-meta">
        {chosen.length > 0 && <div><Clock size={16} /><span>{fmtDuration(minutes, chosen.length === 1 ? chosen[0].durationText : '')}</span></div>}
        {offer && <div><BadgeCheck size={16} /><span>{offer.title}</span></div>}
        <div><Users size={16} /><span>{staff ? staff.role : 'Any available professional'}</span></div>
        {date && time != null && <div><CalendarCheck size={16} /><span>{fmtDate(date)} at {fmtTime(time)}</span></div>}
      </div>
      <div className="bk-total"><span>Total</span><strong>{fmtPrice(total)}</strong></div>
    </div>
  )
}

/* ---------------------------- step 1: services ---------------------------- */
function ServiceStep({ tab, setTab, selected, onToggle, pkgId, onPickPackage, offer, onClearOffer, staffId, onClearStaff, query, setQuery }) {
  const staff = staffId !== 'any' ? staffById(staffId) : null
  const needle = query.trim().toLowerCase()
  const list = SERVICES.filter((s) =>
    (tab === 'all' || s.category === tab) &&
    (!staff || staff.serviceIds.includes(s.id)) &&
    (!needle || s.name.toLowerCase().includes(needle) || (CATEGORIES.find((c) => c.id === s.category)?.name.toLowerCase().includes(needle) ?? false))
  )
  const packages = PACKAGES.filter((p) => {
    if (!needle) return true
    const names = p.serviceIds.map(serviceById).filter(Boolean).map((item) => item.name.toLowerCase())
    return p.name.toLowerCase().includes(needle) || names.some((name) => name.includes(needle))
  })
  return (
    <>
      <div className="bk-step-head">
        <h2>Choose your services</h2>
        <p>Pick one or more services, or book a ready-made package.</p>
      </div>

      {offer && (
        <div className="bk-banner" role="status">
          <BadgeCheck size={20} />
          <p><strong>{offer.title}</strong> is applied to this booking. {offer.terms}</p>
          <button type="button" onClick={onClearOffer}>Remove</button>
        </div>
      )}
      {staff && (
        <div className="bk-banner" role="status">
          <Users size={20} />
          <p>Showing services offered by our <strong>{staff.role}</strong>.</p>
          <button type="button" onClick={onClearStaff}>Show all</button>
        </div>
      )}

      <div className="bk-service-tools">
        <label className="bk-search">
          <Search size={18} aria-hidden="true" />
          <span className="bk-visually-hidden">Search services and packages</span>
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Find a service or package" autoComplete="off" />
          {query && <button type="button" aria-label="Clear search" onClick={() => setQuery('')}><X size={16} /></button>}
        </label>
        <div className="bk-tabs" role="group" aria-label="Filter services by category">
          {[{ id: 'all', name: 'All' }, ...CATEGORIES, { id: 'packages', name: 'Packages' }].map((c) => (
            <button key={c.id} type="button" className={`bk-tab ${tab === c.id ? 'is-active' : ''}`} aria-pressed={tab === c.id} onClick={() => { setTab(c.id); setQuery('') }}>{c.name}</button>
          ))}
        </div>
      </div>

      {tab === 'packages' ? (
        packages.length ? <div className="bk-list" key="packages">
          {packages.map((p, i) => {
            const on = pkgId === p.id
            const items = p.serviceIds.map(serviceById).filter(Boolean)
            const ok = items.every((s) => s.available)
            const mins = items.reduce((n, s) => n + s.durationMin, 0)
            return (
              <button key={p.id} type="button" className={`bk-opt bk-pop ${on ? 'is-on' : ''}`} style={{ '--d': `${i * 70}ms` }} onClick={() => onPickPackage(on ? null : p.id)} aria-pressed={on} disabled={!ok} onPointerMove={glow}>
                <span className="bk-thumb"><Img src={p.image} alt={p.name} /></span>
                <span className="bk-opt-body">
                  <strong>{p.name}</strong>
                  <span className="bk-pkg-items">{items.map((s) => <em key={s.id}>{s.name}</em>)}</span>
                  <span>{fmtDuration(mins)} · <span className="bk-price">{fmtPrice(p.price)}</span></span>
                </span>
                <span className="bk-check bk-radio"><Check size={16} /></span>
              </button>
            )
          })}
        </div> : <div className="bk-empty"><Search size={24} /><p>No packages match “{query}”. Try a different search.</p></div>
      ) : list.length ? (
        <div className="bk-list" key={`${tab}-${staffId}`}>
          {list.map((s, i) => {
            const on = !pkgId && selected.includes(s.id)
            return (
              <button key={s.id} type="button" className={`bk-opt bk-pop ${on ? 'is-on' : ''}`} style={{ '--d': `${Math.min(i, 8) * 60}ms` }} onClick={() => onToggle(s.id)} aria-pressed={on} disabled={!s.available} onPointerMove={glow}>
                <span className="bk-thumb"><Img src={s.image} alt={s.name} /></span>
                <span className="bk-opt-body">
                  <strong>{s.name}</strong>
                  <span><Clock size={13} style={{ verticalAlign: '-2px' }} /> {fmtDuration(s.durationMin, s.durationText)}</span>
                  <span className="bk-price">{s.available ? fmtPrice(s.price) : 'Currently unavailable'}</span>
                </span>
                <span className="bk-check"><Check size={16} /></span>
              </button>
            )
          })}
        </div>
      ) : <div className="bk-empty"><Search size={24} /><p>No services match “{query}”. Try another name or category.</p></div>}
      {pkgId && tab !== 'packages' && (
        <p className="bk-hint" style={{ marginTop: '1rem' }}>A package is selected. Choosing a single service here will replace it.</p>
      )}
    </>
  )
}

/* -------------------------- step 2: professional -------------------------- */
function StaffStep({ chosenIds, eligible, staffId, setStaffId }) {
  return (
    <>
      <div className="bk-step-head">
        <h2>Choose your professional</h2>
        <p>Only professionals who offer all your selected services can be chosen.</p>
      </div>
      {eligible.length === 0 && (
        <div className="bk-banner" role="alert">
          <Info size={20} />
          <p>No single professional offers every service you selected. Go back and book these services separately.</p>
        </div>
      )}
      <div className="bk-list">
        <button type="button" className={`bk-opt bk-pop ${staffId === 'any' ? 'is-on' : ''}`} onClick={() => setStaffId('any')} aria-pressed={staffId === 'any'} disabled={eligible.length === 0} onPointerMove={glow}>
          <span className="bk-thumb" style={{ display: 'grid', placeItems: 'center', color: 'var(--green)', background: 'rgba(61,220,132,0.1)' }}><Users size={30} /></span>
          <span className="bk-opt-body"><strong>Any available professional</strong><span>We will match you with whoever is free at your time.</span></span>
          <span className="bk-check bk-radio"><Check size={16} /></span>
        </button>
        {STAFF.map((p, i) => {
          const ok = chosenIds.every((id) => p.serviceIds.includes(id))
          const missing = chosenIds.filter((id) => !p.serviceIds.includes(id)).map((id) => serviceById(id)?.name).filter(Boolean)
          const on = staffId === p.id
          return (
            <button key={p.id} type="button" className={`bk-opt bk-pop ${on ? 'is-on' : ''}`} style={{ '--d': `${(i + 1) * 70}ms` }} onClick={() => setStaffId(p.id)} aria-pressed={on} disabled={!ok} onPointerMove={glow}>
              <span className="bk-thumb"><Img src={p.image} alt={p.role} /></span>
              <span className="bk-opt-body">
                <strong>{p.role}</strong>
                <span>{ok ? p.speciality : `Does not offer: ${missing.join(', ')}`}</span>
              </span>
              <span className="bk-check bk-radio"><Check size={16} /></span>
            </button>
          )
        })}
      </div>
    </>
  )
}

/* --------------------------- step 3: date and time --------------------------- */
function Calendar({ value, onChange }) {
  const today = useMemo(() => { const t = new Date(); t.setHours(0, 0, 0, 0); return t }, [])
  const last = useMemo(() => { const t = new Date(today); t.setDate(t.getDate() + BOOK_AHEAD_DAYS); return t }, [today])
  const [view, setView] = useState(() => { const b = value ? parseKey(value) : today; return new Date(b.getFullYear(), b.getMonth(), 1) })

  const first = new Date(view.getFullYear(), view.getMonth(), 1)
  const offset = (first.getDay() + 6) % 7
  const days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate()
  const cells = [...Array.from({ length: offset }, () => null), ...Array.from({ length: days }, (_, i) => new Date(view.getFullYear(), view.getMonth(), i + 1))]
  const canPrev = view > new Date(today.getFullYear(), today.getMonth(), 1)
  const canNext = new Date(view.getFullYear(), view.getMonth() + 1, 1) <= last
  const shift = (n) => setView(new Date(view.getFullYear(), view.getMonth() + n, 1))

  return (
    <div className="bk-glass bk-cal">
      <div className="bk-cal-head">
        <button type="button" className="bk-round" onClick={() => shift(-1)} disabled={!canPrev} aria-label="Previous month"><ChevronLeft size={20} /></button>
        <strong>{view.toLocaleDateString('en-KE', { month: 'long', year: 'numeric' })}</strong>
        <button type="button" className="bk-round" onClick={() => shift(1)} disabled={!canNext} aria-label="Next month"><ChevronRight size={20} /></button>
      </div>
      <div className="bk-cal-grid" key={`${view.getFullYear()}-${view.getMonth()}`}>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => <div key={d} className="bk-cal-dow">{d}</div>)}
        {cells.map((d, i) => {
          if (!d) return <span key={`e${i}`} />
          const key = dateKey(d)
          const off = d < today || d > last || !OPEN_HOURS[d.getDay()]
          return (
            <button key={key} type="button" disabled={off} className={`bk-day ${key === value ? 'is-on' : ''} ${key === dateKey(today) ? 'is-today' : ''}`} onClick={() => onChange(key)} aria-pressed={key === value} aria-label={fmtDate(key)}>
              {d.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function DateStep({ date, setDate, time, setTime, slots, minutes, staffId }) {
  const groups = [
    { label: 'Morning', items: slots.filter((s) => s.min < 720) },
    { label: 'Afternoon', items: slots.filter((s) => s.min >= 720 && s.min < 1020) },
    { label: 'Evening', items: slots.filter((s) => s.min >= 1020) },
  ].filter((g) => g.items.length)
  return (
    <>
      <div className="bk-step-head">
        <h2>Pick a date and time</h2>
        <p>Only times that fit your {fmtDuration(minutes)} appointment are shown.</p>
      </div>
      <div className="bk-date-grid">
        <Calendar value={date} onChange={(k) => { setDate(k); setTime(null) }} />
        <div className="bk-slots" aria-live="polite">
          {!date ? (
            <div className="bk-empty"><CalendarCheck size={30} /><p>Choose a date to see the available times.</p></div>
          ) : groups.length === 0 ? (
            <div className="bk-empty"><Clock size={30} /><p>No times are available on this date. Please try another day.</p></div>
          ) : (
            <div key={date} className="bk-pop">
              <h3>{fmtDate(date)}</h3>
              <p>{staffId === 'any' ? 'Times with any available professional.' : `Times with our ${staffById(staffId)?.role}.`}</p>
              {groups.map((g) => (
                <div key={g.label} className="bk-group">
                  <h4>{g.label}</h4>
                  <div className="bk-times">
                    {g.items.map((s) => (
                      <button key={s.min} type="button" className={`bk-time ${time === s.min ? 'is-on' : ''}`} onClick={() => setTime(s.min)} aria-pressed={time === s.min}>{fmtTime(s.min)}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

/* ------------------------------ step 4: account ------------------------------ */
function Field({ icon: Icon, label, error, children }) {
  return (
    <label className="bk-field">
      <span>{label}</span>
      <span className="bk-input" style={{ display: 'block' }}>{Icon && <Icon size={18} />}{children}</span>
      {error && <span className="bk-err" role="alert">{error}</span>}
    </label>
  )
}

function AccountStep({ user, onAuth, onSignOut }) {
  const [mode, setMode] = useState('signup')
  const [show, setShow] = useState(false)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [f, setF] = useState({ name: '', phone: '', email: '', password: '', confirm: '', agree: false, identifier: '', loginPassword: '' })
  const set = (k) => (e) => { setF((p) => ({ ...p, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })); setErrors((p) => ({ ...p, [k]: '' })); setFormError('') }

  if (user) {
    return (
      <>
        <div className="bk-step-head"><h2>Your account</h2><p>You are signed in and ready to confirm your booking.</p></div>
        <div className="bk-signed bk-pop">
          <span className="bk-avatar">{user.name.trim()[0]?.toUpperCase()}</span>
          <h3>{user.name}</h3>
          <p>{user.email}<br />{showPhone(user.phone)}</p>
          <button type="button" className="bk-btn bk-btn-glass" onClick={onSignOut}>Use a different account</button>
        </div>
      </>
    )
  }

  const signUp = (e) => {
    e.preventDefault()
    const next = {}
    const phone = normalizePhone(f.phone)
    if (f.name.trim().length < 2) next.name = 'Enter your full name.'
    if (!phone) next.phone = 'Enter a valid Kenyan phone number, for example 0712 345 678.'
    if (!EMAIL_RE.test(f.email.trim())) next.email = 'Enter a valid email address.'
    if (f.password.length < 8) next.password = 'Use at least 8 characters.'
    else if (passwordScore(f.password) < 2) next.password = 'Add capital letters, numbers or symbols to make it stronger.'
    if (f.confirm !== f.password) next.confirm = 'The passwords do not match.'
    if (!f.agree) next.agree = 'Please accept the terms to create your account.'
    setErrors(next)
    if (Object.keys(next).length) return

    /* [backend] POST the new account; the server hashes the password and rejects duplicates */
    const accounts = store.read(ACCOUNTS_KEY, [])
    const email = f.email.trim().toLowerCase()
    if (accounts.some((a) => a.email === email || a.phone === phone)) {
      setFormError('An account with this email or phone number already exists. Please log in instead.')
      return
    }
    const account = { id: `u_${Date.now().toString(36)}`, name: f.name.trim().replace(/\s+/g, ' '), phone, email }
    store.write(ACCOUNTS_KEY, [...accounts, account])
    store.write(SESSION_KEY, email)
    onAuth(account)
  }

  const logIn = (e) => {
    e.preventDefault()
    const next = {}
    const id = f.identifier.trim()
    if (!id) next.identifier = 'Enter your email or phone number.'
    if (!f.loginPassword) next.loginPassword = 'Enter your password.'
    setErrors(next)
    if (Object.keys(next).length) return

    /* [backend] POST the credentials; the server verifies the password and returns the session */
    const phone = normalizePhone(id)
    const account = store.read(ACCOUNTS_KEY, []).find((a) => a.email === id.toLowerCase() || (phone && a.phone === phone))
    if (!account) {
      setFormError('We could not find an account with those details. Please check them or create an account.')
      return
    }
    store.write(SESSION_KEY, account.email)
    onAuth(account)
  }

  const score = passwordScore(f.password)
  return (
    <>
      <div className="bk-step-head">
        <h2>{mode === 'signup' ? 'Create your account' : 'Welcome back'}</h2>
        <p>An account is needed to confirm a booking, so your appointments and receipts stay in one place.</p>
      </div>
      <div className="bk-seg" role="tablist">
        <button type="button" role="tab" aria-selected={mode === 'signup'} className={mode === 'signup' ? 'is-on' : ''} onClick={() => { setMode('signup'); setErrors({}); setFormError('') }}>Create account</button>
        <button type="button" role="tab" aria-selected={mode === 'login'} className={mode === 'login' ? 'is-on' : ''} onClick={() => { setMode('login'); setErrors({}); setFormError('') }}>Log in</button>
      </div>

      {mode === 'signup' ? (
        <>
          <ul className="bk-perks">
            <li><ShieldCheck size={18} /> Your details are kept private and used only for your bookings.</li>
            <li><CalendarCheck size={18} /> Track upcoming appointments and receipts.</li>
          </ul>
          <form className="bk-form bk-pop" onSubmit={signUp} noValidate>
            <Field icon={User} label="Full name" error={errors.name}>
              <input value={f.name} onChange={set('name')} autoComplete="name" placeholder="Your full name" aria-invalid={Boolean(errors.name)} />
            </Field>
            <div className="bk-row">
              <Field icon={Phone} label="Phone number" error={errors.phone}>
                <input type="tel" inputMode="tel" value={f.phone} onChange={set('phone')} autoComplete="tel" placeholder="0712 345 678" aria-invalid={Boolean(errors.phone)} />
              </Field>
              <Field icon={Mail} label="Email address" error={errors.email}>
                <input type="email" value={f.email} onChange={set('email')} autoComplete="email" placeholder="you@example.com" aria-invalid={Boolean(errors.email)} />
              </Field>
            </div>
            <div className="bk-row">
              <label className="bk-field">
                <span>Password</span>
                <span className="bk-input has-eye" style={{ display: 'block' }}>
                  <Lock size={18} />
                  <input type={show ? 'text' : 'password'} value={f.password} onChange={set('password')} autoComplete="new-password" placeholder="At least 8 characters" aria-invalid={Boolean(errors.password)} />
                  <button type="button" className="bk-eye" onClick={() => setShow((v) => !v)} aria-label={show ? 'Hide password' : 'Show password'}>{show ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                </span>
                <span className="bk-meter" aria-hidden="true">{[1, 2, 3, 4].map((n) => <i key={n} className={score >= n && f.password ? `on-${score}` : ''} />)}</span>
                {errors.password && <span className="bk-err" role="alert">{errors.password}</span>}
              </label>
              <Field icon={Lock} label="Confirm password" error={errors.confirm}>
                <input type={show ? 'text' : 'password'} value={f.confirm} onChange={set('confirm')} autoComplete="new-password" placeholder="Repeat your password" aria-invalid={Boolean(errors.confirm)} />
              </Field>
            </div>
            <label className="bk-agree">
              <input type="checkbox" checked={f.agree} onChange={set('agree')} />
              <span>I agree to the Terms and Conditions and the Privacy Policy.</span>
            </label>
            {errors.agree && <span className="bk-err" role="alert">{errors.agree}</span>}
            {formError && <div className="bk-form-error" role="alert">{formError}</div>}
            <button type="submit" className="bk-btn bk-btn-green bk-btn-lg">Create account and continue <ArrowRight size={18} /></button>
          </form>
        </>
      ) : (
        <form className="bk-form bk-pop" onSubmit={logIn} noValidate>
          <Field icon={User} label="Email or phone number" error={errors.identifier}>
            <input value={f.identifier} onChange={set('identifier')} autoComplete="username" placeholder="you@example.com or 0712 345 678" aria-invalid={Boolean(errors.identifier)} />
          </Field>
          <label className="bk-field">
            <span>Password</span>
            <span className="bk-input has-eye" style={{ display: 'block' }}>
              <Lock size={18} />
              <input type={show ? 'text' : 'password'} value={f.loginPassword} onChange={set('loginPassword')} autoComplete="current-password" placeholder="Your password" aria-invalid={Boolean(errors.loginPassword)} />
              <button type="button" className="bk-eye" onClick={() => setShow((v) => !v)} aria-label={show ? 'Hide password' : 'Show password'}>{show ? <EyeOff size={18} /> : <Eye size={18} />}</button>
            </span>
            {errors.loginPassword && <span className="bk-err" role="alert">{errors.loginPassword}</span>}
          </label>
          {formError && <div className="bk-form-error" role="alert">{formError}</div>}
          <button type="submit" className="bk-btn bk-btn-green bk-btn-lg">Log in and continue <ArrowRight size={18} /></button>
        </form>
      )}
    </>
  )
}

/* ------------------------------ step 5: confirm ------------------------------ */
function ConfirmStep({ summary, onEdit, pay, setPay, mpesaPhone, setMpesaPhone, notes, setNotes, agree, setAgree }) {
  const { chosen, pkg, offer, staff, date, time, minutes, total, user } = summary
  const phoneOk = pay !== 'mpesa' || Boolean(normalizePhone(mpesaPhone))
  return (
    <>
      <div className="bk-step-head">
        <h2>Review and confirm</h2>
        <p>Check everything below, choose how you will pay and confirm your appointment.</p>
      </div>
      <div className="bk-review">
        <div className="bk-review-row">
          <div><h4>{pkg ? 'Package' : 'Services'}</h4><p>{pkg ? `${pkg.name} (${chosen.map((s) => s.name).join(', ')})` : chosen.map((s) => s.name).join(', ')}</p>{offer && <p className="bk-hint">{offer.title} applied</p>}</div>
          <button type="button" className="bk-edit" onClick={() => onEdit(0)}>Edit</button>
        </div>
        <div className="bk-review-row">
          <div><h4>Professional</h4><p>{staff ? staff.role : 'Any available professional'}</p></div>
          <button type="button" className="bk-edit" onClick={() => onEdit(1)}>Edit</button>
        </div>
        <div className="bk-review-row">
          <div><h4>Date and time</h4><p>{fmtDate(date)} at {fmtTime(time)}</p><p className="bk-hint">Estimated {fmtDuration(minutes)}</p></div>
          <button type="button" className="bk-edit" onClick={() => onEdit(2)}>Edit</button>
        </div>
        <div className="bk-review-row">
          <div><h4>Booked by</h4><p>{user.name}</p><p className="bk-hint">{user.email} · {showPhone(user.phone)}</p></div>
        </div>
      </div>

      <div className="bk-pay">
        <h3>How would you like to pay?</h3>
        <div className="bk-pay-opts" role="radiogroup" aria-label="Payment method">
          <button type="button" role="radio" aria-checked={pay === 'mpesa'} className={`bk-opt ${pay === 'mpesa' ? 'is-on' : ''}`} onClick={() => setPay('mpesa')} onPointerMove={glow}>
            <span className="bk-pay-icon"><Smartphone size={22} /></span>
            <span className="bk-opt-body"><strong>M-Pesa</strong><span>Approve a prompt on your phone.</span></span>
            <span className="bk-check bk-radio"><Check size={16} /></span>
          </button>
          <button type="button" role="radio" aria-checked={pay === 'salon'} className={`bk-opt ${pay === 'salon' ? 'is-on' : ''}`} onClick={() => setPay('salon')} onPointerMove={glow}>
            <span className="bk-pay-icon"><Store size={22} /></span>
            <span className="bk-opt-body"><strong>Pay at the salon</strong><span>Settle after your appointment.</span></span>
            <span className="bk-check bk-radio"><Check size={16} /></span>
          </button>
        </div>
        <div className={`bk-expand ${pay === 'mpesa' ? 'is-open' : ''}`}>
          <div>
            <Field icon={Phone} label="M-Pesa phone number" error={!phoneOk && mpesaPhone ? 'Enter a valid Safaricom number, for example 0712 345 678.' : ''}>
              <input type="tel" inputMode="tel" value={mpesaPhone} onChange={(e) => setMpesaPhone(e.target.value)} autoComplete="tel" placeholder="0712 345 678" aria-invalid={!phoneOk && Boolean(mpesaPhone)} />
            </Field>
          </div>
        </div>
        <label className="bk-field">
          <span>Notes for the team (optional)</span>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} maxLength={300} placeholder="Anything we should know before your visit?" />
        </label>
        <label className="bk-agree">
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
          <span>I have read and agree to the booking terms and cancellation policy.</span>
        </label>
      </div>
      <div className="bk-total"><span>Total</span><strong>{fmtPrice(total)}</strong></div>
    </>
  )
}

/* ------------------------------- done screen ------------------------------- */
const CONFETTI = ['#3ddc84', '#f8c957', '#7af0ae', '#ffffff', '#ffe08a']
function Done({ booking, onAgain }) {
  const start = useMemo(() => { const d = parseKey(booking.date); d.setMinutes(booking.time); return d }, [booking])
  const end = useMemo(() => new Date(start.getTime() + booking.minutes * 60000), [start, booking])
  const title = `${BUSINESS_NAME} appointment`
  const details = `${booking.pkg ? `${booking.pkg.name} package: ` : ''}${booking.chosen.map((s) => s.name).join(', ')}\nProfessional: ${booking.staff.role}\nReference: ${booking.ref}`

  const downloadIcs = () => {
    const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', `PRODID:-//${BUSINESS_NAME}//Booking//EN`, 'BEGIN:VEVENT', `UID:${booking.ref}@crystalfive`, `DTSTAMP:${stamp(new Date())}`, `DTSTART:${stamp(start)}`, `DTEND:${stamp(end)}`, `SUMMARY:${icsText(title)}`, `DESCRIPTION:${icsText(details)}`, 'END:VEVENT', 'END:VCALENDAR']
    const url = URL.createObjectURL(new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `${booking.ref}.ics`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${stamp(start)}/${stamp(end)}&details=${encodeURIComponent(details)}`

  return (
    <div className="bk-glass bk-done bk-pop" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="bk-confetti" aria-hidden="true">
        {Array.from({ length: 26 }, (_, i) => <i key={i} style={{ left: `${(i * 37) % 100}%`, background: CONFETTI[i % CONFETTI.length], '--d': `${(i % 9) * 0.18}s` }} />)}
      </div>
      <svg className="bk-tick" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="41" /><path d="M32 52l13 13 24-28" /></svg>
      <h2>You are booked, {booking.user.name.split(' ')[0]}!</h2>
      <p className="bk-hint">Your appointment is confirmed. Keep this reference handy.</p>
      <span className="bk-ref">{booking.ref}</span>
      <div className="bk-done-card">
        <ul className="bk-sum-list">
          {booking.pkg ? <li><span>{booking.pkg.name} package</span><span>{fmtPrice(booking.pkg.price)}</span></li> : booking.chosen.map((s) => <li key={s.id}><span>{s.name}</span><span>{fmtPrice(s.price)}</span></li>)}
        </ul>
        <div className="bk-sum-meta">
          <div><CalendarCheck size={16} /><span>{fmtDate(booking.date)} at {fmtTime(booking.time)}</span></div>
          <div><Clock size={16} /><span>About {fmtDuration(booking.minutes)}</span></div>
          <div><Users size={16} /><span>{booking.staff.role}</span></div>
          <div><Smartphone size={16} /><span>{booking.pay === 'mpesa' ? `M-Pesa payment from ${showPhone(normalizePhone(booking.phone))}` : 'Pay at the salon'}</span></div>
        </div>
        <div className="bk-total"><span>Total</span><strong>{fmtPrice(booking.total)}</strong></div>
      </div>
      <div className="bk-done-actions">
        <button type="button" className="bk-btn bk-btn-green" onClick={downloadIcs}><Download size={18} /> Add to calendar</button>
        <a className="bk-btn bk-btn-glass" href={googleUrl} target="_blank" rel="noreferrer"><CalendarPlus size={18} /> Google Calendar</a>
        <button type="button" className="bk-btn bk-btn-glass" onClick={onAgain}>Book another</button>
        <Link to="/" className="bk-btn bk-btn-glass">Back to home</Link>
      </div>
    </div>
  )
}

/* ---------------------------------- page ---------------------------------- */
const computeInitial = (params) => {
  const pkg = PACKAGES.find((p) => p.id === params.get('package')) || null
  const offer = OFFERS.find((o) => o.id === params.get('offer') && offerLive(o)) || null
  const staff = staffById(params.get('staff'))
  let services = (params.get('service') || '').split(',').map((s) => s.trim()).filter((id) => serviceById(id)?.available)
  if (!pkg && !services.length && offer) services = offer.serviceIds.filter((id) => serviceById(id)?.available)
  if (staff) services = services.filter((id) => staff.serviceIds.includes(id))
  const cat = params.get('category')
  return {
    pkgId: pkg ? pkg.id : null,
    offerId: offer ? offer.id : null,
    staffId: staff ? staff.id : 'any',
    selected: pkg ? [] : services,
    tab: pkg ? 'packages' : CATEGORIES.some((c) => c.id === cat) ? cat : 'all',
    step: pkg || services.length ? 1 : 0,
  }
}

function BookNow() {
  const [params] = useSearchParams()
  const [init] = useState(() => computeInitial(params))
  const [step, setStep] = useState(init.step)
  const [dir, setDir] = useState(1)
  const [tab, setTab] = useState(init.tab)
  const [serviceQuery, setServiceQuery] = useState('')
  const [selected, setSelected] = useState(init.selected)
  const [pkgId, setPkgId] = useState(init.pkgId)
  const [offerId, setOfferId] = useState(init.offerId)
  const [staffId, setStaffId] = useState(init.staffId)
  const [date, setDate] = useState(null)
  const [time, setTime] = useState(null)
  const [user, setUser] = useState(null)
  const [notes, setNotes] = useState('')
  const [pay, setPay] = useState('mpesa')
  const [mpesaPhone, setMpesaPhone] = useState('')
  const [agree, setAgree] = useState(false)
  const [status, setStatus] = useState('idle')
  const [procMsg, setProcMsg] = useState('')
  const [booking, setBooking] = useState(null)
  const topRef = useRef(null)
  const timers = useRef([])

  useEffect(() => {
    const prev = document.title
    document.title = `Book Now | ${BUSINESS_NAME}`
    return () => { document.title = prev; timers.current.forEach(clearTimeout) }
  }, [])

  useEffect(() => {
    const u = loadSession()
    if (u) { setUser(u); setMpesaPhone((p) => p || showPhone(u.phone)) }
  }, [])

  const pkg = PACKAGES.find((p) => p.id === pkgId) || null
  const offer = OFFERS.find((o) => o.id === offerId) || null
  const chosenIds = pkg ? pkg.serviceIds : selected
  const chosen = useMemo(() => chosenIds.map(serviceById).filter(Boolean), [chosenIds])
  const minutes = chosen.reduce((n, s) => n + s.durationMin, 0)
  const total = pkg && pkg.price != null ? pkg.price : chosen.length && chosen.every((s) => s.price != null) ? chosen.reduce((n, s) => n + s.price, 0) : null
  const eligible = useMemo(() => (chosenIds.length ? eligibleStaff(chosenIds) : []), [chosenIds])
  const staff = staffId === 'any' ? null : staffById(staffId)
  const slots = useMemo(() => (date && chosen.length ? buildSlots(date, minutes, staff ? [staff] : eligible) : []), [date, chosen.length, minutes, staff, eligible])

  useEffect(() => { if (staffId !== 'any' && !eligible.some((s) => s.id === staffId)) setStaffId('any') }, [eligible, staffId])
  useEffect(() => { if (time != null && !slots.some((s) => s.min === time)) setTime(null) }, [slots, time])

  const go = useCallback((n) => {
    setDir(n >= step ? 1 : -1)
    setStep(n)
    requestAnimationFrame(() => topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }, [step])

  const toggleService = (id) => {
    if (pkgId) { setPkgId(null); setSelected([id]); return }
    setSelected((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]))
  }
  const pickPackage = (id) => { setPkgId(id); setSelected([]) }

  const onAuth = (account) => {
    setUser(account)
    setMpesaPhone((p) => p || showPhone(account.phone))
    timers.current.push(setTimeout(() => go(3), 700))
  }
  const signOut = () => { store.remove(SESSION_KEY); setUser(null) }

  const canContinue = [
    chosen.length > 0,
    eligible.length > 0 && (staffId === 'any' || eligible.some((s) => s.id === staffId)) && Boolean(date) && time != null,
    Boolean(user),
    agree && (pay === 'salon' || Boolean(normalizePhone(mpesaPhone))),
  ][step]

  const confirm = () => {
    if (!user || !canContinue) return
    setStatus('processing')
    setProcMsg(pay === 'mpesa' ? `Sending an M-Pesa prompt to ${showPhone(normalizePhone(mpesaPhone))}` : 'Confirming your appointment')
    if (pay === 'mpesa') timers.current.push(setTimeout(() => setProcMsg('Approve the payment on your phone'), 1600))
    timers.current.push(setTimeout(() => {
      /* [backend] create the booking, take the payment and receive the reference */
      const slot = slots.find((s) => s.min === time)
      const assigned = staff || staffById(slot ? slot.staffIds[0] : eligible[0].id)
      setBooking({
        ref: `CF-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
        chosen, pkg, offer, staff: assigned, date, time, minutes, total, pay, phone: mpesaPhone, user, notes,
      })
      setStatus('done')
      requestAnimationFrame(() => topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
    }, pay === 'mpesa' ? 3600 : 1800))
  }

  const reset = () => {
    setStatus('idle'); setBooking(null); setStep(0); setDir(1); setTab('all')
    setSelected([]); setPkgId(null); setOfferId(null); setStaffId('any'); setDate(null); setTime(null); setServiceQuery('')
    setNotes(''); setAgree(false)
  }

  const summaryProps = { chosen, pkg, offer, staff, date, time, minutes, total }
  const lastStep = step === STEPS.length - 1

  return (
    <div className="bk-page">
      <style>{STYLES}</style>
      <div className="bk-bg" aria-hidden="true"><span className="bk-orb bk-orb-a" /><span className="bk-orb bk-orb-b" /></div>

      <div className="bk-wrap">
        <header className="bk-top" ref={topRef} style={{ scrollMarginTop: '90px' }}>
          <div>
            <span className="bk-pill"><Sparkles size={15} /> Book Now</span>
            <h1>Book Your Appointment</h1>
            <p>Choose your services, then pick a professional and appointment time together.</p>
          </div>
          {user ? (
            <div className="bk-chip-user">
              <span className="bk-avatar">{user.name.trim()[0]?.toUpperCase()}</span>
              <span><strong>{user.name.split(' ')[0]}</strong><button type="button" onClick={signOut}>Sign out</button></span>
            </div>
          ) : (
            <span className="bk-chip-guest"><Lock size={15} /> Account needed to confirm</span>
          )}
        </header>

        {status === 'done' && booking ? (
          <Done booking={booking} onAgain={reset} />
        ) : (
          <>
            <Stepper step={step} onJump={go} />
            <details className="bk-glass bk-mobile-summary">
              <summary>
                <span>Your booking{chosen.length ? ` · ${chosen.length} ${chosen.length === 1 ? 'item' : 'items'}` : ''}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--gold)' }}>{fmtPrice(total)}<ChevronDown size={20} /></span>
              </summary>
              <Summary {...summaryProps} />
            </details>

            <div className="bk-layout">
              <main className="bk-glass bk-main">
                <div key={step} className={`bk-step ${dir < 0 ? 'to-prev' : ''}`}>
                  {step === 0 && (
                    <ServiceStep tab={tab} setTab={setTab} selected={selected} onToggle={toggleService} pkgId={pkgId} onPickPackage={pickPackage} offer={offer} onClearOffer={() => setOfferId(null)} staffId={staffId} onClearStaff={() => setStaffId('any')} query={serviceQuery} setQuery={setServiceQuery} />
                  )}
                  {step === 1 && (
                    <>
                      <details className="bk-staff-select">
                        <summary>
                          <span><small>Professional preference · optional</small><strong>{eligible.length === 0 ? 'These services need separate bookings' : staff ? staff.role : 'Any available professional'}</strong></span>
                          <span className="bk-staff-change">{staffId === 'any' ? 'Choose' : 'Change'} <ChevronDown size={17} aria-hidden="true" /></span>
                        </summary>
                        <div className="bk-staff-panel"><StaffStep chosenIds={chosenIds} eligible={eligible} staffId={staffId} setStaffId={setStaffId} /></div>
                      </details>
                      <div className="bk-booking-divider" aria-hidden="true" />
                      <DateStep date={date} setDate={setDate} time={time} setTime={setTime} slots={slots} minutes={minutes} staffId={staffId} />
                    </>
                  )}
                  {step === 2 && <AccountStep user={user} onAuth={onAuth} onSignOut={signOut} />}
                  {step === 3 && user && date && time != null && (
                    <ConfirmStep summary={{ ...summaryProps, user }} onEdit={(target) => go(target === 0 ? 0 : 1)} pay={pay} setPay={setPay} mpesaPhone={mpesaPhone} setMpesaPhone={setMpesaPhone} notes={notes} setNotes={setNotes} agree={agree} setAgree={setAgree} />
                  )}
                </div>

                <div className="bk-actions">
                  {step > 0 ? (
                    <button type="button" className="bk-btn bk-btn-glass" onClick={() => go(step - 1)}><ArrowLeft size={18} /> Back</button>
                  ) : <span />}
                  {lastStep ? (
                    <button type="button" className="bk-btn bk-btn-green bk-btn-lg bk-pulse" disabled={!canContinue} onClick={confirm}>Confirm Booking <Check size={18} /></button>
                  ) : (
                    <button type="button" className="bk-btn bk-btn-green" disabled={!canContinue} onClick={() => go(step + 1)}>
                      {step === 0 ? 'Continue to professional & time' : step === 1 ? 'Continue to your details' : user ? 'Continue to review' : 'Continue'} <ArrowRight size={18} />
                    </button>
                  )}
                </div>
              </main>

              <aside className="bk-aside bk-glass" aria-label="Booking summary">
                <Summary {...summaryProps} />
              </aside>
            </div>
          </>
        )}
      </div>

      {status === 'processing' && (
        <div className="bk-overlay" role="alertdialog" aria-live="assertive" aria-label="Confirming your booking">
          <div className="bk-glass bk-proc">
            <span className="bk-spinner" />
            <h3>{pay === 'mpesa' ? 'Waiting for payment' : 'Confirming'}</h3>
            <p>{procMsg}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookNow