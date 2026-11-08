import { createElement, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  ArrowRight, ArrowUp, Check, ChevronDown, ChevronLeft, ChevronRight,
  Clock, Copy, Droplets, Heart, MessageCircle, Phone, Scissors, Search,
  Sparkles, Star, Tag, X, ZoomIn,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  BUSINESS SETTINGS                                                  */
/* ------------------------------------------------------------------ */
const BUSINESS = {
  phone: '',
  whatsapp: '',
}

/* ------------------------------------------------------------------ */
/*  CATEGORIES                                                         */
/* ------------------------------------------------------------------ */
const CATEGORIES = [
  { id: 'hair-salon', name: 'Hair Salon', text: 'Braids, styling and treatments', icon: Sparkles },
  { id: 'kinyozi', name: 'Kinyozi', text: 'Haircuts and beard grooming', icon: Scissors },
  { id: 'beauty', name: 'Beauty & Nails', text: 'Manicure, pedicure and beauty', icon: Heart },
  { id: 'hair-care', name: 'Hair Care', text: 'Washing and hair treatments', icon: Droplets },
]

/* ------------------------------------------------------------------ */
/*  SERVICES                                                           */
/* ------------------------------------------------------------------ */
const SERVICES = [
  {
    id: 'braids',
    category: 'hair-salon',
    name: 'Braids',
    active: true,
    status: 'available',
    featured: true,
    pricePrefix: 'From',
    price: 2100,
    durationMin: 240,
    durationText: '3 – 5 hours',
    image: '/Braids.jpg',
    gallery: [],
    text: 'Neat, long-lasting braids in the style you choose.',
    description: 'Choose the style, size and length you want and our stylists will braid it with care. Neat parting and a clean finish keep your braids looking good for longer.',
    includes: ['Style and length consultation', 'Hair parting and preparation', 'Braiding in your chosen style', 'Neat finishing'],
    prep: 'Come with clean, detangled hair.',
  },
  {
    id: 'hair-styling',
    category: 'hair-salon',
    name: 'Hair Styling',
    active: true,
    status: 'available',
    featured: false,
    pricePrefix: 'From',
    price: 500,
    durationMin: 60,
    image: '/Hair Styling.jpg',
    gallery: [],
    text: 'Styling for everyday looks and special occasions.',
    description: 'From a relaxed everyday look to a polished style for an event, we shape your hair to match your outfit, your mood and your occasion.',
    includes: ['Consultation on the look you want', 'Styling and shaping', 'Finishing products'],
    prep: '',
  },
  {
    id: 'blow-dry',
    category: 'hair-salon',
    name: 'Blow-Dry',
    active: true,
    status: 'available',
    featured: false,
    pricePrefix: 'From',
    price: 1000,
    durationMin: 45,
    image: '/Blow Drying.jpg',
    gallery: [],
    text: 'A smooth, polished finish after your wash.',
    description: 'A professional blow-dry that leaves your hair smooth, full of movement and ready for the day or the night ahead.',
    includes: ['Wash and towel dry', 'Professional blow-dry', 'Smooth finish'],
    prep: '',
  },
  {
    id: 'mens-haircut',
    category: 'kinyozi',
    name: "Men's Haircut",
    active: true,
    status: 'available',
    featured: true,
    price: 1000,
    durationMin: 30,
    image: '/Men Shave.jpg',
    gallery: [],
    text: 'A clean cut shaped around your face and style.',
    description: 'A professional haircut and styling to give you a clean, fresh appearance. Tell your barber what you have in mind or ask for advice on what suits you.',
    includes: ['Consultation', 'Haircut with clippers and scissors', 'Neckline clean-up', 'Styling'],
    prep: '',
  },
  {
    id: 'fade',
    category: 'kinyozi',
    name: 'Fade',
    active: true,
    status: 'available',
    featured: false,
    pricePrefix: 'From',
    price: 1000,
    durationMin: 40,
    image: '/Fade Haircut.jpg',
    gallery: [],
    text: 'Sharp, precise fades blended from skin to length.',
    description: 'A carefully blended fade, from a low skin fade to a high taper, finished with clean lines.',
    includes: ['Consultation on fade height', 'Precision blending', 'Line-up', 'Styling'],
    prep: '',
  },
  {
    id: 'shave',
    category: 'kinyozi',
    name: 'Shave',
    active: true,
    status: 'available',
    featured: false,
    price: 500,
    durationMin: 25,
    image: '/Men Haircut.jpg',
    gallery: [],
    text: 'A close, comfortable shave with a fresh finish.',
    description: 'A close and comfortable shave that leaves your skin smooth and refreshed.',
    includes: ['Skin preparation', 'Close shave', 'Soothing finish'],
    prep: '',
  },
  {
    id: 'beard-trim',
    category: 'kinyozi',
    name: 'Beard Trim',
    active: true,
    status: 'available',
    featured: false,
    price: 700,
    durationMin: 20,
    image: '/Beard Trim.jpg',
    gallery: [],
    text: 'Shaped and lined beards that stay tidy.',
    description: 'Your beard trimmed, shaped and lined so it frames your face and stays neat between visits.',
    includes: ['Shaping and trimming', 'Edge and line-up', 'Finishing'],
    prep: '',
  },
  {
    id: 'makeup',
    category: 'beauty',
    name: 'Makeup',
    active: true,
    status: 'available',
    featured: false,
    pricePrefix: 'From',
    price: 1000,
    durationMin: 60,
    image: '/Makeup.jpg',
    gallery: [],
    text: 'Makeup for events, photos and everyday confidence.',
    description: 'Makeup applied for the occasion you have in mind, whether it is a wedding, a photoshoot, a night out or simply a day when you want to feel your best.',
    includes: ['Skin preparation', 'Full makeup application', 'Finishing'],
    prep: 'Arrive with a clean, moisturised face.',
  },
  {
    id: 'nails',
    category: 'beauty',
    name: 'Nails',
    active: true,
    status: 'available',
    featured: false,
    price: 500,
    durationMin: 60,
    image: '/Nails.jpg',
    gallery: [],
    text: 'Nail shaping, colour and finishing.',
    description: 'Nails shaped, coloured and finished to your taste, from simple and natural to bold and creative.',
    includes: ['Nail shaping', 'Colour application', 'Finishing coat'],
    prep: '',
  },
  {
    id: 'manicure',
    category: 'beauty',
    name: 'Manicure & Pedicure',
    active: true,
    status: 'available',
    featured: true,
    pricePrefix: 'From',
    price: 899,
    durationMin: 90,
    image: '/Nails Manicure.jpg',
    gallery: [],
    text: 'Hand and foot care that leaves you refreshed.',
    description: 'Relaxing care for your hands and feet, with grooming, soothing treatment and a neat finish.',
    includes: ['Hand and foot soak', 'Nail and cuticle care', 'Moisturising treatment', 'Polish'],
    prep: '',
  },
  {
    id: 'hair-wash',
    category: 'hair-care',
    name: 'Wash & Condition',
    active: true,
    status: 'available',
    featured: false,
    price: null,
    durationMin: 30,
    image: '/Hair Wash.jpg',
    gallery: [],
    text: 'A gentle wash with conditioning for soft hair.',
    description: 'A gentle wash and conditioning treatment that leaves your hair clean, soft and easy to manage.',
    includes: ['Gentle shampoo', 'Conditioning', 'Towel dry'],
    prep: '',
  },
  {
    id: 'hair-treatment',
    category: 'hair-care',
    name: 'Hair Treatment',
    active: true,
    status: 'available',
    featured: true,
    pricePrefix: 'From',
    price: 1500,
    durationMin: 45,
    image: '/Hair Treatment.jpg',
    gallery: [],
    text: 'Treatments that restore strength and shine.',
    description: 'A treatment chosen for your hair type to restore moisture, strength and shine.',
    includes: ['Hair and scalp check', 'Treatment application', 'Rinse and finish'],
    prep: '',
  },
]

/* ------------------------------------------------------------------ */
/*  PACKAGES                                                           */
/* ------------------------------------------------------------------ */
const PACKAGES = [
  {
    id: 'fresh-look',
    name: 'Fresh Look',
    text: 'A haircut and a beard trim in one visit.',
    serviceIds: ['mens-haircut', 'beard-trim'],
    price: null,
    image: '/Haircut and Beard Combo.jpg',
    active: true,
  },
  {
    id: 'hair-care-package',
    name: 'Hair Care Package',
    text: 'A wash, a treatment and styling to finish.',
    serviceIds: ['hair-wash', 'hair-treatment', 'hair-styling'],
    price: null,
    image: '/Hair Treatment.jpg',
    active: true,
  },
  {
    id: 'bridal',
    name: 'Bridal Package',
    text: 'Hair styling and makeup for your big day.',
    serviceIds: ['hair-styling', 'makeup'],
    price: null,
    image: '/Makeup.jpg',
    active: true,
  },
  {
    id: 'complete-grooming',
    name: 'Complete Grooming',
    text: 'A haircut, a shave and beard grooming.',
    serviceIds: ['mens-haircut', 'shave', 'beard-trim'],
    price: null,
    image: '/Men Haircut.jpg',
    active: true,
  },
]

/* ------------------------------------------------------------------ */
/*  PROMOTIONS                                                         */
/* ------------------------------------------------------------------ */
const PROMOTIONS = [
  {
    id: 'first-visit',
    title: 'First-visit offer',
    text: 'A welcome offer for customers booking with us for the first time.',
    image: '/First Visit Offer.jpg',
    oldPrice: null,
    price: null,
    startsAt: '2026-01-01',
    endsAt: '2027-12-31',
    terms: 'Applies to first appointments only. Show your booking confirmation on arrival.',
  },
  {
    id: 'cut-and-beard',
    title: 'Haircut and beard combo',
    text: 'Book a haircut and beard trim together for one package price.',
    image: '/Haircut and Beard Combo.jpg',
    oldPrice: null,
    price: null,
    startsAt: '2026-01-01',
    endsAt: '2027-12-31',
    terms: 'Both services must be booked in the same appointment.',
  },
  {
    id: 'student',
    title: 'Student offer',
    text: 'A reduced price on selected services for students.',
    image: '/Student BOy Offer.jpg',
    oldPrice: null,
    price: null,
    startsAt: '2026-01-01',
    endsAt: '2027-12-31',
    terms: 'Valid student ID required at your appointment.',
  },
]

/* ------------------------------------------------------------------ */
/*  PORTFOLIO                                                          */
/* ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------ */
/*  STAFF                                                              */
/* ------------------------------------------------------------------ */
const STAFF = [
  {
    id: 'hairstylist',
    role: 'Senior Hairstylist',
    speciality: 'Braids, styling and treatments',
    image: '/Senior HairStylist.jpg',
    serviceIds: ['braids', 'hair-styling', 'blow-dry', 'hair-wash', 'hair-treatment'],
  },
  {
    id: 'barber',
    role: 'Professional Barber',
    speciality: 'Fades, haircuts and beard grooming',
    image: '/HairStylist 2.jpg',
    serviceIds: ['mens-haircut', 'fade', 'shave', 'beard-trim'],
  },
  {
    id: 'nails',
    role: 'Nail Technician',
    speciality: 'Manicures, pedicures and nail art',
    image: '/Nail Trchnician.jpg',
    serviceIds: ['nails', 'manicure'],
  },
  {
    id: 'beauty',
    role: 'Beauty Therapist',
    speciality: 'Makeup and skin care',
    image: '/Beauty Therapist.jpg',
    serviceIds: ['makeup'],
  },
]

/* ------------------------------------------------------------------ */
/*  FAQS                                                               */
/* ------------------------------------------------------------------ */
const FAQS = [
  {
    q: 'Do I need to book before visiting?',
    a: 'Booking ahead is the surest way to get the time and the professional you want. You can choose your service and time on the booking page in a few steps.',
  },
  {
    q: 'Can I walk in without an appointment?',
    a: 'We will always try to help, but availability depends on who is free at that moment. Booking ahead saves you the wait.',
  },
  {
    q: 'How do I pay using M-Pesa?',
    a: 'M-Pesa is one of the payment options offered when you book. Choose it at payment and follow the prompt on your phone.',
  },
  {
    q: 'Can I choose my preferred barber or stylist?',
    a: 'Yes. Pick a professional on the booking page and you will only see the services they offer and the times they are free.',
  },
  {
    q: 'Can I cancel or reschedule?',
    a: 'Yes. Please contact us as early as you can so your slot can be offered to someone else and we can find you a new time.',
  },
  {
    q: 'How long does a particular service take?',
    a: 'Every service card shows its estimated time, and the details page gives you the full picture before you book.',
  },
  {
    q: 'Are service packages available?',
    a: 'Yes. Our packages combine services into one booking, and the package card shows what is included and the estimated time.',
  },
]

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */
const formatPrice = (n, prefix = '') =>
  n == null
    ? 'Price on request'
    : `${prefix ? `${prefix} ` : ''}KSh ${Number(n).toLocaleString('en-KE')}`

const formatDuration = (min, text) => {
  if (text) return text
  if (min < 60) return `${min} minutes`
  const h = Math.floor(min / 60)
  const m = min % 60
  return `${h} hour${h > 1 ? 's' : ''}${m ? ` ${m} minutes` : ''}`
}

const isLive = (p, now = new Date()) =>
  now >= new Date(p.startsAt) && now <= new Date(`${p.endsAt}T23:59:59`)

const serviceById = (id) => SERVICES.find((s) => s.id === id)
const categoryName = (id) => CATEGORIES.find((c) => c.id === id)?.name || ''
const staffFor = (serviceId) => STAFF.filter((s) => s.serviceIds.includes(serviceId))

const packageFigures = (pkg) => {
  const items = pkg.serviceIds.map(serviceById).filter(Boolean)
  const minutes = items.reduce((sum, s) => sum + s.durationMin, 0)
  const allPriced = items.length > 0 && items.every((s) => s.price != null)
  const total = allPriced ? items.reduce((sum, s) => sum + s.price, 0) : null
  const saving =
    total != null && pkg.price != null && total > pkg.price
      ? total - pkg.price
      : null

  return { items, minutes, total, saving }
}

const scrollToId = (id) => (e) => {
  const el = document.getElementById(id)
  if (!el) return
  if (e && e.preventDefault) e.preventDefault()
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

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

const tilt = {
  onPointerMove: tiltMove,
  onPointerLeave: tiltReset,
}

/* ------------------------------------------------------------------ */
/*  STYLES                                                             */
/* ------------------------------------------------------------------ */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=Outfit:wght@400;500;600;700;800&display=swap');

.sv-page {
  --gold: #a96e17;
  --green: #2e7d6b;
  --green-deep: #236355;
  --ink: #f8f7f3;
  --ink-2: #ffffff;
  --ink-3: #ffffff;
  --text: #20252a;
  --muted: #626b73;
  --line: rgba(32, 37, 42, 0.14);
  --glass: rgba(255, 255, 255, 0.9);
  --ease: cubic-bezier(0.2, 0.7, 0.2, 1);

  font-family: 'Outfit', system-ui, sans-serif;
  background: var(--ink);
  color: var(--text);
  overflow-x: clip;
  line-height: 1.6;
}

.sv-page *,
.sv-page *::before,
.sv-page *::after {
  box-sizing: border-box;
}

.sv-page h1,
.sv-page h2,
.sv-page h3 {
  font-family: 'Fraunces', Georgia, serif;
  line-height: 1.15;
  margin: 0;
  letter-spacing: -0.01em;
}

.sv-page p {
  margin: 0;
}

.sv-page a {
  color: inherit;
  text-decoration: none;
}

.sv-page img {
  display: block;
  max-width: 100%;
}

.sv-page button,
.sv-page input,
.sv-page select {
  font-family: inherit;
}

.sv-page :focus-visible {
  outline: 2px solid var(--green);
  outline-offset: 3px;
}

.sv-page section[id] {
  scroll-margin-top: 90px;
}

.sv-wrap {
  width: min(1180px, 100% - 2rem);
  margin-inline: auto;
}

.sv-section {
  padding: clamp(3rem, 7vw, 5.5rem) 0;
  position: relative;
}

.sv-alt {
  background: #f1efe9;
}

.sv-center {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.sv-cell {
  height: 100%;
}

/* Section headings */
.sv-head {
  max-width: 680px;
  margin: 0 auto clamp(1.8rem, 5vw, 2.8rem);
  text-align: center;
}

.sv-head h2 {
  font-size: clamp(1.9rem, 5.5vw, 3rem);
  color: #20252a;
}

.sv-head p {
  margin-top: 0.7rem;
  color: var(--muted);
  font-size: clamp(0.98rem, 2.6vw, 1.1rem);
}

/* Reveal animations */
.sv-reveal {
  opacity: 0;
  will-change: opacity, transform;
  transition:
    opacity 0.8s var(--ease) var(--d, 0ms),
    transform 0.9s var(--ease) var(--d, 0ms),
    filter 0.8s var(--ease) var(--d, 0ms);
}

.sv-reveal:not(.is-in) {
  transition-delay: 0ms;
  transition-duration: 0.45s;
}

.sv-up.from-below:not(.is-in) {
  transform: translateY(34px);
}

.sv-up.from-above:not(.is-in) {
  transform: translateY(-34px);
}

.sv-zoom:not(.is-in) {
  transform: scale(0.94) translateY(12px);
}

.sv-sec.from-below:not(.is-in) {
  transform: translateY(40px) scale(0.99);
}

.sv-sec.from-above:not(.is-in) {
  transform: translateY(-30px) scale(0.99);
}

.sv-head:not(.is-in) {
  filter: blur(5px);
}

.sv-reveal.is-in {
  opacity: 1;
  transform: none;
  filter: none;
  will-change: auto;
}

.sv-swap {
  animation: sv-pop-in 0.65s var(--ease) var(--d, 0ms) backwards;
}

@keyframes sv-pop-in {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.97);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

/* Cards, glass and hover effects */
.sv-glass {
  position: relative;
  background: #ffffff;
  border: 1px solid var(--line);
  border-radius: 20px;
  box-shadow: 0 6px 24px rgba(32, 37, 42, 0.06);
}

.sv-lift {
  position: relative;
  transition:
    transform 0.35s var(--ease),
    box-shadow 0.35s var(--ease),
    border-color 0.35s var(--ease);
}

.sv-lift:hover,
.sv-lift:focus-within {
  transform: translateY(-5px);
  box-shadow: 0 16px 38px rgba(32, 37, 42, 0.12);
}

.sv-icon {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  flex: none;
  border-radius: 13px;
  color: var(--gold);
  background: rgba(169, 110, 23, 0.1);
  border: 1px solid rgba(169, 110, 23, 0.2);
  transition: transform 0.4s var(--ease);
}

.sv-lift:hover .sv-icon {
  transform: rotate(-8deg) scale(1.08);
}

/* Buttons */
.sv-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.8rem 1.35rem;
  min-height: 46px;
  border: 1px solid transparent;
  border-radius: 999px;
  font-weight: 650;
  font-size: 0.95rem;
  cursor: pointer;
  overflow: hidden;
  text-align: center;
  transition:
    transform 0.3s var(--ease),
    box-shadow 0.3s var(--ease),
    background 0.3s ease,
    border-color 0.3s ease,
    color 0.3s ease;
}

.sv-btn:hover {
  transform: translateY(-2px);
}

.sv-btn:active {
  transform: translateY(0) scale(0.98);
}

.sv-btn-green {
  color: #ffffff !important;
  background: #2e7d6b;
  border-color: #2e7d6b;
  box-shadow: 0 8px 22px rgba(46, 125, 107, 0.2);
}

.sv-btn-green:hover {
  background: #236355;
  box-shadow: 0 12px 30px rgba(46, 125, 107, 0.28);
}

.sv-btn-glass {
  color: #20252a;
  background: #ffffff;
  border-color: var(--line);
}

.sv-btn-glass:hover {
  color: #2e7d6b;
  border-color: #2e7d6b;
}

.sv-btn-sm {
  padding: 0.6rem 1rem;
  min-height: 42px;
  font-size: 0.88rem;
}

.sv-btn-lg {
  padding: 1rem 2rem;
  font-size: 1.05rem;
}

.sv-btn-off {
  color: var(--muted);
  background: #f1f1ee;
  border-color: var(--line);
  cursor: not-allowed;
}

.sv-btn-off:hover {
  transform: none;
}

.sv-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.sv-actions-center {
  justify-content: center;
}

/* Hero */
.sv-hero-editorial {
  min-height: unset;
  padding: clamp(5rem, 10vw, 7.5rem) 0 clamp(3rem, 6vw, 5rem);
  background: #f0eee8;
}

.sv-hero-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(220px, 0.65fr);
  align-items: center;
  gap: clamp(2rem, 7vw, 5rem);
}

.sv-hero-inner {
  max-width: 720px;
}

.sv-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 1rem;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #764b11;
  background: #ffffff;
  border: 1px solid rgba(169, 110, 23, 0.25);
}

