import { createElement, useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, ArrowUp, BadgeCheck, CalendarCheck, ChevronDown, ChevronLeft, ChevronRight,
  Clock, Droplets, Heart, Layers, Mail, MapPin, MessageCircle, Navigation, Phone,
  Scissors, Sparkles, Star, Tag, Users, Wallet, X, ZoomIn,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  IMAGES: every photo lives in /public/clients/. Replace the files    */
/*  below with your own using the same names, or change a path here.    */
/* ------------------------------------------------------------------ */
const IMAGES = {
  heroSlides: [
    '/Hair plaiting 1.jpg',
    '/Barber ShopSlideshow.jpg',
    '/Barber Shop 1.jpg',
    '/Nails Manicure.jpg',
  ],
  about: '/Babering Services 0.jpg',
  aboutSmall: '/Service.jpg',
}

/* ------------------------------------------------------------------ */
/*  BUSINESS SETTINGS: fill these in. Empty values are simply hidden.   */
/* ------------------------------------------------------------------ */
const BUSINESS = {
  phone: '',            // e.g. '+254700000000'
  email: '',
  whatsapp: '',         // digits only with country code, e.g. '254700000000'
  address: '',
  landmarks: '',
  mapQuery: '',         // address or "lat,lng" used by the map and directions
  googleReviewsUrl: '',
}

const OPENING_HOURS = [
  { day: 'Monday – Friday', hours: '' },
  { day: 'Saturday', hours: '' },
  { day: 'Sunday', hours: '' },
]

const HERO_SLIDES = [
  { src: IMAGES.heroSlides[0], label: 'Hair Salon', note: 'Braids, styling and blow-dry' },
  { src: IMAGES.heroSlides[1], label: 'Kinyozi', note: 'Fades, shaves and beard trims' },
  { src: IMAGES.heroSlides[2], label: 'Beauty', note: 'Makeup, nails and pedicures' },
  { src: IMAGES.heroSlides[3], label: 'Hair Care', note: 'Washing, conditioning and treatments' },
]

const CATEGORIES = [
  { id: 'hair-salon', name: 'Hair Salon', icon: Sparkles },
  { id: 'kinyozi', name: 'Kinyozi', icon: Scissors },
  { id: 'beauty', name: 'Beauty', icon: Heart },
  { id: 'hair-care', name: 'Hair Care', icon: Droplets },
]

const TRUST = [
  { icon: Scissors, title: 'Professional Services', text: 'Quality hair and grooming services' },
  { icon: CalendarCheck, title: 'Easy Booking', text: 'Convenient appointment scheduling' },
  { icon: Wallet, title: 'Secure Payments', text: 'M-Pesa and supported payment options' },
  { icon: MapPin, title: 'Easy to Find', text: 'Location and directions' },
]

/* price: null shows "KSh —" until the owner sets it from the admin portal */
const SERVICES = [
  { id: 'braids', category: 'hair-salon', name: 'Braids', text: 'Neat, long-lasting braids in the style you choose.', duration: '3 – 5 hours', price: null, image: '/Braids.jpg' },
  { id: 'hair-styling', category: 'hair-salon', name: 'Hair Styling', text: 'Styling for everyday looks and special occasions.', duration: '1 hour', price: null, image: '/Hair Styling.jpg' },
  { id: 'blow-dry', category: 'hair-salon', name: 'Blow-Dry', text: 'A smooth, polished finish after your wash.', duration: '45 minutes', price: null, image: '/Blow Drying.jpg' },
  { id: 'mens-haircut', category: 'kinyozi', name: "Men's Haircut", text: 'A clean cut shaped around your face and style.', duration: '30 minutes', price: null, image: '/Men Shave.jpg' },
  { id: 'fade', category: 'kinyozi', name: 'Fade', text: 'Sharp, precise fades blended from skin to length.', duration: '40 minutes', price: null, image: '/Fade Haircut.jpg' },
  { id: 'shave', category: 'kinyozi', name: 'Shave', text: 'A close, comfortable shave with a fresh finish.', duration: '25 minutes', price: null, image: '/Men Haircut.jpg' },
  { id: 'beard-trim', category: 'kinyozi', name: 'Beard Trim', text: 'Shaped and lined beards that stay tidy.', duration: '20 minutes', price: null, image: '/Beard Trim.jpg' },
  { id: 'makeup', category: 'beauty', name: 'Makeup', text: 'Makeup for events, photos and everyday confidence.', duration: '1 hour', price: null, image: '/Makeup.jpg' },
  { id: 'nails', category: 'beauty', name: 'Nails', text: 'Nail shaping, colour and finishing.', duration: '1 hour', price: null, image: '/Nails.jpg' },
  { id: 'manicure', category: 'beauty', name: 'Manicure & Pedicure', text: 'Hand and foot care that leaves you refreshed.', duration: '1 hour 30 minutes', price: null, image: '/Nails Manicure.jpg' },
  { id: 'hair-wash', category: 'hair-care', name: 'Wash & Condition', text: 'A gentle wash with conditioning for soft hair.', duration: '30 minutes', price: null, image: '/Hair Wash.jpg' },
  { id: 'hair-treatment', category: 'hair-care', name: 'Hair Treatment', text: 'Treatments that restore strength and shine.', duration: '45 minutes', price: null, image: '/Hair Treatment.jpg' },
]

const WHY = [
  { icon: Users, title: 'Professional staff', text: 'Trained stylists and barbers who listen first.' },
  { icon: Sparkles, title: 'Clean, comfortable space', text: 'A tidy, relaxed place to sit back and be looked after.' },
  { icon: Heart, title: 'Personal attention', text: 'Every visit is shaped around what you want.' },
  { icon: Layers, title: 'Many services, one place', text: 'Hair, grooming and beauty under one roof.' },
  { icon: CalendarCheck, title: 'Simple online booking', text: 'Pick a service, choose a time and you are done.' },
  { icon: BadgeCheck, title: 'Clear pricing', text: 'Prices are shown before you book.' },
]

const GALLERY_FILTERS = ['All', 'Haircuts', 'Braids', 'Styling', 'Beard', 'Makeup', 'Nails', 'Before & After']
const GALLERY = [
  { id: 1, cat: 'Haircuts', src: '/Men Haircut.jpg', alt: 'Fresh haircut' },
  { id: 2, cat: 'Braids', src: '/Braids.jpg', alt: 'Braided hairstyle' },
  { id: 3, cat: 'Styling', src: '/Hair Styling.jpg', alt: 'Styled hair' },
  { id: 4, cat: 'Beard', src: '/Beard Trim.jpg', alt: 'Groomed beard' },
  { id: 5, cat: 'Makeup', src: '/Makeup.jpg', alt: 'Makeup look' },
  { id: 6, cat: 'Nails', src: '/Nails.jpg', alt: 'Nail design' },
]

/* Offers disappear automatically once endsAt has passed */
const PROMOTIONS = [
  { id: 'first-visit', title: 'First-visit offer', text: 'A welcome offer for customers booking with us for the first time.', image: '/First Visit Offer.jpg', oldPrice: null, price: null, startsAt: '2026-01-01', endsAt: '2027-12-31', terms: 'Applies to first appointments only. Show your booking confirmation on arrival.' },
  { id: 'cut-and-beard', title: 'Haircut and beard combo', text: 'Book a haircut and beard trim together for one package price.', image: '/Haircut and Beard Combo.jpg', oldPrice: null, price: null, startsAt: '2026-01-01', endsAt: '2027-12-31', terms: 'Both services must be booked in the same appointment.' },
  { id: 'student', title: 'Student offer', text: 'A reduced price on selected services for students.', image: '/Student BOy Offer.jpg', oldPrice: null, price: null, startsAt: '2026-01-01', endsAt: '2027-12-31', terms: 'Valid student ID required at your appointment.' },
]

const TEAM = [
  { id: 'hairstylist', role: 'Senior Hairstylist', speciality: 'Braids, styling and treatments', image: '/Senior HairStylist.jpg' },
  { id: 'barber', role: 'Professional Barber', speciality: 'Fades, haircuts and beard grooming', image: '/HairStylist 2.jpg' },
  { id: 'nails', role: 'Nail Technician', speciality: 'Manicures, pedicures and nail art', image: '/Nail Trchnician.jpg' },
  { id: 'beauty', role: 'Beauty Therapist', speciality: 'Makeup and skin care', image: '/Beauty Therapist.jpg' },
]

/* Add real customer feedback here: { id, name, rating, text, date, photo? } */
const REVIEWS = []

/* ------------------------------ styles ------------------------------- */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=Outfit:wght@400;500;600;700&display=swap');

.c5-home {
  --gold: #f8c957;
  --gold-deep: #d9a82f;
  --ink: #0d1216;
  --ink-2: #131a20;
  --ink-3: #1b242c;
  --text: #eef1f3;
  --muted: #a9b4bd;
  --line: rgba(255, 255, 255, 0.1);
  --glass: rgba(255, 255, 255, 0.06);
  --ease: cubic-bezier(0.2, 0.7, 0.2, 1);
  font-family: 'Outfit', system-ui, sans-serif;
  background: var(--ink);
  color: var(--text);
  overflow-x: clip;
  line-height: 1.6;
}
.c5-home *, .c5-home *::before, .c5-home *::after { box-sizing: border-box; }
.c5-home h1, .c5-home h2, .c5-home h3 { font-family: 'Fraunces', Georgia, serif; line-height: 1.15; margin: 0; letter-spacing: -0.01em; }
.c5-home p { margin: 0; }
.c5-home a { color: inherit; text-decoration: none; }
.c5-home img { display: block; max-width: 100%; }
.c5-home button { font-family: inherit; }
.c5-home :focus-visible { outline: 2px solid var(--gold); outline-offset: 3px; }

.c5-wrap { width: min(1180px, 100% - 2rem); margin-inline: auto; }
.c5-section { padding: clamp(3.5rem, 9vw, 7rem) 0; position: relative; }
.c5-alt { background: linear-gradient(180deg, var(--ink-2), var(--ink)); }
.c5-center { display: flex; justify-content: center; margin-top: 2rem; }
.c5-cell { height: 100%; }

/* ---------- section head ---------- */
.c5-head { max-width: 640px; margin: 0 auto clamp(1.8rem, 5vw, 3rem); text-align: center; }
.c5-head h2 { font-size: clamp(1.9rem, 5.5vw, 3rem); }
.c5-head p { margin-top: 0.7rem; color: var(--muted); font-size: clamp(0.98rem, 2.6vw, 1.1rem); }

/* ---------- reveal / entrance (plays on scroll down and up) ---------- */
.c5-reveal { opacity: 0; will-change: opacity, transform; transition: opacity 0.85s var(--ease) var(--d, 0ms), transform 0.95s var(--ease) var(--d, 0ms), filter 0.85s var(--ease) var(--d, 0ms); }
.c5-reveal:not(.is-in) { transition-delay: 0ms; transition-duration: 0.45s; }
.c5-up.from-below:not(.is-in) { transform: translateY(38px); }
.c5-up.from-above:not(.is-in) { transform: translateY(-38px); }
.c5-zoom:not(.is-in) { transform: scale(0.9) translateY(14px); }
.c5-left:not(.is-in) { transform: translateX(-46px); }
.c5-right:not(.is-in) { transform: translateX(46px); }
.c5-sec.from-below:not(.is-in) { transform: translateY(46px) scale(0.985); }
.c5-sec.from-above:not(.is-in) { transform: translateY(-34px) scale(0.985); }
.c5-head:not(.is-in) { filter: blur(7px); }
.c5-reveal.is-in { opacity: 1; transform: none; filter: none; will-change: auto; }

.c5-rise { opacity: 0; animation: c5-rise 1s var(--ease) var(--d, 0ms) forwards; }
@keyframes c5-rise { from { opacity: 0; transform: translateY(26px); } to { opacity: 1; transform: none; } }
.c5-swap { animation: c5-pop-in 0.7s var(--ease) var(--d, 0ms) backwards; }
@keyframes c5-pop-in { from { opacity: 0; transform: translateY(24px) scale(0.94); } to { opacity: 1; transform: none; } }

.c5-word { display: inline-block; opacity: 0; animation: c5-word 0.9s var(--ease) calc(280ms + var(--i) * 140ms) forwards; }
@keyframes c5-word { from { opacity: 0; transform: translateY(46px) rotate(4deg); filter: blur(12px); } to { opacity: 1; transform: none; filter: blur(0); } }

.c5-head h2::after { content: ''; display: block; width: 72px; height: 3px; margin: 0.9rem auto 0; border-radius: 3px; background: linear-gradient(90deg, transparent, var(--gold), transparent); transform: scaleX(0); transition: transform 1s var(--ease) 0.25s; }
.c5-head.is-in h2::after { transform: scaleX(1); }

/* ---------- glass, lift, glow ---------- */
.c5-glass {
  position: relative;
  background: var(--glass);
  border: 1px solid var(--line);
  border-radius: 20px;
  backdrop-filter: blur(16px) saturate(140%);
  -webkit-backdrop-filter: blur(16px) saturate(140%);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.08);
}
.c5-lift { position: relative; transform-style: preserve-3d; transition: transform 0.35s var(--ease), box-shadow 0.45s var(--ease), border-color 0.45s var(--ease); }
.c5-lift::before { content: ''; position: absolute; inset: 0; z-index: 2; border-radius: inherit; pointer-events: none; opacity: 0; background: radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(248, 201, 87, 0.2), transparent 55%); transition: opacity 0.4s; }
.c5-lift:hover::before { opacity: 1; }
.c5-lift:hover, .c5-lift:focus-within { transform: perspective(1000px) translateY(-10px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)); border-color: rgba(248, 201, 87, 0.5); box-shadow: 0 26px 56px rgba(0, 0, 0, 0.5), 0 0 40px rgba(248, 201, 87, 0.2); }
.c5-lift .c5-icon { transition: transform 0.5s var(--ease); }
.c5-lift:hover .c5-icon { transform: rotate(-10deg) scale(1.15); }
.c5-icon { display: grid; place-items: center; width: 48px; height: 48px; flex: none; border-radius: 14px; color: var(--gold); background: rgba(248, 201, 87, 0.12); border: 1px solid rgba(248, 201, 87, 0.3); }
.c5-breathe { animation: c5-breathe 4s ease-in-out infinite; }
.c5-glow { animation: c5-glow 3.2s ease-in-out infinite; }
.c5-float { animation: c5-float 6s ease-in-out infinite; }
@keyframes c5-breathe { 0%, 100% { transform: scale(1); box-shadow: 0 0 0 rgba(248, 201, 87, 0); } 50% { transform: scale(1.07); box-shadow: 0 0 24px rgba(248, 201, 87, 0.35); } }
@keyframes c5-glow { 0%, 100% { box-shadow: 0 0 6px rgba(248, 201, 87, 0.15); } 50% { box-shadow: 0 0 26px rgba(248, 201, 87, 0.5); } }
@keyframes c5-float { 0%, 100% { translate: 0 0; } 50% { translate: 0 -12px; } }

