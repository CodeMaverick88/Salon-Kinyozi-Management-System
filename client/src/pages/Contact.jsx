import { createElement, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Clock, MapPin, MessageCircle, Phone, Send, Sparkles } from 'lucide-react'

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
  { question: 'How can I book an appointment?', answer: 'Choose Book Now to view the available booking options, or contact us on WhatsApp if you need help before booking.' },
  { question: 'Where are you located?', answer: 'We are at Jomo Drive, Nderi, Kenya. Use the map and directions link on this page to plan your visit.' },
  { question: 'Can I ask about a service or price first?', answer: 'Yes. Choose Service enquiry or Price enquiry in the form and continue to WhatsApp with your question.' },
  { question: 'What are your opening hours?', answer: 'Opening hours have not been provided here yet. Please contact us to confirm availability before visiting.' },
]

const socialLinks = [
  { name: 'Instagram', href: 'https://www.instagram.com/its__ramsay/', icon: 'instagram' },
  { name: 'Facebook', href: 'https://www.facebook.com/its__ramsay/', icon: 'facebook' },
  { name: 'Threads', href: 'https://www.threads.net/@its__ramsay', icon: 'threads' },
  { name: 'X', href: 'https://x.com/its__ramsay', icon: 'x' },
  { name: 'TikTok', href: 'https://www.tiktok.com/@its__ramsay', icon: 'tiktok' },
]