.sv-hero h1 {
  margin-top: 1rem;
  color: #20252a;
  font-size: clamp(2.4rem, 6.5vw, 4.7rem);
}

.sv-lead {
  margin-top: 1rem;
  max-width: 620px;
  color: #4d565d;
  font-size: clamp(1rem, 2.6vw, 1.15rem);
}

.sv-hero .sv-actions {
  margin-top: 1.7rem;
}

.sv-hero-index {
  display: grid;
  border-top: 1px solid var(--line);
}

.sv-hero-index span {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem 0.2rem;
  border-bottom: 1px solid var(--line);
  font-size: 0.98rem;
  color: #4d565d;
}

.sv-hero-index b {
  color: var(--gold);
  font-size: 0.8rem;
  letter-spacing: 0.08em;
}

/* Category pills */
.sv-cats {
  margin: 0;
  padding: 1.4rem 0;
  background: #ffffff;
  border-block: 1px solid var(--line);
}

.sv-cat-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.sv-cat {
  min-height: 46px;
  display: flex;
  align-items: center;
  gap: 0.55rem;
  width: auto;
  padding: 0.65rem 0.95rem;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: #ffffff;
  color: #20252a;
  font-size: 0.92rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.25s ease,
    color 0.25s ease,
    border-color 0.25s ease,
    transform 0.25s var(--ease);
}

