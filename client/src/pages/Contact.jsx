import { createElement, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CalendarCheck,
  Clock,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Sparkles,
} from 'lucide-react'

const CONTACT_PHONE_DISPLAY = '0701 641 896'
const CONTACT_PHONE_INTERNATIONAL = '254701641896'
const MAP_QUERY = 'Jomo Drive, Nderi, Kenya'

const subjects = [
  'General enquiry',
  'Service enquiry',
  'Price enquiry',
  'Existing booking',
  'Booking change or cancellation',
  'Feedback',
  'Other',
]

const questions = [
  {
    question: 'How can I book an appointment?',
    answer: 'Choose Book Now to view the available booking options, or contact us on WhatsApp if you need help before booking.',
  },
  {
    question: 'Where are you located?',
    answer: 'We are at Jomo Drive, Nderi, Kenya. Use the map and directions link on this page to plan your visit.',
  },
  {
    question: 'Can I ask about a service or price first?',
    answer: 'Yes. Choose Service enquiry or Price enquiry in the form and continue to WhatsApp with your question.',
  },
  {
    question: 'What are your opening hours?',
    answer: 'Opening hours have not been provided here yet. Please contact us to confirm availability before visiting.',
  },
]

const socialLinks = [
  { name: 'Instagram', href: 'https://www.instagram.com/its__ramsay/', icon: 'instagram' },
  { name: 'Facebook', href: 'https://www.facebook.com/its__ramsay/', icon: 'facebook' },
  { name: 'Threads', href: 'https://www.threads.net/@its__ramsay', icon: 'threads' },
  { name: 'X', href: 'https://x.com/its__ramsay', icon: 'x' },
  { name: 'TikTok', href: 'https://www.tiktok.com/@its__ramsay', icon: 'tiktok' },
]