/* ---------- buttons ---------- */
.c5-btn { position: relative; display: inline-flex; align-items: center; justify-content: center; gap: 0.55rem; padding: 0.95rem 1.6rem; min-height: 48px; border: 1px solid transparent; border-radius: 999px; font-weight: 600; font-size: 1rem; cursor: pointer; overflow: hidden; isolation: isolate; text-align: center; transition: transform 0.35s var(--ease), box-shadow 0.35s var(--ease), background 0.35s; }
.c5-btn::after { content: ''; position: absolute; inset: 0; z-index: -1; background: linear-gradient(110deg, transparent 30%, rgba(255, 255, 255, 0.45) 50%, transparent 70%); transform: translateX(-120%); }
.c5-btn:hover::after { transform: translateX(120%); transition: transform 0.9s var(--ease); }
.c5-btn:hover { transform: translateY(-3px); }
.c5-btn:active { transform: translateY(0) scale(0.97); }
.c5-btn-gold { color: #1a1405 !important; background: linear-gradient(135deg, #ffe08a, var(--gold) 55%, var(--gold-deep)); box-shadow: 0 8px 26px rgba(248, 201, 87, 0.3); }
.c5-btn-gold:hover { box-shadow: 0 14px 38px rgba(248, 201, 87, 0.55); }
.c5-btn-glass { color: var(--text); background: rgba(255, 255, 255, 0.08); border-color: rgba(255, 255, 255, 0.22); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }
.c5-btn-glass:hover { background: rgba(255, 255, 255, 0.15); border-color: var(--gold); }
.c5-btn-sm { padding: 0.65rem 1.1rem; min-height: 42px; font-size: 0.92rem; }
.c5-btn-lg { padding: 1.1rem 2.2rem; font-size: 1.1rem; }
.c5-breathe-btn { animation: c5-btn-breathe 3.6s ease-in-out infinite; }
@keyframes c5-btn-breathe { 0%, 100% { box-shadow: 0 8px 26px rgba(248, 201, 87, 0.3); } 50% { box-shadow: 0 8px 46px rgba(248, 201, 87, 0.65); } }
.c5-actions { display: flex; flex-wrap: wrap; gap: 0.8rem; }
.c5-link { display: inline-flex; align-items: center; gap: 0.35rem; color: var(--gold) !important; font-weight: 600; margin-top: 0.4rem; transition: gap 0.3s var(--ease); }
.c5-link:hover { gap: 0.7rem; }

/* ---------- hero ---------- */
.c5-hero { position: relative; min-height: 100vh; min-height: 100svh; display: flex; align-items: center; padding: clamp(6.5rem, 14vw, 8.5rem) 0 6rem; overflow: hidden; }
.c5-hero-slides { position: absolute; inset: -110px 0 0 0; transform: translateY(calc(var(--hp, 0) * 90px)); will-change: transform; background: radial-gradient(circle at 30% 20%, #26323b, var(--ink) 70%); }
.c5-slide { position: absolute; inset: 0; opacity: 0; transition: opacity 1.6s ease; }
.c5-slide.is-active { opacity: 1; }
.c5-slide-img, .c5-slide .c5-fallback { width: 100%; height: 100%; object-fit: cover; transform: scale(1); }
.c5-slide.is-active .c5-slide-img { animation: c5-kenburns 14s ease-out forwards; }
@keyframes c5-kenburns { from { transform: scale(1); } to { transform: scale(1.12); } }
.c5-hero-shade { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(13, 18, 22, 0.92) 0%, rgba(13, 18, 22, 0.6) 55%, rgba(13, 18, 22, 0.4) 100%), linear-gradient(0deg, var(--ink) 0%, transparent 35%); }
.c5-orb { position: absolute; border-radius: 50%; filter: blur(70px); pointer-events: none; }
.c5-orb-a { width: 340px; height: 340px; top: 8%; right: 6%; background: rgba(248, 201, 87, 0.22); animation: c5-drift 12s ease-in-out infinite; }
.c5-orb-b { width: 260px; height: 260px; bottom: 6%; left: -4%; background: rgba(248, 201, 87, 0.14); animation: c5-drift 15s ease-in-out infinite reverse; }
@keyframes c5-drift { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-30px, 34px); } }

