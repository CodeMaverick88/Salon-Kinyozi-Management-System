import { createElement, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck,
  Check,
  Clock,
  CreditCard,
  MapPin,
  Scissors,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
  Wallet,
} from 'lucide-react'

/*
  Frontend booking catalogue only. Replace these local records with the public
  business/service/staff APIs when the backend is ready. Never trust the
  browser's displayed price, duration, availability, or selected staff on submit.
*/
const bookingServices = [
  { id: 'braids', name: 'Braids', category: 'Hair Salon', detail: 'Neat, long-lasting braids in the style you choose.', duration: 240, image: 'public/Braids.jpg' },
  { id: 'hair-styling', name: 'Hair Styling', category: 'Hair Salon', detail: 'Styling for everyday looks and special occasions.', duration: 60, image: 'public/Hair Styling.jpg' },
  { id: 'blow-dry', name: 'Blow-Dry', category: 'Hair Salon', detail: 'A smooth, polished finish after your wash.', duration: 45, image: 'public/Blow Drying.jpg' },
  { id: 'mens-haircut', name: "Men's Haircut", category: 'Kinyozi', detail: 'A clean cut shaped around your face and style.', duration: 30, image: 'public/Men Shave.jpg' },
  { id: 'fade', name: 'Fade', category: 'Kinyozi', detail: 'Sharp, precise fades blended from skin to length.', duration: 40, image: 'public/Fade Haircut.jpg' },
  { id: 'shave', name: 'Shave', category: 'Kinyozi', detail: 'A close, comfortable shave with a fresh finish.', duration: 25, image: 'public/Men Haircut.jpg' },
  { id: 'beard-trim', name: 'Beard Trim', category: 'Kinyozi', detail: 'Shaped and lined beards that stay tidy.', duration: 20, image: 'public/Beard Trim.jpg' },
  { id: 'makeup', name: 'Makeup', category: 'Beauty & Nails', detail: 'Makeup for events, photos and everyday confidence.', duration: 60, image: 'public/Makeup.jpg' },
  { id: 'nails', name: 'Nails', category: 'Beauty & Nails', detail: 'Nail shaping, colour and finishing.', duration: 60, image: 'public/Nails.jpg' },
  { id: 'manicure', name: 'Manicure & Pedicure', category: 'Beauty & Nails', detail: 'Hand and foot care that leaves you refreshed.', duration: 90, image: 'public/Nails Manicure.jpg' },
  { id: 'hair-wash', name: 'Wash & Condition', category: 'Hair Care', detail: 'A gentle wash with conditioning for soft hair.', duration: 30, image: 'public/Hair Wash.jpg' },
  { id: 'hair-treatment', name: 'Hair Treatment', category: 'Hair Care', detail: 'Treatments that restore strength and shine.', duration: 45, image: 'public/Hair Treatment.jpg' },
]

const professionals = [
  { id: 'hairstylist', title: 'Senior Hairstylist', speciality: 'Braids, styling and hair treatments', image: 'public/Senior HairStylist.jpg', serviceIds: ['braids', 'hair-styling', 'blow-dry', 'hair-wash', 'hair-treatment'] },
  { id: 'barber', title: 'Professional Barber', speciality: 'Fades, haircuts and beard grooming', image: 'public/HairStylist 2.jpg', serviceIds: ['mens-haircut', 'fade', 'shave', 'beard-trim'] },
  { id: 'nail-tech', title: 'Nail Technician', speciality: 'Manicures, pedicures and nail care', image: 'public/Nail Trchnician.jpg', serviceIds: ['nails', 'manicure'] },
  { id: 'beauty-therapist', title: 'Beauty Therapist', speciality: 'Makeup and beauty services', image: 'public/Beauty Therapist.jpg', serviceIds: ['makeup'] },
]

const previewTimes = ['9:00 AM', '10:00 AM', '11:30 AM', '1:00 PM', '2:30 PM', '4:00 PM']
const stepNames = ['Service', 'Professional', 'Time', 'Your details', 'Review']
const categories = ['All services', 'Hair Salon', 'Kinyozi', 'Hair Care', 'Beauty & Nails']
const paymentOptions = [
  { id: 'mpesa', label: 'M-Pesa', note: 'Payment flow to be connected', icon: Wallet },
  { id: 'card', label: 'Card', note: 'Payment provider to be connected', icon: CreditCard },
  { id: 'pay-at-salon', label: 'Pay at Crystal Five', note: 'Availability to be configured', icon: MapPin },
]