const contactStyles = `
  .contact-page {
    --contact-ink: #171717;
    --contact-ivory: #FAF8F3;
    --contact-green: #176B55;
    --contact-gold: #D6A84F;
    --contact-muted: #c5c0b5;
    --contact-line: rgba(250,248,243,.14);
    --contact-glass: rgba(250,248,243,.055);
    color: var(--contact-ivory);
    background: var(--contact-ink);
    font-family: inherit;
    overflow: clip;
  }
  .contact-page *, .contact-page *::before, .contact-page *::after { box-sizing: border-box; }
  .contact-page img { display: block; width: 100%; max-width: 100%; }
  .contact-page a { color: inherit; text-decoration: none; }
  .contact-page button, .contact-page input, .contact-page select, .contact-page textarea { font: inherit; }
  .contact-wrap { width: min(1160px, calc(100% - 40px)); margin-inline: auto; }
  .contact-section { position: relative; padding: clamp(64px, 9vw, 108px) 0; }
  .contact-section-alt { background: linear-gradient(180deg, #1d1d1b, #171717); }
  .contact-kicker { display: inline-flex; align-items: center; gap: 9px; color: var(--contact-gold); text-transform: uppercase; letter-spacing: .15em; font-size: .74rem; font-weight: 700; }
  .contact-kicker::before { content: ''; width: 24px; height: 1px; background: currentColor; }
  .contact-heading { max-width: 760px; margin: 14px 0 0; font-family: Georgia, 'Times New Roman', serif; font-size: clamp(2rem, 5vw, 3.55rem); line-height: 1.08; letter-spacing: -.035em; }
  .contact-lead { max-width: 680px; margin: 16px 0 0; color: var(--contact-muted); font-size: clamp(1rem, 2vw, 1.12rem); line-height: 1.8; }
  .contact-section-head { margin: 0 auto 36px; text-align: center; }
  .contact-section-head .contact-kicker { justify-content: center; }
  .contact-section-head .contact-heading, .contact-section-head .contact-lead { margin-left: auto; margin-right: auto; }

  .contact-hero { position: relative; min-height: clamp(440px, 66vh, 680px); display: grid; align-items: center; isolation: isolate; background: #171717; }
  .contact-hero::before { content: ''; position: absolute; inset: 0; z-index: -2; background-image: linear-gradient(90deg, rgba(15,15,14,.93) 0%, rgba(15,15,14,.72) 48%, rgba(15,15,14,.2) 100%), linear-gradient(0deg, rgba(15,15,14,.4), transparent 65%), url('public/Barber ShopSlideshow.jpg'); background-size: cover; background-position: center; animation: contact-image-in 1s cubic-bezier(.2,.8,.2,1) both; }
  .contact-hero::after { content: ''; position: absolute; z-index: -1; inset: auto 0 0; height: 120px; background: linear-gradient(transparent, var(--contact-ink)); }
  .contact-hero-content { width: min(1160px, calc(100% - 40px)); margin-inline: auto; padding: 76px 0; animation: contact-rise-in .75s cubic-bezier(.2,.8,.2,1) .1s both; }
  .contact-hero h1 { max-width: 760px; margin: 18px 0 0; font-family: Georgia, 'Times New Roman', serif; font-size: clamp(2.9rem, 8vw, 6.2rem); line-height: .99; letter-spacing: -.055em; }
  .contact-hero h1 em { color: var(--contact-gold); font-weight: 500; }
  .contact-hero p { max-width: 640px; margin: 22px 0 0; color: rgba(250,248,243,.86); font-size: clamp(1rem, 2vw, 1.16rem); line-height: 1.8; }
  .contact-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
  .contact-button { display: inline-flex; align-items: center; justify-content: center; gap: 10px; min-height: 48px; padding: 13px 20px; border: 1px solid transparent; border-radius: 999px; font-weight: 700; cursor: pointer; transition: transform .25s ease, box-shadow .25s ease, background .25s ease, border-color .25s ease; }
  .contact-button:hover { transform: translateY(-3px); }
  .contact-button-primary { color: var(--contact-ivory) !important; background: var(--contact-green); box-shadow: 0 9px 26px rgba(23,107,85,.3); }
  .contact-button-primary:hover { box-shadow: 0 13px 30px rgba(23,107,85,.42), 0 0 18px rgba(214,168,79,.18); }
  .contact-button-secondary { border-color: rgba(250,248,243,.42); background: rgba(23,23,23,.35); backdrop-filter: blur(8px); }
  .contact-button-secondary:hover { border-color: var(--contact-gold); }
  .contact-button svg { transition: transform .25s ease; }
  .contact-button:hover svg { transform: translateX(3px); }

  .contact-channel-grid { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 14px; }
  .contact-channel-card { min-height: 205px; padding: 22px; border: 1px solid var(--contact-line); border-radius: 22px; background: var(--contact-glass); backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px); box-shadow: inset 0 1px 0 rgba(255,255,255,.035); transition: transform .28s ease, border-color .28s ease, box-shadow .28s ease; }
  .contact-channel-card:hover { transform: translateY(-6px); border-color: rgba(214,168,79,.55); box-shadow: 0 18px 42px rgba(0,0,0,.24), 0 0 24px rgba(214,168,79,.08); }
  .contact-icon { display: grid; place-items: center; width: 46px; height: 46px; border: 1px solid rgba(214,168,79,.34); border-radius: 15px; color: var(--contact-gold); background: rgba(214,168,79,.1); }
  .contact-icon svg { animation: contact-breathe 4.4s ease-in-out infinite; }
  @keyframes contact-breathe { 0%,100% { transform: scale(1); } 50% { transform: scale(1.08); } }
  .contact-channel-card h3 { margin: 17px 0 0; font-size: 1.05rem; }
  .contact-channel-card p { margin: 8px 0 0; color: var(--contact-muted); font-size: .91rem; line-height: 1.65; }
  .contact-channel-link { display: inline-flex; align-items: center; gap: 6px; margin-top: 14px; color: var(--contact-gold) !important; font-size: .92rem; font-weight: 650; }
  .contact-channel-link svg { transition: transform .2s ease; }
  .contact-channel-link:hover svg { transform: translateX(3px); }

  .contact-form-layout { display: grid; grid-template-columns: .78fr 1.22fr; gap: clamp(24px,5vw,64px); align-items: start; }
  .contact-form-aside { position: sticky; top: 24px; }
  .contact-form-aside p { margin: 15px 0 0; color: var(--contact-muted); line-height: 1.8; }
  .contact-form-aside .contact-mini-card { display: flex; gap: 13px; margin-top: 22px; padding: 16px; border: 1px solid var(--contact-line); border-radius: 17px; background: var(--contact-glass); }
  .contact-mini-card svg { flex: 0 0 auto; color: var(--contact-gold); }
  .contact-mini-card strong { display: block; font-size: .94rem; }
  .contact-mini-card span { display: block; margin-top: 4px; color: var(--contact-muted); font-size: .86rem; line-height: 1.55; }
  .contact-form-card { padding: clamp(20px,4vw,34px); border: 1px solid var(--contact-line); border-radius: 26px; background: linear-gradient(145deg, rgba(250,248,243,.075), rgba(250,248,243,.035)); box-shadow: 0 20px 60px rgba(0,0,0,.23), inset 0 1px 0 rgba(255,255,255,.035); }
  .contact-form-card h2 { margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: clamp(1.55rem, 3vw, 2rem); }
  .contact-form-intro { margin: 9px 0 24px; color: var(--contact-muted); font-size: .93rem; line-height: 1.65; }
  .contact-fields { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 16px; }
  .contact-field { display: grid; gap: 7px; min-width: 0; }
  .contact-field-full { grid-column: 1 / -1; }
  .contact-field label { color: var(--contact-ivory); font-size: .9rem; font-weight: 650; }
  .contact-field input, .contact-field select, .contact-field textarea { width: 100%; min-height: 47px; padding: 12px 13px; border: 1px solid rgba(250,248,243,.18); border-radius: 13px; outline: none; color: var(--contact-ivory); background: rgba(23,23,23,.62); transition: border-color .2s ease, box-shadow .2s ease, background .2s ease; }
  .contact-field select option { color: var(--contact-ivory); background: var(--contact-ink); }
  .contact-field textarea { min-height: 132px; resize: vertical; line-height: 1.6; }
  .contact-field input::placeholder, .contact-field textarea::placeholder { color: #969187; }
  .contact-field input:focus, .contact-field select:focus, .contact-field textarea:focus { border-color: var(--contact-gold); background: rgba(23,23,23,.84); box-shadow: 0 0 0 3px rgba(214,168,79,.13); }
  .contact-form-footer { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 14px; margin-top: 20px; }
  .contact-form-note { max-width: 380px; color: var(--contact-muted); font-size: .82rem; line-height: 1.55; }
  .contact-status { margin-top: 15px; padding: 12px 14px; border: 1px solid rgba(23,107,85,.7); border-radius: 13px; color: var(--contact-ivory); background: rgba(23,107,85,.16); font-size: .9rem; line-height: 1.6; }
  .contact-status a { color: var(--contact-gold); text-decoration: underline; text-underline-offset: 3px; }
  .contact-required { color: var(--contact-gold); }

  .contact-map-grid { display: grid; grid-template-columns: .78fr 1.22fr; gap: 24px; align-items: stretch; }
  .contact-location-card { padding: clamp(22px,4vw,32px); border: 1px solid var(--contact-line); border-radius: 24px; background: var(--contact-glass); }
  .contact-location-card h3 { margin: 16px 0 0; font-size: 1.25rem; }
  .contact-location-card p { margin: 9px 0 0; color: var(--contact-muted); line-height: 1.75; }
  .contact-map { display: block; width: 100%; min-height: 340px; border: 1px solid var(--contact-line); border-radius: 24px; filter: grayscale(.15) contrast(1.04); }
  .contact-socials { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 22px; }
  .contact-social-link { display: inline-flex; align-items: center; gap: 8px; padding: 9px 12px; border: 1px solid var(--contact-line); border-radius: 999px; color: var(--contact-ivory) !important; background: rgba(250,248,243,.035); font-size: .84rem; transition: transform .22s ease, color .22s ease, border-color .22s ease; }
  .contact-social-link:hover { transform: translateY(-2px); color: var(--contact-gold) !important; border-color: rgba(214,168,79,.45); }
  .contact-social-icon { display: inline-grid; place-items: center; width: 18px; height: 18px; color: currentColor; font-size: .84rem; font-weight: 800; line-height: 1; }

  .contact-faq-list { display: grid; gap: 11px; max-width: 850px; margin: 0 auto; }
  .contact-faq-item { overflow: hidden; border: 1px solid var(--contact-line); border-radius: 18px; background: var(--contact-glass); transition: border-color .22s ease, background .22s ease; }
  .contact-faq-item[open] { border-color: rgba(214,168,79,.45); background: rgba(250,248,243,.075); }
  .contact-faq-item summary { display: flex; justify-content: space-between; align-items: center; gap: 14px; padding: 17px 19px; cursor: pointer; font-weight: 650; list-style: none; }
  .contact-faq-item summary::-webkit-details-marker { display: none; }
  .contact-faq-item summary::after { content: '+'; color: var(--contact-gold); font-size: 1.3rem; transition: transform .2s ease; }
  .contact-faq-item[open] summary::after { content: '−'; transform: rotate(180deg); }
  .contact-faq-answer { padding: 0 19px 18px; color: var(--contact-muted); line-height: 1.7; }

  .contact-final { padding: clamp(34px,6vw,62px); border: 1px solid rgba(214,168,79,.32); border-radius: 28px; text-align: center; background: radial-gradient(ellipse at 50% 0%, rgba(214,168,79,.14), transparent 55%), linear-gradient(135deg, rgba(250,248,243,.06), rgba(250,248,243,.02)); }
  .contact-final h2 { max-width: 700px; margin: 14px auto 0; font-family: Georgia, 'Times New Roman', serif; font-size: clamp(1.9rem,5vw,3.3rem); line-height: 1.1; }
  .contact-final p { max-width: 600px; margin: 14px auto 0; color: var(--contact-muted); line-height: 1.75; }
  .contact-final .contact-actions { justify-content: center; }

  .contact-reveal { opacity: 0; transform: translateY(22px); transition: opacity .68s cubic-bezier(.2,.8,.2,1), transform .72s cubic-bezier(.2,.8,.2,1); transition-delay: var(--contact-delay, 0ms); }
  .contact-reveal.is-visible { opacity: 1; transform: translateY(0); }
  @keyframes contact-rise-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes contact-image-in { from { opacity: .55; transform: scale(1.055); } to { opacity: 1; transform: scale(1); } }
  .contact-page :focus-visible { outline: 2px solid var(--contact-gold); outline-offset: 4px; border-radius: 5px; }

  @media (max-width: 900px) {
    .contact-channel-grid { grid-template-columns: repeat(2,minmax(0,1fr)); }
    .contact-form-layout { grid-template-columns: 1fr; }
    .contact-form-aside { position: static; }
  }
  @media (max-width: 640px) {
    .contact-wrap, .contact-hero-content { width: min(100% - 30px, 1160px); }
    .contact-section { padding: 58px 0; }
    .contact-hero { min-height: min(650px, 78svh); }
    .contact-hero::before { background-image: linear-gradient(0deg, rgba(15,15,14,.94) 0%, rgba(15,15,14,.65) 55%, rgba(15,15,14,.22) 100%), url('public/Barber ShopSlideshow.jpg'); background-position: 54% center; }
    .contact-hero-content { padding: 66px 0 54px; }
    .contact-hero h1 { font-size: clamp(2.75rem, 13vw, 4.7rem); }
    .contact-actions { display: grid; grid-template-columns: 1fr; max-width: 360px; }
    .contact-button { width: 100%; }
    .contact-channel-grid { gap: 10px; }
    .contact-channel-card { min-height: 190px; padding: 17px; border-radius: 18px; }
    .contact-channel-card h3 { font-size: .98rem; }
    .contact-channel-card p { font-size: .85rem; }
    .contact-fields { grid-template-columns: 1fr; gap: 14px; }
    .contact-field-full { grid-column: auto; }
    .contact-form-footer { align-items: stretch; }
    .contact-form-footer .contact-button { width: 100%; }
    .contact-map-grid { grid-template-columns: 1fr; }
    .contact-map { min-height: 285px; }
    .contact-social-link { padding: 8px 10px; font-size: .8rem; }
    .contact-faq-item summary { padding: 15px; }
    .contact-faq-answer { padding: 0 15px 15px; }
  }
  @media (max-width: 360px) {
    .contact-channel-grid { grid-template-columns: 1fr; }
    .contact-channel-card { min-height: 0; }
  }
  @media (prefers-reduced-motion: reduce) {
    .contact-page *, .contact-page *::before, .contact-page *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; transition-delay: 0ms !important; scroll-behavior: auto !important; }
    .contact-page .contact-reveal { opacity: 1 !important; transform: none !important; }
  }
`

