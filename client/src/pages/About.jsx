import { createElement } from 'react'
import { ArrowRight, CalendarCheck, Heart, Scissors, Sparkles, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

const serviceLanes = [
  { number: '01', icon: Scissors, title: 'Hair salon', detail: 'Braids, styling and blow-dry.', category: 'hair-salon' },
  { number: '02', icon: Users, title: 'Kinyozi & grooming', detail: 'Cuts, fades and beard care.', category: 'kinyozi' },
  { number: '03', icon: Sparkles, title: 'Beauty & nails', detail: 'Makeup, nails and personal care.', category: 'beauty' },
  { number: '04', icon: Heart, title: 'Hair care', detail: 'Wash, condition and treatments.', category: 'hair-care' },
]

const aboutStyles = `
  .about-page { --paper:#faf9f5; --ink:#27322b; --green:#286747; --gold:#a87927; --muted:#657169; --line:#e1e3db; color:var(--ink); background:var(--paper); font-family:inherit; line-height:1.65; }
  .about-page *, .about-page *::before, .about-page *::after { box-sizing:border-box; }
  .about-page img { display:block; max-width:100%; width:100%; }
  .about-page a { color:inherit; text-decoration:none; }
  .about-page :focus-visible { outline:3px solid rgba(40,103,71,.32); outline-offset:3px; }
  .ab-wrap { width:min(1120px,calc(100% - 40px)); margin-inline:auto; }
  .ab-hero { display:grid; grid-template-columns:1fr .9fr; align-items:center; gap:clamp(36px,7vw,86px); width:min(1120px,calc(100% - 40px)); min-height:clamp(530px,72vh,700px); margin-inline:auto; padding:55px 0 50px; }
  .ab-eyebrow { display:inline-flex; align-items:center; gap:8px; color:var(--green); font-size:.78rem; font-weight:700; letter-spacing:.11em; text-transform:uppercase; }
  .ab-hero h1 { margin:20px 0 0; font-family:Georgia,'Times New Roman',serif; font-size:clamp(3.2rem,7.4vw,6rem); font-weight:500; letter-spacing:-.06em; line-height:.98; }
  .ab-hero h1 em { color:var(--green); font-weight:500; }
  .ab-hero-copy > p { max-width:490px; margin:22px 0 0; color:var(--muted); font-size:1.05rem; line-height:1.85; }
  .ab-actions { display:flex; flex-wrap:wrap; gap:10px; margin-top:27px; }
  .ab-button { display:inline-flex; min-height:46px; align-items:center; justify-content:center; gap:9px; padding:10px 16px; border:1px solid #d4dbd3; border-radius:7px; background:#fff; color:var(--ink); font-size:.91rem; font-weight:600; transition:background .16s,border-color .16s; }
  .ab-button:hover { border-color:#9db6a2; background:#f2f7f2; }
  .ab-button-primary { border-color:var(--green); background:var(--green); color:#fff!important; }
  .ab-button-primary:hover { border-color:#1f5339; background:#1f5339; }
  .ab-hero-figure { margin:0; }
  .ab-hero-figure img { height:clamp(380px,51vw,560px); object-fit:cover; object-position:center; }
  .ab-hero-figure figcaption { display:flex; justify-content:space-between; gap:12px; margin-top:10px; color:var(--muted); font-size:.78rem; }
  .ab-hero-figure figcaption strong { color:var(--ink); font-weight:600; }
  .ab-section { padding:clamp(68px,9vw,110px) 0; border-top:1px solid var(--line); }
  .ab-story-grid { display:grid; grid-template-columns:1fr .78fr; align-items:start; gap:clamp(40px,8vw,110px); }
  .ab-kicker { color:var(--green); font-size:.75rem; font-weight:700; letter-spacing:.12em; text-transform:uppercase; }
  .ab-heading { margin:12px 0 0; font-family:Georgia,'Times New Roman',serif; font-size:clamp(2.2rem,5vw,3.7rem); font-weight:500; letter-spacing:-.04em; line-height:1.08; }
  .ab-story-copy > p { max-width:620px; margin:17px 0 0; color:var(--muted); line-height:1.9; }
  .ab-pullquote { margin:8px 0 0; padding:5px 0 5px 24px; border-left:2px solid #c6a35d; font-family:Georgia,'Times New Roman',serif; font-size:clamp(1.4rem,3vw,2rem); line-height:1.45; }
  .ab-pullquote span { display:block; margin-top:13px; color:var(--muted); font-family:inherit; font-size:.82rem; letter-spacing:.04em; }
  .ab-purpose { display:grid; grid-template-columns:1fr 1fr; gap:28px; margin-top:40px; padding-top:21px; border-top:1px solid var(--line); }
  .ab-purpose h3 { margin:0; color:var(--green); font-size:.77rem; letter-spacing:.1em; text-transform:uppercase; }
  .ab-purpose p { margin:8px 0 0; font-family:Georgia,'Times New Roman',serif; font-size:1.08rem; line-height:1.6; }
  .ab-services { background:#f2f1eb; }
  .ab-services-top { display:flex; align-items:end; justify-content:space-between; gap:25px; margin-bottom:27px; }
  .ab-services-top p { max-width:280px; margin:0; color:var(--muted); font-size:.9rem; }
  .ab-service-list { border-top:1px solid #dcded6; }
  .ab-service-row { display:grid; grid-template-columns:52px minmax(210px,.8fr) minmax(0,1fr) 38px; align-items:center; gap:15px; padding:17px 8px; border-bottom:1px solid #dcded6; transition:background .16s,padding .16s; }
  .ab-service-row:hover { padding-inline:15px; background:#fafaf6; }
  .ab-service-n { color:#8c958c; font-size:.8rem; font-variant-numeric:tabular-nums; }
  .ab-service-title { display:flex; align-items:center; gap:10px; font-family:Georgia,'Times New Roman',serif; font-size:1.27rem; }
  .ab-service-title svg { color:var(--green); }
  .ab-service-row p { margin:0; color:var(--muted); font-size:.89rem; }
  .ab-service-arrow { display:grid; place-items:center; width:34px; height:34px; border:1px solid #d5dbd3; border-radius:50%; color:var(--green); }
  .ab-final { display:flex; align-items:center; justify-content:space-between; gap:25px; padding:42px 0 55px; }
  .ab-final h2 { margin:8px 0 0; font-family:Georgia,'Times New Roman',serif; font-size:clamp(1.8rem,4vw,2.8rem); font-weight:500; letter-spacing:-.03em; }
  .ab-final p { margin:7px 0 0; color:var(--muted); font-size:.92rem; }
  @media(max-width:760px) {
    .ab-wrap,.ab-hero { width:min(100% - 30px,1120px); }
    .ab-hero { grid-template-columns:1fr; gap:26px; min-height:unset; padding:45px 0 38px; }
    .ab-hero h1 { font-size:clamp(3.3rem,13vw,5rem); }
    .ab-hero-copy > p { margin-top:16px; }
    .ab-hero-figure img { height:min(95vw,430px); }
    .ab-section { padding:58px 0; }
    .ab-story-grid { grid-template-columns:1fr; gap:25px; }
    .ab-pullquote { max-width:520px; }
    .ab-purpose { margin-top:25px; gap:16px; }
    .ab-services-top { align-items:flex-start; flex-direction:column; gap:10px; }
    .ab-services-top p { max-width:520px; }
    .ab-service-row { grid-template-columns:34px minmax(0,1fr) 34px; gap:10px; padding:14px 2px; }
    .ab-service-title { font-size:1.08rem; gap:7px; }
    .ab-service-title svg { width:18px; }
    .ab-service-row p { grid-column:2; grid-row:2; margin-top:-7px; font-size:.81rem; }
    .ab-service-arrow { grid-column:3; grid-row:1 / span 2; width:31px; height:31px; }
    .ab-final { align-items:flex-start; flex-direction:column; padding:36px 0 44px; }
    .ab-actions { width:100%; max-width:380px; }
  }
  @media(max-width:420px) {
    .ab-hero h1 { font-size:3.05rem; }
    .ab-purpose { grid-template-columns:1fr; gap:18px; }
    .ab-actions { display:grid; grid-template-columns:1fr; }
    .ab-button { width:100%; }
  }
  @media(prefers-reduced-motion:reduce) { .about-page *,.about-page *::before,.about-page *::after { scroll-behavior:auto!important; transition-duration:.01ms!important; } }
`

function About() {
  return (
    <main className="about-page">
      <style>{aboutStyles}</style>
      <section className="ab-hero" aria-labelledby="about-title">
        <div className="ab-hero-copy">
          <span className="ab-eyebrow">Crystal Five · Jomo Drive, Nderi</span>
          <h1 id="about-title">Good care.<br /><em>Your own style.</em></h1>
          <p>A welcoming place for salon, kinyozi, hair-care and beauty services. We want you to feel comfortable exploring your options and choosing what feels right for you.</p>
          <div className="ab-actions">
            <Link to="/services" className="ab-button">Explore services <ArrowRight size={17} aria-hidden="true" /></Link>
            <Link to="/book-now" className="ab-button ab-button-primary">Book an appointment <CalendarCheck size={17} aria-hidden="true" /></Link>
          </div>
        </div>
        <figure className="ab-hero-figure">
          <img src="/Hair plaiting 1.jpg" alt="Hair braiding service at Crystal Five" />
          <figcaption><strong>Crystal Five Salon &amp; Kinyozi</strong><span>Nderi, Kenya</span></figcaption>
        </figure>
      </section>

      <section className="ab-section" aria-labelledby="about-story-title">
        <div className="ab-wrap ab-story-grid">
          <div className="ab-story-copy">
            <span className="ab-kicker">A little about us</span>
            <h2 className="ab-heading" id="about-story-title">A good visit starts with listening.</h2>
            <p>Crystal Five brings salon, kinyozi, hair-care and beauty services together in one welcoming place. We take time to understand what you have in mind, then help you find a service and style that feels right for you.</p>
            <p>Whether you are keeping to a familiar look or ready for a change, our aim is to make the experience clear, comfortable and personal—from choosing a service to the finishing touch.</p>
            <div className="ab-purpose">
              <article><h3>Our mission</h3><p>Make grooming and beauty feel welcoming, personal and easy to access.</p></article>
              <article><h3>Our vision</h3><p>Be a trusted local destination where people can care for their style and leave refreshed.</p></article>
            </div>
          </div>
          <blockquote className="ab-pullquote">“Your choices and preferences come first.”<span>The Crystal Five approach</span></blockquote>
        </div>
      </section>

      <section className="ab-section ab-services" aria-labelledby="about-services-title">
        <div className="ab-wrap">
          <div className="ab-services-top">
            <div><span className="ab-kicker">What you’ll find here</span><h2 className="ab-heading" id="about-services-title">A few ways to refresh.</h2></div>
            <p>Visit Services for the full menu, details and current pricing.</p>
          </div>
          <div className="ab-service-list">
            {serviceLanes.map((item) => (
              <Link key={item.number} to={`/services?category=${item.category}`} className="ab-service-row">
                <span className="ab-service-n">{item.number}</span>
                <span className="ab-service-title">{createElement(item.icon, { size: 20, 'aria-hidden': true })}{item.title}</span>
                <p>{item.detail}</p>
                <span className="ab-service-arrow"><ArrowRight size={16} aria-hidden="true" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="ab-wrap ab-final" aria-labelledby="about-next-title">
        <div><span className="ab-kicker">Whenever you’re ready</span><h2 id="about-next-title">Your next visit starts here.</h2><p>Browse the services, then choose a time that works for you.</p></div>
        <div className="ab-actions"><Link to="/book-now" className="ab-button ab-button-primary">Book your appointment <ArrowRight size={17} aria-hidden="true" /></Link><Link to="/services" className="ab-button">View services</Link></div>
      </section>
    </main>
  )
}

export default About