.sv-cat:hover {
  transform: translateY(-2px);
  border-color: rgba(46, 125, 107, 0.5);
  color: #2e7d6b;
}

.sv-cat .sv-icon {
  width: 26px;
  height: 26px;
  border: 0;
  background: transparent;
  color: var(--gold);
}

.sv-cat h3 {
  font-family: 'Outfit', sans-serif;
  font-size: 0.95rem;
  font-weight: 650;
}

.sv-cat p,
.sv-cat small {
  display: none;
}

.sv-cat.is-active {
  color: #ffffff;
  background: #2e7d6b;
  border-color: #2e7d6b;
}

.sv-cat.is-active .sv-icon {
  color: #ffffff;
}

/* Catalogue toolbar */
.sv-toolbar {
  display: grid;
  gap: 1rem;
  margin-bottom: 1.8rem;
}

.sv-search {
  position: relative;
  max-width: 560px;
  width: 100%;
  margin: 0 auto;
}

.sv-search > svg {
  position: absolute;
  left: 1rem;
  top: 50%;
  translate: 0 -50%;
  color: var(--muted);
  pointer-events: none;
}

.sv-search input {
  width: 100%;
  min-height: 52px;
  padding: 0.8rem 3rem 0.8rem 2.9rem;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: #ffffff;
  color: var(--text);
  font-size: 1rem;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}

.sv-search input::placeholder {
  color: #8c979f;
}

.sv-search input:focus {
  outline: none;
  border-color: #2e7d6b;
  box-shadow: 0 0 0 4px rgba(46, 125, 107, 0.14);
}

.sv-clear {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  translate: 0 -50%;
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 50%;
  background: #f1f1ee;
  color: #20252a;
  cursor: pointer;
  transition: background 0.25s ease, transform 0.3s var(--ease);
}

.sv-clear:hover {
  background: #e4e4df;
  transform: rotate(90deg);
}

.sv-tabs {
  display: flex;
  gap: 0.5rem;
  padding: 0.25rem;
  overflow-x: auto;
  justify-content: center;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}

.sv-tabs::-webkit-scrollbar {
  display: none;
}

