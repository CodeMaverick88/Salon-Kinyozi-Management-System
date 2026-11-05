import { Link } from 'react-router-dom'
import {
  Scissors,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
} from 'lucide-react'

const socialLinks = [
  { label: 'Instagram', href: 'https://www.instagram.com/its__ramsay/', icon: 'instagram' },
  { label: 'Facebook', href: 'https://www.facebook.com/its__ramsay/', icon: 'facebook' },
  { label: 'Threads', href: 'https://www.threads.net/@its__ramsay', icon: 'threads' },
  { label: 'X', href: 'https://x.com/its__ramsay', icon: 'x' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@its__ramsay', icon: 'tiktok' },
  { label: 'WhatsApp', href: 'https://wa.me/254701641896', icon: 'whatsapp' },
]

function SocialIcon({ name }) {
  return (
    <svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true" focusable="false">
      {name === 'instagram' && <>
        <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="4.1" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17.7" cy="6.5" r="1.1" fill="currentColor" />
      </>}
      {name === 'facebook' && <>
        <path fill="currentColor" d="M12 1.8a10.2 10.2 0 1 0 1.6 20.3v-7.2h2.5l.5-3h-3V9.9c0-.9.3-1.5 1.5-1.5h1.6V5.7c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.2H7.7v3h2.6V22A10.2 10.2 0 0 0 12 1.8Z" />
      </>}
      {name === 'threads' && <>
        <path d="M12 21c-5 0-8-3.5-8-8.5C4 7.2 7.1 4 11.7 4c3.8 0 6.3 2.3 6.3 5.8 0 2.4-1.2 3.8-3.2 3.8-1.3 0-2.1-.7-2.2-1.8-.8 1.2-2 1.9-3.4 1.9-1.7 0-2.8-1.1-2.8-2.8 0-2 1.5-3.4 3.5-3.4 2.9 0 4.9 2.1 4.9 5.3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </>}
      {name === 'x' && <path fill="currentColor" d="M18.9 1.2h3.7l-8 9.2 9.4 12.4h-7.4l-5.8-7.6-6.6 7.6H.5l8.6-9.8L.1 1.2h7.6l5.3 6.9 5.9-6.9Zm-1.3 19.4h2L6.7 3.3H4.5l13.1 17.3Z" />}
      {name === 'tiktok' && <path d="M14 3v10.4a4.1 4.1 0 1 1-3.3-4.1M14 3c.5 3.4 2.2 5.2 5.2 5.4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />}
      {name === 'whatsapp' && <>
        <path d="M20.2 11.7a8.2 8.2 0 0 1-12.1 7.2L3 20l1.2-4.9A8.2 8.2 0 1 1 20.2 11.7Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M8.3 7.8c-.3.4-.7 1.1-.5 2 .2.9 1.1 2.1 2.1 3.1 1.1 1.1 2.5 2 3.4 2.2.8.2 1.5-.3 1.8-.7l.5-.8-2.1-1-.8.8c-.8-.3-1.8-1.2-2.2-2l.6-.8-.9-2-1.9-.8Z" fill="currentColor" />
      </>}
    </svg>
  )
}

const footerMotionStyles = `
  .site-footer {
    color: #FAF8F3;
    background: #171717 !important;
    background-color: #171717 !important;
    border-top: 1px solid color-mix(in srgb, #D6A84F 38%, transparent);
  }
  .site-footer .brand { color: #FAF8F3; }
  .site-footer .brand-icon { color: #D6A84F; }
  .site-footer .footer-heading { color: #D6A84F; }
  .site-footer .footer-description,
  .site-footer .footer-bottom,
  .site-footer .footer-link { color: #FAF8F3; }
  .site-footer a.footer-link:hover,
  .site-footer a.footer-link:focus-visible,
  .site-footer .footer-social-link:hover,
  .site-footer .footer-social-link:focus-visible,
  .site-footer .footer-map-link { color: #D6A84F; }
  .site-footer .brand, .site-footer .footer-link, .site-footer .footer-social-link {
    transition: color 200ms ease, transform 220ms ease;
  }
  .site-footer .brand:hover { transform: translateY(-1px); }
  .site-footer .brand-icon { transform-origin: center; transition: transform 350ms ease; }
  .site-footer .brand:hover .brand-icon { transform: rotate(-8deg); }
  .site-footer a.footer-link:hover,
  .site-footer a.footer-link:focus-visible { transform: translateX(3px); }
  .site-footer .footer-social-link:hover,
  .site-footer .footer-social-link:focus-visible { transform: translateY(-2px); }
  .site-footer .footer-map-link { text-decoration: underline; text-underline-offset: 3px; }
  .site-footer :focus-visible { outline: 2px solid #D6A84F; outline-offset: 4px; border-radius: 4px; }
  .site-footer .footer-map-frame {
    display: block;
    width: 100%;
    height: 240px;
    border: 0;
    border-radius: 16px;
  }
  .site-footer .footer-map { grid-column: 1 / -1; }
  .site-footer .footer-social-links { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 18px; align-items: center; }
  .site-footer .footer-social-link { display: inline-flex; align-items: center; justify-content: center; }
  .site-footer .footer-social-link { color: #FAF8F3; }
  @media (prefers-reduced-motion: reduce) {
    .site-footer *, .site-footer *::before, .site-footer *::after {
      animation-duration: .01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: .01ms !important;
      transition-delay: 0ms !important;
      scroll-behavior: auto !important;
    }
  }
`

function Footer() {
  return (
    <>
      <style>{footerMotionStyles}</style>
      <footer className="site-footer">
        <div className="page-container">
          <div className="footer-grid">
            <div>
              <Link to="/" className="brand">
                <Scissors size={32} className="brand-icon" aria-hidden="true" />
                <span>
                  <span className="brand-name">Crystal Five</span>
                  <span className="brand-subtitle">Salon &amp; Kinyozi</span>
                </span>
              </Link>
              <p className="footer-description" style={{ marginTop: 20 }}>
                Your destination for professional beauty, grooming and exceptional personal care.
                Look Good. Feel Great.
              </p>
            </div>

            <div>
              <h3 className="footer-heading">Quick Links</h3>
              <div className="footer-links">
                <Link className="footer-link" to="/">Home</Link>
                <Link className="footer-link" to="/services">Services</Link>
                <Link className="footer-link" to="/about">About Us</Link>
                <Link className="footer-link" to="/contact">Contact</Link>
                <Link className="footer-link" to="/book-now">Book Now</Link>
              </div>
            </div>

            <div>
              <h3 className="footer-heading">Our Services</h3>
              <div className="footer-links">
                <Link className="footer-link" to="/services">Hair Styling</Link>
                <Link className="footer-link" to="/services">Men&apos;s Haircuts</Link>
                <Link className="footer-link" to="/services">Beard Trimming</Link>
                <Link className="footer-link" to="/services">Hair Treatment</Link>
                <Link className="footer-link" to="/services">Beauty &amp; Nails</Link>
              </div>
            </div>

            <div>
              <h3 className="footer-heading">Find Us &amp; Contact</h3>
              <div className="footer-links">
                <a
                  className="footer-link"
                  href="https://www.google.com/maps/search/?api=1&query=Jomo+Drive%2C+Nderi%2C+Kenya"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MapPin size={16} aria-hidden="true" />
                  <span>Jomo Drive, Nderi, Kenya <span className="footer-map-link">Open map</span></span>
                </a>
                <a className="footer-link" href="tel:+254701641896">
                  <Phone size={16} aria-hidden="true" />
                  <span>0701 641 896</span>
                </a>
                <a className="footer-link" href="https://wa.me/254701641896" target="_blank" rel="noopener noreferrer">
                  <MessageCircle size={16} aria-hidden="true" />
                  <span>Message us on WhatsApp</span>
                </a>
                <span className="footer-link">
                  <Mail size={16} aria-hidden="true" />
                  <span>Email details coming soon</span>
                </span>
              </div>
              <div className="footer-social-links" aria-label="Social media links">
                {socialLinks.map(({ label, href, icon }) => (
                  <a
                    key={label}
                    className="footer-social-link"
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                  >
                    <SocialIcon name={icon} />
                  </a>
                ))}
              </div>
            </div>

            <div className="footer-map">
              <h3 className="footer-heading">Our Location</h3>
              <iframe
                className="footer-map-frame"
                title="Map showing Jomo Drive, Nderi, Kenya"
                src="https://maps.google.com/maps?q=Jomo%20Drive%2C%20Nderi%2C%20Kenya&t=&z=14&ie=UTF8&iwloc=&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Crystal Five Salon &amp; Kinyozi. All rights reserved.</span>
            <span>Look Good. Feel Great.</span>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer
