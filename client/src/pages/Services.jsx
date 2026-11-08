import { createElement, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  ArrowRight, ArrowUp, BadgeCheck, CalendarCheck, Check, ChevronDown, ChevronLeft, ChevronRight,
  Clock, Copy, Droplets, Heart, MessageCircle, Phone, Scissors, Search, Sparkles, Star, Tag, X, ZoomIn,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  BUSINESS SETTINGS: optional. Empty values are simply hidden.        */
/* ------------------------------------------------------------------ */
const BUSINESS = {
  phone: '',       // e.g. '+254700000000'
  whatsapp: '',    // digits only with country code, e.g. '254700000000'
}

/* ------------------------------------------------------------------ */
/*  IMAGES: use the same public/<filename> paths as the Home page.      */
/*  Keep these filenames aligned with the files in the public folder.   */
/* ------------------------------------------------------------------ */
const HERO_IMAGE = '/Hair plaiting 1.jpg'

const CATEGORIES = [
  { id: 'hair-salon', name: 'Hair Salon', text: 'Braids, styling and treatments', icon: Sparkles },
  { id: 'kinyozi', name: 'Kinyozi', text: 'Haircuts and beard grooming', icon: Scissors },
  { id: 'beauty', name: 'Beauty & Nails', text: 'Manicure, pedicure and beauty', icon: Heart },
  { id: 'hair-care', name: 'Hair Care', text: 'Washing and hair treatments', icon: Droplets },
]

/*  price: null shows "KSh —" until the owner sets it.                  */
/*  status: 'available' or 'unavailable'.  active: false hides it.      */
/*  featured: true shows it under "Our Most Loved Services".            */
const SERVICES = [
  { id: 'braids', category: 'hair-salon', name: 'Braids', active: true, status: 'available', featured: true, price: null, durationMin: 240, durationText: '3 – 5 hours', image: '/Braids.jpg', gallery: [],
    text: 'Neat, long-lasting braids in the style you choose.',
    description: 'Choose the style, size and length you want and our stylists will braid it with care. Neat parting and a clean finish keep your braids looking good for longer.',
    includes: ['Style and length consultation', 'Hair parting and preparation', 'Braiding in your chosen style', 'Neat finishing'],
    prep: 'Come with clean, detangled hair.' },
  { id: 'hair-styling', category: 'hair-salon', name: 'Hair Styling', active: true, status: 'available', featured: false, price: null, durationMin: 60, image: '/Hair Styling.jpg', gallery: [],
    text: 'Styling for everyday looks and special occasions.',
    description: 'From a relaxed everyday look to a polished style for an event, we shape your hair to match your outfit, your mood and your occasion.',
    includes: ['Consultation on the look you want', 'Styling and shaping', 'Finishing products'],
    prep: '' },
  { id: 'blow-dry', category: 'hair-salon', name: 'Blow-Dry', active: true, status: 'available', featured: false, price: null, durationMin: 45, image: '/Blow Drying.jpg', gallery: [],
    text: 'A smooth, polished finish after your wash.',
    description: 'A professional blow-dry that leaves your hair smooth, full of movement and ready for the day or the night ahead.',
    includes: ['Wash and towel dry', 'Professional blow-dry', 'Smooth finish'],
    prep: '' },
  { id: 'mens-haircut', category: 'kinyozi', name: "Men's Haircut", active: true, status: 'available', featured: true, price: null, durationMin: 30, image: '/Men Shave.jpg', gallery: [],
    text: 'A clean cut shaped around your face and style.',
    description: 'A professional haircut and styling to give you a clean, fresh appearance. Tell your barber what you have in mind or ask for advice on what suits you.',
    includes: ['Consultation', 'Haircut with clippers and scissors', 'Neckline clean-up', 'Styling'],
    prep: '' },
  { id: 'fade', category: 'kinyozi', name: 'Fade', active: true, status: 'available', featured: false, price: null, durationMin: 40, image: '/Fade Haircut.jpg', gallery: [],
    text: 'Sharp, precise fades blended from skin to length.',
    description: 'A carefully blended fade, from a low skin fade to a high taper, finished with clean lines.',
    includes: ['Consultation on fade height', 'Precision blending', 'Line-up', 'Styling'],
    prep: '' },
  { id: 'shave', category: 'kinyozi', name: 'Shave', active: true, status: 'available', featured: false, price: null, durationMin: 25, image: '/Men Haircut.jpg', gallery: [],
    text: 'A close, comfortable shave with a fresh finish.',
    description: 'A close and comfortable shave that leaves your skin smooth and refreshed.',
    includes: ['Skin preparation', 'Close shave', 'Soothing finish'],
    prep: '' },
  { id: 'beard-trim', category: 'kinyozi', name: 'Beard Trim', active: true, status: 'available', featured: false, price: null, durationMin: 20, image: '/Beard Trim.jpg', gallery: [],
    text: 'Shaped and lined beards that stay tidy.',
    description: 'Your beard trimmed, shaped and lined so it frames your face and stays neat between visits.',
    includes: ['Shaping and trimming', 'Edge and line-up', 'Finishing'],
    prep: '' },
  { id: 'makeup', category: 'beauty', name: 'Makeup', active: true, status: 'available', featured: false, price: null, durationMin: 60, image: '/Makeup.jpg', gallery: [],
    text: 'Makeup for events, photos and everyday confidence.',
    description: 'Makeup applied for the occasion you have in mind, whether it is a wedding, a photoshoot, a night out or simply a day when you want to feel your best.',
    includes: ['Skin preparation', 'Full makeup application', 'Finishing'],
    prep: 'Arrive with a clean, moisturised face.' },
  { id: 'nails', category: 'beauty', name: 'Nails', active: true, status: 'available', featured: false, price: null, durationMin: 60, image: '/Nails.jpg', gallery: [],
    text: 'Nail shaping, colour and finishing.',
    description: 'Nails shaped, coloured and finished to your taste, from simple and natural to bold and creative.',
    includes: ['Nail shaping', 'Colour application', 'Finishing coat'],
    prep: '' },
  { id: 'manicure', category: 'beauty', name: 'Manicure & Pedicure', active: true, status: 'available', featured: true, price: null, durationMin: 90, image: '/Nails Manicure.jpg', gallery: [],
    text: 'Hand and foot care that leaves you refreshed.',
    description: 'Relaxing care for your hands and feet, with grooming, soothing treatment and a neat finish.',
    includes: ['Hand and foot soak', 'Nail and cuticle care', 'Moisturising treatment', 'Polish'],
    prep: '' },
  { id: 'hair-wash', category: 'hair-care', name: 'Wash & Condition', active: true, status: 'available', featured: false, price: null, durationMin: 30, image: '/Hair Wash.jpg', gallery: [],
    text: 'A gentle wash with conditioning for soft hair.',
    description: 'A gentle wash and conditioning treatment that leaves your hair clean, soft and easy to manage.',
    includes: ['Gentle shampoo', 'Conditioning', 'Towel dry'],
    prep: '' },
  { id: 'hair-treatment', category: 'hair-care', name: 'Hair Treatment', active: true, status: 'available', featured: true, price: null, durationMin: 45, image: '/Hair Treatment.jpg', gallery: [],
    text: 'Treatments that restore strength and shine.',
    description: 'A treatment chosen for your hair type to restore moisture, strength and shine.',
    includes: ['Hair and scalp check', 'Treatment application', 'Rinse and finish'],
    prep: '' },
]

/* A package's price is set by the owner; savings are worked out from the service prices. */
const PACKAGES = [
  { id: 'fresh-look', name: 'Fresh Look', text: 'A haircut and a beard trim in one visit.', serviceIds: ['mens-haircut', 'beard-trim'], price: null, image: '/Haircut and Beard Combo.jpg', active: true },
  { id: 'hair-care-package', name: 'Hair Care Package', text: 'A wash, a treatment and styling to finish.', serviceIds: ['hair-wash', 'hair-treatment', 'hair-styling'], price: null, image: '/Hair Treatment.jpg', active: true },
  { id: 'bridal', name: 'Bridal Package', text: 'Hair styling and makeup for your big day.', serviceIds: ['hair-styling', 'makeup'], price: null, image: '/Makeup.jpg', active: true },
  { id: 'complete-grooming', name: 'Complete Grooming', text: 'A haircut, a shave and beard grooming.', serviceIds: ['mens-haircut', 'shave', 'beard-trim'], price: null, image: '/Men Haircut.jpg', active: true },
]

/* Offers disappear automatically once endsAt has passed */
const PROMOTIONS = [
  { id: 'first-visit', title: 'First-visit offer', text: 'A welcome offer for customers booking with us for the first time.', image: '/First Visit Offer.jpg', oldPrice: null, price: null, startsAt: '2026-01-01', endsAt: '2027-12-31', terms: 'Applies to first appointments only. Show your booking confirmation on arrival.' },
  { id: 'cut-and-beard', title: 'Haircut and beard combo', text: 'Book a haircut and beard trim together for one package price.', image: '/Haircut and Beard Combo.jpg', oldPrice: null, price: null, startsAt: '2026-01-01', endsAt: '2027-12-31', terms: 'Both services must be booked in the same appointment.' },
  { id: 'student', title: 'Student offer', text: 'A reduced price on selected services for students.', image: '/Student BOy Offer.jpg', oldPrice: null, price: null, startsAt: '2026-01-01', endsAt: '2027-12-31', terms: 'Valid student ID required at your appointment.' },
]

/* Portfolio photos are tied to a service, so they show up in that service's details too */
const PORTFOLIO = [
  { id: 1, serviceId: 'mens-haircut', src: '/Men Haircut.jpg', alt: 'Fresh haircut' },
  { id: 2, serviceId: 'braids', src: '/Braids.jpg', alt: 'Braided hairstyle' },
  { id: 3, serviceId: 'hair-styling', src: '/Hair Styling.jpg', alt: 'Styled hair' },
  { id: 4, serviceId: 'beard-trim', src: '/Beard Trim.jpg', alt: 'Groomed beard' },
  { id: 5, serviceId: 'makeup', src: '/Makeup.jpg', alt: 'Makeup look' },
  { id: 6, serviceId: 'nails', src: '/Nails.jpg', alt: 'Nail design' },
  { id: 7, serviceId: 'fade', src: '/Fade Haircut.jpg', alt: 'Fade haircut' },
  { id: 8, serviceId: 'braids', src: '/Braids.jpg', alt: 'Box braids' },
  { id: 9, serviceId: 'hair-styling', src: '/Hair Styling.jpg', alt: 'Event hairstyle' },
  { id: 10, serviceId: 'manicure', src: '/Nails Manicure.jpg', alt: 'Manicure' },
  { id: 11, serviceId: 'hair-treatment', src: '/Hair Treatment.jpg', alt: 'Hair after treatment' },
  { id: 12, serviceId: 'mens-haircut', src: '/Men Shave.jpg', alt: 'Classic haircut' },
]

/* Photos for the team live in /public/clients/team/. Add names and bios here when you are ready. */
const STAFF = [
  { id: 'hairstylist', role: 'Senior Hairstylist', speciality: 'Braids, styling and treatments', image: '/Senior HairStylist.jpg', serviceIds: ['braids', 'hair-styling', 'blow-dry', 'hair-wash', 'hair-treatment'] },
  { id: 'barber', role: 'Professional Barber', speciality: 'Fades, haircuts and beard grooming', image: '/HairStylist 2.jpg', serviceIds: ['mens-haircut', 'fade', 'shave', 'beard-trim'] },
  { id: 'nails', role: 'Nail Technician', speciality: 'Manicures, pedicures and nail art', image: '/Nail Trchnician.jpg', serviceIds: ['nails', 'manicure'] },
  { id: 'beauty', role: 'Beauty Therapist', speciality: 'Makeup and skin care', image: '/Beauty Therapist.jpg', serviceIds: ['makeup'] },
]

const FAQS = [
  { q: 'Do I need to book before visiting?', a: 'Booking ahead is the surest way to get the time and the professional you want. You can choose your service and time on the booking page in a few steps.' },
  { q: 'Can I walk in without an appointment?', a: 'We will always try to help, but availability depends on who is free at that moment. Booking ahead saves you the wait.' },
  { q: 'How do I pay using M-Pesa?', a: 'M-Pesa is one of the payment options offered when you book. Choose it at payment and follow the prompt on your phone.' },
  { q: 'Can I choose my preferred barber or stylist?', a: 'Yes. Pick a professional on the booking page and you will only see the services they offer and the times they are free.' },
  { q: 'Can I cancel or reschedule?', a: 'Yes. Please contact us as early as you can so your slot can be offered to someone else and we can find you a new time.' },
  { q: 'How long does a particular service take?', a: 'Every service card shows its estimated time, and the details page gives you the full picture before you book.' },
  { q: 'Are service packages available?', a: 'Yes. Our packages combine services into one booking, and the package card shows what is included and the estimated time.' },
]

/* ------------------------------ helpers ------------------------------ */
const formatPrice = (n) => (n == null ? 'KSh —' : `KSh ${Number(n).toLocaleString('en-KE')}`)
const formatDuration = (min, text) => {
  if (text) return text
  if (min < 60) return `${min} minutes`
  const h = Math.floor(min / 60)
  const m = min % 60
  return `${h} hour${h > 1 ? 's' : ''}${m ? ` ${m} minutes` : ''}`
}
const isLive = (p, now = new Date()) => now >= new Date(p.startsAt) && now <= new Date(`${p.endsAt}T23:59:59`)
const serviceById = (id) => SERVICES.find((s) => s.id === id)
const categoryName = (id) => CATEGORIES.find((c) => c.id === id)?.name || ''
const staffFor = (serviceId) => STAFF.filter((s) => s.serviceIds.includes(serviceId))
const packageFigures = (pkg) => {
  const items = pkg.serviceIds.map(serviceById).filter(Boolean)
  const minutes = items.reduce((sum, s) => sum + s.durationMin, 0)
  const allPriced = items.length > 0 && items.every((s) => s.price != null)
  const total = allPriced ? items.reduce((sum, s) => sum + s.price, 0) : null
  const saving = total != null && pkg.price != null && total > pkg.price ? total - pkg.price : null
  return { items, minutes, total, saving }
}

const scrollToId = (id) => (e) => {
  const el = document.getElementById(id)
  if (!el) return
  if (e && e.preventDefault) e.preventDefault()
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/* 3D tilt and light that follows the mouse (ignored on touch screens) */
const tiltMove = (e) => {
  if (e.pointerType && e.pointerType !== 'mouse') return
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  const x = (e.clientX - r.left) / r.width
  const y = (e.clientY - r.top) / r.height
  el.style.setProperty('--mx', `${x * 100}%`)
  el.style.setProperty('--my', `${y * 100}%`)
  el.style.setProperty('--rx', `${(0.5 - y) * 6}deg`)
  el.style.setProperty('--ry', `${(x - 0.5) * 8}deg`)
}
const tiltReset = (e) => {
  e.currentTarget.style.setProperty('--rx', '0deg')
  e.currentTarget.style.setProperty('--ry', '0deg')
}
const tilt = { onPointerMove: tiltMove, onPointerLeave: tiltReset }

/* ------------------------------ styles ------------------------------- */
const STYLES = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=Outfit:wght@400;500;600;700&display=swap');

.sv-page {
  --gold: #f8c957; --green: #3ddc84; --green-deep: #1fae62;
  --ink: #0d1216; --ink-2: #131a20; --ink-3: #1b242c;
  --text: #eef1f3; --muted: #a9b4bd; --line: rgba(255,255,255,0.1); --glass: rgba(255,255,255,0.06);
  --ease: cubic-bezier(0.2, 0.7, 0.2, 1);
  font-family: 'Outfit', system-ui, sans-serif; background: var(--ink); color: var(--text); overflow-x: clip; line-height: 1.6;
}
.sv-page *, .sv-page *::before, .sv-page *::after { box-sizing: border-box; }
.sv-page h1, .sv-page h2, .sv-page h3 { font-family: 'Fraunces', Georgia, serif; line-height: 1.15; margin: 0; letter-spacing: -0.01em; }
.sv-page p { margin: 0; }
.sv-page a { color: inherit; text-decoration: none; }
.sv-page img { display: block; max-width: 100%; }
.sv-page button, .sv-page input, .sv-page select { font-family: inherit; }
.sv-page :focus-visible { outline: 2px solid var(--gold); outline-offset: 3px; }
.sv-page section[id] { scroll-margin-top: 84px; }

.sv-wrap { width: min(1180px, 100% - 2rem); margin-inline: auto; }
.sv-section { padding: clamp(3.2rem, 8vw, 6.5rem) 0; position: relative; }
.sv-alt { background: linear-gradient(180deg, var(--ink-2), var(--ink)); }
.sv-center { display: flex; justify-content: center; margin-top: 2rem; }
.sv-cell { height: 100%; }

/* ---------- section head ---------- */
.sv-head { max-width: 640px; margin: 0 auto clamp(1.8rem, 5vw, 3rem); text-align: center; }
.sv-head h2 { font-size: clamp(1.9rem, 5.5vw, 3rem); }
.sv-head p { margin-top: 0.7rem; color: var(--muted); font-size: clamp(0.98rem, 2.6vw, 1.1rem); }
.sv-head h2::after { content: ''; display: block; width: 72px; height: 3px; margin: 0.9rem auto 0; border-radius: 3px; background: linear-gradient(90deg, transparent, var(--gold), transparent); transform: scaleX(0); transition: transform 1s var(--ease) 0.25s; }
.sv-head.is-in h2::after { transform: scaleX(1); }

/* ---------- reveal (plays scrolling down and up) ---------- */
.sv-reveal { opacity: 0; will-change: opacity, transform; transition: opacity 0.85s var(--ease) var(--d, 0ms), transform 0.95s var(--ease) var(--d, 0ms), filter 0.85s var(--ease) var(--d, 0ms); }
.sv-reveal:not(.is-in) { transition-delay: 0ms; transition-duration: 0.45s; }
.sv-up.from-below:not(.is-in) { transform: translateY(38px); }
.sv-up.from-above:not(.is-in) { transform: translateY(-38px); }
.sv-zoom:not(.is-in) { transform: scale(0.9) translateY(14px); }
.sv-left:not(.is-in) { transform: translateX(-46px); }
.sv-right:not(.is-in) { transform: translateX(46px); }
.sv-sec.from-below:not(.is-in) { transform: translateY(46px) scale(0.985); }
.sv-sec.from-above:not(.is-in) { transform: translateY(-34px) scale(0.985); }
.sv-head:not(.is-in) { filter: blur(7px); }
.sv-reveal.is-in { opacity: 1; transform: none; filter: none; will-change: auto; }
.sv-rise { opacity: 0; animation: sv-rise 1s var(--ease) var(--d, 0ms) forwards; }
@keyframes sv-rise { from { opacity: 0; transform: translateY(26px); } to { opacity: 1; transform: none; } }
.sv-swap { animation: sv-pop-in 0.7s var(--ease) var(--d, 0ms) backwards; }
@keyframes sv-pop-in { from { opacity: 0; transform: translateY(24px) scale(0.94); } to { opacity: 1; transform: none; } }
.sv-word { display: inline-block; opacity: 0; animation: sv-word 0.9s var(--ease) calc(250ms + var(--i) * 130ms) forwards; }
@keyframes sv-word { from { opacity: 0; transform: translateY(46px) rotate(4deg); filter: blur(12px); } to { opacity: 1; transform: none; filter: blur(0); } }

/* ---------- glass, lift, glow ---------- */
.sv-glass { position: relative; background: var(--glass); border: 1px solid var(--line); border-radius: 20px; backdrop-filter: blur(16px) saturate(140%); -webkit-backdrop-filter: blur(16px) saturate(140%); box-shadow: 0 10px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08); }
.sv-lift { position: relative; transform-style: preserve-3d; transition: transform 0.35s var(--ease), box-shadow 0.45s var(--ease), border-color 0.45s var(--ease); }
.sv-lift::before { content: ''; position: absolute; inset: 0; z-index: 2; border-radius: inherit; pointer-events: none; opacity: 0; background: radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(248,201,87,0.18), transparent 55%); transition: opacity 0.4s; }
.sv-lift:hover::before { opacity: 1; }
.sv-lift:hover, .sv-lift:focus-within { transform: perspective(1000px) translateY(-10px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)); border-color: rgba(248,201,87,0.45); box-shadow: 0 26px 56px rgba(0,0,0,0.5), 0 0 40px rgba(61,220,132,0.14); }
.sv-icon { display: grid; place-items: center; width: 48px; height: 48px; flex: none; border-radius: 14px; color: var(--gold); background: rgba(248,201,87,0.12); border: 1px solid rgba(248,201,87,0.3); transition: transform 0.5s var(--ease); }
.sv-lift:hover .sv-icon { transform: rotate(-10deg) scale(1.15); }
.sv-breathe { animation: sv-breathe 4s ease-in-out infinite; }
.sv-float { animation: sv-float 6s ease-in-out infinite; }
@keyframes sv-breathe { 0%, 100% { transform: scale(1); box-shadow: 0 0 0 rgba(248,201,87,0); } 50% { transform: scale(1.07); box-shadow: 0 0 24px rgba(248,201,87,0.35); } }
@keyframes sv-float { 0%, 100% { translate: 0 0; } 50% { translate: 0 -12px; } }
@keyframes sv-pulse { 0%, 100% { box-shadow: 0 8px 26px rgba(61,220,132,0.28); } 50% { box-shadow: 0 8px 46px rgba(61,220,132,0.6); } }

