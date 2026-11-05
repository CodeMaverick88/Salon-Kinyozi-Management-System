import { useEffect, useRef, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Scissors, Menu, X } from 'lucide-react'

const navigationLinks = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
]

const navbarMotionStyles = `
  .site-navbar {
    position: static !important;
    inset: auto !important;
    z-index: 10;
    color: #FAF8F3;
    background: #171717 !important;
    background-color: #171717 !important;
    border-bottom: 1px solid color-mix(in srgb, #D6A84F 36%, transparent);
    box-shadow: 0 3px 14px rgb(23 23 23 / 18%);
    animation: navbar-flow-in 620ms cubic-bezier(.2,.8,.2,1) both;
  }
  @keyframes navbar-flow-in {
    from { opacity: 0; translate: 0 -10px; }
    to { opacity: 1; translate: 0 0; }
  }
  .site-navbar .navbar-inner {
    width: 100%;
    max-width: none;
    margin-inline: 0;
    padding: 12px clamp(16px, 3.5vw, 56px);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    background: transparent !important;
    background-color: transparent !important;
    box-shadow: none !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
  }
  .site-navbar .brand,
  .site-navbar .nav-link,
  .site-navbar .nav-book-button,
  .site-navbar .mobile-menu-button { -webkit-tap-highlight-color: transparent; }

  .site-navbar .brand {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
    color: #FAF8F3;
    transition: transform 280ms cubic-bezier(.2,.8,.2,1), filter 280ms ease;
  }
  .site-navbar .brand:hover {
    transform: translateY(-2px);
    filter: drop-shadow(0 0 10px color-mix(in srgb, currentColor 24%, transparent));
  }
  .site-navbar .brand-icon { overflow: visible; color: #D6A84F; }
  .site-navbar .brand-name,
  .site-navbar .brand-subtitle,
  .site-navbar .nav-link,
  .site-navbar .mobile-menu-button { color: #FAF8F3; }
  .site-navbar .brand-icon path {
    transform-box: fill-box;
    transform-origin: center;
  }
  .site-navbar .brand-icon path:nth-of-type(1) {
    animation: scissor-blade-a 520ms cubic-bezier(.2,.8,.2,1) 180ms both;
  }
  .site-navbar .brand-icon path:nth-of-type(2) {
    animation: scissor-blade-b 520ms cubic-bezier(.2,.8,.2,1) 180ms both;
  }
  @keyframes scissor-blade-a {
    0% { transform: rotate(0deg); }
    42% { transform: rotate(-24deg); }
    72% { transform: rotate(10deg); }
    100% { transform: rotate(0deg); }
  }
  @keyframes scissor-blade-b {
    0% { transform: rotate(0deg); }
    42% { transform: rotate(24deg); }
    72% { transform: rotate(-10deg); }
    100% { transform: rotate(0deg); }
  }
  .site-navbar .brand.is-cutting .brand-icon path:nth-of-type(1) { animation: scissor-blade-a 460ms ease both; }
  .site-navbar .brand.is-cutting .brand-icon path:nth-of-type(2) { animation: scissor-blade-b 460ms ease both; }

  .site-navbar .nav-links {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: clamp(16px, 2.2vw, 32px);
  }
  .site-navbar .nav-link {
    position: relative;
    transition: color 220ms ease, transform 220ms ease, text-shadow 220ms ease;
  }
  .site-navbar .nav-link::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -6px;
    height: 2px;
    border-radius: 99px;
    background: #D6A84F;
    transform: scaleX(0);
    transform-origin: left center;
    transition: transform 300ms cubic-bezier(.2,.8,.2,1);
  }
  .site-navbar .nav-link:hover,
  .site-navbar .nav-link:focus-visible,
  .site-navbar .nav-link.active {
    color: #D6A84F;
    text-shadow: 0 0 14px color-mix(in srgb, #D6A84F 48%, transparent);
  }
  .site-navbar .nav-link:hover { transform: translateY(-2px); }
  .site-navbar .nav-link:hover::after,
  .site-navbar .nav-link:focus-visible::after,
  .site-navbar .nav-link.active::after { transform: scaleX(1); }
  .site-navbar .nav-book-button {
    position: relative;
    overflow: hidden;
    border-radius: 999px;
    color: #FAF8F3 !important;
    background: #176B55 !important;
    box-shadow: 0 5px 16px rgb(23 107 85 / 22%);
    transition: transform 240ms cubic-bezier(.2,.8,.2,1), box-shadow 240ms ease, filter 240ms ease;
  }
  .site-navbar .nav-book-button::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: linear-gradient(110deg, transparent 20%, color-mix(in srgb, white 18%, transparent) 48%, transparent 72%);
    transform: translateX(-130%);
    transition: transform 600ms ease;
  }
  .site-navbar .nav-book-button:hover,
  .site-navbar .nav-book-button:focus-visible {
    transform: translateY(-2px);
    filter: drop-shadow(0 7px 14px rgb(214 168 79 / 35%));
  }
  .site-navbar .nav-book-button:hover::before { transform: translateX(130%); }
  .site-navbar .mobile-menu-button {
    display: none;
    border-radius: 999px;
    background: transparent;
    transition: transform 240ms ease, color 220ms ease, filter 220ms ease;
  }
  .site-navbar .mobile-menu-button:hover,
  .site-navbar .mobile-menu-button:focus-visible {
    transform: scale(1.06);
    filter: drop-shadow(0 0 9px color-mix(in srgb, currentColor 30%, transparent));
  }
  .site-navbar .mobile-menu-button svg { animation: navbar-icon-in 220ms ease both; }
  @keyframes navbar-icon-in {
    from { opacity: 0; transform: rotate(-35deg) scale(.75); }
    to { opacity: 1; transform: rotate(0) scale(1); }
  }
  .site-navbar :focus-visible { outline: 2px solid #D6A84F; outline-offset: 4px; }

  @media (max-width: 768px) {
    .site-navbar .navbar-inner { position: relative; flex-wrap: wrap; padding: 10px 16px; gap: 0 12px; }
    .site-navbar .mobile-menu-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 10px;
      margin-left: auto;
      cursor: pointer;
    }
    .site-navbar .nav-links {
      position: static;
      flex: 0 0 100%;
      width: 100%;
      display: flex !important;
      flex-direction: column;
      align-items: stretch;
      gap: 8px;
      padding: 0 16px;
      overflow: hidden;
      max-height: 0;
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      transform: translateY(-9px) scale(.985);
      transform-origin: top center;
      border-radius: 20px;
      background: transparent !important;
      box-shadow: none !important;
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
      transition: max-height 420ms cubic-bezier(.2,.8,.2,1), opacity 240ms ease,
        transform 320ms cubic-bezier(.2,.8,.2,1), visibility 0s linear 420ms,
        padding 300ms ease, margin 300ms ease;
      will-change: max-height, opacity, transform;
    }
    .site-navbar .nav-links.mobile-open {
      max-height: 80vh;
      padding: 14px 16px 18px;
      margin-top: 8px;
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
      transform: translateY(0) scale(1);
      transition: max-height 480ms cubic-bezier(.2,.8,.2,1), opacity 260ms ease 40ms,
        transform 360ms cubic-bezier(.2,.8,.2,1), visibility 0s, padding 300ms ease,
        margin 300ms ease;
    }
    .site-navbar .nav-links .nav-link,
    .site-navbar .nav-links .nav-book-button {
      width: 100%;
      border-radius: 16px;
      padding: 12px 14px;
      opacity: 0;
      transform: translateY(8px);
      transition: opacity 220ms ease, transform 280ms cubic-bezier(.2,.8,.2,1);
    }
    .site-navbar .nav-links.mobile-open .nav-link,
    .site-navbar .nav-links.mobile-open .nav-book-button { opacity: 1; transform: translateY(0); }
    .site-navbar .nav-links.mobile-open .nav-link:nth-child(1) { transition-delay: 60ms; }
    .site-navbar .nav-links.mobile-open .nav-link:nth-child(2) { transition-delay: 100ms; }
    .site-navbar .nav-links.mobile-open .nav-link:nth-child(3) { transition-delay: 140ms; }
    .site-navbar .nav-links.mobile-open .nav-link:nth-child(4) { transition-delay: 180ms; }
    .site-navbar .nav-links.mobile-open .nav-book-button { transition-delay: 220ms; }
  }
  @media (prefers-reduced-motion: reduce) {
    .site-navbar *, .site-navbar *::before, .site-navbar *::after {
      animation-duration: .01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: .01ms !important;
      transition-delay: 0ms !important;
      scroll-behavior: auto !important;
    }
  }
`

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [cutting, setCutting] = useState(true)
  const cuttingTimer = useRef(null)
  const navbarRef = useRef(null)

  useEffect(() => {
    const navbar = navbarRef.current
    if (!navbar) return undefined

    // Inline !important overrides competing global header/navbar rules.
    navbar.style.setProperty('position', 'static', 'important')
    navbar.style.setProperty('top', 'auto', 'important')
    navbar.style.setProperty('inset', 'auto', 'important')
    return undefined
  }, [])

  const closeMenu = () => {
    setMenuOpen(false)
    replayCut()
  }
  const replayCut = () => {
    setCutting(false)
    window.requestAnimationFrame(() => setCutting(true))
    window.clearTimeout(cuttingTimer.current)
    cuttingTimer.current = window.setTimeout(() => setCutting(false), 560)
  }
  const toggleMenu = () => {
    replayCut()
    setMenuOpen((open) => !open)
  }

  useEffect(() => {
    cuttingTimer.current = window.setTimeout(() => setCutting(false), 700)
    return () => window.clearTimeout(cuttingTimer.current)
  }, [])

  useEffect(() => {
    if (!menuOpen) return undefined
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') closeMenu()
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [menuOpen])

  return (
    <>
      <style>{navbarMotionStyles}</style>
      <header ref={navbarRef} className="site-navbar">
        <div className="navbar-inner">
          <Link to="/" className={`brand ${cutting ? 'is-cutting' : ''}`} onClick={closeMenu}>
            <Scissors size={32} className="brand-icon" aria-hidden="true" />
            <span>
              <span className="brand-name">Crystal Five</span>
              <span className="brand-subtitle">Salon &amp; Kinyozi</span>
            </span>
          </Link>
          <button
            type="button"
            className="mobile-menu-button"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
            onClick={toggleMenu}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <nav
            id="main-navigation"
            className={`nav-links ${menuOpen ? 'mobile-open' : ''}`}
            aria-label="Main navigation"
          >
            {navigationLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                onClick={closeMenu}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                {link.name}
              </NavLink>
            ))}
            <Link to="/book-now" className="nav-book-button" onClick={closeMenu}>
              Book Now
            </Link>
          </nav>
        </div>
      </header>
    </>
  )
}

export default Navbar