function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return undefined
    }
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.12, rootMargin: '0px 0px -4% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`contact-reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{ '--contact-delay': `${delay}ms` }}
    >
      {children}
    </div>
  )
}

function SocialMark({ name }) {
  if (name === 'instagram') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none" />
      </svg>
    )
  }
  if (name === 'facebook') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M13.4 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V3.9c-.8-.1-1.7-.2-2.6-.2-2.7 0-4.5 1.6-4.5 4.6V10H6.8v3h2.8v8h3.8z" />
      </svg>
    )
  }
  if (name === 'whatsapp') return <MessageCircle size={16} aria-hidden="true" />
  const mark = name === 'threads' ? '@' : name === 'x' ? 'X' : '♪'
  return <span className="contact-social-icon" aria-hidden="true">{mark}</span>
}

function Contact() {
  const [draftUrl, setDraftUrl] = useState('')
  const [status, setStatus] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.reportValidity()) return

    const data = new FormData(form)
    const message = [
      'Hello Crystal Five, I would like to get in touch.',
      `Name: ${String(data.get('name') || '').trim()}`,
      `Email: ${String(data.get('email') || '').trim()}`,
      `Phone: ${String(data.get('phone') || '').trim() || 'Not provided'}`,
      `Subject: ${String(data.get('subject') || '').trim()}`,
      `Preferred response: ${String(data.get('response') || '').trim() || 'WhatsApp is fine'}`,
      `Message: ${String(data.get('message') || '').trim()}`,
    ].join('\n')
    const url = `https://wa.me/${CONTACT_PHONE_INTERNATIONAL}?text=${encodeURIComponent(message)}`
    setDraftUrl(url)
    setStatus('Your message draft is ready. WhatsApp will open so you can review it and tap Send.')
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <main className="contact-page">
      <style>{contactStyles}</style>

      <section className="contact-hero" aria-labelledby="contact-hero-title">
        <div className="contact-hero-content">
          <span className="contact-kicker">Crystal Five Salon &amp; Kinyozi</span>
          <h1 id="contact-hero-title">Let&apos;s talk.<br /><em>We&apos;re here to help.</em></h1>
          <p>Have a question, need help with a booking or want to know more about a service? Reach out and we&apos;ll help you find the next step.</p>
          <div className="contact-actions">
            <a className="contact-button contact-button-primary" href="#contact-form">
              Send us a message <ArrowRight size={18} aria-hidden="true" />
            </a>
            <Link to="/book-now" className="contact-button contact-button-secondary">
              Book an appointment <CalendarCheck size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="contact-section" aria-label="Contact options">
        <div className="contact-wrap">
          <Reveal>
            <div className="contact-channel-grid">
              <article className="contact-channel-card">
                <span className="contact-icon"><Phone size={21} /></span>
                <h3>Call us</h3>
                <p>Speak with the Crystal Five team.</p>
                <a className="contact-channel-link" href="tel:+254701641896">{CONTACT_PHONE_DISPLAY} <ArrowRight size={15} /></a>
              </article>
              <article className="contact-channel-card">
                <span className="contact-icon"><MessageCircle size={21} /></span>
                <h3>WhatsApp</h3>
                <p>Send a question or enquiry directly.</p>
                <a className="contact-channel-link" href={`https://wa.me/${CONTACT_PHONE_INTERNATIONAL}`} target="_blank" rel="noopener noreferrer">Message us <ArrowRight size={15} /></a>
              </article>
              <article className="contact-channel-card">
                <span className="contact-icon"><MapPin size={21} /></span>
                <h3>Visit us</h3>
                <p>{MAP_QUERY}</p>
                <a className="contact-channel-link" href="https://www.google.com/maps/search/?api=1&query=Jomo+Drive%2C+Nderi%2C+Kenya" target="_blank" rel="noopener noreferrer">Get directions <ArrowRight size={15} /></a>
              </article>
              <article className="contact-channel-card">
                <span className="contact-icon"><Clock size={21} /></span>
                <h3>Check availability</h3>
                <p>Hours are not listed yet. Please contact us to confirm when to visit.</p>
                <a className="contact-channel-link" href={`https://wa.me/${CONTACT_PHONE_INTERNATIONAL}?text=${encodeURIComponent('Hello Crystal Five, could you please confirm your current availability?')}`} target="_blank" rel="noopener noreferrer">Ask on WhatsApp <ArrowRight size={15} /></a>
              </article>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="contact-section contact-section-alt" id="contact-form" aria-labelledby="contact-form-title">
        <div className="contact-wrap contact-form-layout">
          <Reveal className="contact-form-aside">
            <span className="contact-kicker">Send an enquiry</span>
            <h2 className="contact-heading">Tell us what you need.</h2>
            <p>Fill in the form and we&apos;ll prepare a WhatsApp message with your details. You can review it and press Send in WhatsApp.</p>
            <div className="contact-mini-card"><span className="contact-icon"><Sparkles size={19} /></span><div><strong>Simple and direct</strong><span>No account needed. Your message is handed off to WhatsApp for you to send.</span></div></div>
            <div className="contact-mini-card"><span className="contact-icon"><MapPin size={19} /></span><div><strong>Find our location</strong><span>Jomo Drive, Nderi, Kenya</span></div></div>
          </Reveal>

          <Reveal delay={100}>
            <form className="contact-form-card" onSubmit={handleSubmit}>
              <h2 id="contact-form-title">How can we help?</h2>
              <p className="contact-form-intro">Required fields are marked <span className="contact-required">*</span>. Your message will open as a draft in WhatsApp, not be sent automatically.</p>
              <div className="contact-fields">
                <div className="contact-field">
                  <label htmlFor="contact-name">Full name <span className="contact-required">*</span></label>
                  <input id="contact-name" name="name" type="text" autoComplete="name" minLength={2} maxLength={80} placeholder="Your name" required />
                </div>
                <div className="contact-field">
                  <label htmlFor="contact-email">Email address <span>(optional)</span></label>
                  <input id="contact-email" name="email" type="email" autoComplete="email" maxLength={120} placeholder="you@example.com" />
                </div>
                <div className="contact-field">
                  <label htmlFor="contact-phone">Phone number <span>(optional)</span></label>
                  <input id="contact-phone" name="phone" type="tel" autoComplete="tel" maxLength={30} placeholder="Your phone number" />
                </div>
                <div className="contact-field">
                  <label htmlFor="contact-subject">Subject <span className="contact-required">*</span></label>
                  <select id="contact-subject" name="subject" defaultValue="" required>
                    <option value="" disabled>Choose a subject</option>
                    {subjects.map((subject) => <option key={subject} value={subject}>{subject}</option>)}
                  </select>
                </div>
                <div className="contact-field">
                  <label htmlFor="contact-response">Preferred response (optional)</label>
                  <select id="contact-response" name="response" defaultValue="WhatsApp">
                    <option>WhatsApp</option>
                    <option>Phone call</option>
                  </select>
                </div>
                <div className="contact-field contact-field-full">
                  <label htmlFor="contact-message">Your message <span className="contact-required">*</span></label>
                  <textarea id="contact-message" name="message" minLength={5} maxLength={1500} placeholder="Write your question or tell us how we can help…" required />
                </div>
              </div>
              <div className="contact-form-footer">
                <span className="contact-form-note">Your details are placed into a WhatsApp draft addressed to {CONTACT_PHONE_DISPLAY}. Nothing is sent until you confirm in WhatsApp.</span>
                <button className="contact-button contact-button-primary" type="submit">Continue to WhatsApp <Send size={17} aria-hidden="true" /></button>
              </div>
              {status && (
                <div className="contact-status" role="status" aria-live="polite">
                  {status}{' '}
                  {draftUrl && <a href={draftUrl} target="_blank" rel="noopener noreferrer">Open WhatsApp draft</a>}
                </div>
              )}
            </form>
          </Reveal>
        </div>
      </section>

      <section className="contact-section" aria-labelledby="contact-location-title">
        <div className="contact-wrap">
          <Reveal className="contact-section-head">
            <span className="contact-kicker">Come by</span>
            <h2 className="contact-heading" id="contact-location-title">Find us in Nderi.</h2>
            <p className="contact-lead">Jomo Drive, Nderi, Kenya. Open the map for directions and route options.</p>
          </Reveal>
          <div className="contact-map-grid">
            <Reveal>
              <div className="contact-location-card">
                <span className="contact-icon"><MapPin size={21} /></span>
                <h3>Crystal Five Salon &amp; Kinyozi</h3>
                <p>{MAP_QUERY}</p>
                <div className="contact-actions">
                  <a className="contact-button contact-button-primary" href="https://www.google.com/maps/search/?api=1&query=Jomo+Drive%2C+Nderi%2C+Kenya" target="_blank" rel="noopener noreferrer">Open directions <ArrowRight size={17} /></a>
                </div>
                <div className="contact-socials" aria-label="Social media links">
                  {socialLinks.map((social) => (
                    <a key={social.name} className="contact-social-link" href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.name} title={social.name}>
                      {createElement(SocialMark, { name: social.icon })}<span>{social.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <iframe className="contact-map" title="Map showing Jomo Drive, Nderi, Kenya" src="https://maps.google.com/maps?q=Jomo%20Drive%2C%20Nderi%2C%20Kenya&t=&z=14&ie=UTF8&iwloc=&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="contact-section contact-section-alt" aria-labelledby="contact-faq-title">
        <div className="contact-wrap">
          <Reveal className="contact-section-head">
            <span className="contact-kicker">Helpful answers</span>
            <h2 className="contact-heading" id="contact-faq-title">Before you get in touch.</h2>
          </Reveal>
          <div className="contact-faq-list">
            {questions.map((item, index) => (
              <Reveal key={item.question} delay={index * 50}>
                <details className="contact-faq-item">
                  <summary>{item.question}</summary>
                  <div className="contact-faq-answer">{item.answer}</div>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="contact-section">
        <div className="contact-wrap">
          <Reveal>
            <div className="contact-final">
              <span className="contact-kicker">We look forward to hearing from you</span>
              <h2>Have a question? Let&apos;s make it easy.</h2>
              <p>Call or message the team, or explore the services before you decide what to book.</p>
              <div className="contact-actions">
                <a className="contact-button contact-button-primary" href={`https://wa.me/${CONTACT_PHONE_INTERNATIONAL}`} target="_blank" rel="noopener noreferrer">Chat on WhatsApp <MessageCircle size={17} /></a>
                <Link to="/services" className="contact-button contact-button-secondary">Explore services <ArrowRight size={17} /></Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}

export default Contact