/* ---------- buttons ---------- */
.sv-btn { position: relative; display: inline-flex; align-items: center; justify-content: center; gap: 0.55rem; padding: 0.9rem 1.5rem; min-height: 46px; border: 1px solid transparent; border-radius: 999px; font-weight: 600; font-size: 0.98rem; cursor: pointer; overflow: hidden; isolation: isolate; text-align: center; transition: transform 0.35s var(--ease), box-shadow 0.35s var(--ease), background 0.35s, border-color 0.35s; }
.sv-btn::after { content: ''; position: absolute; inset: 0; z-index: -1; background: linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.45) 50%, transparent 70%); transform: translateX(-120%); }
.sv-btn:hover::after { transform: translateX(120%); transition: transform 0.9s var(--ease); }
.sv-btn:hover { transform: translateY(-3px); }
.sv-btn:active { transform: translateY(0) scale(0.97); }
.sv-btn-green { color: #04140a !important; background: linear-gradient(135deg, #7af0ae, var(--green) 55%, var(--green-deep)); box-shadow: 0 8px 26px rgba(61,220,132,0.28); }
.sv-btn-green:hover { box-shadow: 0 14px 38px rgba(61,220,132,0.55); }
.sv-btn-glass { color: var(--text); background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.22); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }
.sv-btn-glass:hover { background: rgba(255,255,255,0.15); border-color: var(--gold); }
.sv-btn-sm { padding: 0.6rem 1rem; min-height: 42px; font-size: 0.9rem; }
.sv-btn-lg { padding: 1.1rem 2.2rem; font-size: 1.1rem; }
.sv-btn-off { color: var(--muted); background: rgba(255,255,255,0.05); border-color: var(--line); cursor: not-allowed; }
.sv-btn-off:hover { transform: none; }
.sv-pulse { animation: sv-pulse 3.6s ease-in-out infinite; }
.sv-actions { display: flex; flex-wrap: wrap; gap: 0.8rem; }
.sv-actions-center { justify-content: center; }
.sv-link { display: inline-flex; align-items: center; gap: 0.35rem; color: var(--gold) !important; font-weight: 600; background: none; border: 0; padding: 0.3rem 0; cursor: pointer; transition: gap 0.3s var(--ease); }
.sv-link:hover { gap: 0.7rem; }

