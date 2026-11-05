import { createElement, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  Check,
  Clock,
  Heart,
  MapPin,
  MessageCircle,
  Phone,
  Scissors,
  Sparkles,
  Users,
  Wallet,
} from 'lucide-react'

const values = [
  { icon: BadgeCheck, title: 'Care in every detail', text: 'We take time to understand the look you want and the service that feels right for you.' },
  { icon: Heart, title: 'A welcoming experience', text: 'A visit should feel comfortable, friendly and personal from the first hello to the finishing touch.' },
  { icon: Sparkles, title: 'Room for your style', text: 'From everyday grooming to a fresh new look, your choices and preferences come first.' },
  { icon: Wallet, title: 'Clear choices', text: 'Explore the available services and their displayed details before choosing what to book.' },
]

const team = [
  { role: 'Senior Hairstylist', specialty: 'Braids, styling and hair care', image: 'public/Senior HairStylist.jpg', alt: 'Hairstylist ready to provide a salon service' },
  { role: 'Professional Barber', specialty: 'Haircuts, fades and beard grooming', image: 'public/HairStylist 2.jpg', alt: 'Barber holding scissors' },
  { role: 'Nail Technician', specialty: 'Manicures, pedicures and nail care', image: 'public/Nail Trchnician.jpg', alt: 'Nail technician at work' },
  { role: 'Beauty Therapist', specialty: 'Makeup and beauty services', image: 'public/Beauty Therapist.jpg', alt: 'Beauty therapist' },
]

const gallery = [
  { image: 'public/Men Haircut.jpg', alt: 'Men’s haircut', label: 'Fresh cuts' },
  { image: 'public/Braids.jpg', alt: 'Braided hairstyle', label: 'Braids' },
  { image: 'public/Hair Styling.jpg', alt: 'Styled hair', label: 'Hair styling' },
  { image: 'public/Beard Trim.jpg', alt: 'Beard trim', label: 'Beard grooming' },
  { image: 'public/Makeup.jpg', alt: 'Makeup service', label: 'Beauty' },
  { image: 'public/Nails.jpg', alt: 'Nail service', label: 'Nails' },
]

const faqs = [
  {
    question: 'What services can I book?',
    answer: 'Crystal Five brings salon, kinyozi, hair-care and beauty services together. Visit the Services page to browse the current options and details.',
  },
  {
    question: 'How do I make an appointment?',
    answer: 'Choose Book Now to view the booking options and select the service that suits you.',
  },
  {
    question: 'Where is Crystal Five located?',
    answer: 'You can find us at Jomo Drive, Nderi, Kenya. Use the map below for directions.',
  },
  {
    question: 'Can I ask a question before booking?',
    answer: 'Yes. Call or WhatsApp us on 0701 641 896 and we’ll help with your question.',
  },
]