.sv-tab {
  flex: none;
  padding: 0.6rem 1.15rem;
  min-height: 44px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: #ffffff;
  color: #535d64;
  font-weight: 600;
  font-size: 0.92rem;
  cursor: pointer;
  transition:
    color 0.25s ease,
    background 0.25s ease,
    border-color 0.25s ease,
    transform 0.25s var(--ease);
}

.sv-tab:hover {
  color: #2e7d6b;
  border-color: rgba(46, 125, 107, 0.45);
  transform: translateY(-2px);
}

.sv-tab.is-active {
  color: #ffffff;
  background: #2e7d6b;
  border-color: #2e7d6b;
}

.sv-count {
  text-align: center;
  color: var(--muted);
  font-size: 0.92rem;
}

/* Service showcase cards */
.sv-grid {
  display: grid;
  gap: clamp(1rem, 2.4vw, 1.5rem);
}

.sv-services {
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 290px), 1fr));
}

.sv-packages {
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 290px), 1fr));
}

.sv-promos {
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
}

.sv-team {
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr));
}

.sv-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 22px;
  background: #ffffff;
  box-shadow: 0 8px 26px rgba(32, 37, 42, 0.07);
}

.sv-media {
  position: relative;
  aspect-ratio: 16 / 11;
  overflow: hidden;
  background: #efede8;
}

.sv-media img,
.sv-media .sv-fallback {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s var(--ease);
}

.sv-card:hover .sv-media img {
  transform: scale(1.07);
}

.sv-media::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(32, 37, 42, 0) 45%, rgba(32, 37, 42, 0.55) 100%);
  pointer-events: none;
}

.sv-badges {
  position: absolute;
  z-index: 3;
  left: 0.8rem;
  right: 0.8rem;
  top: 0.8rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.sv-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  font-size: 0.76rem;
  font-weight: 650;
  color: #ffffff;
  background: rgba(32, 37, 42, 0.62);
  border: 1px solid rgba(255, 255, 255, 0.22);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.sv-badge-gold {
  color: #3d2704;
  background: #f3c86b;
  border-color: #f3c86b;
}

.sv-badge-ok {
  color: #0e3b2c;
  background: #d7f3e7;
  border-color: #b9e5d4;
}

.sv-badge-off {
  color: #62251d;
  background: #fbe2de;
  border-color: #f2c6bf;
}

.sv-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.15rem;
}

.sv-cat-label {
  color: #875511;
  font-size: 0.73rem;
  font-weight: 750;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.sv-body h3 {
  font-family: 'Outfit', sans-serif;
  font-size: 1.18rem;
  color: #20252a;
}

.sv-body > p {
  color: #5f686f;
  font-size: 0.92rem;
  line-height: 1.55;
}

.sv-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.7rem;
  margin-top: auto;
  padding-top: 0.75rem;
  border-top: 1px solid var(--line);
}

.sv-dur {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: #626b73;
  font-size: 0.85rem;
}

.sv-price {
  color: #875511;
  font-size: 1.05rem;
  font-weight: 750;
  white-space: nowrap;
}

.sv-price s {
  margin-right: 0.45rem;
  color: var(--muted);
  font-size: 0.85rem;
  font-weight: 400;
}

.sv-card-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  padding-top: 0.75rem;
}

.sv-card-actions .sv-btn {
  flex: 1 1 auto;
  min-width: 118px;
}

.sv-include {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.2rem;
}

.sv-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.72rem;
  border: 1px solid var(--line);
  border-radius: 999px;
  font-size: 0.8rem;
  color: #20252a;
  background: #f7f6f2;
  cursor: pointer;
  transition:
    background 0.25s ease,
    border-color 0.25s ease,
    transform 0.25s var(--ease);
}

.sv-chip:hover {
  border-color: #2e7d6b;
  color: #2e7d6b;
  transform: translateY(-2px);
}

.sv-save {
  display: inline-flex;
  padding: 0.28rem 0.7rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
  color: #0e3b2c;
  background: #d7f3e7;
}

.sv-terms {
  margin-top: 0.6rem;
  font-size: 0.85rem;
  color: var(--muted);
}

.sv-terms summary {
  cursor: pointer;
  color: #20252a;
  padding: 0.3rem 0;
}

.sv-terms p {
  margin-top: 0.4rem;
}

.sv-empty {
  max-width: 520px;
  margin: 1rem auto 0;
  padding: clamp(1.6rem, 5vw, 2.4rem);
  text-align: center;
  display: grid;
  justify-items: center;
  gap: 0.8rem;
}

.sv-empty p {
  color: var(--muted);
}

/* Most loved */
.sv-loved {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
  gap: clamp(1rem, 2.4vw, 1.5rem);
}

.sv-feat {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 400px;
  height: 100%;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 22px;
  background: #ffffff;
}

.sv-feat > img,
.sv-feat > .sv-fallback {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.9s var(--ease);
}

.sv-feat:hover > img {
  transform: scale(1.08);
}

.sv-feat::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(0deg, rgba(32, 37, 42, 0.92) 0%, rgba(32, 37, 42, 0.5) 48%, transparent 78%);
}

.sv-feat-body {
  position: relative;
  z-index: 3;
  display: grid;
  gap: 0.5rem;
  padding: 1.3rem;
}

.sv-feat-body h3 {
  color: #ffffff;
  font-size: 1.4rem;
}

.sv-feat-body p {
  color: #e6e9ec;
  font-size: 0.92rem;
}

.sv-feat .sv-badges {
  justify-content: flex-start;
}

/* Portfolio */
.sv-gallery {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.8rem;
}

.sv-shot {
  position: relative;
  padding: 0;
  border: 1px solid var(--line);
  border-radius: 16px;
  overflow: hidden;
  aspect-ratio: 1;
  background: #efede8;
  cursor: zoom-in;
  transition:
    transform 0.4s var(--ease),
    box-shadow 0.4s var(--ease);
}

.sv-shot img,
.sv-shot .sv-fallback {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s var(--ease);
}

.sv-shot:hover {
  transform: translateY(-5px);
  box-shadow: 0 16px 36px rgba(32, 37, 42, 0.14);
}

.sv-shot:hover img {
  transform: scale(1.08);
}

.sv-shot-over {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.5rem;
  text-align: center;
  color: #ffffff;
  background: rgba(32, 37, 42, 0.55);
  opacity: 0;
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
  transition: opacity 0.35s ease;
}

.sv-shot-over em {
  font-style: normal;
  font-size: 0.85rem;
}

.sv-shot:hover .sv-shot-over,
.sv-shot:focus-visible .sv-shot-over {
  opacity: 1;
}

/* Team */
.sv-photo {
  aspect-ratio: 3 / 4;
  overflow: hidden;
  background: #efede8;
}

.sv-photo img,
.sv-photo .sv-fallback {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s var(--ease);
}

.sv-card:hover .sv-photo img {
  transform: scale(1.06);
}

.sv-team .sv-body {
  align-items: flex-start;
}

.sv-team .sv-btn {
  width: 100%;
  margin-top: auto;
}

/* FAQ */
.sv-faq {
  max-width: 820px;
  margin: 0 auto;
  display: grid;
  gap: 0.8rem;
}