/* ---------- hero ---------- */
.sv-hero { position: relative; min-height: 78vh; min-height: 78svh; display: flex; align-items: center; padding: clamp(6.5rem, 14vw, 8.5rem) 0 clamp(4rem, 9vw, 6rem); overflow: hidden; }
.sv-hero-bg { position: absolute; inset: -110px 0 0 0; transform: translateY(calc(var(--hp, 0) * 90px)); background: radial-gradient(circle at 30% 20%, #26323b, var(--ink) 70%); will-change: transform; }
.sv-hero-bg img, .sv-hero-bg .sv-fallback { width: 100%; height: 100%; object-fit: cover; animation: sv-kenburns 18s ease-out forwards; }
@keyframes sv-kenburns { from { transform: scale(1); } to { transform: scale(1.1); } }
.sv-hero-shade { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(13,18,22,0.93), rgba(13,18,22,0.62) 60%, rgba(13,18,22,0.45)), linear-gradient(0deg, var(--ink), transparent 40%); }
.sv-orb { position: absolute; border-radius: 50%; filter: blur(70px); pointer-events: none; animation: sv-drift 12s ease-in-out infinite; }
.sv-orb-a { width: 320px; height: 320px; top: 8%; right: 8%; background: rgba(61,220,132,0.18); }
.sv-orb-b { width: 260px; height: 260px; bottom: 4%; left: -3%; background: rgba(248,201,87,0.16); animation-direction: reverse; animation-duration: 15s; }
@keyframes sv-drift { 0%, 100% { transform: translate(0,0); } 50% { transform: translate(-30px, 34px); } }
.sv-spark { position: absolute; z-index: 1; width: 6px; height: 6px; border-radius: 50%; background: var(--gold); box-shadow: 0 0 12px 2px rgba(248,201,87,0.8); opacity: 0; pointer-events: none; animation: sv-spark 9s ease-in-out infinite; }
@keyframes sv-spark { 0% { opacity: 0; transform: translateY(40px) scale(0.5); } 20% { opacity: 0.9; } 80% { opacity: 0.6; } 100% { opacity: 0; transform: translateY(-170px) scale(1.2); } }
.sv-hero-inner { position: relative; z-index: 2; opacity: calc(1 - var(--hp, 0) * 1.25); transform: translateY(calc(var(--hp, 0) * -46px)); max-width: 760px; }
.sv-pill { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.45rem 1rem; border-radius: 999px; font-size: 0.92rem; font-weight: 500; color: var(--gold); background: rgba(248,201,87,0.1); border: 1px solid rgba(248,201,87,0.35); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
.sv-hero h1 { margin-top: 1.1rem; font-size: clamp(2.5rem, 8.5vw, 5.2rem); font-weight: 700; animation: sv-glow 5s ease-in-out infinite; }
@keyframes sv-glow { 0%, 100% { text-shadow: 0 0 24px rgba(248,201,87,0.12); } 50% { text-shadow: 0 0 50px rgba(248,201,87,0.45); } }
.sv-tagline { margin-top: 1rem; font-size: clamp(1.1rem, 3.2vw, 1.5rem); color: var(--gold); font-weight: 500; }
.sv-lead { margin-top: 1rem; max-width: 600px; color: #d4dbe0; font-size: clamp(1rem, 2.6vw, 1.15rem); }
.sv-hero .sv-actions { margin-top: 1.8rem; }

/* ---------- categories ---------- */
.sv-cats { margin-top: -2.4rem; position: relative; z-index: 4; padding-bottom: 1rem; }
.sv-cat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
.sv-cat { display: flex; flex-direction: column; align-items: flex-start; gap: 0.7rem; width: 100%; height: 100%; padding: 1.3rem; text-align: left; color: var(--text); cursor: pointer; font-size: 1rem; }
.sv-cat h3 { font-family: 'Outfit', sans-serif; font-size: 1.15rem; font-weight: 600; }
.sv-cat p { color: var(--muted); font-size: 0.9rem; }
.sv-cat small { margin-top: auto; color: var(--green); font-weight: 600; }
.sv-cat.is-active { border-color: var(--green); box-shadow: 0 0 34px rgba(61,220,132,0.28); }

/* ---------- catalogue toolbar ---------- */
.sv-toolbar { display: grid; gap: 1rem; margin-bottom: 1.8rem; }
.sv-search { position: relative; max-width: 560px; width: 100%; margin: 0 auto; }
.sv-search > svg { position: absolute; left: 1rem; top: 50%; translate: 0 -50%; color: var(--muted); pointer-events: none; }
.sv-search input { width: 100%; min-height: 52px; padding: 0.8rem 3rem 0.8rem 2.9rem; border-radius: 999px; border: 1px solid var(--line); background: rgba(255,255,255,0.06); color: var(--text); font-size: 1rem; transition: border-color 0.3s, box-shadow 0.3s; }
.sv-search input::placeholder { color: var(--muted); }
.sv-search input:focus { outline: none; border-color: var(--green); box-shadow: 0 0 0 3px rgba(61,220,132,0.22); }
.sv-clear { position: absolute; right: 0.5rem; top: 50%; translate: 0 -50%; display: grid; place-items: center; width: 36px; height: 36px; border-radius: 50%; border: 0; background: rgba(255,255,255,0.1); color: var(--text); cursor: pointer; transition: background 0.3s, transform 0.3s var(--ease); }
.sv-clear:hover { background: rgba(255,255,255,0.2); transform: rotate(90deg); }
.sv-tabs { display: flex; gap: 0.6rem; padding: 0.25rem; overflow-x: auto; justify-content: center; scrollbar-width: none; -webkit-overflow-scrolling: touch; }
.sv-tabs::-webkit-scrollbar { display: none; }
.sv-tab { flex: none; padding: 0.6rem 1.2rem; min-height: 44px; border-radius: 999px; border: 1px solid var(--line); background: var(--glass); color: var(--muted); font-weight: 500; font-size: 0.95rem; cursor: pointer; transition: all 0.35s var(--ease); }
.sv-tab:hover { color: var(--text); border-color: rgba(61,220,132,0.55); transform: translateY(-2px); }
.sv-tab.is-active { color: #04140a; background: var(--green); border-color: var(--green); box-shadow: 0 0 24px rgba(61,220,132,0.4); }
.sv-count { text-align: center; color: var(--muted); font-size: 0.92rem; }

/* ---------- cards ---------- */
.sv-grid { display: grid; gap: clamp(1rem, 2.5vw, 1.6rem); }
.sv-services { grid-template-columns: repeat(auto-fill, minmax(min(100%, 270px), 1fr)); }
.sv-packages { grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)); }
.sv-promos { grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr)); }
.sv-team { grid-template-columns: repeat(auto-fit, minmax(min(100%, 250px), 1fr)); }
.sv-card { display: flex; flex-direction: column; height: 100%; overflow: hidden; border-radius: 20px; background: var(--ink-3); border: 1px solid var(--line); }
.sv-media { position: relative; aspect-ratio: 4 / 3; overflow: hidden; background: var(--ink-2); }
.sv-media img, .sv-media .sv-fallback { width: 100%; height: 100%; object-fit: cover; transition: transform 0.9s var(--ease); }
.sv-card:hover .sv-media img { transform: scale(1.08); }
.sv-badges { position: absolute; left: 0.8rem; top: 0.8rem; right: 0.8rem; display: flex; justify-content: space-between; gap: 0.5rem; z-index: 3; }
.sv-badge { display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.28rem 0.7rem; border-radius: 999px; font-size: 0.78rem; font-weight: 600; background: rgba(13,18,22,0.7); border: 1px solid rgba(255,255,255,0.18); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
.sv-badge-gold { color: #1a1405; background: var(--gold); border-color: var(--gold); }
.sv-badge-ok { color: var(--green); }
.sv-badge-off { color: #ff8a80; }
.sv-body { display: flex; flex-direction: column; flex: 1; gap: 0.5rem; padding: 1.2rem; }
.sv-cat-label { font-size: 0.85rem; color: var(--green); font-weight: 500; }
.sv-body h3 { font-size: 1.3rem; }
.sv-body > p { color: var(--muted); font-size: 0.95rem; }
.sv-meta { display: flex; align-items: center; justify-content: space-between; gap: 0.7rem; margin-top: auto; padding-top: 0.8rem; }
.sv-dur { display: inline-flex; align-items: center; gap: 0.4rem; color: var(--muted); font-size: 0.9rem; }
.sv-price { font-weight: 700; font-size: 1.2rem; color: var(--gold); }
.sv-price s { margin-right: 0.5rem; font-weight: 400; font-size: 0.9rem; color: var(--muted); }
.sv-card-actions { display: flex; flex-wrap: wrap; gap: 0.6rem; padding-top: 0.8rem; }
.sv-card-actions .sv-btn { flex: 1 1 auto; }
.sv-include { display: flex; flex-wrap: wrap; gap: 0.45rem; margin-top: 0.2rem; }
.sv-chip { display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.3rem 0.75rem; border-radius: 999px; font-size: 0.82rem; color: var(--text); background: rgba(255,255,255,0.07); border: 1px solid var(--line); cursor: pointer; transition: background 0.3s, border-color 0.3s, transform 0.3s var(--ease); }
.sv-chip:hover { background: rgba(61,220,132,0.14); border-color: var(--green); transform: translateY(-2px); }
.sv-save { display: inline-flex; padding: 0.28rem 0.7rem; border-radius: 999px; font-size: 0.82rem; font-weight: 600; color: #04140a; background: var(--green); }
.sv-terms { margin-top: 0.6rem; font-size: 0.85rem; color: var(--muted); }
.sv-terms summary { cursor: pointer; color: var(--text); padding: 0.3rem 0; }
.sv-terms p { margin-top: 0.4rem; animation: sv-rise 0.4s var(--ease); }

.sv-empty { max-width: 520px; margin: 1rem auto 0; padding: clamp(1.6rem, 5vw, 2.4rem); text-align: center; display: grid; justify-items: center; gap: 0.8rem; }
.sv-empty p { color: var(--muted); }

/* ---------- most loved ---------- */
.sv-loved { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr)); gap: clamp(1rem, 2.5vw, 1.5rem); }
.sv-feat { position: relative; display: flex; flex-direction: column; justify-content: flex-end; min-height: 380px; height: 100%; overflow: hidden; border-radius: 22px; border: 1px solid var(--line); background: var(--ink-3); }
.sv-feat > img, .sv-feat > .sv-fallback { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 1s var(--ease); }
.sv-feat:hover > img { transform: scale(1.09); }
.sv-feat::after { content: ''; position: absolute; inset: 0; background: linear-gradient(0deg, rgba(13,18,22,0.96) 0%, rgba(13,18,22,0.55) 45%, transparent 75%); }
.sv-feat-body { position: relative; z-index: 3; display: grid; gap: 0.5rem; padding: 1.3rem; }
.sv-feat-body h3 { font-size: 1.45rem; }
.sv-feat-body p { color: #cfd7dd; font-size: 0.93rem; }
.sv-feat .sv-badges { justify-content: flex-start; }

/* ---------- portfolio ---------- */
.sv-gallery { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.8rem; }
.sv-shot { position: relative; padding: 0; border: 1px solid var(--line); border-radius: 16px; overflow: hidden; aspect-ratio: 1; background: var(--ink-3); cursor: zoom-in; transition: transform 0.45s var(--ease), box-shadow 0.45s var(--ease); }
.sv-shot img, .sv-shot .sv-fallback { width: 100%; height: 100%; object-fit: cover; transition: transform 0.9s var(--ease); }
.sv-shot:hover { transform: translateY(-6px); box-shadow: 0 18px 40px rgba(0,0,0,0.5), 0 0 28px rgba(61,220,132,0.2); }
.sv-shot:hover img { transform: scale(1.1); }
.sv-shot-over { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.4rem; padding: 0.5rem; text-align: center; color: var(--green); background: rgba(13,18,22,0.6); opacity: 0; backdrop-filter: blur(3px); -webkit-backdrop-filter: blur(3px); transition: opacity 0.4s; }
.sv-shot-over em { font-style: normal; font-size: 0.85rem; color: var(--text); }
.sv-shot:hover .sv-shot-over, .sv-shot:focus-visible .sv-shot-over { opacity: 1; }

/* ---------- team ---------- */
.sv-photo { aspect-ratio: 3 / 4; overflow: hidden; background: var(--ink-2); }
.sv-photo img, .sv-photo .sv-fallback { width: 100%; height: 100%; object-fit: cover; transition: transform 0.9s var(--ease); }
.sv-card:hover .sv-photo img { transform: scale(1.08); }
.sv-team .sv-body { align-items: flex-start; }
.sv-team .sv-body > p { margin-bottom: 0.3rem; }
.sv-team .sv-btn { width: 100%; margin-top: auto; }
.sv-team .sv-include { margin-bottom: 0.8rem; }

/* ---------- faq ---------- */
.sv-faq { max-width: 820px; margin: 0 auto; display: grid; gap: 0.8rem; }
.sv-faq-item { overflow: hidden; border-radius: 16px; transition: border-color 0.4s, box-shadow 0.4s; }
.sv-faq-item.is-open { border-color: rgba(61,220,132,0.5); box-shadow: 0 0 30px rgba(61,220,132,0.14); }
.sv-faq-q { display: flex; align-items: center; justify-content: space-between; gap: 1rem; width: 100%; padding: 1.1rem 1.3rem; min-height: 56px; border: 0; background: none; color: var(--text); font-size: 1.05rem; font-weight: 500; text-align: left; cursor: pointer; }
.sv-faq-q svg { flex: none; color: var(--gold); transition: transform 0.5s var(--ease); }
.sv-faq-item.is-open .sv-faq-q svg { transform: rotate(180deg); }
.sv-faq-a { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.5s var(--ease); }
.sv-faq-item.is-open .sv-faq-a { grid-template-rows: 1fr; }
.sv-faq-a > div { overflow: hidden; }
.sv-faq-a p { padding: 0 1.3rem 1.2rem; color: var(--muted); }
.sv-faq-more { margin-top: 2rem; text-align: center; display: grid; gap: 0.9rem; justify-items: center; color: var(--muted); }

/* ---------- final cta ---------- */
.sv-cta { position: relative; overflow: hidden; display: flex; flex-direction: column; align-items: center; gap: 0.9rem; padding: clamp(2.4rem, 8vw, 5rem) clamp(1.2rem, 5vw, 3rem); text-align: center; border-radius: 28px; border: 1px solid rgba(61,220,132,0.4); background: linear-gradient(135deg, rgba(61,220,132,0.14), rgba(255,255,255,0.03)); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); }
.sv-cta h2 { font-size: clamp(2rem, 6.5vw, 3.6rem); }
.sv-cta-sub { color: var(--gold); font-size: clamp(1.1rem, 3vw, 1.4rem); font-weight: 500; }
.sv-cta p:not(.sv-cta-sub) { max-width: 520px; color: #cfd7dd; }
.sv-cta .sv-btn { margin-top: 0.8rem; }
.sv-cta-glow { position: absolute; z-index: -1; width: 420px; height: 420px; top: -40%; left: 50%; translate: -50% 0; border-radius: 50%; background: rgba(61,220,132,0.25); filter: blur(90px); animation: sv-glow-pulse 5s ease-in-out infinite; }
@keyframes sv-glow-pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
.sv-cta::after { content: ''; position: absolute; inset: 0; pointer-events: none; background: linear-gradient(115deg, transparent 35%, rgba(255,255,255,0.12) 50%, transparent 65%); transform: translateX(-120%); animation: sv-sweep 6s ease-in-out infinite; }
@keyframes sv-sweep { 0%, 55% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }

/* ---------- modal and lightbox ---------- */
.sv-overlay { position: fixed; inset: 0; z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1rem; background: rgba(5,8,10,0.88); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); animation: sv-fade 0.35s ease; }
@keyframes sv-fade { from { opacity: 0; } to { opacity: 1; } }
.sv-dialog { position: relative; width: min(1020px, 100%); max-height: calc(100vh - 2rem); max-height: calc(100svh - 2rem); overflow-y: auto; overscroll-behavior: contain; display: grid; grid-template-columns: 1.05fr 1fr; border-radius: 24px; background: var(--ink-2); border: 1px solid rgba(255,255,255,0.14); box-shadow: 0 30px 80px rgba(0,0,0,0.6), 0 0 60px rgba(61,220,132,0.12); animation: sv-pop 0.5s var(--ease); }
@keyframes sv-pop { from { opacity: 0; transform: translateY(30px) scale(0.94); } to { opacity: 1; transform: none; } }
.sv-d-media { padding: 1rem; display: grid; gap: 0.7rem; align-content: start; }
.sv-d-main { aspect-ratio: 4 / 3; border-radius: 16px; overflow: hidden; background: var(--ink-3); }
.sv-d-main img, .sv-d-main .sv-fallback { width: 100%; height: 100%; object-fit: cover; animation: sv-fade 0.5s ease; }
.sv-thumbs { display: flex; gap: 0.5rem; overflow-x: auto; padding-bottom: 0.2rem; scrollbar-width: thin; }
.sv-thumb { flex: none; width: 72px; height: 56px; padding: 0; border: 2px solid transparent; border-radius: 10px; overflow: hidden; background: var(--ink-3); cursor: pointer; opacity: 0.6; transition: opacity 0.3s, border-color 0.3s, transform 0.3s var(--ease); }
.sv-thumb img, .sv-thumb .sv-fallback { width: 100%; height: 100%; object-fit: cover; }
.sv-thumb:hover { opacity: 1; transform: translateY(-2px); }
.sv-thumb.is-active { opacity: 1; border-color: var(--green); }
.sv-d-info { display: grid; gap: 1rem; align-content: start; padding: clamp(1.2rem, 3vw, 1.8rem); }
.sv-d-info h2 { font-size: clamp(1.7rem, 4vw, 2.3rem); padding-right: 2.6rem; }
.sv-d-info h4 { margin: 0 0 0.5rem; font-size: 0.95rem; font-weight: 600; color: var(--gold); }
.sv-d-info p { color: #cfd7dd; }
.sv-d-facts { display: flex; flex-wrap: wrap; gap: 0.8rem 1.6rem; align-items: center; padding: 0.9rem 1rem; border-radius: 14px; background: rgba(255,255,255,0.05); border: 1px solid var(--line); }
.sv-d-facts span { display: inline-flex; align-items: center; gap: 0.4rem; color: var(--muted); }
.sv-ticks { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.45rem; }
.sv-ticks li { display: flex; gap: 0.55rem; align-items: flex-start; color: #cfd7dd; }
.sv-ticks svg { flex: none; margin-top: 4px; color: var(--green); }
.sv-d-actions { display: flex; flex-wrap: wrap; gap: 0.7rem; position: sticky; bottom: 0; padding: 0.9rem 0 0.2rem; background: linear-gradient(0deg, var(--ink-2) 70%, transparent); }
.sv-d-actions .sv-btn-green { flex: 1 1 200px; }
.sv-x { position: absolute; top: 0.8rem; right: 0.8rem; z-index: 5; }
.sv-round { display: grid; place-items: center; width: 42px; height: 42px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.22); background: rgba(13,18,22,0.7); color: var(--text); cursor: pointer; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); transition: transform 0.3s var(--ease), background 0.3s, border-color 0.3s; }
.sv-round:hover { background: rgba(61,220,132,0.22); border-color: var(--green); transform: scale(1.1); }
.sv-lb figure { margin: 0; max-width: min(92vw, 900px); animation: sv-pop 0.45s var(--ease); }
.sv-lb figure img, .sv-lb figure .sv-fallback { max-height: 72vh; width: auto; min-width: min(80vw, 420px); min-height: 260px; margin: 0 auto; border-radius: 16px; object-fit: contain; box-shadow: 0 0 60px rgba(61,220,132,0.18); }
.sv-lb figcaption { display: grid; justify-items: center; gap: 0.7rem; margin-top: 0.9rem; color: var(--muted); }
.sv-lb-prev, .sv-lb-next { position: absolute; top: 50%; translate: 0 -50%; }
.sv-lb-prev { left: clamp(0.4rem, 2vw, 1.5rem); }
.sv-lb-next { right: clamp(0.4rem, 2vw, 1.5rem); }

/* ---------- floating buttons ---------- */
.sv-floaters { position: fixed; z-index: 90; right: clamp(0.8rem, 2vw, 1.6rem); bottom: clamp(0.8rem, 2vw, 1.6rem); display: flex; flex-direction: column; gap: 0.7rem; align-items: flex-end; }
.sv-fab { display: grid; place-items: center; width: 52px; height: 52px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.25); color: var(--text); background: rgba(13,18,22,0.7); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); cursor: pointer; box-shadow: 0 10px 30px rgba(0,0,0,0.45); transition: transform 0.4s var(--ease), opacity 0.4s, box-shadow 0.3s; }
.sv-fab:hover { transform: translateY(-4px) scale(1.08); box-shadow: 0 0 28px rgba(61,220,132,0.5); }
.sv-fab-wa { color: #fff; background: #1faa59; border-color: #1faa59; animation: sv-pulse 3.6s ease-in-out infinite; }
.sv-fab-top { opacity: 0; transform: translateY(16px) scale(0.8); pointer-events: none; }
.sv-fab-top.is-on { opacity: 1; transform: none; pointer-events: auto; }
.sv-fab-top.is-on:hover { transform: translateY(-4px) scale(1.08); }

.sv-fallback { background: linear-gradient(135deg, #1b242c, #26323b 50%, #1b242c); background-size: 200% 200%; animation: sv-shimmer 6s ease-in-out infinite; }
@keyframes sv-shimmer { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }

/* ---------- large screens ---------- */
@media (min-width: 1200px) {
  .sv-wrap { width: min(1280px, 100% - 6rem); }
  .sv-section { padding: 7.5rem 0; }
  .sv-hero { min-height: 82vh; }
  .sv-hero h1 { font-size: clamp(4.4rem, 6vw, 6.2rem); }
  .sv-head h2 { font-size: 3.4rem; }
  .sv-body h3 { font-size: 1.4rem; }
}
@media (min-width: 1600px) {
  .sv-wrap { width: min(1480px, 100% - 10rem); }
  .sv-hero h1 { font-size: 7rem; }
  .sv-lead { font-size: 1.3rem; max-width: 680px; }
}

/* ---------- tablet and phone ---------- */
@media (max-width: 1024px) {
  .sv-cat-grid { grid-template-columns: repeat(2, 1fr); }
  .sv-gallery { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 820px) {
  .sv-dialog { grid-template-columns: 1fr; border-radius: 20px; }
  .sv-d-main { aspect-ratio: 16 / 10; }
  .sv-hero-shade { background: linear-gradient(180deg, rgba(13,18,22,0.78), rgba(13,18,22,0.7) 60%, var(--ink)); }
  .sv-cats { margin-top: -1rem; }
}
@media (max-width: 560px) {
  .sv-wrap { width: calc(100% - 1.5rem); }
  .sv-cat-grid { grid-template-columns: 1fr 1fr; gap: 0.7rem; }
  .sv-cat { padding: 1rem; }
  .sv-cat p { display: none; }
  .sv-gallery { grid-template-columns: repeat(2, 1fr); gap: 0.6rem; }
  .sv-actions .sv-btn { flex: 1 1 100%; }
  .sv-tabs { justify-content: flex-start; margin-inline: -0.75rem; padding-inline: 0.75rem; }
  .sv-card-actions .sv-btn { flex: 1 1 100%; }
  .sv-overlay { padding: 0.5rem; }
  .sv-dialog { max-height: calc(100svh - 1rem); }
  .sv-feat { min-height: 340px; }
  .sv-fab { width: 46px; height: 46px; }
  .sv-lb-prev, .sv-lb-next { top: auto; bottom: 1rem; translate: 0 0; }
  .sv-faq-q { font-size: 1rem; padding: 1rem; }
}
@media (max-width: 360px) {
  .sv-cat-grid { grid-template-columns: 1fr; }
  .sv-hero h1 { font-size: 2.2rem; }
}
@media (prefers-reduced-motion: reduce) {
  .sv-page *, .sv-page *::before, .sv-page *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
  .sv-reveal, .sv-rise, .sv-swap, .sv-word { opacity: 1 !important; transform: none !important; filter: none !important; }
}
`

/* Fades in when it enters the screen and fades out when it leaves, scrolling either way */
function Reveal({ children, delay = 0, variant = 'up', className = '', as: Tag = 'div' }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)
  const [from, setFrom] = useState('below')

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') { setShown(true); return undefined }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setShown(true)
          else {
            setShown(false)
            setFrom(entry.boundingClientRect.top < 0 ? 'above' : 'below')
          }
        })
      },
      { threshold: variant === 'sec' ? 0 : 0.14, rootMargin: '-5% 0px -5% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [variant])

  return createElement(Tag, {
      ref,
      className: `sv-reveal sv-${variant} from-${from} ${shown ? 'is-in' : ''} ${className}`,
      style: { '--d': `${delay}ms` },
    }, children)
}

function Img({ src, alt, className = '', ...rest }) {
  const [failed, setFailed] = useState(false)
  if (failed) return <div className={`sv-fallback ${className}`} role="img" aria-label={alt} />
  return <img src={src} alt={alt} className={className} loading="lazy" onError={() => setFailed(true)} {...rest} />
}

function Words({ text }) {
  return text.split(' ').map((w, i) => (
    <span key={`${w}-${i}`}>
      <span className="sv-word" style={{ '--i': i }}>{w}</span>{' '}
    </span>
  ))
}

function SectionHead({ title, text }) {
  return (
    <Reveal className="sv-head">
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </Reveal>
  )
}

function useScrollLock(on) {
  useEffect(() => {
    if (!on) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [on])
}

function BookButton({ service, small = false, className = '' }) {
  const size = small ? 'sv-btn-sm' : ''
  if (service.status !== 'available') {
    return <span className={`sv-btn sv-btn-off ${size} ${className}`} aria-disabled="true">Currently unavailable</span>
  }
  return (
    <Link to={`/book-now?service=${service.id}`} className={`sv-btn sv-btn-green ${size} ${className}`}>
      Book This Service <ArrowRight size={17} />
    </Link>
  )
}

const SPARKS = [
  { l: '10%', t: '66%', d: '0s', s: 0.9 }, { l: '24%', t: '80%', d: '2.4s', s: 0.7 },
  { l: '42%', t: '58%', d: '4.8s', s: 1 }, { l: '60%', t: '82%', d: '1.2s', s: 0.8 },
  { l: '76%', t: '64%', d: '3.6s', s: 0.7 }, { l: '90%', t: '78%', d: '6s', s: 1 },
]

/* ------------------------------- hero -------------------------------- */
function Hero() {
  const root = useRef(null)
  useEffect(() => {
    const el = root.current
    if (!el) return undefined
    let raf = 0
    const update = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      el.style.setProperty('--hp', Math.min(1, Math.max(0, -r.top / (r.height * 0.85))).toFixed(3))
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section id="top" ref={root} className="sv-hero">
      <div className="sv-hero-bg" aria-hidden="true">
        <Img src={HERO_IMAGE} alt="" loading="eager" />
        <div className="sv-hero-shade" />
      </div>
      <span className="sv-orb sv-orb-a" aria-hidden="true" />
      <span className="sv-orb sv-orb-b" aria-hidden="true" />
      {SPARKS.map((s) => (
        <i key={s.l} className="sv-spark" aria-hidden="true" style={{ left: s.l, top: s.t, animationDelay: s.d, scale: s.s }} />
      ))}
      <div className="sv-wrap">
        <div className="sv-hero-inner">
          <span className="sv-pill sv-rise" style={{ '--d': '100ms' }}><Sparkles size={15} /> Our Services</span>
          <h1><Words text="Explore Our Services" /></h1>
          <p className="sv-tagline sv-rise" style={{ '--d': '800ms' }}>Your Style. Your Choice. Our Expertise.</p>
          <p className="sv-lead sv-rise" style={{ '--d': '950ms' }}>
            Discover our range of professional salon, barbering and beauty services. Whether you are looking for a fresh haircut, a beautiful hairstyle or a complete beauty treatment, Crystal Five is here to deliver an experience worth coming back for.
          </p>
          <div className="sv-actions sv-rise" style={{ '--d': '1100ms' }}>
            <a href="#catalogue" onClick={scrollToId('catalogue')} className="sv-btn sv-btn-glass">Explore Services <ChevronDown size={18} /></a>
            <Link to="/book-now" className="sv-btn sv-btn-green">Book an Appointment <ArrowRight size={18} /></Link>
          </div>
        </div>
      </div>
    </section>
  )
}

/* --------------------------- category cards --------------------------- */
function Categories({ active, onPick }) {
  return (
    <section className="sv-cats" aria-label="Explore by category">
      <Reveal variant="sec" className="sv-wrap sv-cat-grid">
        {CATEGORIES.map(({ id, name, text, icon: Icon }, i) => {
          const count = SERVICES.filter((s) => s.active && s.category === id).length
          return (
            <Reveal key={id} delay={i * 90} variant="zoom" className="sv-cell">
              <button type="button" className={`sv-glass sv-lift sv-cat ${active === id ? 'is-active' : ''}`} onClick={() => onPick(id)} {...tilt}>
                <span className="sv-icon sv-breathe">{createElement(Icon, { size: 22 })}</span>
                <h3>{name}</h3>
                <p>{text}</p>
                <small>{count} {count === 1 ? 'service' : 'services'}</small>
              </button>
            </Reveal>
          )
        })}
      </Reveal>
    </section>
  )
}

/* ------------------------------ catalogue ------------------------------ */
function Catalogue({ active, setActive, query, setQuery, onOpen }) {
  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    return SERVICES.filter((s) => s.active)
      .filter((s) => active === 'all' || s.category === active)
      .filter((s) => !q || `${s.name} ${s.text} ${s.description} ${categoryName(s.category)}`.toLowerCase().includes(q))
  }, [active, query])

  const reset = () => { setActive('all'); setQuery('') }

  return (
    <section id="catalogue" className="sv-section">
      <Reveal variant="sec" className="sv-wrap">
        <SectionHead title="Our Service Catalogue" text="Filter by category or search for the exact service you want." />
        <div className="sv-toolbar">
          <div className="sv-search">
            <Search size={20} />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for a service..."
              aria-label="Search for a service"
              autoComplete="off"
            />
            {query && (
              <button type="button" className="sv-clear" onClick={() => setQuery('')} aria-label="Clear search"><X size={18} /></button>
            )}
          </div>
          <div className="sv-tabs" role="group" aria-label="Service categories">
            {[{ id: 'all', name: 'All Services' }, ...CATEGORIES].map((c) => (
              <button key={c.id} type="button" className={`sv-tab ${active === c.id ? 'is-active' : ''}`} aria-pressed={active === c.id} onClick={() => setActive(c.id)}>
                {c.name}
              </button>
            ))}
          </div>
          <p className="sv-count" aria-live="polite">
            Showing {list.length} {list.length === 1 ? 'service' : 'services'}
          </p>
        </div>

        {list.length > 0 ? (
          <div className="sv-grid sv-services" key={`${active}-${query}`}>
            {list.map((s, i) => (
              <article key={s.id} className="sv-card sv-lift sv-swap" style={{ '--d': `${Math.min(i, 8) * 70}ms` }} {...tilt}>
                <div className="sv-media">
                  <Img src={s.image} alt={s.name} />
                  <div className="sv-badges">
                    {s.featured ? <span className="sv-badge sv-badge-gold"><Star size={12} /> Featured</span> : <span />}
                    <span className={`sv-badge ${s.status === 'available' ? 'sv-badge-ok' : 'sv-badge-off'}`}>
                      {s.status === 'available' ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </div>
                <div className="sv-body">
                  <span className="sv-cat-label">{categoryName(s.category)}</span>
                  <h3>{s.name}</h3>
                  <p>{s.text}</p>
                  <div className="sv-meta">
                    <span className="sv-dur"><Clock size={15} /> {formatDuration(s.durationMin, s.durationText)}</span>
                    <span className="sv-price">{formatPrice(s.price)}</span>
                  </div>
                  <div className="sv-card-actions">
                    <BookButton service={s} small />
                    <button type="button" className="sv-btn sv-btn-glass sv-btn-sm" onClick={() => onOpen(s.id)}>View Details</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="sv-glass sv-empty">
            <span className="sv-icon"><Search size={22} /></span>
            <h3>No services match your search</h3>
            <p>Try a different word or clear the filters to see every service.</p>
            <button type="button" className="sv-btn sv-btn-green" onClick={reset}>Show All Services</button>
          </div>
        )}
      </Reveal>
    </section>
  )
}

/* ------------------------------ details ------------------------------- */
function ServiceModal({ service, onClose, onOpen }) {
  const closeRef = useRef(null)
  const [img, setImg] = useState(0)
  const [copied, setCopied] = useState(false)
  useScrollLock(true)

  const images = useMemo(() => {
    const extra = PORTFOLIO.filter((p) => p.serviceId === service.id).map((p) => p.src)
    return [...new Set([service.image, ...service.gallery, ...extra])]
  }, [service])
  const staff = staffFor(service.id)
  const related = SERVICES.filter((s) => s.active && s.category === service.category && s.id !== service.id).slice(0, 3)

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const copy = async () => {
    const url = `${window.location.origin}${window.location.pathname}?service=${service.id}`
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      const t = document.createElement('textarea')
      t.value = url
      document.body.appendChild(t)
      t.select()
      document.execCommand('copy')
      document.body.removeChild(t)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  return (
    <div className="sv-overlay" role="dialog" aria-modal="true" aria-label={service.name} onClick={onClose}>
      <div className="sv-dialog" onClick={(e) => e.stopPropagation()}>
        <button ref={closeRef} type="button" className="sv-round sv-x" onClick={onClose} aria-label="Close details"><X size={20} /></button>

        <div className="sv-d-media">
          <div className="sv-d-main"><Img key={images[img]} src={images[img]} alt={service.name} /></div>
          {images.length > 1 && (
            <div className="sv-thumbs">
              {images.map((src, i) => (
                <button key={src} type="button" className={`sv-thumb ${i === img ? 'is-active' : ''}`} onClick={() => setImg(i)} aria-label={`Show photo ${i + 1}`}>
                  <Img src={src} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="sv-d-info">
          <div>
            <span className="sv-cat-label">{categoryName(service.category)}</span>
            <h2>{service.name}</h2>
          </div>
          <div className="sv-d-facts">
            <span><Clock size={17} /> {formatDuration(service.durationMin, service.durationText)}</span>
            <span className="sv-price">{formatPrice(service.price)}</span>
            <span className={service.status === 'available' ? 'sv-badge-ok' : 'sv-badge-off'}>
              {service.status === 'available' ? 'Available' : 'Currently unavailable'}
            </span>
          </div>
          <p>{service.description}</p>
          <div>
            <h4>What is included</h4>
            <ul className="sv-ticks">
              {service.includes.map((item) => <li key={item}><Check size={16} /> {item}</li>)}
            </ul>
          </div>
          {service.prep && (
            <div>
              <h4>Before your visit</h4>
              <p>{service.prep}</p>
            </div>
          )}
          {staff.length > 0 && (
            <div>
              <h4>Offered by</h4>
              <div className="sv-include">
                {staff.map((s) => <span key={s.id} className="sv-chip" style={{ cursor: 'default' }}>{s.role}</span>)}
              </div>
            </div>
          )}
          {related.length > 0 && (
            <div>
              <h4>Related services</h4>
              <div className="sv-include">
                {related.map((r) => <button key={r.id} type="button" className="sv-chip" onClick={() => { setImg(0); onOpen(r.id) }}>{r.name}</button>)}
              </div>
            </div>
          )}
          <div className="sv-d-actions">
            <BookButton service={service} />
            <button type="button" className="sv-btn sv-btn-glass" onClick={copy}>
              {copied ? <><Check size={17} /> Link copied</> : <><Copy size={17} /> Share</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------ packages ------------------------------ */
function Packages({ onOpen }) {
  const list = PACKAGES.filter((p) => p.active)
  if (!list.length) return null
  return (
    <section id="packages" className="sv-section sv-alt">
      <Reveal variant="sec" className="sv-wrap">
        <SectionHead title="Service Packages" text="Combine services into one booking and make the most of your visit." />
        <div className="sv-grid sv-packages">
          {list.map((p, i) => {
            const { items, minutes, total, saving } = packageFigures(p)
            const ok = items.every((s) => s.status === 'available')
            return (
              <Reveal key={p.id} delay={(i % 4) * 100} className="sv-cell">
                <article className="sv-card sv-lift" {...tilt}>
                  <div className="sv-media">
                    <Img src={p.image} alt={p.name} />
                    <div className="sv-badges">
                      <span className="sv-badge"><Clock size={12} /> {formatDuration(minutes)}</span>
                      {saving != null && <span className="sv-save">Save {formatPrice(saving)}</span>}
                    </div>
                  </div>
                  <div className="sv-body">
                    <h3>{p.name}</h3>
                    <p>{p.text}</p>
                    <div className="sv-include" aria-label="Included services">
                      {items.map((s) => <button key={s.id} type="button" className="sv-chip" onClick={() => onOpen(s.id)}>{s.name}</button>)}
                    </div>
                    <div className="sv-meta">
                      <span className="sv-price">{total != null && p.price != null && <s>{formatPrice(total)}</s>}{formatPrice(p.price)}</span>
                    </div>
                    <div className="sv-card-actions">
                      {ok ? (
                        <Link to={`/book-now?package=${p.id}`} className="sv-btn sv-btn-green sv-btn-sm">Book This Package <ArrowRight size={17} /></Link>
                      ) : (
                        <span className="sv-btn sv-btn-off sv-btn-sm" aria-disabled="true">Currently unavailable</span>
                      )}
                    </div>
                  </div>
                </article>
              </Reveal>
            )
          })}
        </div>
      </Reveal>
    </section>
  )
}

/* ---------------------------- most loved ------------------------------ */
function Loved({ onOpen }) {
  const list = SERVICES.filter((s) => s.active && s.featured)
  if (!list.length) return null
  return (
    <section id="loved" className="sv-section">
      <Reveal variant="sec" className="sv-wrap">
        <SectionHead title="Our Most Loved Services" text="Hand-picked services we are proud of." />
        <div className="sv-loved">
          {list.map((s, i) => (
            <Reveal key={s.id} delay={(i % 4) * 100} variant="zoom" className="sv-cell">
              <article className="sv-feat sv-lift" {...tilt}>
                <Img src={s.image} alt={s.name} />
                <div className="sv-badges"><span className="sv-badge sv-badge-gold"><Star size={12} /> Featured</span></div>
                <div className="sv-feat-body">
                  <span className="sv-cat-label">{categoryName(s.category)}</span>
                  <h3>{s.name}</h3>
                  <p>{s.text}</p>
                  <div className="sv-meta">
                    <span className="sv-dur"><Clock size={15} /> {formatDuration(s.durationMin, s.durationText)}</span>
                    <span className="sv-price">{formatPrice(s.price)}</span>
                  </div>
                  <div className="sv-card-actions">
                    <BookButton service={s} small />
                    <button type="button" className="sv-btn sv-btn-glass sv-btn-sm" onClick={() => onOpen(s.id)}>View Details</button>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Reveal>
    </section>
  )
}

/* ----------------------------- promotions ----------------------------- */
function Promotions() {
  const live = PROMOTIONS.filter((p) => isLive(p))
  if (!live.length) return null
  return (
    <section id="offers" className="sv-section sv-alt">
      <Reveal variant="sec" className="sv-wrap">
        <SectionHead title="Special Offers" text="Current offers you can book right now." />
        <div className="sv-grid sv-promos">
          {live.map((p, i) => (
            <Reveal key={p.id} delay={i * 120} className="sv-cell">
              <article className="sv-card sv-lift" {...tilt}>
                <div className="sv-media">
                  <Img src={p.image} alt={p.title} />
                  <div className="sv-badges">
                    <span className="sv-badge sv-badge-gold"><Tag size={12} /> Until {new Date(p.endsAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
                <div className="sv-body">
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                  <div className="sv-meta">
                    <span className="sv-price">{p.oldPrice != null && <s>{formatPrice(p.oldPrice)}</s>}{formatPrice(p.price)}</span>
                    <Link to={`/book-now?offer=${p.id}`} className="sv-btn sv-btn-green sv-btn-sm">Book Now</Link>
                  </div>
                  <details className="sv-terms">
                    <summary>Terms and conditions</summary>
                    <p>{p.terms}</p>
                  </details>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Reveal>
    </section>
  )
}

/* ------------------------------ portfolio ------------------------------ */
function Portfolio({ onOpen }) {
  const [filter, setFilter] = useState('all')
  const [open, setOpen] = useState(null)
  const touchX = useRef(null)

  const items = useMemo(
    () => PORTFOLIO.filter((p) => { const s = serviceById(p.serviceId); return s && s.active && (filter === 'all' || s.category === filter) }),
    [filter],
  )

  const step = useCallback((dir) => {
    setOpen((cur) => {
      if (cur == null) return cur
      const i = items.findIndex((g) => g.id === cur)
      if (i < 0) return null
      return items[(i + dir + items.length) % items.length].id
    })
  }, [items])

  useScrollLock(open != null)
  useEffect(() => {
    if (open == null) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(null)
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, step])

  const current = PORTFOLIO.find((g) => g.id === open)
  const currentService = current ? serviceById(current.serviceId) : null

  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX }
  const onTouchEnd = (e) => {
    if (touchX.current == null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1)
    touchX.current = null
  }

  return (
    <section id="work" className="sv-section">
      <Reveal variant="sec" className="sv-wrap">
        <SectionHead title="Our Work" text="Real results from the services above. Tap a photo to enlarge it." />
        <Reveal className="sv-tabs" >
          {[{ id: 'all', name: 'All Work' }, ...CATEGORIES].map((c) => (
            <button key={c.id} type="button" className={`sv-tab ${filter === c.id ? 'is-active' : ''}`} aria-pressed={filter === c.id} onClick={() => setFilter(c.id)}>
              {c.name}
            </button>
          ))}
        </Reveal>
        <div className="sv-gallery" key={filter} style={{ marginTop: '1.6rem' }}>
          {items.map((g, i) => (
            <button key={g.id} type="button" className="sv-shot sv-swap" style={{ '--d': `${Math.min(i, 8) * 55}ms` }} onClick={() => setOpen(g.id)} aria-label={`Enlarge: ${g.alt}`}>
              <Img src={g.src} alt={g.alt} />
              <span className="sv-shot-over"><ZoomIn size={22} /><em>{serviceById(g.serviceId)?.name}</em></span>
            </button>
          ))}
        </div>
        {items.length === 0 && (
          <div className="sv-glass sv-empty"><p>Photos for this category are coming soon.</p></div>
        )}
      </Reveal>

      {current && currentService && (
        <div className="sv-overlay sv-lb" role="dialog" aria-modal="true" aria-label={current.alt} onClick={() => setOpen(null)} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <button type="button" className="sv-round sv-x" onClick={() => setOpen(null)} aria-label="Close"><X size={20} /></button>
          <button type="button" className="sv-round sv-lb-prev" onClick={(e) => { e.stopPropagation(); step(-1) }} aria-label="Previous photo"><ChevronLeft size={22} /></button>
          <figure key={current.id} onClick={(e) => e.stopPropagation()}>
            <Img src={current.src} alt={current.alt} />
            <figcaption>
              <span>{currentService.name}</span>
              <div className="sv-actions sv-actions-center">
                <BookButton service={currentService} small />
                <button type="button" className="sv-btn sv-btn-glass sv-btn-sm" onClick={() => { setOpen(null); onOpen(currentService.id) }}>View Details</button>
              </div>
            </figcaption>
          </figure>
          <button type="button" className="sv-round sv-lb-next" onClick={(e) => { e.stopPropagation(); step(1) }} aria-label="Next photo"><ChevronRight size={22} /></button>
        </div>
      )}
    </section>
  )
}

/* ----------------------------- professionals ---------------------------- */
function Professionals({ onOpen }) {
  return (
    <section id="team" className="sv-section sv-alt">
      <Reveal variant="sec" className="sv-wrap">
        <SectionHead title="Meet the Professionals" text="The people behind the services. Choose who looks after you." />
        <div className="sv-grid sv-team">
          {STAFF.map((p, i) => (
            <Reveal key={p.id} delay={i * 110} variant="zoom" className="sv-cell">
              <article className="sv-card sv-lift" {...tilt}>
                <div className="sv-photo"><Img src={p.image} alt={p.role} /></div>
                <div className="sv-body">
                  <h3>{p.role}</h3>
                  <p>{p.speciality}</p>
                  <div className="sv-include">
                    {p.serviceIds.map(serviceById).filter((s) => s && s.active).map((s) => (
                      <button key={s.id} type="button" className="sv-chip" onClick={() => onOpen(s.id)}>{s.name}</button>
                    ))}
                  </div>
                  <Link to={`/book-now?staff=${p.id}`} className="sv-btn sv-btn-green sv-btn-sm">Book with this professional</Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Reveal>
    </section>
  )
}

/* --------------------------------- faq --------------------------------- */
function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <section id="faq" className="sv-section">
      <Reveal variant="sec" className="sv-wrap">
        <SectionHead title="Frequently Asked Questions" text="Quick answers before you book." />
        <div className="sv-faq">
          {FAQS.map((f, i) => {
            const isOpen = open === i
            return (
              <Reveal key={f.q} delay={(i % 4) * 70}>
                <div className={`sv-glass sv-faq-item ${isOpen ? 'is-open' : ''}`}>
                  <button type="button" className="sv-faq-q" aria-expanded={isOpen} aria-controls={`faq-${i}`} id={`faq-q-${i}`} onClick={() => setOpen(isOpen ? -1 : i)}>
                    <span>{f.q}</span>
                    <ChevronDown size={22} />
                  </button>
                  <div className="sv-faq-a" id={`faq-${i}`} role="region" aria-labelledby={`faq-q-${i}`}>
                    <div><p>{f.a}</p></div>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
        {(BUSINESS.phone || BUSINESS.whatsapp) && (
          <Reveal className="sv-faq-more">
            <p>Still have a question? Reach out and we will gladly help.</p>
            <div className="sv-actions sv-actions-center">
              {BUSINESS.whatsapp && <a className="sv-btn sv-btn-glass" href={`https://wa.me/${BUSINESS.whatsapp}`} target="_blank" rel="noreferrer"><MessageCircle size={18} /> WhatsApp</a>}
              {BUSINESS.phone && <a className="sv-btn sv-btn-glass" href={`tel:${BUSINESS.phone}`}><Phone size={18} /> Call Us</a>}
            </div>
          </Reveal>
        )}
      </Reveal>
    </section>
  )
}

