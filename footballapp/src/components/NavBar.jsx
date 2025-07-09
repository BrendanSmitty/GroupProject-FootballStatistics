import { Link } from 'react-router-dom';
import Logout from './Logout';

const NavBar = ({ user, onLogout }) => {

  return (
    <nav className='nav'>
      <div className='header'>
        <h1 className="site-title">Football Central</h1>
      </div>
      <div className='navLinks'>
        <Link className='navLink' to='/'>Home</Link>
        <Link className='navLink' to='/teams'>Teams</Link>
        <Link className='navLink' to='/fixtures'>Fixtures</Link>
        <Link className='navLink' to='/players'>Players</Link>
        <Link className='navLink' to='/profile'>Profile</Link>
        {user ? (
          <>
            <span className='username'>User: {user}</span>
            <Logout onLogout={onLogout} />
          </>
        ) : (
          <Link className='navLink' to='/login'>Login</Link>
        )}
        {!user && <Link className='navLink' to='/register'>Register</Link>}
      </div>
    </nav>
  );
};

export default NavBar;