.sv-faq-item {
  overflow: hidden;
  border-radius: 16px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.sv-faq-item.is-open {
  border-color: rgba(46, 125, 107, 0.45);
  box-shadow: 0 12px 30px rgba(32, 37, 42, 0.08);
}

.sv-faq-q {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
  padding: 1.05rem 1.25rem;
  min-height: 56px;
  border: 0;
  background: none;
  color: #20252a;
  font-size: 1.02rem;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
}

.sv-faq-q svg {
  flex: none;
  color: var(--gold);
  transition: transform 0.4s var(--ease);
}

.sv-faq-item.is-open .sv-faq-q svg {
  transform: rotate(180deg);
}

.sv-faq-a {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.45s var(--ease);
}

.sv-faq-item.is-open .sv-faq-a {
  grid-template-rows: 1fr;
}

.sv-faq-a > div {
  overflow: hidden;
}

.sv-faq-a p {
  padding: 0 1.25rem 1.15rem;
  color: var(--muted);
}

.sv-faq-more {
  margin-top: 2rem;
  text-align: center;
  display: grid;
  gap: 0.9rem;
  justify-items: center;
  color: var(--muted);
}

/* Final CTA */
.sv-cta {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.9rem;
  padding: clamp(2.4rem, 8vw, 4.5rem) clamp(1.2rem, 5vw, 3rem);
  text-align: center;
  border: 1px solid rgba(46, 125, 107, 0.25);
  border-radius: 28px;
  background: linear-gradient(135deg, rgba(46, 125, 107, 0.1), #ffffff 65%);
  box-shadow: 0 18px 45px rgba(32, 37, 42, 0.08);
}

.sv-cta h2 {
  font-size: clamp(2rem, 6vw, 3.3rem);
  color: #20252a;
}

.sv-cta-sub {
  color: #875511;
  font-size: clamp(1.05rem, 3vw, 1.3rem);
  font-weight: 650;
}

.sv-cta p:not(.sv-cta-sub) {
  max-width: 540px;
  color: #4d565d;
}

.sv-cta .sv-btn {
  margin-top: 0.8rem;
}

/* Modal and lightbox */
.sv-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(20, 26, 31, 0.72);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  animation: sv-fade 0.3s ease;
}

@keyframes sv-fade {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.sv-dialog {
  position: relative;
  width: min(1020px, 100%);
  max-height: calc(100vh - 2rem);
  max-height: calc(100svh - 2rem);
  overflow-y: auto;
  overscroll-behavior: contain;
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  border: 1px solid var(--line);
  border-radius: 24px;
  background: #ffffff;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.35);
  animation: sv-pop 0.45s var(--ease);
}

@keyframes sv-pop {
  from {
    opacity: 0;
    transform: translateY(26px) scale(0.97);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

.sv-d-media {
  padding: 1rem;
  display: grid;
  gap: 0.7rem;
  align-content: start;
}

.sv-d-main {
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 16px;
  background: #efede8;
}

.sv-d-main img,
.sv-d-main .sv-fallback {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sv-thumbs {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.2rem;
  scrollbar-width: thin;
}

.sv-thumb {
  flex: none;
  width: 72px;
  height: 56px;
  padding: 0;
  border: 2px solid transparent;
  border-radius: 10px;
  overflow: hidden;
  background: #efede8;
  cursor: pointer;
  opacity: 0.65;
  transition: opacity 0.25s ease, border-color 0.25s ease, transform 0.25s var(--ease);
}

.sv-thumb img,
.sv-thumb .sv-fallback {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sv-thumb:hover {
  opacity: 1;
  transform: translateY(-2px);
}

.sv-thumb.is-active {
  opacity: 1;
  border-color: #2e7d6b;
}

.sv-d-info {
  display: grid;
  gap: 1rem;
  align-content: start;
  padding: clamp(1.2rem, 3vw, 1.8rem);
}

.sv-d-info h2 {
  font-size: clamp(1.7rem, 4vw, 2.2rem);
  padding-right: 2.6rem;
  color: #20252a;
}

.sv-d-info h4 {
  margin: 0 0 0.5rem;
  font-size: 0.95rem;
  font-weight: 700;
  color: #875511;
}

.sv-d-info p {
  color: #4d565d;
}

.sv-d-facts {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.8rem 1.5rem;
  padding: 0.9rem 1rem;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: #f7f6f2;
}

.sv-d-facts span {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--muted);
}

.sv-ticks {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.45rem;
}

.sv-ticks li {
  display: flex;
  align-items: flex-start;
  gap: 0.55rem;
  color: #4d565d;
}

.sv-ticks svg {
  flex: none;
  margin-top: 4px;
  color: #2e7d6b;
}

.sv-d-actions {
  position: sticky;
  bottom: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
  padding: 0.9rem 0 0.2rem;
  background: linear-gradient(0deg, #ffffff 70%, transparent);
}

.sv-d-actions .sv-btn-green {
  flex: 1 1 200px;
}

.sv-x {
  position: absolute;
  top: 0.8rem;
  right: 0.8rem;
  z-index: 5;
}

.sv-round {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 50%;
  background: rgba(32, 37, 42, 0.7);
  color: #ffffff;
  cursor: pointer;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: transform 0.3s var(--ease), background 0.3s ease;
}

.sv-round:hover {
  background: rgba(46, 125, 107, 0.85);
  transform: scale(1.08);
}

.sv-lb figure {
  margin: 0;
  max-width: min(92vw, 900px);
  animation: sv-pop 0.4s var(--ease);
}

.sv-lb figure img,
.sv-lb figure .sv-fallback {
  max-height: 72vh;
  width: auto;
  min-width: min(80vw, 420px);
  min-height: 260px;
  margin: 0 auto;
  border-radius: 16px;
  object-fit: contain;
}

.sv-lb figcaption {
  display: grid;
  justify-items: center;
  gap: 0.7rem;
  margin-top: 0.9rem;
  color: #e6e9ec;
}

.sv-lb-prev,
.sv-lb-next {
  position: absolute;
  top: 50%;
  translate: 0 -50%;
}

.sv-lb-prev {
  left: clamp(0.4rem, 2vw, 1.5rem);
}

.sv-lb-next {
  right: clamp(0.4rem, 2vw, 1.5rem);
}

/* Floating buttons */
.sv-floaters {
  position: fixed;
  z-index: 90;
  right: clamp(0.8rem, 2vw, 1.6rem);
  bottom: clamp(0.8rem, 2vw, 1.6rem);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.7rem;
}

.sv-fab {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 50%;
  color: #ffffff;
  background: rgba(32, 37, 42, 0.78);
  cursor: pointer;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  transition: transform 0.35s var(--ease), opacity 0.35s ease, box-shadow 0.3s ease;
}

.sv-fab:hover {
  transform: translateY(-4px) scale(1.07);
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.3);
}

.sv-fab-wa {
  background: #1faa59;
  border-color: #1faa59;
}

.sv-fab-top {
  opacity: 0;
  transform: translateY(16px) scale(0.85);
  pointer-events: none;
}

.sv-fab-top.is-on {
  opacity: 1;
  transform: none;
  pointer-events: auto;
}

.sv-fallback {
  background: linear-gradient(135deg, #e8e5de, #f5f3ee 50%, #e8e5de);
  background-size: 200% 200%;
  animation: sv-shimmer 6s ease-in-out infinite;
}

@keyframes sv-shimmer {
  0%, 100% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }
}

/* Responsive */
@media (min-width: 1200px) {
  .sv-wrap {
    width: min(1280px, 100% - 6rem);
  }
}

@media (max-width: 1024px) {
  .sv-gallery {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 820px) {
  .sv-hero-layout {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .sv-hero-index {
    grid-template-columns: 1fr 1fr;
  }

  .sv-dialog {
    grid-template-columns: 1fr;
    border-radius: 20px;
  }

  .sv-d-main {
    aspect-ratio: 16 / 10;
  }
}

@media (max-width: 700px) {
  .sv-services {
    grid-template-columns: 1fr;
  }

  .sv-card-actions .sv-btn {
    flex: 1 1 100%;
  }
}

@media (max-width: 560px) {
  .sv-wrap {
    width: calc(100% - 1.5rem);
  }

  .sv-cat-grid {
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-bottom: 0.35rem;
  }

  .sv-cat {
    flex: none;
  }

  .sv-gallery {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.6rem;
  }

  .sv-actions .sv-btn {
    flex: 1 1 100%;
  }

  .sv-overlay {
    padding: 0.5rem;
  }

  .sv-dialog {
    max-height: calc(100svh - 1rem);
  }

  .sv-feat {
    min-height: 340px;
  }

  .sv-fab {
    width: 46px;
    height: 46px;
  }

  .sv-lb-prev,
  .sv-lb-next {
    top: auto;
    bottom: 1rem;
    translate: 0 0;
  }
}

@media (max-width: 380px) {
  .sv-cat-grid {
    grid-template-columns: 1fr;
  }

  .sv-hero h1 {
    font-size: 2.2rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sv-page *,
  .sv-page *::before,
  .sv-page *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  .sv-reveal,
  .sv-swap {
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
  }
}
`

/* ------------------------------------------------------------------ */
/*  REUSABLE COMPONENTS                                                */
/* ------------------------------------------------------------------ */
function Reveal({ children, delay = 0, variant = 'up', className = '', as: Tag = 'div' }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)
  const [from, setFrom] = useState('below')

  useEffect(() => {
    const el = ref.current

    if (!el || typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true)
          } else {
            setShown(false)
            setFrom(entry.boundingClientRect.top < 0 ? 'above' : 'below')
          }
        })
      },
      {
        threshold: variant === 'sec' ? 0 : 0.14,
        rootMargin: '-5% 0px -5% 0px',
      },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [variant])

  return createElement(
    Tag,
    {
      ref,
      className: `sv-reveal sv-${variant} from-${from} ${shown ? 'is-in' : ''} ${className}`,
      style: { '--d': `${delay}ms` },
    },
    children,
  )
}

function Img({ src, alt, className = '', ...rest }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return <div className={`sv-fallback ${className}`} role="img" aria-label={alt} />
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
      {...rest}
    />
  )
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

    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previous
    }
  }, [on])
}

function BookButton({ service, small = false, className = '' }) {
  const size = small ? 'sv-btn-sm' : ''

  if (service.status !== 'available') {
    return (
      <span className={`sv-btn sv-btn-off ${size} ${className}`} aria-disabled="true">
        Currently unavailable
      </span>
    )
  }

  return (
    <Link
      to={`/book-now?service=${service.id}`}
      className={`sv-btn sv-btn-green ${size} ${className}`}
    >
      Book This Service
      <ArrowRight size={17} />
    </Link>
  )
}

/* ------------------------------------------------------------------ */
/*  HERO                                                               */
/* ------------------------------------------------------------------ */
function Hero() {
  return (
    <section id="top" className="sv-hero sv-hero-editorial">
      <div className="sv-wrap sv-hero-layout">
        <div className="sv-hero-inner">
          <span className="sv-pill">
            <Scissors size={15} />
            Crystal Five service guide
          </span>

          <h1>Find the service that fits you.</h1>

          <p className="sv-lead">
            Compare what is included, the estimated time and the starting price.
            Then choose a stylist, barber or beauty service and book when you are ready.
          </p>

          <div className="sv-actions">
            <a
              href="#catalogue"
              onClick={scrollToId('catalogue')}
              className="sv-btn sv-btn-glass"
            >
              Browse the service list
              <ChevronDown size={18} />
            </a>

            <Link to="/book-now" className="sv-btn sv-btn-green">
              Book an Appointment
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        <div className="sv-hero-index" aria-label="Service categories">
          <span><b>01</b> Hair salon</span>
          <span><b>02</b> Barbering</span>
          <span><b>03</b> Beauty &amp; nails</span>
          <span><b>04</b> Hair care</span>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  CATEGORIES                                                         */
/* ------------------------------------------------------------------ */
function Categories({ active, onPick }) {
  return (
    <section className="sv-cats" aria-label="Explore by category">
      <Reveal variant="sec" className="sv-wrap sv-cat-grid">
        {CATEGORIES.map(({ id, name, icon: Icon }, index) => (
          <button
            key={id}
            type="button"
            className={`sv-cat ${active === id ? 'is-active' : ''}`}
            onClick={() => onPick(id)}
          >
            <span className="sv-icon">
              {createElement(Icon, { size: 18 })}
            </span>

            <h3>{name}</h3>
          </button>
        ))}
      </Reveal>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  SERVICE CATALOGUE                                                  */
/* ------------------------------------------------------------------ */
function Catalogue({ active, setActive, query, setQuery, onOpen }) {
  const list = useMemo(() => {
    const search = query.trim().toLowerCase()

    return SERVICES.filter((service) => service.active)
      .filter((service) => active === 'all' || service.category === active)
      .filter(
        (service) =>
          !search ||
          `${service.name} ${service.text} ${service.description} ${categoryName(service.category)}`
            .toLowerCase()
            .includes(search),
      )
  }, [active, query])

  const reset = () => {
    setActive('all')
    setQuery('')
  }

  return (
    <section id="catalogue" className="sv-section">
      <Reveal variant="sec" className="sv-wrap">
        <SectionHead
          title="Our Service Catalogue"
          text="Browse our services by photo, price and estimated time. Choose a service to see the full details before booking."
        />

        <div className="sv-toolbar">
          <div className="sv-search">
            <Search size={20} />

            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search for a service..."
              aria-label="Search for a service"
              autoComplete="off"
            />

            {query && (
              <button
                type="button"
                className="sv-clear"
                onClick={() => setQuery('')}
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <div className="sv-tabs" role="group" aria-label="Service categories">
            {[{ id: 'all', name: 'All Services' }, ...CATEGORIES].map((category) => (
              <button
                key={category.id}
                type="button"
                className={`sv-tab ${active === category.id ? 'is-active' : ''}`}
                aria-pressed={active === category.id}
                onClick={() => setActive(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>

          <p className="sv-count" aria-live="polite">
            Showing {list.length} {list.length === 1 ? 'service' : 'services'}
          </p>
        </div>

        {list.length > 0 ? (
          <div className="sv-grid sv-services" key={`${active}-${query}`}>
            {list.map((service, index) => (
              <article
                key={service.id}
                className="sv-card sv-lift sv-swap"
                style={{ '--d': `${Math.min(index, 8) * 65}ms` }}
                {...tilt}
              >
                <div className="sv-media">
                  <Img src={service.image} alt={service.name} />

                  <div className="sv-badges">
                    {service.featured ? (
                      <span className="sv-badge sv-badge-gold">
                        <Star size={12} />
                        Featured
                      </span>
                    ) : (
                      <span />
                    )}

                    <span
                      className={`sv-badge ${
                        service.status === 'available' ? 'sv-badge-ok' : 'sv-badge-off'
                      }`}
                    >
                      {service.status === 'available' ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </div>

                <div className="sv-body">
                  <span className="sv-cat-label">{categoryName(service.category)}</span>

                  <h3>{service.name}</h3>

                  <p>{service.text}</p>

                  <div className="sv-meta">
                    <span className="sv-dur">
                      <Clock size={15} />
                      {formatDuration(service.durationMin, service.durationText)}
                    </span>

                    <span className="sv-price">
                      {formatPrice(service.price, service.pricePrefix)}
                    </span>
                  </div>

                  <div className="sv-card-actions">
                    <BookButton service={service} small />

                    <button
                      type="button"
                      className="sv-btn sv-btn-glass sv-btn-sm"
                      onClick={() => onOpen(service.id)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="sv-glass sv-empty">
            <span className="sv-icon">
              <Search size={22} />
            </span>

            <h3>No services match your search</h3>

            <p>Try a different word or clear the filters to see every service.</p>

            <button type="button" className="sv-btn sv-btn-green" onClick={reset}>
              Show All Services
            </button>
          </div>
        )}
      </Reveal>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  SERVICE DETAILS                                                    */
/* ------------------------------------------------------------------ */
function ServiceModal({ service, onClose, onOpen }) {
  const closeRef = useRef(null)
  const [imageIndex, setImageIndex] = useState(0)
  const [copied, setCopied] = useState(false)

  useScrollLock(true)

  const images = useMemo(() => {
    const extra = PORTFOLIO.filter((item) => item.serviceId === service.id).map(
      (item) => item.src,
    )

    return [...new Set([service.image, ...service.gallery, ...extra])]
  }, [service])

  const staff = staffFor(service.id)

  const related = SERVICES.filter(
    (item) =>
      item.active &&
      item.category === service.category &&
      item.id !== service.id,
  ).slice(0, 3)

  useEffect(() => {
    closeRef.current?.focus()

    const handleKey = (event) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const copyLink = async () => {
    const url = `${window.location.origin}${window.location.pathname}?service=${service.id}`

    try {
      await navigator.clipboard.writeText(url)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = url
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }

    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  return (
    <div
      className="sv-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={service.name}
      onClick={onClose}
    >
      <div className="sv-dialog" onClick={(event) => event.stopPropagation()}>
        <button
          ref={closeRef}
          type="button"
          className="sv-round sv-x"
          onClick={onClose}
          aria-label="Close details"
        >
          <X size={20} />
        </button>

        <div className="sv-d-media">
          <div className="sv-d-main">
            <Img
              key={images[imageIndex]}
              src={images[imageIndex]}
              alt={service.name}
            />
          </div>

          {images.length > 1 && (
            <div className="sv-thumbs">
              {images.map((src, index) => (
                <button
                  key={src}
                  type="button"
                  className={`sv-thumb ${index === imageIndex ? 'is-active' : ''}`}
                  onClick={() => setImageIndex(index)}
                  aria-label={`Show photo ${index + 1}`}
                >
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
            <span>
              <Clock size={17} />
              {formatDuration(service.durationMin, service.durationText)}
            </span>

            <span className="sv-price">
              {formatPrice(service.price, service.pricePrefix)}
            </span>

            <span
              className={
                service.status === 'available' ? 'sv-badge-ok' : 'sv-badge-off'
              }
            >
              {service.status === 'available' ? 'Available' : 'Currently unavailable'}
            </span>
          </div>

          <p>{service.description}</p>

          <div>
            <h4>What is included</h4>

            <ul className="sv-ticks">
              {service.includes.map((item) => (
                <li key={item}>
                  <Check size={16} />
                  {item}
                </li>
              ))}
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
                {staff.map((person) => (
                  <span
                    key={person.id}
                    className="sv-chip"
                    style={{ cursor: 'default' }}
                  >
                    {person.role}
                  </span>
                ))}
              </div>
            </div>
          )}

          {related.length > 0 && (
            <div>
              <h4>Related services</h4>

              <div className="sv-include">
                {related.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="sv-chip"
                    onClick={() => {
                      setImageIndex(0)
                      onOpen(item.id)
                    }}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="sv-d-actions">
            <BookButton service={service} />

            <button type="button" className="sv-btn sv-btn-glass" onClick={copyLink}>
              {copied ? (
                <>
                  <Check size={17} />
                  Link copied
                </>
              ) : (
                <>
                  <Copy size={17} />
                  Share
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  PACKAGES                                                           */
/* ------------------------------------------------------------------ */
function Packages({ onOpen }) {
  const list = PACKAGES.filter((item) => item.active)

  if (!list.length) return null

  return (
    <section id="packages" className="sv-section sv-alt">
      <Reveal variant="sec" className="sv-wrap">
        <SectionHead
          title="Service Packages"
          text="Combine services into one booking and make the most of your visit."
        />

        <div className="sv-grid sv-packages">
          {list.map((item, index) => {
            const { items, minutes, total, saving } = packageFigures(item)
            const available = items.every((service) => service.status === 'available')

            return (
              <Reveal
                key={item.id}
                delay={(index % 4) * 90}
                className="sv-cell"
              >
                <article className="sv-card sv-lift" {...tilt}>
                  <div className="sv-media">
                    <Img src={item.image} alt={item.name} />

                    <div className="sv-badges">
                      <span className="sv-badge">
                        <Clock size={12} />
                        {formatDuration(minutes)}
                      </span>

                      {saving != null && (
                        <span className="sv-save">
                          Save {formatPrice(saving)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="sv-body">
                    <h3>{item.name}</h3>
                    <p>{item.text}</p>

                    <div className="sv-include" aria-label="Included services">
                      {items.map((service) => (
                        <button
                          key={service.id}
                          type="button"
                          className="sv-chip"
                          onClick={() => onOpen(service.id)}
                        >
                          {service.name}
                        </button>
                      ))}
                    </div>

                    <div className="sv-meta">
                      <span className="sv-price">
                        {total != null && item.price != null && (
                          <s>{formatPrice(total)}</s>
                        )}
                        {formatPrice(item.price)}
                      </span>
                    </div>

                    <div className="sv-card-actions">
                      {available ? (
                        <Link
                          to={`/book-now?package=${item.id}`}
                          className="sv-btn sv-btn-green sv-btn-sm"
                        >
                          Book This Package
                          <ArrowRight size={17} />
                        </Link>
                      ) : (
                        <span className="sv-btn sv-btn-off sv-btn-sm" aria-disabled="true">
                          Currently unavailable
                        </span>
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

/* ------------------------------------------------------------------ */
/*  MOST LOVED SERVICES                                                */
/* ------------------------------------------------------------------ */
function Loved({ onOpen }) {
  const list = SERVICES.filter((service) => service.active && service.featured)

  if (!list.length) return null

  return (
    <section id="loved" className="sv-section">
      <Reveal variant="sec" className="sv-wrap">
        <SectionHead
          title="Our Most Loved Services"
          text="Hand-picked services we are proud of."
        />

        <div className="sv-loved">
          {list.map((service, index) => (
            <Reveal
              key={service.id}
              delay={(index % 4) * 90}
              variant="zoom"
              className="sv-cell"
            >
              <article className="sv-feat sv-lift" {...tilt}>
                <Img src={service.image} alt={service.name} />

                <div className="sv-badges">
                  <span className="sv-badge sv-badge-gold">
                    <Star size={12} />
                    Featured
                  </span>
                </div>

                <div className="sv-feat-body">
                  <span className="sv-cat-label">
                    {categoryName(service.category)}
                  </span>

                  <h3>{service.name}</h3>
                  <p>{service.text}</p>

                  <div className="sv-meta">
                    <span className="sv-dur">
                      <Clock size={15} />
                      {formatDuration(service.durationMin, service.durationText)}
                    </span>

                    <span className="sv-price">
                      {formatPrice(service.price, service.pricePrefix)}
                    </span>
                  </div>

                  <div className="sv-card-actions">
                    <BookButton service={service} small />

                    <button
                      type="button"
                      className="sv-btn sv-btn-glass sv-btn-sm"
                      onClick={() => onOpen(service.id)}
                    >
                      View Details
                    </button>
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

/* ------------------------------------------------------------------ */
/*  PROMOTIONS                                                         */
/* ------------------------------------------------------------------ */
function Promotions() {
  const live = PROMOTIONS.filter((item) => isLive(item))

  if (!live.length) return null

  return (
    <section id="offers" className="sv-section sv-alt">
      <Reveal variant="sec" className="sv-wrap">
        <SectionHead
          title="Special Offers"
          text="Current offers you can book right now."
        />

        <div className="sv-grid sv-promos">
          {live.map((item, index) => (
            <Reveal key={item.id} delay={index * 110} className="sv-cell">
              <article className="sv-card sv-lift" {...tilt}>
                <div className="sv-media">
                  <Img src={item.image} alt={item.title} />

                  <div className="sv-badges">
                    <span className="sv-badge sv-badge-gold">
                      <Tag size={12} />
                      Until{' '}
                      {new Date(item.endsAt).toLocaleDateString('en-KE', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                <div className="sv-body">
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>

                  <div className="sv-meta">
                    <span className="sv-price">
                      {item.oldPrice != null && <s>{formatPrice(item.oldPrice)}</s>}
                      {formatPrice(item.price)}
                    </span>

                    <Link
                      to={`/book-now?offer=${item.id}`}
                      className="sv-btn sv-btn-green sv-btn-sm"
                    >
                      Book Now
                    </Link>
                  </div>

                  <details className="sv-terms">
                    <summary>Terms and conditions</summary>
                    <p>{item.terms}</p>
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

/* ------------------------------------------------------------------ */
/*  PORTFOLIO                                                          */
/* ------------------------------------------------------------------ */
function Portfolio({ onOpen }) {
  const [filter, setFilter] = useState('all')
  const [open, setOpen] = useState(null)
  const touchStartX = useRef(null)

  const items = useMemo(
    () =>
      PORTFOLIO.filter((item) => {
        const service = serviceById(item.serviceId)

        return (
          service &&
          service.active &&
          (filter === 'all' || service.category === filter)
        )
      }),
    [filter],
  )

  const step = useCallback(
    (direction) => {
      setOpen((current) => {
        if (current == null) return current

        const index = items.findIndex((item) => item.id === current)

        if (index < 0) return null

        return items[(index + direction + items.length) % items.length].id
      })
    },
    [items],
  )

  useScrollLock(open != null)

  useEffect(() => {
    if (open == null) return undefined

    const handleKey = (event) => {
      if (event.key === 'Escape') setOpen(null)
      if (event.key === 'ArrowRight') step(1)
      if (event.key === 'ArrowLeft') step(-1)
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, step])

  const current = PORTFOLIO.find((item) => item.id === open)
  const currentService = current ? serviceById(current.serviceId) : null

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX
  }

  const handleTouchEnd = (event) => {
    if (touchStartX.current == null) return

    const difference =
      event.changedTouches[0].clientX - touchStartX.current

    if (Math.abs(difference) > 50) {
      step(difference < 0 ? 1 : -1)
    }

    touchStartX.current = null
  }

  return (
    <section id="work" className="sv-section">
      <Reveal variant="sec" className="sv-wrap">
        <SectionHead
          title="Our Work"
          text="Real results from the services above. Tap a photo to enlarge it."
        />

        <Reveal className="sv-tabs">
          {[{ id: 'all', name: 'All Work' }, ...CATEGORIES].map((category) => (
            <button
              key={category.id}
              type="button"
              className={`sv-tab ${filter === category.id ? 'is-active' : ''}`}
              aria-pressed={filter === category.id}
              onClick={() => setFilter(category.id)}
            >
              {category.name}
            </button>
          ))}
        </Reveal>

        <div
          className="sv-gallery"
          key={filter}
          style={{ marginTop: '1.6rem' }}
        >
          {items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className="sv-shot sv-swap"
              style={{ '--d': `${Math.min(index, 8) * 55}ms` }}
              onClick={() => setOpen(item.id)}
              aria-label={`Enlarge: ${item.alt}`}
            >
              <Img src={item.src} alt={item.alt} />

              <span className="sv-shot-over">
                <ZoomIn size={22} />
                <em>{serviceById(item.serviceId)?.name}</em>
              </span>
            </button>
          ))}
        </div>

        {items.length === 0 && (
          <div className="sv-glass sv-empty">
            <p>Photos for this category are coming soon.</p>
          </div>
        )}
      </Reveal>

      {current && currentService && (
        <div
          className="sv-overlay sv-lb"
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
          onClick={() => setOpen(null)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button
            type="button"
            className="sv-round sv-x"
            onClick={() => setOpen(null)}
            aria-label="Close"
          >
            <X size={20} />
          </button>

          <button
            type="button"
            className="sv-round sv-lb-prev"
            onClick={(event) => {
              event.stopPropagation()
              step(-1)
            }}
            aria-label="Previous photo"
          >
            <ChevronLeft size={22} />
          </button>

          <figure
            key={current.id}
            onClick={(event) => event.stopPropagation()}
          >
            <Img src={current.src} alt={current.alt} />

            <figcaption>
              <span>{currentService.name}</span>

              <div className="sv-actions sv-actions-center">
                <BookButton service={currentService} small />

                <button
                  type="button"
                  className="sv-btn sv-btn-glass sv-btn-sm"
                  onClick={() => {
                    setOpen(null)
                    onOpen(currentService.id)
                  }}
                >
                  View Details
                </button>
              </div>
            </figcaption>
          </figure>

          <button
            type="button"
            className="sv-round sv-lb-next"
            onClick={(event) => {
              event.stopPropagation()
              step(1)
            }}
            aria-label="Next photo"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      )}
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  PROFESSIONALS                                                      */
/* ------------------------------------------------------------------ */
function Professionals({ onOpen }) {
  return (
    <section id="team" className="sv-section sv-alt">
      <Reveal variant="sec" className="sv-wrap">
        <SectionHead
          title="Meet the Professionals"
          text="The people behind the services. Choose who looks after you."
        />

        <div className="sv-grid sv-team">
          {STAFF.map((person, index) => (
            <Reveal
              key={person.id}
              delay={index * 100}
              variant="zoom"
              className="sv-cell"
            >
              <article className="sv-card sv-lift" {...tilt}>
                <div className="sv-photo">
                  <Img src={person.image} alt={person.role} />
                </div>

                <div className="sv-body">
                  <h3>{person.role}</h3>
                  <p>{person.speciality}</p>

                  <div className="sv-include">
                    {person.serviceIds
                      .map(serviceById)
                      .filter((service) => service && service.active)
                      .map((service) => (
                        <button
                          key={service.id}
                          type="button"
                          className="sv-chip"
                          onClick={() => onOpen(service.id)}
                        >
                          {service.name}
                        </button>
                      ))}
                  </div>

                  <Link
                    to={`/book-now?staff=${person.id}`}
                    className="sv-btn sv-btn-green sv-btn-sm"
                  >
                    Book with this professional
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Reveal>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  FAQ                                                                */
/* ------------------------------------------------------------------ */
function Faq() {
  const [open, setOpen] = useState(0)

  return (
    <section id="faq" className="sv-section">
      <Reveal variant="sec" className="sv-wrap">
        <SectionHead
          title="Frequently Asked Questions"
          text="Quick answers before you book."
        />

        <div className="sv-faq">
          {FAQS.map((item, index) => {
            const isOpen = open === index

            return (
              <Reveal key={item.q} delay={(index % 4) * 65}>
                <div className={`sv-glass sv-faq-item ${isOpen ? 'is-open' : ''}`}>
                  <button
                    type="button"
                    className="sv-faq-q"
                    aria-expanded={isOpen}
                    aria-controls={`faq-${index}`}
                    id={`faq-q-${index}`}
                    onClick={() => setOpen(isOpen ? -1 : index)}
                  >
                    <span>{item.q}</span>
                    <ChevronDown size={22} />
                  </button>

                  <div
                    className="sv-faq-a"
                    id={`faq-${index}`}
                    role="region"
                    aria-labelledby={`faq-q-${index}`}
                  >
                    <div>
                      <p>{item.a}</p>
                    </div>
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
              {BUSINESS.whatsapp && (
                <a
                  className="sv-btn sv-btn-glass"
                  href={`https://wa.me/${BUSINESS.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle size={18} />
                  WhatsApp
                </a>
              )}

              {BUSINESS.phone && (
                <a className="sv-btn sv-btn-glass" href={`tel:${BUSINESS.phone}`}>
                  <Phone size={18} />
                  Call Us
                </a>
              )}
            </div>
          </Reveal>
        )}
      </Reveal>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  FINAL CALL TO ACTION                                               */
/* ------------------------------------------------------------------ */
function FinalCta() {
  return (
    <section className="sv-section">
      <Reveal variant="sec" className="sv-wrap">
        <Reveal variant="zoom">
          <div className="sv-cta">
            <h2>Found Your Perfect Service?</h2>

            <p className="sv-cta-sub">Your next great look starts here.</p>

            <p>
              Choose your service, select your preferred professional and reserve
              your appointment with Crystal Five.
            </p>

            <Link
              to="/book-now"
              className="sv-btn sv-btn-green sv-btn-lg"
            >
              Book Your Appointment
              <ArrowRight size={20} />
            </Link>
          </div>
        </Reveal>
      </Reveal>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  FLOATING BUTTONS                                                   */
/* ------------------------------------------------------------------ */
function Floaters() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 700)

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="sv-floaters">
      {BUSINESS.whatsapp && (
        <a
          className="sv-fab sv-fab-wa"
          href={`https://wa.me/${BUSINESS.whatsapp}`}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle size={24} />
        </a>
      )}

      <button
        type="button"
        className={`sv-fab sv-fab-top ${visible ? 'is-on' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
        tabIndex={visible ? 0 : -1}
      >
        <ArrowUp size={22} />
      </button>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */
function Services() {
  const [params, setParams] = useSearchParams()
  const startCategory = CATEGORIES.some(
    (category) => category.id === params.get('category'),
  )
    ? params.get('category')
    : 'all'

  const [active, setActive] = useState(startCategory)
  const [query, setQuery] = useState('')

  const openId = params.get('service')
  const current = SERVICES.find(
    (service) => service.id === openId && service.active,
  )

  const openService = useCallback(
    (id) => {
      const next = new URLSearchParams(params)
      next.set('service', id)
      setParams(next)
    },
    [params, setParams],
  )

  const closeService = useCallback(() => {
    const next = new URLSearchParams(params)
    next.delete('service')
    setParams(next, { replace: true })
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

      <Catalogue
        active={active}
        setActive={setActive}
        query={query}
        setQuery={setQuery}
        onOpen={openService}
      />

      <Packages onOpen={openService} />
      <Promotions />
      <Portfolio onOpen={openService} />
      <Professionals onOpen={openService} />
      <Faq />
      <FinalCta />
      <Floaters />

      {current && (
        <ServiceModal
          key={current.id}
          service={current}
          onClose={closeService}
          onOpen={openService}
        />
      )}
    </div>
  )
}

export default Services