.c5-hero-grid { position: relative; z-index: 2; opacity: calc(1 - var(--hp, 0) * 1.25); transform: translateY(calc(var(--hp, 0) * -46px)); display: grid; grid-template-columns: 1.25fr 0.75fr; gap: clamp(1.5rem, 4vw, 3.5rem); align-items: center; }
.c5-pill { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.45rem 1rem; border-radius: 999px; font-size: 0.92rem; font-weight: 500; color: var(--gold); background: rgba(248, 201, 87, 0.1); border: 1px solid rgba(248, 201, 87, 0.35); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
.c5-hero h1 { margin-top: 1.1rem; font-size: clamp(2.6rem, 9vw, 5.6rem); font-weight: 700; animation: c5-title-glow 5s ease-in-out infinite; }
@keyframes c5-title-glow { 0%, 100% { text-shadow: 0 0 24px rgba(248, 201, 87, 0.15); } 50% { text-shadow: 0 0 50px rgba(248, 201, 87, 0.5); } }
.c5-spark { position: absolute; z-index: 1; width: 6px; height: 6px; border-radius: 50%; background: var(--gold); box-shadow: 0 0 12px 2px rgba(248, 201, 87, 0.8); opacity: 0; pointer-events: none; animation: c5-spark 9s ease-in-out infinite; }
@keyframes c5-spark { 0% { opacity: 0; transform: translateY(40px) scale(0.5); } 20% { opacity: 0.9; } 80% { opacity: 0.6; } 100% { opacity: 0; transform: translateY(-170px) scale(1.2); } }
.c5-tagline { margin-top: 1rem; font-size: clamp(1.1rem, 3.2vw, 1.5rem); color: var(--gold); font-weight: 500; }
.c5-lead { margin-top: 1rem; max-width: 540px; color: #d4dbe0; font-size: clamp(1rem, 2.6vw, 1.15rem); }
.c5-hero .c5-actions { margin-top: 1.8rem; }

.c5-hero-card { padding: clamp(1.1rem, 3vw, 1.6rem); animation-name: c5-rise, c5-float; animation-duration: 1s, 7s; animation-delay: var(--d, 0ms), 2s; animation-iteration-count: 1, infinite; animation-timing-function: var(--ease), ease-in-out; animation-fill-mode: forwards, none; }
.c5-hero-card h2 { font-size: 1.25rem; margin-bottom: 1rem; }
.c5-quick { display: grid; grid-template-columns: 1fr 1fr; gap: 0.7rem; }
.c5-quick-item { display: flex; flex-direction: column; align-items: flex-start; gap: 0.5rem; padding: 0.9rem; border-radius: 14px; background: rgba(255, 255, 255, 0.05); border: 1px solid var(--line); font-weight: 500; transition: transform 0.35s var(--ease), background 0.35s, border-color 0.35s, box-shadow 0.35s; }
.c5-quick-item svg { color: var(--gold); }
.c5-quick-item:hover { transform: translateY(-5px); background: rgba(248, 201, 87, 0.12); border-color: var(--gold); box-shadow: 0 0 22px rgba(248, 201, 87, 0.25); }
.c5-now-showing { display: flex; flex-direction: column; margin-top: 1rem; padding-top: 0.9rem; border-top: 1px solid var(--line); font-size: 0.9rem; color: var(--muted); }
.c5-now-showing strong { color: var(--text); font-size: 1rem; }

.c5-hero-controls { position: absolute; z-index: 3; left: 50%; bottom: 1.6rem; transform: translateX(-50%); display: flex; align-items: center; gap: 0.8rem; padding: 0.45rem 0.7rem; border-radius: 999px; background: rgba(13, 18, 22, 0.5); border: 1px solid var(--line); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
.c5-round { display: grid; place-items: center; width: 40px; height: 40px; border-radius: 50%; border: 1px solid rgba(255, 255, 255, 0.2); background: rgba(255, 255, 255, 0.08); color: var(--text); cursor: pointer; transition: transform 0.3s var(--ease), background 0.3s, border-color 0.3s; }
.c5-round:hover { background: rgba(248, 201, 87, 0.2); border-color: var(--gold); transform: scale(1.1); }
.c5-dots { display: flex; gap: 0.5rem; }
.c5-dot { width: 12px; height: 12px; padding: 0; border: 0; border-radius: 999px; background: rgba(255, 255, 255, 0.3); cursor: pointer; transition: width 0.5s var(--ease), background 0.3s, box-shadow 0.3s; }
.c5-dot:hover { background: rgba(255, 255, 255, 0.6); }
.c5-dot.is-active { width: 34px; background: var(--gold); box-shadow: 0 0 14px rgba(248, 201, 87, 0.7); }
.c5-scroll { position: absolute; z-index: 3; right: clamp(1rem, 4vw, 2.5rem); bottom: 1.9rem; display: grid; place-items: center; width: 40px; height: 40px; border-radius: 50%; border: 1px solid rgba(255, 255, 255, 0.25); animation: c5-bounce 2s ease-in-out infinite; }
@keyframes c5-bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(8px); } }

/* ---------- trust ---------- */
.c5-trust { position: relative; z-index: 4; margin-top: -2.2rem; padding-bottom: 1rem; }
.c5-trust-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
.c5-trust-item { display: flex; align-items: center; gap: 0.9rem; padding: 1.1rem; height: 100%; }
.c5-trust-item h3 { font-family: 'Outfit', sans-serif; font-size: 1rem; font-weight: 600; }
.c5-trust-item p { font-size: 0.88rem; color: var(--muted); }

/* ---------- about ---------- */
.c5-about { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(2rem, 6vw, 5rem); align-items: center; }
.c5-about-media { position: relative; padding: 0 0 2.5rem; }
.c5-about-main { width: 88%; aspect-ratio: 4 / 5; object-fit: cover; border-radius: 24px; border: 1px solid var(--line); box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5); }
.c5-about-small { position: absolute; right: 0; bottom: 0; width: 48%; aspect-ratio: 1; object-fit: cover; border-radius: 20px; border: 4px solid var(--ink); box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5); }
.c5-about-glow { position: absolute; z-index: -1; inset: 10% 14% 6% -6%; border-radius: 30px; background: radial-gradient(circle, rgba(248, 201, 87, 0.3), transparent 70%); filter: blur(30px); animation: c5-glow-pulse 5s ease-in-out infinite; }
@keyframes c5-glow-pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
.c5-about-copy h2 { font-size: clamp(2rem, 5.5vw, 3.2rem); }
.c5-about-copy > p { margin-top: 1rem; color: #cfd7dd; font-size: clamp(1rem, 2.6vw, 1.12rem); max-width: 520px; }
.c5-checks { list-style: none; margin: 1.4rem 0 1.8rem; padding: 0; display: grid; gap: 0.7rem; }
.c5-checks li { display: flex; align-items: center; gap: 0.6rem; }
.c5-checks svg { color: var(--gold); flex: none; }

/* ---------- tabs ---------- */
.c5-tabs { display: flex; gap: 0.6rem; margin: 0 auto 2rem; padding: 0.25rem; overflow-x: auto; justify-content: center; scrollbar-width: none; -webkit-overflow-scrolling: touch; }
.c5-tabs::-webkit-scrollbar { display: none; }
.c5-tab { flex: none; padding: 0.6rem 1.2rem; min-height: 44px; border-radius: 999px; border: 1px solid var(--line); background: var(--glass); color: var(--muted); font-weight: 500; font-size: 0.95rem; cursor: pointer; transition: all 0.35s var(--ease); }
.c5-tab:hover { color: var(--text); border-color: rgba(248, 201, 87, 0.5); transform: translateY(-2px); }
.c5-tab.is-active { color: #1a1405; background: var(--gold); border-color: var(--gold); box-shadow: 0 0 24px rgba(248, 201, 87, 0.4); }

/* ---------- cards ---------- */
.c5-grid { display: grid; gap: clamp(1rem, 2.5vw, 1.6rem); }
.c5-services { grid-template-columns: repeat(auto-fill, minmax(min(100%, 270px), 1fr)); }
.c5-promos { grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr)); }
.c5-why { grid-template-columns: repeat(auto-fit, minmax(min(100%, 250px), 1fr)); }
.c5-team { grid-template-columns: repeat(auto-fit, minmax(min(100%, 230px), 1fr)); }
.c5-reviews { grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)); }

