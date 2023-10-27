import { Link } from "react-router-dom";

function NavBar() {

  return (
    <nav>
      <Link to={'/'}><button>Home</button></Link>
      <Link to={'/log-in'}><button>Settings</button></Link>
      <Link to={'/sign-up'}><button>About</button></Link>
    </nav>
  )
}

export default NavBar