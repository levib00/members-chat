import React from 'react';
import { Link } from 'react-router-dom';

export interface INavProps {
  hasAuth: boolean,
  setHasAuth: React.Dispatch<React.SetStateAction<boolean>>,
}

function NavBar(props: INavProps) {
  const { hasAuth, setHasAuth } = props;

  const signOut = () => {
    setHasAuth(false);
    localStorage.removeItem('jwt');
  };

  return (
    <nav>
      { !hasAuth
        ? <>
        <Link to={'/'}><button>Home</button></Link>
        <Link to={'/log-in'}><button>Log in</button></Link>
        <Link to={'/sign-up'}><button>sign up</button></Link>
      </>
        : <>
        <Link to={'/'}><button>Home</button></Link>
        <Link to={'/chatrooms'}><button>Chatrooms</button></Link>
        <button onClick={signOut}>Log Out</button>
      </>
      }
    </nav>
  );
}

export default NavBar;