.c5-card { display: flex; flex-direction: column; height: 100%; overflow: hidden; border-radius: 20px; background: var(--ink-3); border: 1px solid var(--line); }
.c5-card-media { position: relative; aspect-ratio: 4 / 3; overflow: hidden; background: var(--ink-2); }
.c5-card-media img, .c5-card-media .c5-fallback, .c5-member-photo img, .c5-member-photo .c5-fallback { width: 100%; height: 100%; object-fit: cover; transition: transform 0.9s var(--ease); }
.c5-card:hover .c5-card-media img, .c5-card:hover .c5-member-photo img { transform: scale(1.08); }
.c5-chip { position: absolute; left: 0.8rem; bottom: 0.8rem; display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.3rem 0.7rem; border-radius: 999px; font-size: 0.8rem; background: rgba(13, 18, 22, 0.65); border: 1px solid rgba(255, 255, 255, 0.18); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
.c5-chip-gold { color: #1a1405; background: var(--gold); border-color: var(--gold); font-weight: 600; }
.c5-card-body { display: flex; flex-direction: column; flex: 1; gap: 0.5rem; padding: 1.2rem; }
.c5-card-body h3 { font-size: 1.3rem; }
.c5-card-body > p { color: var(--muted); font-size: 0.95rem; }
.c5-card-foot { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.7rem; margin-top: auto; padding-top: 0.9rem; }
.c5-price { font-weight: 700; font-size: 1.15rem; color: var(--gold); }
.c5-price s { margin-right: 0.5rem; font-weight: 400; font-size: 0.9rem; color: var(--muted); }
.c5-terms { margin-top: 0.6rem; font-size: 0.85rem; color: var(--muted); }
.c5-terms summary { cursor: pointer; color: var(--text); padding: 0.3rem 0; }
.c5-terms p { margin-top: 0.4rem; animation: c5-rise 0.4s var(--ease); }

.c5-why-item { height: 100%; padding: 1.6rem; display: flex; flex-direction: column; gap: 0.8rem; }
.c5-why-item h3 { font-size: 1.2rem; }
.c5-why-item p { color: var(--muted); font-size: 0.95rem; }

/* ---------- gallery ---------- */
.c5-gallery { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.8rem; }
.c5-shot { position: relative; padding: 0; border: 1px solid var(--line); border-radius: 16px; overflow: hidden; aspect-ratio: 1; background: var(--ink-3); cursor: zoom-in; transition: transform 0.45s var(--ease), box-shadow 0.45s var(--ease); }
.c5-shot img, .c5-shot .c5-fallback { width: 100%; height: 100%; object-fit: cover; transition: transform 0.9s var(--ease); }
.c5-shot:hover { transform: translateY(-6px); box-shadow: 0 18px 40px rgba(0, 0, 0, 0.5), 0 0 28px rgba(248, 201, 87, 0.22); }
.c5-shot:hover img { transform: scale(1.1); }
.c5-shot-over { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.4rem; color: var(--gold); background: rgba(13, 18, 22, 0.55); opacity: 0; backdrop-filter: blur(3px); -webkit-backdrop-filter: blur(3px); transition: opacity 0.4s; }
.c5-shot-over em { font-style: normal; font-size: 0.88rem; color: var(--text); }
.c5-shot:hover .c5-shot-over, .c5-shot:focus-visible .c5-shot-over { opacity: 1; }
@media (hover: none) { .c5-shot-over { opacity: 0; } }

.c5-lightbox { position: fixed; inset: 0; z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1rem; background: rgba(5, 8, 10, 0.9); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); animation: c5-fade 0.35s ease; }
@keyframes c5-fade { from { opacity: 0; } to { opacity: 1; } }
.c5-lightbox figure { margin: 0; max-width: min(92vw, 900px); animation: c5-pop 0.45s var(--ease); }
@keyframes c5-pop { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: none; } }
.c5-lightbox figure img, .c5-lightbox figure .c5-fallback { max-height: 80vh; width: auto; min-width: min(80vw, 420px); min-height: 280px; margin: 0 auto; border-radius: 16px; object-fit: contain; box-shadow: 0 0 60px rgba(248, 201, 87, 0.2); }
.c5-lightbox figcaption { text-align: center; margin-top: 0.8rem; color: var(--muted); }
.c5-lb-close { position: absolute; top: 1rem; right: 1rem; }
.c5-lb-prev { position: absolute; left: clamp(0.4rem, 2vw, 1.5rem); top: 50%; translate: 0 -50%; }
.c5-lb-next { position: absolute; right: clamp(0.4rem, 2vw, 1.5rem); top: 50%; translate: 0 -50%; }

/* ---------- team ---------- */
.c5-member-photo { aspect-ratio: 3 / 4; overflow: hidden; background: var(--ink-2); }
.c5-member .c5-card-body { text-align: center; align-items: center; }