const contactStyles = `
  .contact-page { --paper:#faf9f5; --white:#fff; --ink:#27322b; --green:#286747; --green-dark:#1f5339; --gold:#a87927; --muted:#667169; --line:#e1e4dc; color:var(--ink); background:var(--paper); font-family:inherit; line-height:1.6; }
  .contact-page *, .contact-page *::before, .contact-page *::after { box-sizing:border-box; }
  .contact-page a { color:inherit; text-decoration:none; }
  .contact-page button,.contact-page input,.contact-page select,.contact-page textarea { font:inherit; }
  .contact-page :focus-visible { outline:3px solid rgba(40,103,71,.3); outline-offset:3px; }
  .contact-wrap { width:min(1120px,calc(100% - 40px)); margin-inline:auto; }
  .contact-hero { padding:clamp(50px,8vw,86px) 0 34px; }
  .contact-eyebrow { display:inline-flex; align-items:center; gap:8px; color:var(--green); font-size:.76rem; font-weight:700; letter-spacing:.12em; text-transform:uppercase; }
  .contact-hero h1 { max-width:850px; margin:17px 0 0; font-family:Georgia,'Times New Roman',serif; font-size:clamp(2.9rem,7vw,5.5rem); font-weight:500; letter-spacing:-.055em; line-height:1.01; }
  .contact-hero h1 em { color:var(--green); font-weight:500; }
  .contact-hero p { max-width:620px; margin:18px 0 0; color:var(--muted); font-size:1.02rem; line-height:1.8; }
  .contact-quick { display:flex; flex-wrap:wrap; gap:10px; margin-top:24px; }
  .contact-action { display:inline-flex; min-height:45px; align-items:center; justify-content:center; gap:9px; padding:10px 15px; border:1px solid #d5ddd5; border-radius:7px; background:#fff; color:var(--ink); font-size:.9rem; font-weight:600; transition:background .15s,border-color .15s; }
  .contact-action:hover { border-color:#9eb7a3; background:#f1f7f1; }
  .contact-action-primary { border-color:var(--green); background:var(--green); color:#fff!important; }
  .contact-action-primary:hover { border-color:var(--green-dark); background:var(--green-dark); }
  .contact-main { display:grid; grid-template-columns:minmax(0,.84fr) minmax(0,1.16fr); gap:clamp(25px,5vw,56px); align-items:start; padding:30px 0 75px; border-top:1px solid var(--line); }
  .contact-side { min-width:0; }
  .contact-side h2,.contact-form h2,.contact-faq h2 { margin:0; font-family:Georgia,'Times New Roman',serif; font-size:clamp(1.65rem,3vw,2.25rem); font-weight:500; letter-spacing:-.025em; line-height:1.2; }
  .contact-side > p { margin:8px 0 0; color:var(--muted); font-size:.92rem; }
  .contact-address { display:flex; align-items:flex-start; gap:11px; margin-top:20px; padding:15px 0; border-top:1px solid var(--line); border-bottom:1px solid var(--line); }
  .contact-address > svg { flex:none; margin-top:3px; color:var(--green); }
  .contact-address strong { display:block; font-size:.93rem; }
  .contact-address span { display:block; margin-top:3px; color:var(--muted); font-size:.87rem; }
  .contact-directions { display:inline-flex; align-items:center; gap:6px; margin-top:7px; color:var(--green)!important; font-size:.85rem; font-weight:650; text-decoration:underline!important; text-underline-offset:3px; }
  .contact-hours-note { display:flex; align-items:flex-start; gap:9px; margin:14px 0 0; color:var(--muted); font-size:.84rem; line-height:1.6; }
  .contact-hours-note svg { flex:none; margin-top:2px; color:var(--gold); }
  .contact-map { display:block; width:100%; min-height:228px; margin-top:18px; border:1px solid var(--line); filter:grayscale(.1); }
  .contact-socials { display:flex; flex-wrap:wrap; align-items:center; gap:8px; margin-top:16px; }
  .contact-socials-label { width:100%; margin-bottom:1px; color:var(--muted); font-size:.78rem; }
  .contact-social-link { display:inline-flex; align-items:center; gap:7px; min-height:34px; padding:6px 9px; border:1px solid var(--line); border-radius:5px; background:#fff; color:#505b52!important; font-size:.78rem; transition:border-color .15s,color .15s; }
  .contact-social-link:hover { border-color:#9eb7a3; color:var(--green)!important; }
  .contact-social-mark { display:inline-grid; place-items:center; width:16px; height:16px; color:currentColor; font-size:.8rem; font-weight:800; line-height:1; }
  .contact-form { padding:clamp(19px,3vw,29px); border:1px solid var(--line); background:#fff; }
  .contact-form-intro { margin:8px 0 19px; color:var(--muted); font-size:.85rem; line-height:1.65; }
  .contact-required { color:#9b5b11; }
  .contact-fields { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:14px 13px; }
  .contact-field { display:grid; gap:5px; min-width:0; }
  .contact-field-full { grid-column:1/-1; }
  .contact-field label { color:#455149; font-size:.83rem; font-weight:650; }
  .contact-field label span:not(.contact-required) { color:var(--muted); font-weight:400; }
  .contact-field input,.contact-field select,.contact-field textarea { width:100%; min-height:44px; padding:10px 11px; border:1px solid #d9ddd6; border-radius:5px; outline:0; background:#fff; color:var(--ink); font-size:.9rem; }
  .contact-field input::placeholder,.contact-field textarea::placeholder { color:#89928a; }
  .contact-field input:focus,.contact-field select:focus,.contact-field textarea:focus { border-color:#78a084; box-shadow:0 0 0 3px rgba(40,103,71,.09); }
  .contact-field textarea { min-height:112px; resize:vertical; line-height:1.6; }
  .contact-form-footer { display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:12px; margin-top:17px; }
  .contact-form-note { max-width:350px; color:var(--muted); font-size:.77rem; line-height:1.55; }
  .contact-submit { display:inline-flex; min-height:44px; align-items:center; justify-content:center; gap:8px; padding:10px 14px; border:1px solid var(--green); border-radius:6px; background:var(--green); color:#fff; font-size:.88rem; font-weight:650; cursor:pointer; }
  .contact-submit:hover { border-color:var(--green-dark); background:var(--green-dark); }
  .contact-status { margin-top:13px; padding:10px 12px; border:1px solid #b7d1bc; background:#f0f7f0; color:#294b32; font-size:.85rem; line-height:1.6; }
  .contact-status a { color:var(--green); font-weight:650; text-decoration:underline; text-underline-offset:3px; }
  .contact-faq { padding:54px 0 76px; border-top:1px solid var(--line); background:#f3f2ec; }
  .contact-faq-head { display:flex; align-items:end; justify-content:space-between; gap:20px; margin-bottom:19px; }
  .contact-faq-head p { max-width:350px; margin:0; color:var(--muted); font-size:.88rem; }
  .contact-faq-list { display:grid; grid-template-columns:1fr 1fr; column-gap:35px; border-top:1px solid #dfe1d8; }
  .contact-faq-item { border-bottom:1px solid #dfe1d8; }
  .contact-faq-item summary { display:flex; align-items:center; justify-content:space-between; gap:13px; padding:15px 1px; list-style:none; font-size:.89rem; font-weight:650; cursor:pointer; }
  .contact-faq-item summary::-webkit-details-marker { display:none; }
  .contact-faq-item summary::after { content:'+'; color:var(--green); font-size:1.15rem; }
  .contact-faq-item[open] summary::after { content:'−'; }
  .contact-faq-answer { padding:0 18px 14px 1px; color:var(--muted); font-size:.84rem; line-height:1.7; }
  .contact-more { display:flex; align-items:center; justify-content:space-between; gap:14px; margin-top:21px; padding-top:15px; border-top:1px solid #dfe1d8; color:var(--muted); font-size:.86rem; }
  .contact-more a { display:inline-flex; align-items:center; gap:6px; color:var(--green); font-weight:650; }
  @media(max-width:800px) { .contact-main { grid-template-columns:1fr; gap:30px; } .contact-side { display:grid; grid-template-columns:1fr 1fr; column-gap:20px; } .contact-side-head { grid-column:1/-1; } .contact-address { margin-top:14px; } .contact-map { grid-column:2; grid-row:2/span 3; min-height:245px; margin-top:14px; } .contact-socials { grid-column:1; } }
  @media(max-width:600px) {
    .contact-wrap { width:min(100% - 30px,1120px); }
    .contact-hero { padding:43px 0 26px; }
    .contact-hero h1 { font-size:clamp(2.8rem,13vw,4.3rem); }
    .contact-hero p { margin-top:13px; font-size:.96rem; }
    .contact-quick { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
    .contact-action { min-width:0; padding:9px 10px; font-size:.83rem; }
    .contact-action:last-child { grid-column:1/-1; }
    .contact-main { padding:23px 0 52px; }
    .contact-form { grid-row:1; }
    .contact-side { display:block; }
    .contact-side { grid-row:2; }
    .contact-map { min-height:225px; margin-top:16px; }
    .contact-fields { grid-template-columns:1fr; gap:12px; }
    .contact-field-full { grid-column:auto; }
    .contact-form { padding:17px; }
    .contact-form-footer { align-items:stretch; }
    .contact-form-note { max-width:none; }
    .contact-submit { width:100%; }
    .contact-faq { padding:43px 0 55px; }
    .contact-faq-head { display:block; }
    .contact-faq-head p { margin-top:7px; }
    .contact-faq-list { grid-template-columns:1fr; }
  }
  @media(prefers-reduced-motion:reduce) { .contact-page *,.contact-page *::before,.contact-page *::after { scroll-behavior:auto!important; transition-duration:.01ms!important; } }
`