const bookNowStyles = `
  .booking-page { --book-ink:#171717; --book-ivory:#FAF8F3; --book-green:#176B55; --book-gold:#D6A84F; --book-muted:#c5c0b5; --book-line:rgba(250,248,243,.13); --book-glass:rgba(250,248,243,.05); color:var(--book-ivory); background:var(--book-ink); font-family:inherit; overflow:clip; min-height:100vh; }
  .booking-page *, .booking-page *::before, .booking-page *::after { box-sizing:border-box; }
  .booking-page a { color:inherit; text-decoration:none; }
  .booking-page button, .booking-page input, .booking-page select, .booking-page textarea { font:inherit; }
  .booking-wrap { width:min(1180px,calc(100% - 40px)); margin-inline:auto; }
  .booking-hero { position:relative; isolation:isolate; overflow:hidden; padding:clamp(54px,8vw,90px) 0 44px; background:#191917; }
  .booking-hero::before { content:''; position:absolute; z-index:-2; inset:0; background:linear-gradient(90deg,rgba(18,18,17,.96),rgba(18,18,17,.78) 54%,rgba(18,18,17,.5)),url('public/Hair plaiting 1.jpg') center 42%/cover; animation:book-hero-in .85s cubic-bezier(.2,.8,.2,1) both; }
  .booking-hero::after { content:''; position:absolute; z-index:-1; inset:auto 0 0; height:100px; background:linear-gradient(transparent,var(--book-ink)); }
  @keyframes book-hero-in { from { opacity:.55; transform:scale(1.04); } to { opacity:1; transform:scale(1); } }
  .booking-hero-copy { max-width:760px; animation:book-rise .7s cubic-bezier(.2,.8,.2,1) .1s both; }
  @keyframes book-rise { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
  .booking-kicker { display:inline-flex; align-items:center; gap:9px; color:var(--book-gold); text-transform:uppercase; letter-spacing:.15em; font-size:.73rem; font-weight:750; }
  .booking-kicker::before { content:''; width:23px; height:1px; background:currentColor; }
  .booking-hero h1 { margin:16px 0 0; font:500 clamp(2.8rem,7vw,5.5rem)/.98 Georgia,'Times New Roman',serif; letter-spacing:-.05em; }
  .booking-hero h1 em { color:var(--book-gold); font-weight:500; }
  .booking-hero p { max-width:650px; margin:20px 0 0; color:rgba(250,248,243,.82); line-height:1.8; font-size:clamp(1rem,2vw,1.13rem); }
  .booking-trust { display:flex; flex-wrap:wrap; gap:10px 22px; margin-top:26px; }
  .booking-trust span { display:inline-flex; align-items:center; gap:8px; color:rgba(250,248,243,.83); font-size:.88rem; }
  .booking-trust svg { color:var(--book-gold); }
  .booking-notice { display:flex; align-items:flex-start; gap:12px; margin:26px auto 0; padding:14px 16px; border:1px solid rgba(214,168,79,.34); border-radius:16px; color:var(--book-ivory); background:rgba(214,168,79,.075); line-height:1.6; font-size:.9rem; }
  .booking-notice svg { flex:0 0 auto; color:var(--book-gold); margin-top:2px; }
  .booking-main { padding:26px 0 90px; }
  .booking-progress { display:grid; grid-template-columns:repeat(5,minmax(0,1fr)); gap:8px; margin:0 0 25px; }
  .booking-progress-step { position:relative; display:flex; align-items:center; gap:10px; min-width:0; padding:12px 10px; border:1px solid var(--book-line); border-radius:15px; color:#a6a198; background:rgba(250,248,243,.025); transition:border-color .25s ease,background .25s ease,color .25s ease,transform .25s ease; }
  .booking-progress-step.is-current { color:var(--book-ivory); border-color:rgba(214,168,79,.55); background:rgba(214,168,79,.09); box-shadow:0 0 22px rgba(214,168,79,.06); }
  .booking-progress-step.is-complete { color:var(--book-ivory); border-color:rgba(23,107,85,.66); background:rgba(23,107,85,.12); }
  .booking-step-number { display:grid; place-items:center; width:29px; height:29px; flex:0 0 29px; border:1px solid currentColor; border-radius:50%; font-size:.78rem; font-weight:750; }
  .booking-step-name { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-size:.79rem; font-weight:650; }
  .booking-layout { display:grid; grid-template-columns:minmax(0,1fr) 310px; gap:22px; align-items:start; }
  .booking-panel { min-width:0; padding:clamp(20px,3vw,32px); border:1px solid var(--book-line); border-radius:24px; background:linear-gradient(145deg,rgba(250,248,243,.055),rgba(250,248,243,.025)); box-shadow:0 18px 55px rgba(0,0,0,.2),inset 0 1px 0 rgba(255,255,255,.03); animation:book-rise .42s cubic-bezier(.2,.8,.2,1) both; }
  .booking-panel h2 { margin:0; font:500 clamp(1.55rem,3vw,2.15rem)/1.15 Georgia,'Times New Roman',serif; letter-spacing:-.02em; }
  .booking-panel-intro { margin:9px 0 22px; color:var(--book-muted); line-height:1.7; font-size:.93rem; }
  .booking-service-tools { display:flex; flex-wrap:wrap; gap:10px; margin-bottom:16px; }
  .booking-search { position:relative; flex:1 1 220px; }
  .booking-search svg { position:absolute; left:13px; top:50%; transform:translateY(-50%); color:var(--book-muted); }
  .booking-search input { width:100%; min-height:43px; padding:10px 13px 10px 39px; border:1px solid var(--book-line); border-radius:12px; color:var(--book-ivory); background:rgba(0,0,0,.2); outline:none; }
  .booking-search input:focus { border-color:var(--book-gold); box-shadow:0 0 0 3px rgba(214,168,79,.12); }
  .booking-filter { min-height:43px; padding:9px 12px; border:1px solid var(--book-line); border-radius:12px; color:var(--book-ivory); background:#20201e; outline:none; }
  .booking-service-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; }
  .booking-service-card { display:grid; grid-template-columns:96px minmax(0,1fr); gap:14px; position:relative; overflow:hidden; padding:10px; border:1px solid var(--book-line); border-radius:17px; background:rgba(250,248,243,.025); transition:transform .25s ease,border-color .25s ease,background .25s ease,box-shadow .25s ease; }
  .booking-service-card:hover { transform:translateY(-3px); border-color:rgba(214,168,79,.48); background:rgba(250,248,243,.045); box-shadow:0 12px 26px rgba(0,0,0,.22); }
  .booking-service-card.is-selected { border-color:var(--book-gold); background:rgba(214,168,79,.075); box-shadow:0 0 0 1px rgba(214,168,79,.12),0 12px 26px rgba(0,0,0,.18); }
  .booking-service-card img { width:96px; height:112px; border-radius:12px; object-fit:cover; background:#292925; }
  .booking-service-info { min-width:0; padding:3px 2px 32px 0; }
  .booking-category { color:var(--book-gold); font-size:.7rem; text-transform:uppercase; letter-spacing:.1em; font-weight:750; }
  .booking-service-info h3 { margin:6px 0 0; font-size:.98rem; line-height:1.3; }
  .booking-service-info p { margin:6px 0 0; color:var(--book-muted); font-size:.8rem; line-height:1.5; }
  .booking-service-meta { display:flex; align-items:center; gap:10px; margin-top:9px; color:#d3cec2; font-size:.77rem; }
  .booking-service-meta span { display:inline-flex; align-items:center; gap:5px; }
  .booking-service-meta svg { color:var(--book-gold); }
  .booking-select-service { position:absolute; right:10px; bottom:10px; display:inline-flex; align-items:center; gap:5px; padding:6px 10px; border:1px solid rgba(214,168,79,.34); border-radius:999px; color:var(--book-gold); background:rgba(23,23,23,.75); font-size:.75rem; font-weight:700; cursor:pointer; }
  .booking-select-service:hover { background:rgba(214,168,79,.14); }
  .booking-empty { grid-column:1/-1; padding:26px; color:var(--book-muted); text-align:center; border:1px dashed var(--book-line); border-radius:15px; }
  .booking-helper { display:flex; gap:9px; align-items:flex-start; margin-top:16px; color:var(--book-muted); font-size:.83rem; line-height:1.55; }
  .booking-helper svg { flex:0 0 auto; color:var(--book-gold); }
  .booking-choice-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; }
  .booking-choice-card { display:flex; align-items:center; gap:13px; width:100%; min-height:84px; padding:13px; border:1px solid var(--book-line); border-radius:16px; color:var(--book-ivory); text-align:left; background:rgba(250,248,243,.025); cursor:pointer; transition:transform .23s ease,border-color .23s ease,background .23s ease; }
  .booking-choice-card:hover { transform:translateY(-3px); border-color:rgba(214,168,79,.45); }
  .booking-choice-card.is-selected { border-color:var(--book-gold); background:rgba(214,168,79,.08); }
  .booking-choice-card img { width:58px; height:58px; flex:0 0 58px; border-radius:13px; object-fit:cover; }
  .booking-choice-icon { display:grid; place-items:center; width:45px; height:45px; flex:0 0 45px; border-radius:14px; color:var(--book-gold); background:rgba(214,168,79,.1); }
  .booking-choice-copy { min-width:0; }
  .booking-choice-copy strong { display:block; font-size:.92rem; }
  .booking-choice-copy small { display:block; margin-top:4px; color:var(--book-muted); font-size:.79rem; line-height:1.45; }
  .booking-time-options { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:9px; margin-top:17px; }
  .booking-time-option { min-height:44px; border:1px solid var(--book-line); border-radius:12px; color:var(--book-ivory); background:rgba(250,248,243,.025); cursor:pointer; transition:all .2s ease; }
  .booking-time-option:hover { border-color:rgba(214,168,79,.5); transform:translateY(-2px); }
  .booking-time-option.is-selected { border-color:var(--book-gold); color:var(--book-gold); background:rgba(214,168,79,.1); }
  .booking-date-strip { display:flex; gap:9px; overflow-x:auto; padding:2px 2px 8px; scrollbar-width:thin; }
  .booking-date-option { display:grid; place-items:center; gap:3px; min-width:75px; min-height:82px; padding:10px; border:1px solid var(--book-line); border-radius:15px; color:var(--book-ivory); background:rgba(250,248,243,.025); cursor:pointer; transition:transform .22s ease,border-color .22s ease,background .22s ease; }
  .booking-date-option:hover { transform:translateY(-2px); border-color:rgba(214,168,79,.45); }
  .booking-date-option.is-selected { border-color:var(--book-gold); background:rgba(214,168,79,.1); }
  .booking-date-option small { color:var(--book-muted); font-size:.72rem; }
  .booking-date-option strong { font-size:1.1rem; }
  .booking-date-option span { color:var(--book-gold); font-size:.69rem; }
  .booking-details-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:15px; }
  .booking-field { display:grid; gap:7px; }
  .booking-field-full { grid-column:1/-1; }
  .booking-field label { font-size:.88rem; font-weight:650; }
  .booking-field input,.booking-field textarea { width:100%; min-height:46px; padding:11px 13px; border:1px solid var(--book-line); border-radius:12px; color:var(--book-ivory); background:rgba(0,0,0,.2); outline:none; }
  .booking-field textarea { min-height:104px; resize:vertical; line-height:1.6; }
  .booking-field input::placeholder,.booking-field textarea::placeholder { color:#918d84; }
  .booking-field input:focus,.booking-field textarea:focus { border-color:var(--book-gold); box-shadow:0 0 0 3px rgba(214,168,79,.12); }
  .booking-policy { display:flex; align-items:flex-start; gap:10px; margin-top:17px; color:var(--book-muted); font-size:.84rem; line-height:1.55; }
  .booking-policy input { width:17px; height:17px; flex:0 0 17px; margin-top:2px; accent-color:var(--book-green); }
  .booking-summary { position:sticky; top:20px; padding:21px; border:1px solid var(--book-line); border-radius:22px; background:linear-gradient(155deg,rgba(250,248,243,.075),rgba(250,248,243,.025)); box-shadow:0 16px 44px rgba(0,0,0,.22); }
  .booking-summary h3 { margin:0; font-size:1.06rem; }
  .booking-summary-brand { display:flex; align-items:center; gap:10px; padding-bottom:16px; border-bottom:1px solid var(--book-line); }
  .booking-summary-brand svg { color:var(--book-gold); }
  .booking-summary-brand span { display:block; color:var(--book-muted); font-size:.78rem; }
  .booking-summary-block { padding:15px 0; border-bottom:1px solid var(--book-line); }
  .booking-summary-label { display:block; color:var(--book-muted); text-transform:uppercase; letter-spacing:.1em; font-size:.68rem; font-weight:750; }
  .booking-summary-value { display:block; margin-top:6px; font-size:.9rem; line-height:1.5; }
  .booking-summary-list { display:grid; gap:8px; margin:9px 0 0; padding:0; list-style:none; }
  .booking-summary-list li { display:flex; justify-content:space-between; gap:10px; color:var(--book-ivory); font-size:.84rem; }
  .booking-summary-list small { color:var(--book-muted); }
  .booking-summary-total { display:flex; justify-content:space-between; gap:12px; margin-top:15px; font-size:.88rem; }
  .booking-summary-total strong { color:var(--book-gold); text-align:right; }
  .booking-summary-note { margin:13px 0 0; color:var(--book-muted); font-size:.77rem; line-height:1.55; }
  .booking-step-actions { display:flex; justify-content:space-between; gap:12px; margin-top:24px; padding-top:18px; border-top:1px solid var(--book-line); }
  .booking-btn { display:inline-flex; align-items:center; justify-content:center; gap:9px; min-height:46px; padding:11px 17px; border:1px solid transparent; border-radius:999px; color:var(--book-ivory); font-weight:700; cursor:pointer; transition:transform .22s ease,box-shadow .22s ease,border-color .22s ease,background .22s ease; }
  .booking-btn:hover { transform:translateY(-2px); }
  .booking-btn-primary { background:var(--book-green); box-shadow:0 8px 23px rgba(23,107,85,.26); }
  .booking-btn-primary:hover { box-shadow:0 11px 27px rgba(23,107,85,.42),0 0 18px rgba(214,168,79,.11); }
  .booking-btn-quiet { border-color:var(--book-line); background:rgba(250,248,243,.035); }
  .booking-btn-quiet:hover { border-color:rgba(214,168,79,.46); }
  .booking-btn:disabled { opacity:.45; cursor:not-allowed; transform:none; box-shadow:none; }
  .booking-payment-list { display:grid; gap:10px; margin-top:20px; }
  .booking-payment-option { display:flex; align-items:center; gap:12px; padding:14px; border:1px solid var(--book-line); border-radius:15px; cursor:pointer; background:rgba(250,248,243,.025); transition:border-color .2s ease,background .2s ease; }
  .booking-payment-option.is-selected { border-color:var(--book-gold); background:rgba(214,168,79,.07); }
  .booking-payment-option input { accent-color:var(--book-green); }
  .booking-payment-option svg { color:var(--book-gold); }
  .booking-payment-option strong { display:block; font-size:.9rem; }
  .booking-payment-option small { display:block; margin-top:3px; color:var(--book-muted); font-size:.77rem; }
  .booking-review-callout { display:flex; gap:10px; padding:14px; border:1px solid rgba(214,168,79,.32); border-radius:15px; color:var(--book-muted); background:rgba(214,168,79,.06); font-size:.85rem; line-height:1.6; }
  .booking-review-callout svg { flex:0 0 auto; color:var(--book-gold); }
  .booking-feedback { margin-top:16px; padding:13px 15px; border:1px solid rgba(214,168,79,.35); border-radius:13px; color:var(--book-ivory); background:rgba(214,168,79,.08); font-size:.9rem; line-height:1.6; }
  .booking-price-empty { color:var(--book-muted); font-style:italic; }
  .booking-mobile-summary { display:none; }
  .booking-page :focus-visible { outline:2px solid var(--book-gold); outline-offset:4px; }
  @media(max-width:980px) { .booking-layout { grid-template-columns:minmax(0,1fr) 280px; gap:15px; } .booking-step-name { font-size:.72rem; } .booking-service-grid { grid-template-columns:1fr; } }
  @media(max-width:760px) { .booking-wrap { width:min(100% - 30px,1180px); } .booking-layout { grid-template-columns:1fr; } .booking-summary-desktop { display:none; } .booking-mobile-summary { display:block; margin-bottom:16px; } .booking-mobile-summary summary { padding:13px 15px; border:1px solid var(--book-line); border-radius:14px; color:var(--book-ivory); background:var(--book-glass); font-weight:700; cursor:pointer; } .booking-mobile-summary[open] summary { border-radius:14px 14px 0 0; } .booking-mobile-summary .booking-summary { position:static; border-radius:0 0 16px 16px; } }
  @media(max-width:600px) { .booking-wrap { width:min(100% - 26px,1180px); } .booking-hero { padding:52px 0 32px; } .booking-hero::before { background-image:linear-gradient(0deg,rgba(18,18,17,.97),rgba(18,18,17,.78) 68%,rgba(18,18,17,.54)),url('public/Hair plaiting 1.jpg'); background-position:55% center; } .booking-hero h1 { font-size:clamp(2.65rem,13vw,4.3rem); } .booking-trust { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; } .booking-trust span { align-items:flex-start; font-size:.78rem; } .booking-progress { display:flex; overflow-x:auto; gap:7px; padding:2px 1px 9px; scrollbar-width:thin; } .booking-progress-step { flex:0 0 auto; min-width:49px; justify-content:center; padding:9px; } .booking-step-name { display:none; } .booking-step-number { width:28px; height:28px; flex-basis:28px; } .booking-panel { padding:18px 14px; border-radius:19px; } .booking-service-card { grid-template-columns:82px minmax(0,1fr); gap:11px; } .booking-service-card img { width:82px; height:105px; } .booking-service-info h3 { font-size:.91rem; } .booking-service-info p { font-size:.76rem; } .booking-service-meta { gap:7px; font-size:.72rem; } .booking-choice-grid { grid-template-columns:1fr; } .booking-date-option { min-width:68px; } .booking-time-options { grid-template-columns:repeat(2,minmax(0,1fr)); } .booking-details-grid { grid-template-columns:1fr; } .booking-field-full { grid-column:auto; } .booking-step-actions { position:sticky; bottom:7px; z-index:2; margin-inline:-4px; padding:12px 4px 4px; background:linear-gradient(rgba(23,23,23,0),var(--book-ink) 30%); } .booking-step-actions .booking-btn { flex:1; min-width:0; padding-inline:12px; } }
  @media(prefers-reduced-motion:reduce) { .booking-page *, .booking-page *::before, .booking-page *::after { animation-duration:.01ms!important; animation-iteration-count:1!important; transition-duration:.01ms!important; scroll-behavior:auto!important; } }
`