/* ---------- reviews ---------- */
.c5-review { margin: 0; height: 100%; padding: 1.6rem; display: flex; flex-direction: column; gap: 1rem; }
.c5-stars { display: flex; gap: 0.2rem; }
.c5-stars svg { color: var(--muted); }
.c5-stars svg.on { color: var(--gold); fill: var(--gold); }
.c5-review blockquote { margin: 0; color: #d8dfe4; }
.c5-review figcaption { display: flex; align-items: center; gap: 0.7rem; margin-top: auto; }
.c5-review figcaption img { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; }
.c5-review figcaption small { display: block; color: var(--muted); }
.c5-empty { max-width: 560px; margin: 0 auto; padding: clamp(1.6rem, 5vw, 2.6rem); text-align: center; display: flex; flex-direction: column; align-items: center; gap: 0.8rem; }
.c5-empty p { color: var(--muted); }

/* ---------- find us ---------- */
.c5-find { display: grid; grid-template-columns: 1.15fr 0.85fr; gap: clamp(1rem, 3vw, 2rem); align-items: start; }
.c5-map-col { display: grid; gap: 1.2rem; }
.c5-map { overflow: hidden; padding: 0.5rem; }
.c5-map iframe { display: block; width: 100%; height: clamp(300px, 52vw, 460px); border: 0; border-radius: 14px; filter: grayscale(0.35) contrast(1.05); }
.c5-map-empty { display: grid; place-content: center; justify-items: center; gap: 0.6rem; height: clamp(260px, 45vw, 380px); color: var(--muted); }
.c5-map-empty svg { color: var(--gold); }
.c5-info { padding: clamp(1.2rem, 3vw, 1.8rem); }
.c5-info h3 { display: flex; align-items: center; gap: 0.5rem; font-size: 1.3rem; }
.c5-info h3 svg { color: var(--gold); }
.c5-hours { margin: 1rem 0; display: grid; gap: 0.5rem; }
.c5-hours div { display: flex; justify-content: space-between; gap: 1rem; padding: 0.65rem 0.9rem; border-radius: 12px; background: rgba(255, 255, 255, 0.04); transition: background 0.3s, transform 0.3s var(--ease); }
.c5-hours div:hover { background: rgba(248, 201, 87, 0.1); transform: translateX(4px); }
.c5-hours dt { font-weight: 500; }
.c5-hours dd { margin: 0; color: var(--muted); text-align: right; }
.c5-contacts { list-style: none; margin: 0 0 1.2rem; padding: 0; display: grid; gap: 0.7rem; }
.c5-contacts li { display: flex; gap: 0.7rem; align-items: flex-start; overflow-wrap: anywhere; }
.c5-contacts svg { color: var(--gold); flex: none; margin-top: 3px; }
.c5-contacts small { display: block; color: var(--muted); }
.c5-contacts a:hover { color: var(--gold); }
.c5-form { display: grid; gap: 0.9rem; padding-top: 1.2rem; border-top: 1px solid var(--line); }
.c5-form label { display: grid; gap: 0.35rem; font-size: 0.9rem; color: var(--muted); }
.c5-form input, .c5-form textarea { width: 100%; padding: 0.8rem 1rem; border-radius: 12px; border: 1px solid var(--line); background: rgba(255, 255, 255, 0.05); color: var(--text); font: inherit; font-size: 1rem; resize: vertical; transition: border-color 0.3s, box-shadow 0.3s; }
.c5-form input:focus, .c5-form textarea:focus { outline: none; border-color: var(--gold); box-shadow: 0 0 0 3px rgba(248, 201, 87, 0.22); }
.c5-note { font-size: 0.9rem; color: var(--gold); }

/* ---------- final cta ---------- */
.c5-cta-wrap { padding-top: clamp(2rem, 6vw, 4rem); }
.c5-cta { position: relative; overflow: hidden; display: flex; flex-direction: column; align-items: center; gap: 0.9rem; padding: clamp(2.4rem, 8vw, 5rem) clamp(1.2rem, 5vw, 3rem); text-align: center; border-radius: 28px; border: 1px solid rgba(248, 201, 87, 0.35); background: linear-gradient(135deg, rgba(248, 201, 87, 0.14), rgba(255, 255, 255, 0.03)); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); }
.c5-cta h2 { font-size: clamp(2rem, 6.5vw, 3.6rem); }
.c5-cta-sub { color: var(--gold); font-size: clamp(1.1rem, 3vw, 1.4rem); font-weight: 500; }
.c5-cta p:not(.c5-cta-sub) { max-width: 480px; color: #cfd7dd; }
.c5-cta .c5-btn { margin-top: 0.8rem; }
.c5-cta-glow { position: absolute; z-index: -1; width: 420px; height: 420px; top: -40%; left: 50%; translate: -50% 0; border-radius: 50%; background: rgba(248, 201, 87, 0.28); filter: blur(90px); animation: c5-glow-pulse 5s ease-in-out infinite; }

/* ---------- fallback when a photo is missing ---------- */
.c5-fallback { background: linear-gradient(135deg, #1b242c, #26323b 50%, #1b242c); background-size: 200% 200%; animation: c5-shimmer 6s ease-in-out infinite; }
@keyframes c5-shimmer { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }

/* ---------- tablet ---------- */
@media (max-width: 1024px) {
  .c5-trust-grid { grid-template-columns: repeat(2, 1fr); }
  .c5-gallery { grid-template-columns: repeat(3, 1fr); }
  .c5-hero-grid { grid-template-columns: 1fr 0.9fr; }
}

/* ---------- small tablets and phones ---------- */
@media (max-width: 820px) {
  .c5-hero { align-items: flex-start; padding-bottom: 7rem; }
  .c5-hero-grid { grid-template-columns: 1fr; }
  .c5-hero-shade { background: linear-gradient(180deg, rgba(13, 18, 22, 0.75) 0%, rgba(13, 18, 22, 0.7) 60%, var(--ink) 100%); }
  .c5-about, .c5-find { grid-template-columns: 1fr; }
  .c5-about-media { max-width: 460px; margin-inline: auto; }
  .c5-scroll { display: none; }
  .c5-trust { margin-top: -1rem; }
}

@media (max-width: 560px) {
  .c5-wrap { width: calc(100% - 1.5rem); }
  .c5-trust-grid { grid-template-columns: 1fr; }
  .c5-gallery { grid-template-columns: repeat(2, 1fr); gap: 0.6rem; }
  .c5-actions .c5-btn { flex: 1 1 100%; }
  .c5-hero .c5-actions .c5-btn { width: 100%; }
  .c5-tabs { justify-content: flex-start; margin-inline: -0.75rem; padding-inline: 0.75rem; }
  .c5-hero-controls { gap: 0.5rem; padding: 0.35rem 0.5rem; bottom: 1.1rem; }
  .c5-round { width: 36px; height: 36px; }
  .c5-hours div { flex-direction: column; gap: 0.1rem; }
  .c5-hours dd { text-align: left; }
  .c5-card-foot { flex-direction: column; align-items: stretch; }
  .c5-card-foot .c5-btn { width: 100%; }
  .c5-orb-a { width: 220px; height: 220px; }
  .c5-lb-prev, .c5-lb-next { top: auto; bottom: 1rem; translate: 0 0; }
  .c5-fab { width: 46px; height: 46px; }
  .c5-gallery.is-featured .c5-shot:first-child { grid-column: span 2; grid-row: span 2; }
}

@media (max-width: 360px) {
  .c5-quick { grid-template-columns: 1fr; }
  .c5-hero h1 { font-size: 2.3rem; }
}

@media (prefers-reduced-motion: reduce) {
  .c5-home *, .c5-home *::before, .c5-home *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
  .c5-reveal, .c5-rise, .c5-swap, .c5-word { opacity: 1 !important; transform: none !important; filter: none !important; }
}

/* ---------- ticker ---------- */
.c5-ticker { overflow: hidden; padding: 1.1rem 0; border-block: 1px solid var(--line); background: rgba(248, 201, 87, 0.05); -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent); mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent); }
.c5-track { display: flex; width: max-content; gap: 2rem; animation: c5-marquee 45s linear infinite; }
.c5-ticker:hover .c5-track { animation-play-state: paused; }
.c5-track span { display: inline-flex; align-items: center; gap: 2rem; font-family: 'Fraunces', Georgia, serif; font-size: clamp(1.1rem, 3vw, 1.6rem); white-space: nowrap; color: #d7dde2; }
.c5-track svg { color: var(--gold); }
@keyframes c5-marquee { to { transform: translateX(-50%); } }

/* ---------- floating buttons ---------- */
.c5-floaters { position: fixed; z-index: 90; right: clamp(0.8rem, 2vw, 1.6rem); bottom: clamp(0.8rem, 2vw, 1.6rem); display: flex; flex-direction: column; gap: 0.7rem; align-items: flex-end; }
.c5-fab { display: grid; place-items: center; width: 52px; height: 52px; border-radius: 50%; border: 1px solid rgba(255, 255, 255, 0.25); color: var(--text); background: rgba(13, 18, 22, 0.7); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); cursor: pointer; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45); transition: transform 0.4s var(--ease), opacity 0.4s, background 0.3s, box-shadow 0.3s; }
.c5-fab:hover { transform: translateY(-4px) scale(1.08); box-shadow: 0 0 28px rgba(248, 201, 87, 0.5); }
.c5-fab-wa { color: #fff; background: #1faa59; border-color: #1faa59; animation: c5-btn-breathe 3.6s ease-in-out infinite; }
.c5-fab-top { opacity: 0; transform: translateY(16px) scale(0.8); pointer-events: none; }
.c5-fab-top.is-on { opacity: 1; transform: none; pointer-events: auto; }
.c5-fab-top.is-on:hover { transform: translateY(-4px) scale(1.08); }

/* ---------- misc ---------- */
.c5-home section[id] { scroll-margin-top: 84px; }
.c5-gallery.is-featured .c5-shot:first-child { grid-column: span 2; grid-row: span 2; }
.c5-cta::after { content: ''; position: absolute; inset: 0; pointer-events: none; background: linear-gradient(115deg, transparent 35%, rgba(255, 255, 255, 0.12) 50%, transparent 65%); transform: translateX(-120%); animation: c5-sweep 6s ease-in-out infinite; }
@keyframes c5-sweep { 0%, 55% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }
.c5-actions-center { justify-content: center; }
.c5-direct { max-width: 100%; text-align: center; display: grid; gap: 0.8rem; justify-items: center; padding: 1rem 0 0.2rem; border-top: 1px solid var(--line); margin-top: 1.2rem; }
.c5-direct p { color: var(--muted); }
.c5-lb-hint { position: absolute; bottom: 1rem; left: 50%; translate: -50% 0; font-size: 0.8rem; color: var(--muted); }

/* ---------- large screens ---------- */
@media (min-width: 1200px) {
  .c5-wrap { width: min(1280px, 100% - 6rem); }
  .c5-hero h1 { font-size: clamp(4.6rem, 6.4vw, 6.6rem); }
  .c5-hero-card { padding: 1.9rem; }
  .c5-hero-card h2 { font-size: 1.4rem; }
  .c5-section { padding: 8rem 0; }
  .c5-head h2, .c5-about-copy h2 { font-size: 3.4rem; }
  .c5-card-body h3 { font-size: 1.4rem; }
}
@media (min-width: 1600px) {
  .c5-wrap { width: min(1480px, 100% - 10rem); }
  .c5-hero h1 { font-size: 7.4rem; }
  .c5-lead { font-size: 1.3rem; max-width: 620px; }
}
`

/* ------------------------------- helpers ------------------------------ */
const formatPrice = (n) => (n == null ? 'KSh —' : `KSh ${Number(n).toLocaleString('en-KE')}`)
const isLive = (p, now = new Date()) => now >= new Date(p.startsAt) && now <= new Date(`${p.endsAt}T23:59:59`)

const scrollToId = (id) => (e) => {
  const el = document.getElementById(id)
  if (!el) return
  e.preventDefault()
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
  el.style.setProperty('--rx', `${(0.5 - y) * 7}deg`)
  el.style.setProperty('--ry', `${(x - 0.5) * 9}deg`)
}
const tiltReset = (e) => {
  e.currentTarget.style.setProperty('--rx', '0deg')
  e.currentTarget.style.setProperty('--ry', '0deg')
}
const tilt = { onPointerMove: tiltMove, onPointerLeave: tiltReset }

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

  return createElement(
    Tag,
    {
      ref,
      className: `c5-reveal c5-${variant} from-${from} ${shown ? 'is-in' : ''} ${className}`,
      style: { '--d': `${delay}ms` },
    },
    children,
  )
}

function Img({ src, alt, className = '', ...rest }) {
  const [failed, setFailed] = useState(false)
  if (failed) return <div className={`c5-fallback ${className}`} role="img" aria-label={alt} />
  return <img src={src} alt={alt} className={className} loading="lazy" onError={() => setFailed(true)} {...rest} />
}

function Words({ text }) {
  return text.split(' ').map((w, i) => (
    <span key={`${w}-${i}`}>
      <span className="c5-word" style={{ '--i': i }}>{w}</span>{' '}
    </span>
  ))
}

function SectionHead({ title, text }) {
  return (
    <Reveal className="c5-head">
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </Reveal>
  )
}

const SPARKS = [
  { l: '8%', t: '62%', d: '0s', s: 0.9 }, { l: '18%', t: '78%', d: '2.4s', s: 0.7 },
  { l: '31%', t: '55%', d: '4.8s', s: 1 }, { l: '47%', t: '82%', d: '1.2s', s: 0.8 },
  { l: '58%', t: '66%', d: '3.6s', s: 0.7 }, { l: '71%', t: '80%', d: '6s', s: 1 },
  { l: '83%', t: '58%', d: '2s', s: 0.8 }, { l: '92%', t: '74%', d: '5.2s', s: 0.9 },
]

/* ------------------------------- hero -------------------------------- */
function Hero() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchX = useRef(null)
  const root = useRef(null)
  const count = HERO_SLIDES.length

  const go = useCallback((i) => setIndex((i + count) % count), [count])

  useEffect(() => {
    if (paused) return undefined
    const t = setInterval(() => setIndex((i) => (i + 1) % count), 6500)
    return () => clearInterval(t)
  }, [paused, count, index])

  /* parallax and fade as you scroll away from the hero */
  useEffect(() => {
    const el = root.current
    if (!el) return undefined
    let raf = 0
    const update = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const p = Math.min(1, Math.max(0, -r.top / (r.height * 0.85)))
      el.style.setProperty('--hp', p.toFixed(3))
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

  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX; setPaused(true) }
  const onTouchEnd = (e) => {
    if (touchX.current != null) {
      const dx = e.changedTouches[0].clientX - touchX.current
      if (Math.abs(dx) > 45) go(index + (dx < 0 ? 1 : -1))
    }
    touchX.current = null
    setPaused(false)
  }

  return (
    <section
      id="home"
      ref={root}
      className="c5-hero"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="c5-hero-slides" aria-hidden="true">
        {HERO_SLIDES.map((s, i) => (
          <div key={s.label} className={`c5-slide ${i === index ? 'is-active' : ''}`}>
            <Img src={s.src} alt="" className="c5-slide-img" loading={i === 0 ? 'eager' : 'lazy'} />
          </div>
        ))}
        <div className="c5-hero-shade" />
      </div>

      <span className="c5-orb c5-orb-a" aria-hidden="true" />
      <span className="c5-orb c5-orb-b" aria-hidden="true" />
      {SPARKS.map((s) => (
        <i key={s.l} className="c5-spark" aria-hidden="true" style={{ left: s.l, top: s.t, animationDelay: s.d, scale: s.s }} />
      ))}

      <div className="c5-wrap c5-hero-grid">
        <div className="c5-hero-copy">
          <span className="c5-pill c5-rise" style={{ '--d': '100ms' }}>
            <Sparkles size={15} /> Welcome to Crystal Five
          </span>
          <h1><Words text="Look Good. Feel Great." /></h1>
          <p className="c5-tagline c5-rise" style={{ '--d': '900ms' }}>
            Your Beauty. Your Style. Your Confidence.
          </p>
          <p className="c5-lead c5-rise" style={{ '--d': '1050ms' }}>
            Experience professional hair styling, grooming and beauty services delivered by a team that understands your style.
          </p>
          <div className="c5-actions c5-rise" style={{ '--d': '1200ms' }}>
            <Link to="/book-now" className="c5-btn c5-btn-gold">
              Book an Appointment <ArrowRight size={18} />
            </Link>
            <a href="#services" onClick={scrollToId('services')} className="c5-btn c5-btn-glass">Explore Our Services</a>
          </div>
        </div>

        <aside className="c5-glass c5-hero-card c5-rise" style={{ '--d': '1100ms' }}>
          <h2>What are you booking today?</h2>
          <div className="c5-quick">
            {CATEGORIES.map(({ id, name, icon }) => (
              <Link key={id} to={`/book-now?category=${id}`} className="c5-quick-item">
                {createElement(icon, { size: 20 })}
                <span>{name}</span>
              </Link>
            ))}
          </div>
          <div className="c5-now-showing" aria-live="polite">
            <strong>{HERO_SLIDES[index].label}</strong>
            <span>{HERO_SLIDES[index].note}</span>
          </div>
        </aside>
      </div>

      <div className="c5-hero-controls">
        <button type="button" className="c5-round" onClick={() => go(index - 1)} aria-label="Previous slide"><ChevronLeft size={20} /></button>
        <div className="c5-dots" role="tablist" aria-label="Hero slides">
          {HERO_SLIDES.map((s, i) => (
            <button
              key={s.label}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Show ${s.label}`}
              className={`c5-dot ${i === index ? 'is-active' : ''}`}
              onClick={() => go(i)}
            />
          ))}
        </div>
        <button type="button" className="c5-round" onClick={() => go(index + 1)} aria-label="Next slide"><ChevronRight size={20} /></button>
      </div>

      <a href="#trust" onClick={scrollToId('trust')} className="c5-scroll" aria-label="Scroll down"><ChevronDown size={22} /></a>
    </section>
  )
}