function FinalCta() {
  return (
    <section className="sv-section">
      <Reveal variant="sec" className="sv-wrap">
        <Reveal variant="zoom">
          <div className="sv-cta">
            <span className="sv-cta-glow" aria-hidden="true" />
            <h2>Found Your Perfect Service?</h2>
            <p className="sv-cta-sub">Your next great look starts here.</p>
            <p>Choose your service, select your preferred professional and reserve your appointment with Crystal Five.</p>
            <Link to="/book-now" className="sv-btn sv-btn-green sv-btn-lg sv-pulse">
              Book Your Appointment <ArrowRight size={20} />
            </Link>
          </div>
        </Reveal>
      </Reveal>
    </section>
  )
}

function Floaters() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 700)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <div className="sv-floaters">
      {BUSINESS.whatsapp && (
        <a className="sv-fab sv-fab-wa" href={`https://wa.me/${BUSINESS.whatsapp}`} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">
          <MessageCircle size={24} />
        </a>
      )}
      <button type="button" className={`sv-fab sv-fab-top ${visible ? 'is-on' : ''}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top" tabIndex={visible ? 0 : -1}>
        <ArrowUp size={22} />
      </button>
    </div>
  )
}

/* -------------------------------- page --------------------------------- */
function Services() {
  const [params, setParams] = useSearchParams()
  const startCat = CATEGORIES.some((c) => c.id === params.get('category')) ? params.get('category') : 'all'
  const [active, setActive] = useState(startCat)
  const [query, setQuery] = useState('')

  const openId = params.get('service')
  const current = SERVICES.find((s) => s.id === openId && s.active)

  const openService = useCallback((id) => {
    const p = new URLSearchParams(params)
    p.set('service', id)
    setParams(p)
  }, [params, setParams])

  const closeService = useCallback(() => {
    const p = new URLSearchParams(params)
    p.delete('service')
    setParams(p, { replace: true })
  }, [params, setParams])

  const pickCategory = (id) => {
    setActive(id)
    setQuery('')
    scrollToId('catalogue')()
  }

  return (
    <div className="sv-page">
      <style>{STYLES}</style>
      <Hero />
      <Categories active={active} onPick={pickCategory} />
      <Catalogue active={active} setActive={setActive} query={query} setQuery={setQuery} onOpen={openService} />
      <Packages onOpen={openService} />
      <Loved onOpen={openService} />
      <Promotions />
      <Portfolio onOpen={openService} />
      <Professionals onOpen={openService} />
      <Faq />
      <FinalCta />
      <Floaters />
      {current && <ServiceModal key={current.id} service={current} onClose={closeService} onOpen={openService} />}
    </div>
  )
}

export default Services