function makeUpcomingDates(count = 14) {
  return Array.from({ length: count }, (_, index) => {
    const date = new Date()
    date.setHours(12, 0, 0, 0)
    date.setDate(date.getDate() + index + 1)
    return {
      key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
      weekday: new Intl.DateTimeFormat('en', { weekday: 'short' }).format(date),
      day: date.getDate(),
      month: new Intl.DateTimeFormat('en', { month: 'short' }).format(date),
    }
  })
}

function formatDuration(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (hours && minutes) return `${hours} hr ${minutes} min`
  if (hours) return `${hours} ${hours === 1 ? 'hour' : 'hours'}`
  return `${minutes} min`
}

function BookingSummary({ selectedServices, selectedProfessional, selectedDate, selectedTime, details, compact = false }) {
  const duration = selectedServices.reduce((sum, service) => sum + service.duration, 0)
  const dateLabel = selectedDate
    ? new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date(`${selectedDate}T12:00:00`))
    : 'Not selected'

  return (
    <aside className={`booking-summary ${compact ? 'booking-summary-compact' : ''}`} aria-label="Booking summary">
      <div className="booking-summary-brand"><Scissors size={21} /><div><h3>Your appointment</h3><span>Crystal Five Salon &amp; Kinyozi</span></div></div>
      <div className="booking-summary-block">
        <span className="booking-summary-label">Services</span>
        {selectedServices.length ? (
          <ul className="booking-summary-list">
            {selectedServices.map((service) => <li key={service.id}><span>{service.name}</span><small>{formatDuration(service.duration)}</small></li>)}
          </ul>
        ) : <span className="booking-summary-value booking-price-empty">Choose a service to start</span>}
      </div>
      <div className="booking-summary-block"><span className="booking-summary-label">Professional</span><span className="booking-summary-value">{selectedProfessional === 'any' ? 'Any available professional' : selectedProfessional === 'none' ? 'No preference' : professionals.find((person) => person.id === selectedProfessional)?.title || 'Not selected'}</span></div>
      <div className="booking-summary-block"><span className="booking-summary-label">Date &amp; time</span><span className="booking-summary-value">{dateLabel}{selectedTime ? ` · ${selectedTime}` : ''}</span></div>
      {duration > 0 && <div className="booking-summary-total"><span>Estimated duration</span><strong>{formatDuration(duration)}</strong></div>}
      <div className="booking-summary-total"><span>Price</span><strong>Confirmed before booking</strong></div>
      {details.name && <div className="booking-summary-block"><span className="booking-summary-label">Booking for</span><span className="booking-summary-value">{details.name}</span></div>}
      <p className="booking-summary-note">Preview only: prices and availability are not live, and no appointment is reserved.</p>
    </aside>
  )
}

