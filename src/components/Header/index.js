import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/')
  }

  return (
    <nav className="header-container">
      <Link to="/" className="nav-link">
        <img
          className="nav-logo"
          src="https://res.cloudinary.com/dtomajdlh/image/upload/v1721641439/nxt-assess-logo.png"
          alt="website logo"
        />
      </Link>
      <button onClick={onClickLogout} type="button" className="logout-button">
        Logout
      </button>
    </nav>
  )
}

export default withRouter(Header)