const aboutStyles = `
  .about-page {
    --about-ink: #171717;
    --about-ivory: #FAF8F3;
    --about-green: #176B55;
    --about-gold: #D6A84F;
    --about-muted: #c5c0b5;
    --about-line: rgba(250, 248, 243, .13);
    --about-glass: rgba(250, 248, 243, .055);
    color: var(--about-ivory);
    background: var(--about-ink);
    font-family: inherit;
    overflow: clip;
  }
  .about-page *, .about-page *::before, .about-page *::after { box-sizing: border-box; }
  .about-page img { display: block; width: 100%; max-width: 100%; }
  .about-page a { color: inherit; text-decoration: none; }
  .about-page button { font: inherit; }
  .about-wrap { width: min(1160px, calc(100% - 40px)); margin-inline: auto; }
  .about-section { position: relative; padding: clamp(64px, 9vw, 112px) 0; }
  .about-section-alt { background: linear-gradient(180deg, #1d1d1b, #171717); }
  .about-kicker { display: inline-flex; align-items: center; gap: 9px; color: var(--about-gold); text-transform: uppercase; letter-spacing: .16em; font-size: .74rem; font-weight: 700; }
  .about-kicker::before { content: ''; width: 24px; height: 1px; background: currentColor; }
  .about-heading { max-width: 760px; margin: 14px 0 0; font-family: Georgia, 'Times New Roman', serif; font-size: clamp(2rem, 5vw, 3.6rem); line-height: 1.08; letter-spacing: -.035em; }
  .about-lead { max-width: 680px; margin: 18px 0 0; color: var(--about-muted); font-size: clamp(1rem, 2vw, 1.12rem); line-height: 1.8; }
  .about-section-head { margin: 0 auto 38px; text-align: center; }
  .about-section-head .about-kicker { justify-content: center; }
  .about-section-head .about-heading, .about-section-head .about-lead { margin-left: auto; margin-right: auto; }

  .about-hero {
    min-height: clamp(510px, 74vh, 760px);
    display: grid;
    align-items: end;
    position: relative;
    isolation: isolate;
    background: #171717;
  }
  .about-hero::before {
    content: '';
    position: absolute;
    z-index: -2;
    inset: 0;
    background-image: linear-gradient(90deg, rgba(15,15,14,.92) 0%, rgba(15,15,14,.70) 43%, rgba(15,15,14,.12) 100%), linear-gradient(0deg, rgba(15,15,14,.62), transparent 60%), url('public/Hair plaiting 1.jpg');
    background-size: cover;
    background-position: center 38%;
    transform: scale(1.025);
    animation: about-hero-settle 1.1s cubic-bezier(.2,.8,.2,1) both;
  }
  .about-hero::after { content: ''; position: absolute; z-index: -1; inset: auto 0 0; height: 140px; background: linear-gradient(transparent, var(--about-ink)); }
  @keyframes about-hero-settle { from { opacity: .55; transform: scale(1.07); } to { opacity: 1; transform: scale(1.025); } }
  .about-hero-content { width: min(1160px, calc(100% - 40px)); margin: 0 auto; padding: clamp(68px, 11vw, 132px) 0 88px; animation: about-rise-in .8s cubic-bezier(.2,.8,.2,1) .12s both; }
  .about-hero h1 { max-width: 760px; margin: 18px 0 0; font-family: Georgia, 'Times New Roman', serif; font-size: clamp(3rem, 8.5vw, 6.5rem); letter-spacing: -.055em; line-height: .98; }
  .about-hero h1 em { color: var(--about-gold); font-weight: 500; }
  .about-hero p { max-width: 620px; margin: 22px 0 0; color: rgba(250,248,243,.86); font-size: clamp(1rem, 2vw, 1.18rem); line-height: 1.8; }
  .about-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 30px; }
  .about-button { display: inline-flex; align-items: center; justify-content: center; gap: 10px; min-height: 48px; padding: 13px 20px; border: 1px solid transparent; border-radius: 999px; font-weight: 700; transition: transform .25s ease, box-shadow .25s ease, background .25s ease, border-color .25s ease; }
  .about-button:hover { transform: translateY(-3px); }
  .about-button-primary { color: var(--about-ivory) !important; background: var(--about-green); box-shadow: 0 9px 26px rgba(23,107,85,.3); }
  .about-button-primary:hover { box-shadow: 0 13px 30px rgba(23,107,85,.42), 0 0 18px rgba(214,168,79,.18); }
  .about-button-quiet { border-color: rgba(250,248,243,.42); background: rgba(23,23,23,.35); backdrop-filter: blur(8px); }
  .about-button-quiet:hover { border-color: var(--about-gold); }
  .about-button svg { transition: transform .25s ease; }
  .about-button:hover svg { transform: translateX(3px); }

  .about-story-grid { display: grid; grid-template-columns: minmax(0, 1.04fr) minmax(300px, .96fr); align-items: center; gap: clamp(32px, 7vw, 84px); }
  .about-story-copy p { margin: 18px 0 0; color: var(--about-muted); font-size: 1.02rem; line-height: 1.9; }
  .about-story-photo { position: relative; min-height: 420px; border: 1px solid var(--about-line); border-radius: 28px; overflow: hidden; box-shadow: 0 24px 70px rgba(0,0,0,.35); }
  .about-story-photo img { position: absolute; inset: 0; height: 100%; object-fit: cover; transition: transform .75s cubic-bezier(.2,.8,.2,1); }
  .about-story-photo:hover img { transform: scale(1.045); }
  .about-photo-note { position: absolute; left: 18px; right: 18px; bottom: 18px; padding: 14px 17px; border: 1px solid rgba(250,248,243,.18); border-radius: 17px; color: var(--about-ivory); background: rgba(23,23,23,.72); backdrop-filter: blur(14px); }
  .about-photo-note strong { display: block; color: var(--about-gold); font-size: .92rem; }
  .about-photo-note span { display: block; margin-top: 3px; color: rgba(250,248,243,.76); font-size: .86rem; }

  .about-purpose-grid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 18px; margin-top: 36px; }
  .about-purpose-card, .about-value-card, .about-difference-card, .about-team-card, .about-faq-item {
    border: 1px solid var(--about-line);
    border-radius: 22px;
    background: var(--about-glass);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    box-shadow: inset 0 1px 0 rgba(255,255,255,.035);
  }
  .about-purpose-card { padding: clamp(22px, 4vw, 34px); transition: transform .3s ease, border-color .3s ease, box-shadow .3s ease; }
  .about-purpose-card:hover, .about-value-card:hover, .about-difference-card:hover, .about-team-card:hover { transform: translateY(-6px); border-color: rgba(214,168,79,.54); box-shadow: 0 18px 42px rgba(0,0,0,.24), 0 0 24px rgba(214,168,79,.08); }
  .about-card-icon { display: grid; place-items: center; width: 48px; height: 48px; border: 1px solid rgba(214,168,79,.32); border-radius: 15px; color: var(--about-gold); background: rgba(214,168,79,.09); }
  .about-card-icon svg { animation: about-breathe 4.4s ease-in-out infinite; }
  @keyframes about-breathe { 0%,100% { transform: scale(1); } 50% { transform: scale(1.08); } }
  .about-purpose-card h3, .about-value-card h3, .about-difference-card h3 { margin: 17px 0 0; color: var(--about-ivory); font-size: 1.15rem; }
  .about-purpose-card p, .about-value-card p, .about-difference-card p { margin: 9px 0 0; color: var(--about-muted); line-height: 1.7; }

  .about-values-grid { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 15px; margin-top: 36px; }
  .about-value-card { min-height: 220px; padding: 22px; transition: transform .3s ease, border-color .3s ease, box-shadow .3s ease; }
  .about-value-card .about-card-icon { width: 43px; height: 43px; border-radius: 14px; }
  .about-value-card h3 { font-size: 1.04rem; }
  .about-value-card p { font-size: .94rem; }

  .about-difference-grid { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 15px; margin-top: 34px; }
  .about-difference-card { padding: 22px; transition: transform .3s ease, border-color .3s ease, box-shadow .3s ease; }
  .about-difference-card h3 { font-size: 1.02rem; }
  .about-difference-card p { font-size: .93rem; }
  .about-difference-card .about-card-icon { width: 42px; height: 42px; }

  .about-team-grid { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 16px; margin-top: 36px; }
  .about-team-card { overflow: hidden; transition: transform .32s ease, border-color .32s ease, box-shadow .32s ease; }
  .about-team-image { aspect-ratio: 4 / 4.5; overflow: hidden; background: #242421; }
  .about-team-image img { height: 100%; object-fit: cover; transition: transform .65s cubic-bezier(.2,.8,.2,1), filter .4s ease; }
  .about-team-card:hover .about-team-image img { transform: scale(1.055); filter: saturate(1.08); }
  .about-team-info { padding: 18px; }
  .about-team-info h3 { margin: 0; font-size: 1.06rem; }
  .about-team-info p { margin: 7px 0 0; color: var(--about-muted); font-size: .91rem; line-height: 1.55; }
  .about-team-label { display: inline-flex; margin-top: 12px; padding: 5px 9px; border-radius: 99px; color: var(--about-gold); background: rgba(214,168,79,.09); font-size: .75rem; }
  .about-small-note { margin: 18px auto 0; color: var(--about-muted); font-size: .88rem; text-align: center; }

  .about-space-grid { display: grid; grid-template-columns: 1.1fr .9fr; gap: 18px; margin-top: 36px; }
  .about-space-main, .about-space-side { min-height: 300px; border-radius: 24px; overflow: hidden; border: 1px solid var(--about-line); }
  .about-space-main { position: relative; }
  .about-space-main img, .about-space-side img { width: 100%; height: 100%; object-fit: cover; transition: transform .65s ease; }
  .about-space-main:hover img, .about-space-side:hover img { transform: scale(1.04); }
  .about-space-main img { position: absolute; inset: 0; }
  .about-space-caption { position: absolute; inset: auto 0 0; padding: 22px; background: linear-gradient(transparent, rgba(0,0,0,.8)); }
  .about-space-caption strong { display: block; font-size: 1.1rem; }
  .about-space-caption span { display: block; margin-top: 4px; color: rgba(250,248,243,.8); font-size: .91rem; }
  .about-space-side { display: grid; grid-template-rows: 1fr 1fr; gap: 18px; border: 0; overflow: visible; }
  .about-space-side figure { position: relative; min-height: 140px; margin: 0; border: 1px solid var(--about-line); border-radius: 22px; overflow: hidden; }
  .about-space-side img { position: absolute; inset: 0; }

  .about-hygiene { display: grid; grid-template-columns: auto 1fr; align-items: start; gap: 20px; max-width: 900px; margin: 32px auto 0; padding: clamp(22px,4vw,34px); border: 1px solid rgba(214,168,79,.28); border-radius: 24px; background: linear-gradient(135deg, rgba(214,168,79,.095), rgba(250,248,243,.025)); }
  .about-hygiene h3 { margin: 0; font-size: 1.18rem; }
  .about-hygiene p { margin: 8px 0 0; color: var(--about-muted); line-height: 1.8; }

  .about-gallery-grid { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 14px; margin-top: 36px; }
  .about-gallery-item { position: relative; aspect-ratio: 1.28; border: 1px solid var(--about-line); border-radius: 19px; overflow: hidden; background: #242421; }
  .about-gallery-item img { height: 100%; object-fit: cover; transition: transform .6s cubic-bezier(.2,.8,.2,1), filter .4s ease; }
  .about-gallery-item:hover img { transform: scale(1.06); filter: saturate(1.08); }
  .about-gallery-item figcaption { position: absolute; inset: auto 0 0; padding: 34px 14px 13px; color: var(--about-ivory); font-size: .9rem; font-weight: 600; background: linear-gradient(transparent, rgba(0,0,0,.78)); }
  .about-gallery-item figure { height: 100%; margin: 0; }
  .about-gallery-item img { position: absolute; inset: 0; }

  .about-faq-list { display: grid; gap: 12px; max-width: 850px; margin: 34px auto 0; }
  .about-faq-item { overflow: hidden; transition: border-color .25s ease, background .25s ease; }
  .about-faq-item[open] { border-color: rgba(214,168,79,.46); background: rgba(250,248,243,.075); }
  .about-faq-item summary { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 18px 20px; cursor: pointer; font-weight: 650; list-style: none; }
  .about-faq-item summary::-webkit-details-marker { display: none; }
  .about-faq-item summary::after { content: '+'; color: var(--about-gold); font-size: 1.4rem; transition: transform .25s ease; }
  .about-faq-item[open] summary::after { content: '−'; transform: rotate(180deg); }
  .about-faq-answer { padding: 0 20px 19px; color: var(--about-muted); line-height: 1.75; }

  .about-location-grid { display: grid; grid-template-columns: .82fr 1.18fr; gap: 24px; align-items: stretch; margin-top: 36px; }
  .about-contact-card { padding: clamp(22px,4vw,32px); border: 1px solid var(--about-line); border-radius: 24px; background: var(--about-glass); }
  .about-contact-row { display: flex; align-items: flex-start; gap: 13px; margin-top: 19px; color: var(--about-muted); line-height: 1.6; }
  .about-contact-row:first-of-type { margin-top: 22px; }
  .about-contact-row svg { flex: 0 0 auto; margin-top: 2px; color: var(--about-gold); }
  .about-contact-row a { color: var(--about-ivory); text-decoration: underline; text-decoration-color: rgba(214,168,79,.5); text-underline-offset: 4px; }
  .about-map { width: 100%; min-height: 330px; border: 1px solid var(--about-line); border-radius: 24px; filter: grayscale(.2) contrast(1.04); }

  .about-final-cta { position: relative; overflow: hidden; padding: clamp(38px, 7vw, 72px); border: 1px solid rgba(214,168,79,.32); border-radius: 30px; text-align: center; background: radial-gradient(ellipse at 50% 0%, rgba(214,168,79,.14), transparent 55%), linear-gradient(135deg, rgba(250,248,243,.065), rgba(250,248,243,.018)); box-shadow: 0 24px 70px rgba(0,0,0,.24); }
  .about-final-cta h2 { max-width: 700px; margin: 14px auto 0; font-family: Georgia, 'Times New Roman', serif; font-size: clamp(2rem, 5vw, 3.7rem); line-height: 1.08; letter-spacing: -.035em; }
  .about-final-cta p { max-width: 620px; margin: 16px auto 0; color: var(--about-muted); line-height: 1.8; }
  .about-final-cta .about-actions { justify-content: center; }
  .about-reveal { opacity: 0; transform: translateY(24px); transition: opacity .72s cubic-bezier(.2,.8,.2,1), transform .78s cubic-bezier(.2,.8,.2,1); transition-delay: var(--about-delay, 0ms); }
  .about-reveal.is-visible { opacity: 1; transform: translateY(0); }
  @keyframes about-rise-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .about-page :focus-visible { outline: 2px solid var(--about-gold); outline-offset: 4px; border-radius: 5px; }

  @media (max-width: 900px) {
    .about-values-grid, .about-team-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
    .about-difference-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
    .about-story-grid { grid-template-columns: 1fr 1fr; gap: 30px; }
  }
  @media (max-width: 640px) {
    .about-wrap, .about-hero-content { width: min(100% - 30px, 1160px); }
    .about-section { padding: 60px 0; }
    .about-hero { min-height: 590px; min-height: min(740px, 82svh); }
    .about-hero::before { background-image: linear-gradient(0deg, rgba(15,15,14,.93) 0%, rgba(15,15,14,.55) 57%, rgba(15,15,14,.15) 100%), url('public/Hair plaiting 1.jpg'); background-position: 55% center; }
    .about-hero-content { padding: 72px 0 58px; }
    .about-hero h1 { font-size: clamp(2.8rem, 14vw, 4.8rem); }
    .about-actions { display: grid; grid-template-columns: 1fr; max-width: 360px; }
    .about-button { width: 100%; }
    .about-story-grid, .about-purpose-grid, .about-space-grid, .about-location-grid { grid-template-columns: 1fr; }
    .about-story-photo { min-height: 380px; order: -1; }
    .about-purpose-grid { gap: 12px; }
    .about-values-grid, .about-difference-grid { grid-template-columns: 1fr; gap: 12px; }
    .about-value-card { min-height: auto; }
    .about-team-grid { grid-template-columns: repeat(2, minmax(0,1fr)); gap: 11px; }
    .about-team-info { padding: 14px; }
    .about-team-info h3 { font-size: .96rem; }
    .about-team-info p { font-size: .84rem; }
    .about-team-image { aspect-ratio: 4 / 4.8; }
    .about-space-grid { gap: 12px; }
    .about-space-main { min-height: 270px; }
    .about-space-side { grid-template-columns: 1fr 1fr; grid-template-rows: 170px; gap: 12px; }
    .about-gallery-grid { grid-template-columns: repeat(2, minmax(0,1fr)); gap: 10px; }
    .about-gallery-item { aspect-ratio: .96; border-radius: 15px; }
    .about-gallery-item figcaption { font-size: .8rem; }
    .about-hygiene { grid-template-columns: 1fr; gap: 14px; }
    .about-map { min-height: 280px; }
    .about-faq-item summary { padding: 16px; }
    .about-faq-answer { padding: 0 16px 16px; }
  }
  @media (max-width: 380px) {
    .about-team-grid { grid-template-columns: 1fr; }
    .about-team-image { aspect-ratio: 1.2; }
    .about-space-side { grid-template-columns: 1fr; grid-template-rows: 160px 160px; }
  }
  @media (prefers-reduced-motion: reduce) {
    .about-page *, .about-page *::before, .about-page *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; transition-delay: 0ms !important; scroll-behavior: auto !important; }
    .about-page .about-reveal { opacity: 1 !important; transform: none !important; }
  }
`