function SocialMark({ name }) {
  if (name === 'instagram') {
    return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none" /></svg>
  }
  if (name === 'facebook') {
    return <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.4 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V3.9c-.8-.1-1.7-.2-2.6-.2-2.7 0-4.5 1.6-4.5 4.6V10H6.8v3h2.8v8h3.8z" /></svg>
  }
  const mark = name === 'threads' ? '@' : name === 'x' ? 'X' : '♪'
  return <span className="contact-social-mark" aria-hidden="true">{mark}</span>
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
      `Email: ${String(data.get('email') || '').trim() || 'Not provided'}`,
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
      <header className="contact-hero">
        <div className="contact-wrap">
          <span className="contact-eyebrow"><Sparkles size={15} aria-hidden="true" /> Crystal Five · Nderi, Kenya</span>
          <h1>Questions?<br /><em>We’re here to help.</em></h1>
          <p>Ask about a service, price or booking—or get directions to the salon. Choose the easiest way to reach us.</p>
          <nav className="contact-quick" aria-label="Quick contact options">
            <a className="contact-action" href={`tel:+${CONTACT_PHONE_INTERNATIONAL}`}><Phone size={17} aria-hidden="true" /> Call {CONTACT_PHONE_DISPLAY}</a>
            <a className="contact-action contact-action-primary" href={`https://wa.me/${CONTACT_PHONE_INTERNATIONAL}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={17} aria-hidden="true" /> WhatsApp</a>
            <a className="contact-action" href="https://www.google.com/maps/search/?api=1&query=Jomo+Drive%2C+Nderi%2C+Kenya" target="_blank" rel="noopener noreferrer"><MapPin size={17} aria-hidden="true" /> Directions</a>
          </nav>
        </div>
      </header>

      <section className="contact-wrap contact-main" aria-label="Send a message or find us">
        <aside className="contact-side">
          <div className="contact-side-head"><span className="contact-eyebrow">Find the salon</span><h2>Come by Nderi.</h2><p>We’re at Jomo Drive, Nderi, Kenya.</p></div>
          <div className="contact-address"><MapPin size={19} aria-hidden="true" /><div><strong>Crystal Five Salon &amp; Kinyozi</strong><span>{MAP_QUERY}</span><a className="contact-directions" href="https://www.google.com/maps/search/?api=1&query=Jomo+Drive%2C+Nderi%2C+Kenya" target="_blank" rel="noopener noreferrer">Open directions <ArrowRight size={14} aria-hidden="true" /></a></div></div>
          <p className="contact-hours-note"><Clock size={17} aria-hidden="true" /> Opening hours aren’t listed yet. Please contact us to confirm availability before visiting.</p>
          <iframe className="contact-map" title="Map showing Jomo Drive, Nderi, Kenya" src="https://maps.google.com/maps?q=Jomo%20Drive%2C%20Nderi%2C%20Kenya&t=&z=14&ie=UTF8&iwloc=&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          <div className="contact-socials" aria-label="Social media links">
            <span className="contact-socials-label">Follow Crystal Five</span>
            {socialLinks.map((social) => <a key={social.name} className="contact-social-link" href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.name}>{createElement(SocialMark, { name: social.icon })}<span>{social.name}</span></a>)}
          </div>
        </aside>

        <form className="contact-form" onSubmit={handleSubmit}>
          <span className="contact-eyebrow">Send an enquiry</span>
          <h2>How can we help?</h2>
          <p className="contact-form-intro">We’ll prepare a WhatsApp draft with your message. Review it there and tap Send when you’re ready.</p>
          <div className="contact-fields">
            <div className="contact-field"><label htmlFor="contact-name">Full name <span className="contact-required">*</span></label><input id="contact-name" name="name" type="text" autoComplete="name" minLength={2} maxLength={80} placeholder="Your name" required /></div>
            <div className="contact-field"><label htmlFor="contact-email">Email address <span>(optional)</span></label><input id="contact-email" name="email" type="email" autoComplete="email" maxLength={120} placeholder="you@example.com" /></div>
            <div className="contact-field"><label htmlFor="contact-phone">Phone number <span>(optional)</span></label><input id="contact-phone" name="phone" type="tel" autoComplete="tel" maxLength={30} placeholder="Your phone number" /></div>
            <div className="contact-field"><label htmlFor="contact-subject">Subject <span className="contact-required">*</span></label><select id="contact-subject" name="subject" defaultValue="" required><option value="" disabled>Choose a subject</option>{subjects.map((subject) => <option key={subject} value={subject}>{subject}</option>)}</select></div>
            <div className="contact-field contact-field-full"><label htmlFor="contact-response">Preferred response <span>(optional)</span></label><select id="contact-response" name="response" defaultValue="WhatsApp"><option>WhatsApp</option><option>Phone call</option></select></div>
            <div className="contact-field contact-field-full"><label htmlFor="contact-message">Your message <span className="contact-required">*</span></label><textarea id="contact-message" name="message" minLength={5} maxLength={1500} placeholder="Write your question or tell us how we can help…" required /></div>
          </div>
          <div className="contact-form-footer"><span className="contact-form-note">Your information is placed into a WhatsApp draft addressed to {CONTACT_PHONE_DISPLAY}. Nothing is sent until you confirm in WhatsApp.</span><button className="contact-submit" type="submit">Continue to WhatsApp <Send size={16} aria-hidden="true" /></button></div>
          {status && <div className="contact-status" role="status" aria-live="polite">{status}{' '}{draftUrl && <a href={draftUrl} target="_blank" rel="noopener noreferrer">Open WhatsApp draft</a>}</div>}
        </form>
      </section>

      <section className="contact-faq" aria-labelledby="contact-faq-title">
        <div className="contact-wrap">
          <div className="contact-faq-head"><div><span className="contact-eyebrow">A few quick answers</span><h2 id="contact-faq-title">Before you get in touch.</h2></div><p>Still unsure? Call or message us and we’ll help you with the next step.</p></div>
          <div className="contact-faq-list">
            {questions.map((item) => <details key={item.question} className="contact-faq-item"><summary>{item.question}</summary><div className="contact-faq-answer">{item.answer}</div></details>)}
          </div>
          <div className="contact-more"><span>Ready to choose a service?</span><Link to="/services">Browse services <ArrowRight size={15} aria-hidden="true" /></Link></div>
        </div>
      </section>
    </main>
  )
}

export default Contact