/* ------------------------------- sections ------------------------------ */
function Trust() {
  return (
    <section id="trust" className="c5-trust">
      <Reveal variant="sec" className="c5-wrap c5-trust-grid">
        {TRUST.map(({ icon: Icon, title, text }, i) => (
          <Reveal key={title} delay={i * 90} variant="zoom" className="c5-cell">
            <div className="c5-glass c5-lift c5-trust-item" {...tilt}>
              <span className="c5-icon c5-breathe">{createElement(Icon, { size: 22 })}</span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </Reveal>
    </section>
  )
}

function About() {
  return (
    <section id="about" className="c5-section">
      <Reveal variant="sec" className="c5-wrap c5-about">
        <Reveal variant="left" className="c5-about-media">
          <Img src={IMAGES.about} alt="Inside Crystal Five" className="c5-about-main" />
          <Img src={IMAGES.aboutSmall} alt="Our team at work" className="c5-about-small c5-float" />
          <span className="c5-about-glow" aria-hidden="true" />
        </Reveal>
        <Reveal variant="right" className="c5-about-copy">
          <h2>More Than a Salon. An Experience.</h2>
          <p>
            Crystal Five brings salon, kinyozi and beauty services together in one welcoming place, so everyone who walks in leaves feeling like the best version of themselves.
          </p>
          <ul className="c5-checks">
            <li><BadgeCheck size={18} /> Quality work on every visit</li>
            <li><BadgeCheck size={18} /> Friendly, attentive customer service</li>
            <li><BadgeCheck size={18} /> A team that listens before it starts</li>
          </ul>
          <Link to="/about" className="c5-btn c5-btn-gold">Read More <ArrowRight size={18} /></Link>
        </Reveal>
      </Reveal>
    </section>
  )
}

function Ticker() {
  const names = SERVICES.map((s) => s.name)
  const row = (k) => (
    <span key={k} aria-hidden={k === 'b'}>
      {names.map((n) => (
        <span key={`${k}-${n}`}>{n}<Sparkles size={16} /></span>
      ))}
    </span>
  )
  return (
    <div className="c5-ticker" aria-label="Services we offer">
      <div className="c5-track">{row('a')}{row('b')}</div>
    </div>
  )
}

function Services() {
  const [active, setActive] = useState('all')
  const list = useMemo(() => (active === 'all' ? SERVICES : SERVICES.filter((s) => s.category === active)), [active])
  return (
    <section id="services" className="c5-section c5-alt">
      <Reveal variant="sec" className="c5-wrap">
        <SectionHead title="Our Services" text="Choose a service and book it in a few taps." />
        <Reveal className="c5-tabs">
          {[{ id: 'all', name: 'All' }, ...CATEGORIES].map((c) => (
            <button key={c.id} type="button" className={`c5-tab ${active === c.id ? 'is-active' : ''}`} onClick={() => setActive(c.id)}>
              {c.name}
            </button>
          ))}
        </Reveal>
        <div className="c5-grid c5-services" key={active}>
          {list.map((s, i) => (
            <article key={s.id} className="c5-card c5-lift c5-swap" style={{ '--d': `${i * 70}ms` }} {...tilt}>
              <div className="c5-card-media">
                <Img src={s.image} alt={s.name} />
                <span className="c5-chip"><Clock size={13} /> {s.duration}</span>
              </div>
              <div className="c5-card-body">
                <h3>{s.name}</h3>
                <p>{s.text}</p>
                <div className="c5-card-foot">
                  <span className="c5-price">{formatPrice(s.price)}</span>
                  <Link to={`/book-now?service=${s.id}`} className="c5-btn c5-btn-gold c5-btn-sm">Book This Service</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Reveal>
    </section>
  )
}

function Why() {
  return (
    <section className="c5-section">
      <Reveal variant="sec" className="c5-wrap">
        <SectionHead title="Why Choose Crystal Five" text="The things that make every visit easy and enjoyable." />
        <div className="c5-grid c5-why">
          {WHY.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={(i % 3) * 110} className="c5-cell">
              <div className="c5-glass c5-lift c5-why-item" {...tilt}>
                <span className="c5-icon c5-glow">{createElement(Icon, { size: 22 })}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Reveal>
    </section>
  )
}

function Gallery() {
  const [filter, setFilter] = useState('All')
  const [showAll, setShowAll] = useState(false)
  const [open, setOpen] = useState(null)
  const touchX = useRef(null)

  const filtered = useMemo(() => (filter === 'All' ? GALLERY : GALLERY.filter((g) => g.cat === filter)), [filter])
  const featured = filter === 'All' && !showAll
  const limit = featured ? 9 : filtered.length
  const visible = showAll ? filtered : filtered.slice(0, limit)
  const canExpand = filter === 'All' && filtered.length > 9

  const step = useCallback((dir) => {
    setOpen((cur) => {
      if (cur == null) return cur
      const i = filtered.findIndex((g) => g.id === cur)
      return filtered[(i + dir + filtered.length) % filtered.length].id
    })
  }, [filtered])

  useEffect(() => {
    if (open == null) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(null)
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey) }
  }, [open, step])

  const current = GALLERY.find((g) => g.id === open)

  const lbTouchStart = (e) => { touchX.current = e.touches[0].clientX }
  const lbTouchEnd = (e) => {
    if (touchX.current == null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1)
    touchX.current = null
  }

  return (
    <section id="gallery" className="c5-section c5-alt">
      <Reveal variant="sec" className="c5-wrap">
        <SectionHead title="Our Work" text="A look at what we do, from fresh cuts to full transformations." />
        <Reveal className="c5-tabs">
          {GALLERY_FILTERS.map((f) => (
            <button key={f} type="button" className={`c5-tab ${filter === f ? 'is-active' : ''}`} onClick={() => { setFilter(f); setShowAll(false) }}>
              {f}
            </button>
          ))}
        </Reveal>
        <div className={`c5-gallery ${featured ? 'is-featured' : ''}`} key={`${filter}-${showAll}`}>
          {visible.map((g, i) => (
            <button key={g.id} type="button" className="c5-shot c5-swap" style={{ '--d': `${i * 55}ms` }} onClick={() => setOpen(g.id)} aria-label={`Enlarge: ${g.alt}`}>
              <Img src={g.src} alt={g.alt} />
              <span className="c5-shot-over"><ZoomIn size={22} /><em>{g.cat}</em></span>
            </button>
          ))}
        </div>
        {canExpand && (
          <div className="c5-center">
            <button type="button" className="c5-btn c5-btn-glass" onClick={() => setShowAll((v) => !v)}>
              {showAll ? 'Show Less' : 'View More Gallery'}
            </button>
          </div>
        )}
      </Reveal>

      {current && (
        <div className="c5-lightbox" role="dialog" aria-modal="true" aria-label={current.alt} onClick={() => setOpen(null)} onTouchStart={lbTouchStart} onTouchEnd={lbTouchEnd}>
          <button type="button" className="c5-round c5-lb-close" onClick={() => setOpen(null)} aria-label="Close"><X size={20} /></button>
          <button type="button" className="c5-round c5-lb-prev" onClick={(e) => { e.stopPropagation(); step(-1) }} aria-label="Previous photo"><ChevronLeft size={22} /></button>
          <figure key={current.id} onClick={(e) => e.stopPropagation()}>
            <Img src={current.src} alt={current.alt} />
            <figcaption>{current.cat}</figcaption>
          </figure>
          <button type="button" className="c5-round c5-lb-next" onClick={(e) => { e.stopPropagation(); step(1) }} aria-label="Next photo"><ChevronRight size={22} /></button>
        </div>
      )}
    </section>
  )
}

function Promotions() {
  const live = PROMOTIONS.filter((p) => isLive(p))
  if (!live.length) return null
  return (
    <section id="offers" className="c5-section">
      <Reveal variant="sec" className="c5-wrap">
        <SectionHead title="Special Offers" text="Current offers you can book right now." />
        <div className="c5-grid c5-promos">
          {live.map((p, i) => (
            <Reveal key={p.id} delay={i * 120} className="c5-cell">
              <article className="c5-card c5-lift c5-promo" {...tilt}>
                <div className="c5-card-media">
                  <Img src={p.image} alt={p.title} />
                  <span className="c5-chip c5-chip-gold"><Tag size={13} /> Until {new Date(p.endsAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                <div className="c5-card-body">
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                  <div className="c5-card-foot">
                    <span className="c5-price">
                      {p.oldPrice != null && <s>{formatPrice(p.oldPrice)}</s>}
                      {formatPrice(p.price)}
                    </span>
                    <Link to={`/book-now?offer=${p.id}`} className="c5-btn c5-btn-gold c5-btn-sm">Book Now</Link>
                  </div>
                  <details className="c5-terms">
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

function Team() {
  return (
    <section id="team" className="c5-section c5-alt">
      <Reveal variant="sec" className="c5-wrap">
        <SectionHead title="Meet the Team" text="The people who will take care of you." />
        <div className="c5-grid c5-team">
          {TEAM.map((t, i) => (
            <Reveal key={t.id} delay={i * 110} variant="zoom" className="c5-cell">
              <article className="c5-card c5-lift c5-member" {...tilt}>
                <div className="c5-member-photo">
                  <Img src={t.image} alt={t.role} />
                </div>
                <div className="c5-card-body">
                  <h3>{t.role}</h3>
                  <p>{t.speciality}</p>
                  <Link to="/book-now" className="c5-link">Book now <ArrowRight size={16} /></Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Reveal>
    </section>
  )
}

function Reviews() {
  return (
    <section id="reviews" className="c5-section">
      <Reveal variant="sec" className="c5-wrap">
        <SectionHead title="What Customers Say" text="Honest feedback from people we have looked after." />
        {REVIEWS.length > 0 ? (
          <div className="c5-grid c5-reviews">
            {REVIEWS.map((r, i) => (
              <Reveal key={r.id} delay={i * 100} className="c5-cell">
                <figure className="c5-glass c5-lift c5-review" {...tilt}>
                  <div className="c5-stars" aria-label={`${r.rating} out of 5`}>
                    {Array.from({ length: 5 }, (_, k) => <Star key={k} size={16} className={k < r.rating ? 'on' : ''} />)}
                  </div>
                  <blockquote>{r.text}</blockquote>
                  <figcaption>
                    {r.photo && <img src={r.photo} alt="" />}
                    <span><strong>{r.name}</strong><small>{r.date}</small></span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal variant="zoom">
            <div className="c5-glass c5-empty">
              <span className="c5-icon c5-breathe"><Star size={24} /></span>
              <h3>Reviews are on their way</h3>
              <p>Book your visit and tell us how it went. Your feedback will appear here.</p>
              <div className="c5-actions c5-actions-center">
                <Link to="/book-now" className="c5-btn c5-btn-gold">Book a Visit</Link>
                {BUSINESS.googleReviewsUrl && (
                  <a href={BUSINESS.googleReviewsUrl} target="_blank" rel="noreferrer" className="c5-btn c5-btn-glass">See Google Reviews</a>
                )}
              </div>
            </div>
          </Reveal>
        )}
      </Reveal>
    </section>
  )
}

function FindUs() {
  const [form, setForm] = useState({ name: '', phone: '', message: '' })
  const [note, setNote] = useState('')
  const q = encodeURIComponent(BUSINESS.mapQuery)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const canSend = Boolean(BUSINESS.whatsapp || BUSINESS.email)

  const submit = (e) => {
    e.preventDefault()
    const text = `Hello Crystal Five, I'm ${form.name.trim()}.${form.phone.trim() ? ` My number is ${form.phone.trim()}.` : ''} ${form.message.trim()}`
    if (BUSINESS.whatsapp) {
      window.open(`https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener')
    } else {
      window.location.href = `mailto:${BUSINESS.email}?subject=${encodeURIComponent('Enquiry from the website')}&body=${encodeURIComponent(text)}`
    }
    setNote('Your message is ready to send. Finish sending it in the app that just opened.')
    setForm({ name: '', phone: '', message: '' })
  }

  return (
    <section id="contact" className="c5-section c5-alt">
      <Reveal variant="sec" className="c5-wrap">
        <SectionHead title="Find Us" text="Visit us, call us or send a message." />
        <div className="c5-find">
          <Reveal variant="left" className="c5-map-col">
            <div className="c5-glass c5-map">
              {BUSINESS.mapQuery ? (
                <iframe title="Crystal Five location" src={`https://www.google.com/maps?q=${q}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
              ) : (
                <div className="c5-map-empty"><MapPin size={34} className="c5-float" /><p>Our map will appear here.</p></div>
              )}
            </div>
            <div className="c5-actions">
              {BUSINESS.mapQuery && (
                <a className="c5-btn c5-btn-gold" href={`https://www.google.com/maps/dir/?api=1&destination=${q}`} target="_blank" rel="noreferrer"><Navigation size={18} /> Get Directions</a>
              )}
              {BUSINESS.phone && <a className="c5-btn c5-btn-glass" href={`tel:${BUSINESS.phone}`}><Phone size={18} /> Call Us</a>}
              {BUSINESS.whatsapp && <a className="c5-btn c5-btn-glass" href={`https://wa.me/${BUSINESS.whatsapp}`} target="_blank" rel="noreferrer"><MessageCircle size={18} /> WhatsApp</a>}
              {!BUSINESS.mapQuery && !BUSINESS.phone && !BUSINESS.whatsapp && (
                <Link to="/book-now" className="c5-btn c5-btn-gold">Book Online <ArrowRight size={18} /></Link>
              )}
            </div>
          </Reveal>

          <Reveal variant="right" className="c5-info-col">
            <div className="c5-glass c5-info">
              <h3><Clock size={20} /> Opening hours</h3>
              <dl className="c5-hours">
                {OPENING_HOURS.map((h) => (
                  <div key={h.day}><dt>{h.day}</dt><dd>{h.hours || 'Contact us to confirm'}</dd></div>
                ))}
              </dl>
              <ul className="c5-contacts">
                {BUSINESS.address && <li><MapPin size={18} /> <span>{BUSINESS.address}{BUSINESS.landmarks && <small>{BUSINESS.landmarks}</small>}</span></li>}
                {BUSINESS.phone && <li><Phone size={18} /> <a href={`tel:${BUSINESS.phone}`}>{BUSINESS.phone}</a></li>}
                {BUSINESS.email && <li><Mail size={18} /> <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a></li>}
              </ul>
              {canSend ? (
                <form className="c5-form" onSubmit={submit}>
                  <label>
                    <span>Your name</span>
                    <input required value={form.name} onChange={set('name')} autoComplete="name" />
                  </label>
                  <label>
                    <span>Phone number (optional)</span>
                    <input type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" />
                  </label>
                  <label>
                    <span>Message</span>
                    <textarea required rows={3} value={form.message} onChange={set('message')} />
                  </label>
                  <button type="submit" className="c5-btn c5-btn-gold">
                    {BUSINESS.whatsapp ? <MessageCircle size={18} /> : <Mail size={18} />}
                    {BUSINESS.whatsapp ? 'Send on WhatsApp' : 'Send by Email'}
                  </button>
                  {note && <p className="c5-note" role="status">{note}</p>}
                </form>
              ) : (
                <div className="c5-direct">
                  <p>The quickest way to reach us is to book online.</p>
                  <Link to="/book-now" className="c5-btn c5-btn-gold">Book Your Appointment <ArrowRight size={18} /></Link>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </Reveal>
    </section>
  )
}

function FinalCta() {
  return (
    <section className="c5-section c5-cta-wrap">
      <Reveal variant="sec" className="c5-wrap">
        <Reveal variant="zoom">
          <div className="c5-cta">
            <span className="c5-cta-glow" aria-hidden="true" />
            <h2>Ready for Your Next Look?</h2>
            <p className="c5-cta-sub">Your style deserves the best.</p>
            <p>Book your appointment today and let our team take care of the rest.</p>
            <Link to="/book-now" className="c5-btn c5-btn-gold c5-btn-lg c5-breathe-btn">
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
    <div className="c5-floaters">
      {BUSINESS.whatsapp && (
        <a className="c5-fab c5-fab-wa" href={`https://wa.me/${BUSINESS.whatsapp}`} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">
          <MessageCircle size={24} />
        </a>
      )}
      <button
        type="button"
        className={`c5-fab c5-fab-top ${visible ? 'is-on' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
        tabIndex={visible ? 0 : -1}
      >
        <ArrowUp size={22} />
      </button>
    </div>
  )
}

function Home() {
  return (
    <div className="c5-home">
      <style>{STYLES}</style>
      <Hero />
      <Trust />
      <About />
      <Ticker />
      <Services />
      <Why />
      <Gallery />
      <Promotions />
      <Team />
      <Reviews />
      <FindUs />
      <FinalCta />
      <Floaters />
    </div>
  )
}

export default Home