function Reveal({ children, className = '', delay = 0 }) {
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
      className={`about-reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{ '--about-delay': `${delay}ms` }}
    >
      {children}
    </div>
  )
}

function About() {
  return (
    <main className="about-page">
      <style>{aboutStyles}</style>

      <section className="about-hero" aria-labelledby="about-hero-title">
        <div className="about-hero-content">
          <span className="about-kicker">Crystal Five Salon &amp; Kinyozi</span>
          <h1 id="about-hero-title">Our story.<br /><em>Your style.</em></h1>
          <p>
            A place for grooming, beauty and a little time for yourself. Explore the services,
            meet the team and find the right next step for your look.
          </p>
          <div className="about-actions">
            <Link to="/services" className="about-button about-button-primary">
              Explore services <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link to="/book-now" className="about-button about-button-quiet">
              Book an appointment <CalendarCheck size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="about-section" aria-labelledby="about-story-title">
        <div className="about-wrap about-story-grid">
          <Reveal className="about-story-copy">
            <span className="about-kicker">A little about us</span>
            <h2 className="about-heading" id="about-story-title">Good care starts with listening.</h2>
            <p>
              Crystal Five brings salon, kinyozi, hair-care and beauty services together in one
              welcoming place. Every visit starts with understanding what you want, then choosing
              the service and style that feel right for you.
            </p>
            <p>
              Whether you are keeping to a familiar look or ready for a change, our aim is to make
              the experience clear, comfortable and personal—from browsing services to the final
              details of your appointment.
            </p>
            <div className="about-actions">
              <Link to="/services" className="about-button about-button-primary">
                See what we offer <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
          <Reveal delay={100} className="about-story-photo">
            <img src="public/Babering Services 0.jpg" alt="A barber carefully shaping a client's beard" loading="lazy" />
            <div className="about-photo-note">
              <strong>Look good. Feel great.</strong>
              <span>Professional grooming and beauty, with a personal touch.</span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="about-section about-section-alt" aria-labelledby="about-purpose-title">
        <div className="about-wrap">
          <Reveal className="about-section-head">
            <span className="about-kicker">What guides us</span>
            <h2 className="about-heading" id="about-purpose-title">A simple purpose, thoughtfully delivered.</h2>
            <p className="about-lead">
              Our focus is helping you feel comfortable, understood and confident in the choices
              you make for your hair, grooming and beauty care.
            </p>
          </Reveal>
          <div className="about-purpose-grid">
            <Reveal delay={40}>
              <article className="about-purpose-card">
                <span className="about-card-icon"><Sparkles size={23} /></span>
                <h3>Our mission</h3>
                <p>To make professional grooming and beauty services feel welcoming, personal and easy to access.</p>
              </article>
            </Reveal>
            <Reveal delay={120}>
              <article className="about-purpose-card">
                <span className="about-card-icon"><Heart size={23} /></span>
                <h3>Our vision</h3>
                <p>To be a trusted local destination where people can care for their style and leave feeling refreshed.</p>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="about-section" aria-labelledby="about-values-title">
        <div className="about-wrap">
          <Reveal className="about-section-head">
            <span className="about-kicker">The Crystal Five approach</span>
            <h2 className="about-heading" id="about-values-title">What matters in every visit.</h2>
            <p className="about-lead">The details that help make a service feel considered, comfortable and yours.</p>
          </Reveal>
          <div className="about-values-grid">
            {values.map((value, index) => (
              <Reveal key={value.title} delay={index * 70}>
                <article className="about-value-card">
                  <span className="about-card-icon">{createElement(value.icon, { size: 21, 'aria-hidden': true })}</span>
                  <h3>{value.title}</h3>
                  <p>{value.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="about-section about-section-alt" aria-labelledby="about-difference-title">
        <div className="about-wrap">
          <Reveal className="about-section-head">
            <span className="about-kicker">One place, many ways to feel good</span>
            <h2 className="about-heading" id="about-difference-title">Find the care that fits you.</h2>
          </Reveal>
          <div className="about-difference-grid">
            {[
              { icon: Scissors, title: 'Salon & hair care', text: 'Browse braiding, styling, washing and treatment options.' },
              { icon: Users, title: 'Kinyozi & grooming', text: 'Explore haircut, fade, shave and beard-grooming services.' },
              { icon: Sparkles, title: 'Beauty & nails', text: 'Find beauty, nail and personal-care services in one place.' },
              { icon: CalendarCheck, title: 'Booking made clear', text: 'Review service details and continue to booking when you are ready.' },
              { icon: Heart, title: 'Your preferences matter', text: 'Tell the team what you have in mind so your visit can start with a conversation.' },
              { icon: BadgeCheck, title: 'Choose with confidence', text: 'See the available options on the Services page before deciding.' },
            ].map((item, index) => (
              <Reveal key={item.title} delay={index * 45}>
                <article className="about-difference-card">
                  <span className="about-card-icon">{createElement(item.icon, { size: 20, 'aria-hidden': true })}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="about-section" aria-labelledby="about-team-title">
        <div className="about-wrap">
          <Reveal className="about-section-head">
            <span className="about-kicker">The people behind your visit</span>
            <h2 className="about-heading" id="about-team-title">Meet the team.</h2>
            <p className="about-lead">Get to know the service roles available at Crystal Five. Ask us about availability when you book.</p>
          </Reveal>
          <div className="about-team-grid">
            {team.map((member, index) => (
              <Reveal key={member.role} delay={index * 65}>
                <article className="about-team-card">
                  <div className="about-team-image">
                    <img src={member.image} alt={member.alt} loading="lazy" />
                  </div>
                  <div className="about-team-info">
                    <h3>{member.role}</h3>
                    <p>{member.specialty}</p>
                    <span className="about-team-label">Crystal Five team</span>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          <p className="about-small-note">Team photos and role descriptions can be updated as your public staff profiles are confirmed.</p>
        </div>
      </section>

      <section className="about-section about-section-alt" aria-labelledby="about-space-title">
        <div className="about-wrap">
          <Reveal className="about-section-head">
            <span className="about-kicker">A look around</span>
            <h2 className="about-heading" id="about-space-title">A space for your next refresh.</h2>
            <p className="about-lead">A glimpse of the services, people and setting you can explore at Crystal Five.</p>
          </Reveal>
          <div className="about-space-grid">
            <Reveal className="about-space-main">
              <img src="public/Barber Shop 1.jpg" alt="Barber shop interior and styling stations" loading="lazy" />
              <div className="about-space-caption"><strong>Come in and make yourself comfortable.</strong><span>Find us at Jomo Drive, Nderi, Kenya.</span></div>
            </Reveal>
            <div className="about-space-side">
              <Reveal delay={80}>
                <figure><img src="public/Service.jpg" alt="A barber providing a careful grooming service" loading="lazy" /></figure>
              </Reveal>
              <Reveal delay={150}>
                <figure><img src="public/Nails Manicure.jpg" alt="Manicure service" loading="lazy" /></figure>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="about-section" aria-labelledby="about-care-title">
        <div className="about-wrap">
          <Reveal className="about-section-head">
            <span className="about-kicker">Comfort and care</span>
            <h2 className="about-heading" id="about-care-title">Your comfort matters.</h2>
          </Reveal>
          <Reveal>
            <div className="about-hygiene">
              <span className="about-card-icon"><Check size={22} /></span>
              <div>
                <h3>A comfortable visit starts with good questions.</h3>
                <p>
                  If you have questions about tools, products or service preparation, please ask
                  the team before your appointment. We want you to feel informed and at ease.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="about-section about-section-alt" aria-labelledby="about-gallery-title">
        <div className="about-wrap">
          <Reveal className="about-section-head">
            <span className="about-kicker">A little inspiration</span>
            <h2 className="about-heading" id="about-gallery-title">Explore the work and services.</h2>
            <p className="about-lead">Browse a few examples from the images already featured across the site.</p>
          </Reveal>
          <div className="about-gallery-grid">
            {gallery.map((item, index) => (
              <Reveal key={item.label} delay={index * 45}>
                <div className="about-gallery-item">
                  <figure>
                    <img src={item.image} alt={item.alt} loading="lazy" />
                    <figcaption>{item.label}</figcaption>
                  </figure>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="about-actions" style={{ justifyContent: 'center', marginTop: 28 }}>
            <Link to="/services" className="about-button about-button-quiet">
              View all services <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="about-section" aria-labelledby="about-faq-title">
        <div className="about-wrap">
          <Reveal className="about-section-head">
            <span className="about-kicker">Good to know</span>
            <h2 className="about-heading" id="about-faq-title">A few helpful answers.</h2>
          </Reveal>
          <div className="about-faq-list">
            {faqs.map((item, index) => (
              <Reveal key={item.question} delay={index * 50}>
                <details className="about-faq-item">
                  <summary>{item.question}</summary>
                  <div className="about-faq-answer">{item.answer}</div>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="about-section about-section-alt" aria-labelledby="about-location-title">
        <div className="about-wrap">
          <Reveal className="about-section-head">
            <span className="about-kicker">Come say hello</span>
            <h2 className="about-heading" id="about-location-title">Find Crystal Five.</h2>
            <p className="about-lead">Jomo Drive, Nderi, Kenya</p>
          </Reveal>
          <div className="about-location-grid">
            <Reveal>
              <div className="about-contact-card">
                <span className="about-kicker">Contact &amp; directions</span>
                <div className="about-contact-row"><MapPin size={19} /><span>Jomo Drive, Nderi, Kenya<br /><a href="https://www.google.com/maps/search/?api=1&query=Jomo+Drive%2C+Nderi%2C+Kenya" target="_blank" rel="noopener noreferrer">Open directions</a></span></div>
                <div className="about-contact-row"><Phone size={18} /><a href="tel:+254701641896">0701 641 896</a></div>
                <div className="about-contact-row"><MessageCircle size={18} /><a href="https://wa.me/254701641896" target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a></div>
                <div className="about-contact-row"><Clock size={18} /><span>For current availability, please contact us or continue to booking.</span></div>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <iframe
                className="about-map"
                title="Map showing Jomo Drive, Nderi, Kenya"
                src="https://maps.google.com/maps?q=Jomo%20Drive%2C%20Nderi%2C%20Kenya&t=&z=14&ie=UTF8&iwloc=&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="about-section" aria-labelledby="about-cta-title">
        <div className="about-wrap">
          <Reveal>
            <div className="about-final-cta">
              <span className="about-kicker">Your next great look starts here</span>
              <h2 id="about-cta-title">Ready when you are.</h2>
              <p>Explore the services, choose what feels right and book your visit with Crystal Five.</p>
              <div className="about-actions">
                <Link to="/book-now" className="about-button about-button-primary">Book your appointment <ArrowRight size={18} aria-hidden="true" /></Link>
                <Link to="/services" className="about-button about-button-quiet">Explore services</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}

export default About
