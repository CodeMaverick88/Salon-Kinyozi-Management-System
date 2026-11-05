
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <section className="page-container section-padding">
      <h1 className="section-heading">404 - Page Not Found</h1>

      <p className="section-description">
        Sorry, the page you are looking for does not exist.
      </p>

      <Link to="/" className="primary-button" style={{ marginTop: 20 }}>
        Return Home
      </Link>
    </section>
  )
}

export default NotFound
