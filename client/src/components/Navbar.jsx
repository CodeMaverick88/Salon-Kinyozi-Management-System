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
    position: sticky !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    z-index: 1000;
    color: #27322B;
    background: #FAF9F5 !important;
    background-color: #FAF9F5 !important;
    border-bottom: 1px solid #E1E4DC;
    box-shadow: 0 2px 9px rgb(39 50 43 / 5%);
    animation: navbar-flow-in 440ms cubic-bezier(.2,.7,.2,1) both;
    transition: background-color 240ms ease, box-shadow 240ms ease;
  }

  @keyframes navbar-flow-in {
    from {
      opacity: 0;
      translate: 0 -7px;
    }

    to {
      opacity: 1;
      translate: 0 0;
    }
  }

  .site-navbar .navbar-inner {
    width: min(1160px, calc(100% - 40px));
    max-width: 1160px;
    min-height: 74px;
    margin-inline: auto;
    padding: 15px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    background: transparent !important;
    background-color: transparent !important;
    box-shadow: none !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    transition: min-height 240ms ease, padding 240ms ease, gap 240ms ease;
  }

  .site-navbar .brand,
  .site-navbar .nav-link,
  .site-navbar .nav-book-button,
  .site-navbar .mobile-menu-button {
    -webkit-tap-highlight-color: transparent;
  }

  .site-navbar .brand {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
    color: #27322B;
    transition: transform 220ms ease, color 220ms ease;
  }

  .site-navbar .brand:hover {
    color: #286747;
  }

  .site-navbar .brand-icon {
    overflow: visible;
    color: #286747;
    transition: width 240ms ease, height 240ms ease;
  }

  .site-navbar .brand-name,
  .site-navbar .brand-subtitle,
  .site-navbar .nav-link,
  .site-navbar .mobile-menu-button {
    color: #27322B;
  }

  .site-navbar .brand-name {
    display: block;
    font-size: 1rem;
    font-weight: 700;
    line-height: 1.2;
    transition: font-size 240ms ease;
  }

  .site-navbar .brand-subtitle {
    display: block;
    margin-top: 2px;
    color: #68736A;
    font-size: 0.74rem;
    line-height: 1.2;
    transition: font-size 240ms ease, opacity 180ms ease;
  }

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
    0% { transform: rotate(0); }
    42% { transform: rotate(-24deg); }
    72% { transform: rotate(10deg); }
    100% { transform: rotate(0); }
  }

  @keyframes scissor-blade-b {
    0% { transform: rotate(0); }
    42% { transform: rotate(24deg); }
    72% { transform: rotate(-10deg); }
    100% { transform: rotate(0); }
  }

  .site-navbar .brand.is-cutting .brand-icon path:nth-of-type(1) {
    animation: scissor-blade-a 460ms ease both;
  }

  .site-navbar .brand.is-cutting .brand-icon path:nth-of-type(2) {
    animation: scissor-blade-b 460ms ease both;
  }

  .site-navbar.is-compact {
    background: #FFFFFF !important;
    background-color: #FFFFFF !important;
    box-shadow: 0 4px 18px rgb(39 50 43 / 8%);
  }

  .site-navbar.is-compact .navbar-inner {
    min-height: 58px;
    padding-block: 7px;
    gap: 18px;
  }

  .site-navbar.is-compact .brand-icon {
    width: 27px;
    height: 27px;
  }

  .site-navbar.is-compact .brand-name {
    font-size: 0.94rem;
  }

  .site-navbar.is-compact .brand-subtitle {
    font-size: 0.68rem;
  }

  .site-navbar .nav-links {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: clamp(16px, 2.1vw, 30px);
  }

  .site-navbar .nav-link {
    position: relative;
    padding: 7px 0;
    color: #414C43;
    font-size: 0.91rem;
    font-weight: 550;
    transition: color 180ms ease;
  }

  .site-navbar .nav-link::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 1px;
    height: 2px;
    border-radius: 99px;
    background: #A87927;
    transform: scaleX(0);
    transform-origin: left center;
    transition: transform 230ms cubic-bezier(.2,.7,.2,1);
  }

  .site-navbar .nav-link:hover,
  .site-navbar .nav-link:focus-visible,
  .site-navbar .nav-link.active {
    color: #286747;
  }

  .site-navbar .nav-link:hover::after,
  .site-navbar .nav-link:focus-visible::after,
  .site-navbar .nav-link.active::after {
    transform: scaleX(1);
  }

  .site-navbar .nav-book-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 41px;
    padding: 9px 16px;
    border: 1px solid #286747;
    border-radius: 6px;
    color: #FFFFFF !important;
    background: #286747 !important;
    font-size: 0.88rem;
    font-weight: 650;
    transition: min-height 220ms ease, padding 220ms ease, background 180ms ease, border-color 180ms ease;
  }

  .site-navbar .nav-book-button:hover,
  .site-navbar .nav-book-button:focus-visible {
    border-color: #1F5339;
    background: #1F5339 !important;
  }

  .site-navbar.is-compact .nav-book-button {
    min-height: 36px;
    padding-block: 7px;
  }

  .site-navbar .mobile-menu-button {
    display: none;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    border: 1px solid #DFE3DC;
    border-radius: 6px;
    background: #FFFFFF;
    cursor: pointer;
    transition: width 220ms ease, height 220ms ease, background 180ms ease;
  }

  .site-navbar .mobile-menu-button:hover {
    background: #F0F5F0;
  }

  .site-navbar.is-compact .mobile-menu-button {
    width: 38px;
    height: 38px;
  }

  .site-navbar .mobile-menu-button svg {
    animation: navbar-icon-in 200ms ease both;
  }

  @keyframes navbar-icon-in {
    from {
      opacity: 0;
      transform: rotate(-25deg) scale(.84);
    }

    to {
      opacity: 1;
      transform: rotate(0) scale(1);
    }
  }

  .site-navbar :focus-visible {
    outline: 2px solid #286747;
    outline-offset: 4px;
    border-radius: 4px;
  }

  @media (max-width: 768px) {
    .site-navbar .navbar-inner {
      position: relative;
      flex-wrap: wrap;
      width: calc(100% - 30px);
      min-height: 66px;
      padding: 11px 0;
      gap: 0 12px;
    }

    .site-navbar.is-compact .navbar-inner {
      min-height: 54px;
      padding-block: 6px;
    }

    .site-navbar .mobile-menu-button {
      display: inline-flex;
      margin-left: auto;
    }

    .site-navbar .nav-links {
      position: static;
      flex: 0 0 100%;
      width: 100%;
      display: flex !important;
      flex-direction: column;
      align-items: stretch;
      gap: 4px;
      max-height: 0;
      margin: 0;
      padding: 0 8px;
      overflow: hidden;
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      transform: translateY(-6px);
      transform-origin: top center;
      border: 0 solid #E2E5DE;
      border-radius: 7px;
      background: #FFFFFF !important;
      box-shadow: none !important;
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
      transition: max-height 300ms ease, opacity 180ms ease, transform 220ms ease, visibility 0s linear 300ms, margin 220ms ease, padding 220ms ease, border-width 220ms ease;
    }

    .site-navbar .nav-links.mobile-open {
      max-height: 420px;
      margin-top: 8px;
      padding: 9px 8px;
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
      transform: none;
      border-width: 1px;
      transition: max-height 360ms ease, opacity 200ms ease, transform 240ms ease, visibility 0s, padding 220ms ease, margin 220ms ease, border-width 220ms ease;
    }

    .site-navbar .nav-links .nav-link,
    .site-navbar .nav-links .nav-book-button {
      display: flex;
      width: 100%;
      min-height: 42px;
      align-items: center;
      padding: 10px 12px;
      border-radius: 4px;
      opacity: 0;
      transform: translateY(5px);
      transition: opacity 160ms ease, transform 200ms ease, background 160ms ease, color 160ms ease;
    }

    .site-navbar .nav-links .nav-link::after {
      display: none;
    }

    .site-navbar .nav-links .nav-link:hover,
    .site-navbar .nav-links .nav-link.active {
      background: #F1F5EF;
    }

    .site-navbar .nav-links .nav-book-button {
      justify-content: center;
      margin-top: 4px;
    }

    .site-navbar .nav-links.mobile-open .nav-link,
    .site-navbar .nav-links.mobile-open .nav-book-button {
      opacity: 1;
      transform: none;
    }

    .site-navbar .nav-links.mobile-open .nav-link:nth-child(1) {
      transition-delay: 35ms;
    }

    .site-navbar .nav-links.mobile-open .nav-link:nth-child(2) {
      transition-delay: 65ms;
    }

    .site-navbar .nav-links.mobile-open .nav-link:nth-child(3) {
      transition-delay: 95ms;
    }

    .site-navbar .nav-links.mobile-open .nav-link:nth-child(4) {
      transition-delay: 125ms;
    }

    .site-navbar .nav-links.mobile-open .nav-book-button {
      transition-delay: 155ms;
    }
  }

  @media (max-width: 380px) {
    .site-navbar .brand {
      gap: 7px;
    }

    .site-navbar .brand-icon {
      width: 28px;
      height: 28px;
    }

    .site-navbar .brand-name {
      font-size: 0.94rem;
    }

    .site-navbar .brand-subtitle {
      font-size: 0.69rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .site-navbar *,
    .site-navbar *::before,
    .site-navbar *::after {
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
  const [compact, setCompact] = useState(false)
  const [cutting, setCutting] = useState(true)
  const cuttingTimer = useRef(null)

  useEffect(() => {
    const updateCompactState = () => {
      const next = window.scrollY > 12
      setCompact((current) => (current === next ? current : next))
    }

    updateCompactState()
    window.addEventListener('scroll', updateCompactState, { passive: true })

    return () => window.removeEventListener('scroll', updateCompactState)
  }, [])

  const replayCut = () => {
    setCutting(false)
    window.requestAnimationFrame(() => setCutting(true))
    window.clearTimeout(cuttingTimer.current)
    cuttingTimer.current = window.setTimeout(() => setCutting(false), 560)
  }

  const closeMenu = () => {
    setMenuOpen(false)
    replayCut()
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

      <header className={`site-navbar ${compact ? 'is-compact' : ''}`}>
        <div className="navbar-inner">
          <Link
            to="/"
            className={`brand ${cutting ? 'is-cutting' : ''}`}
            onClick={closeMenu}
          >
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
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
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
            <Link to="/admin" className="nav-book-button" onClick={closeMenu}>
              Admin
            </Link>
          </nav>
        </div>
      </header>
    </>
  )
}

export default Navbar