function BookNow() {
  const [step, setStep] = useState(1)
  const [category, setCategory] = useState('All services')
  const [search, setSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState([])
  const [selectedProfessional, setSelectedProfessional] = useState('any')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [selectedPayment, setSelectedPayment] = useState('pay-at-salon')
  const [policyAccepted, setPolicyAccepted] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [details, setDetails] = useState({ name: '', phone: '', email: '', notes: '' })
  const dateChoices = useMemo(() => makeUpcomingDates(), [])

  const selectedServices = bookingServices.filter((service) => selectedIds.includes(service.id))
  const eligibleProfessionals = professionals.filter((person) => selectedServices.length > 0 && selectedServices.every((service) => person.serviceIds.includes(service.id)))
  const visibleServices = bookingServices.filter((service) => (
    (category === 'All services' || service.category === category)
    && `${service.name} ${service.detail} ${service.category}`.toLowerCase().includes(search.toLowerCase().trim())
  ))

  const updateDetails = (event) => {
    setDetails((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  const toggleService = (id) => {
    setSelectedIds((current) => current.includes(id) ? current.filter((selectedId) => selectedId !== id) : [...current, id])
    setFeedback('')
  }

  const goBack = () => {
    setFeedback('')
    setStep((current) => Math.max(1, current - 1))
  }

  const goNext = () => {
    setFeedback('')
    if (step === 1 && selectedIds.length === 0) {
      setFeedback('Choose at least one service to continue.')
      return
    }
    if (step === 2 && selectedProfessional !== 'any' && selectedProfessional !== 'none' && !eligibleProfessionals.some((person) => person.id === selectedProfessional)) {
      setSelectedProfessional('any')
    }
    if (step === 3 && (!selectedDate || !selectedTime)) {
      setFeedback('Choose a preview date and time to continue. These options are for exploring the interface only.')
      return
    }
    if (step === 4) {
      const form = document.getElementById('booking-details-form')
      if (form && !form.reportValidity()) return
      if (!policyAccepted) {
        setFeedback('Please acknowledge the booking policy to review this preview.')
        return
      }
    }
    setStep((current) => Math.min(5, current + 1))
  }

  const finishPreview = () => {
    setFeedback('Preview complete. No appointment was submitted, no time was reserved and no payment was taken. Connect the booking API to enable real bookings.')
  }

  return (
    <main className="booking-page">
      <style>{bookNowStyles}</style>

      <header className="booking-hero">
        <div className="booking-wrap booking-hero-copy">
          <span className="booking-kicker">Crystal Five Salon &amp; Kinyozi</span>
          <h1>Book your<br /><em>appointment.</em></h1>
          <p>Your next great look is a few steps away. Choose your services, select a professional and explore the booking flow.</p>
          <div className="booking-trust" aria-label="Booking information">
            <span><Sparkles size={16} /> Salon, grooming &amp; beauty</span>
            <span><CalendarCheck size={16} /> Guided booking flow</span>
            <span><ShieldCheck size={16} /> Guest-friendly details</span>
            <span><Clock size={16} /> Preview mode right now</span>
          </div>
        </div>
      </header>

      <div className="booking-wrap">
        <div className="booking-notice" role="note">
          <Sparkles size={18} aria-hidden="true" />
          <span><strong>Frontend preview:</strong> service choices and the booking steps are interactive, but dates and time options below are examples only. Live prices, availability, reservations, payment and confirmation will be connected to your backend later.</span>
        </div>
      </div>

      <section className="booking-main" aria-label="Appointment booking steps">
        <div className="booking-wrap">
          <nav className="booking-progress" aria-label="Booking progress">
            {stepNames.map((name, index) => {
              const stepNumber = index + 1
              return (
                <div key={name} className={`booking-progress-step ${step === stepNumber ? 'is-current' : ''} ${step > stepNumber ? 'is-complete' : ''}`} aria-current={step === stepNumber ? 'step' : undefined}>
                  <span className="booking-step-number">{step > stepNumber ? <Check size={15} aria-hidden="true" /> : stepNumber}</span>
                  <span className="booking-step-name">{name}</span>
                </div>
              )
            })}
          </nav>

          <details className="booking-mobile-summary">
            <summary>View booking summary · {selectedServices.length} service{selectedServices.length === 1 ? '' : 's'}</summary>
            <BookingSummary selectedServices={selectedServices} selectedProfessional={selectedProfessional} selectedDate={selectedDate} selectedTime={selectedTime} details={details} compact />
          </details>

          <div className="booking-layout">
            <div className="booking-panel" key={step}>
              {step === 1 && (
                <>
                  <h2>What would you like done?</h2>
                  <p className="booking-panel-intro">Choose one or more services to build your appointment preview. Prices are not set here.</p>
                  <div className="booking-service-tools">
                    <label className="booking-search"><Search size={17} aria-hidden="true" /><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search services" aria-label="Search services" /></label>
                    <select className="booking-filter" value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filter services by category">
                      {categories.map((name) => <option key={name}>{name}</option>)}
                    </select>
                  </div>
                  <div className="booking-service-grid">
                    {visibleServices.length ? visibleServices.map((service) => {
                      const isSelected = selectedIds.includes(service.id)
                      return (
                        <article key={service.id} className={`booking-service-card ${isSelected ? 'is-selected' : ''}`}>
                          <img src={service.image} alt="" loading="lazy" />
                          <div className="booking-service-info">
                            <span className="booking-category">{service.category}</span>
                            <h3>{service.name}</h3>
                            <p>{service.detail}</p>
                            <div className="booking-service-meta"><span><Clock size={13} /> {formatDuration(service.duration)}</span></div>
                          </div>
                          <button type="button" className="booking-select-service" aria-pressed={isSelected} onClick={() => toggleService(service.id)}>
                            {isSelected ? <><Check size={13} /> Added</> : <>Select <ArrowRight size={13} /></>}
                          </button>
                        </article>
                      )
                    }) : <div className="booking-empty">No services match that search. Try another name or category.</div>}
                  </div>
                  <p className="booking-helper"><Sparkles size={16} /> Pricing is intentionally not shown as live. The backend should return current business prices and calculate totals when connected.</p>
                </>
              )}

              {step === 2 && (
                <>
                  <h2>Choose a professional.</h2>
                  <p className="booking-panel-intro">Pick a role you prefer, or leave the choice to the booking rules once live availability is connected.</p>
                  <div className="booking-choice-grid">
                    <button type="button" className={`booking-choice-card ${selectedProfessional === 'any' ? 'is-selected' : ''}`} aria-pressed={selectedProfessional === 'any'} onClick={() => setSelectedProfessional('any')}>
                      <span className="booking-choice-icon"><Sparkles size={21} /></span><span className="booking-choice-copy"><strong>Any available professional</strong><small>Match me with someone eligible for the selected services.</small></span>
                    </button>
                    <button type="button" className={`booking-choice-card ${selectedProfessional === 'none' ? 'is-selected' : ''}`} aria-pressed={selectedProfessional === 'none'} onClick={() => setSelectedProfessional('none')}>
                      <span className="booking-choice-icon"><UserRound size={21} /></span><span className="booking-choice-copy"><strong>No preference</strong><small>Let the business assign an eligible professional.</small></span>
                    </button>
                    {eligibleProfessionals.map((person) => (
                      <button key={person.id} type="button" className={`booking-choice-card ${selectedProfessional === person.id ? 'is-selected' : ''}`} aria-pressed={selectedProfessional === person.id} onClick={() => setSelectedProfessional(person.id)}>
                        <img src={person.image} alt="" loading="lazy" /><span className="booking-choice-copy"><strong>{person.title}</strong><small>{person.speciality}</small></span>
                      </button>
                    ))}
                  </div>
                  <p className="booking-helper"><ShieldCheck size={16} /> Role choices and service eligibility are placeholders from the current site content. A future API should return only publicly bookable, qualified staff.</p>
                </>
              )}

              {step === 3 && (
                <>
                  <h2>Pick a date and time.</h2>
                  <p className="booking-panel-intro">Explore how the calendar selection will look. Sample options are not live availability and do not reserve a slot.</p>
                  <div className="booking-notice" role="note"><Clock size={17} /><span><strong>Sample times only.</strong> Replace this preview with availability returned by your backend (including staff schedule, business hours and existing bookings).</span></div>
                  <h3 style={{ margin: '22px 0 12px', fontSize: '.96rem' }}>Choose a date</h3>
                  <div className="booking-date-strip" role="group" aria-label="Sample date options">
                    {dateChoices.map((date) => (
                      <button key={date.key} type="button" className={`booking-date-option ${selectedDate === date.key ? 'is-selected' : ''}`} aria-pressed={selectedDate === date.key} onClick={() => { setSelectedDate(date.key); setSelectedTime(''); setFeedback('') }}>
                        <small>{date.weekday}</small><strong>{date.day}</strong><span>{date.month}</span>
                      </button>
                    ))}
                  </div>
                  <h3 style={{ margin: '20px 0 0', fontSize: '.96rem' }}>Sample time options</h3>
                  <div className="booking-time-options" role="group" aria-label="Sample appointment times">
                    {previewTimes.map((time) => (
                      <button key={time} type="button" className={`booking-time-option ${selectedTime === time ? 'is-selected' : ''}`} aria-pressed={selectedTime === time} onClick={() => { setSelectedTime(time); setFeedback('') }}>{time}</button>
                    ))}
                  </div>
                </>
              )}

              {step === 4 && (
                <>
                  <h2>Your details.</h2>
                  <p className="booking-panel-intro">Guest booking preview—no account needed. Your information is not sent or stored until a backend is connected.</p>
                  <form id="booking-details-form" onSubmit={(event) => event.preventDefault()}>
                    <div className="booking-details-grid">
                      <div className="booking-field booking-field-full"><label htmlFor="booking-name">Full name <span style={{ color: 'var(--book-gold)' }}>*</span></label><input id="booking-name" name="name" autoComplete="name" minLength={2} maxLength={80} placeholder="Your full name" value={details.name} onChange={updateDetails} required /></div>
                      <div className="booking-field"><label htmlFor="booking-phone">Phone number <span style={{ color: 'var(--book-gold)' }}>*</span></label><input id="booking-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" minLength={9} maxLength={18} placeholder="e.g. 0701 641 896" value={details.phone} onChange={updateDetails} required /></div>
                      <div className="booking-field"><label htmlFor="booking-email">Email address <span style={{ color: 'var(--book-muted)', fontWeight: 400 }}>(optional)</span></label><input id="booking-email" name="email" type="email" autoComplete="email" maxLength={120} placeholder="you@example.com" value={details.email} onChange={updateDetails} /></div>
                      <div className="booking-field booking-field-full"><label htmlFor="booking-notes">Special instructions <span style={{ color: 'var(--book-muted)', fontWeight: 400 }}>(optional)</span></label><textarea id="booking-notes" name="notes" maxLength={500} placeholder="Anything you would like us to know before your visit?" value={details.notes} onChange={updateDetails} /></div>
                    </div>
                    <label className="booking-policy"><input type="checkbox" checked={policyAccepted} onChange={(event) => { setPolicyAccepted(event.target.checked); setFeedback('') }} /><span>I understand this is a booking preview only. No appointment is confirmed until the live booking system verifies the details and availability.</span></label>
                  </form>
                </>
              )}

              {step === 5 && (
                <>
                  <h2>Review your appointment.</h2>
                  <p className="booking-panel-intro">Check the preview details before the booking system is connected.</p>
                  <div className="booking-review-callout"><ShieldCheck size={18} /><span>This screen is a front-end preview. No reservation, booking confirmation, or payment will be created yet.</span></div>
                  <h3 style={{ margin: '22px 0 8px', fontSize: '1rem' }}>Payment preference (preview)</h3>
                  <p className="booking-panel-intro" style={{ marginTop: 0 }}>Choose how you might want to pay. No payment method is active or charged in this preview.</p>
                  <div className="booking-payment-list">
                    {paymentOptions.map((option) => (
                      <label key={option.id} className={`booking-payment-option ${selectedPayment === option.id ? 'is-selected' : ''}`}>
                        <input type="radio" name="payment-preview" value={option.id} checked={selectedPayment === option.id} onChange={() => setSelectedPayment(option.id)} />
                        {createElement(option.icon, { size: 19, 'aria-hidden': true })}
                        <span><strong>{option.label}</strong><small>{option.note}</small></span>
                      </label>
                    ))}
                  </div>
                  <p className="booking-helper"><MapPin size={16} /> Current location: Jomo Drive, Nderi, Kenya. Payment rules and cancellation terms will be displayed here when configured.</p>
                </>
              )}

              {feedback && <div className="booking-feedback" role="status" aria-live="polite">{feedback}</div>}

              <div className="booking-step-actions">
                {step > 1 ? <button type="button" className="booking-btn booking-btn-quiet" onClick={goBack}><ArrowLeft size={16} /> Back</button> : <span />}
                {step < 5 ? (
                  <button type="button" className="booking-btn booking-btn-primary" onClick={goNext}>{step === 4 ? 'Review booking' : 'Continue'} <ArrowRight size={16} /></button>
                ) : (
                  <button type="button" className="booking-btn booking-btn-primary" onClick={finishPreview}>Finish preview <Check size={16} /></button>
                )}
              </div>
            </div>

            <div className="booking-summary-desktop">
              <BookingSummary selectedServices={selectedServices} selectedProfessional={selectedProfessional} selectedDate={selectedDate} selectedTime={selectedTime} details={details} />
            </div>
          </div>
          <p className="booking-helper" style={{ justifyContent: 'center', marginTop: 24 }}><ShieldCheck size={16} /> When the backend is ready, connect the catalogue, staff, availability, booking and payment APIs here. Server-side validation must determine final price and availability.</p>
        </div>
      </section>
    </main>
  )
}

export default BookNow
