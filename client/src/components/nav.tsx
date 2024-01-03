import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@mdi/react';
import {
  mdiDotsHorizontalCircleOutline as moreDots,
  mdiHome as home,
  mdiForum as chatrooms,
  mdiLogout as logout,
  mdiAccountPlus as signUp,
  mdiLogin as login,
} from '@mdi/js';

// Props interface for the NavBar component
export interface INavProps {
  hasAuth: boolean, // Indicates whether the user is authenticated
  // Function to update the authentication status
  setHasAuth: React.Dispatch<React.SetStateAction<boolean>>,
}

// NavBar functional component that displays navigation links based on authentication status
function NavBar(props: INavProps) {
  const { hasAuth, setHasAuth } = props; // Destructuring props

  const [isMoreHidden, setIsMoreHidden] = useState(true);

  // Function to handle user sign out
  const signOut = () => {
    setIsMoreHidden(true);
    setHasAuth(false); // Update authentication status to false
    localStorage.removeItem('jwt'); // Remove JWT token from localStorage
  };

  // JSX rendering for navigation buttons based on authentication status
  return (
    <nav onMouseLeave={() => setIsMoreHidden(true)}>
      { !hasAuth
        // eslint-disable-next-line operator-linebreak
        ? // Display these links if user is not authenticated
        <>
          <div hidden={isMoreHidden}>
            <div className="hamburger-menu">
              <Link className='menu-nav' to={'/members-chat/log-in'}>Log in</Link>
              <Link className='menu-nav' to={'/members-chat/sign-up'}>Sign up</Link>
              <p>
                Made by{' '}
                <a className='github-link' href="https://github.com/levib00">levib00 on GitHub</a>
              </p>
            </div>
          </div>
          <div className='main-nav'>
            <Link className='hero main-nav-button' to={'/members-chat/'}>
              <Icon path={home}
                title='home'
                size={1}
              />
              <div>Home</div></Link>
            <Link className='side-nav main-nav-button' to={'/members-chat/log-in'}>
              <Icon path={login}
                title='login'
                size={1}
              />
              <div>Log in</div>
            </Link>
            <Link className='side-nav main-nav-button' to={'/members-chat/sign-up'}>
            <Icon path={signUp}
                title='sign-up'
                size={1}
              />
              <div>Sign up</div>
              </Link>
            <button onClick={() => setIsMoreHidden(!isMoreHidden)} className='more-menu main-nav-button'>
              <Icon path={moreDots}
                title='more'
                size={1}
              />
              <div>More</div>
            </button>
          </div>
        </>
        // eslint-disable-next-line operator-linebreak
        : // Display these links if user is authenticated
        <>
          <div hidden={isMoreHidden} tabIndex={0} onBlur={() => setIsMoreHidden(true)}>
            <div className="hamburger-menu">
              <button className='menu-nav' onClick={signOut}>Log Out</button>
              <p>
                Made by{' '}
                <a className='github-link' href="https://github.com/levib00">levib00 on GitHub</a>
              </p>
            </div>
          </div>
          <div className='main-nav'>
            <Link className='hero main-nav-button' to={'/members-chat/'}>
              <Icon path={home}
                title='home'
                size={1}
              />
              <div>Home</div>
            </Link>
            <Link className='main-nav-button' to={'/members-chat/chatrooms'}>
            <Icon path={chatrooms}
              title='chatrooms'
              size={1}
            />
              <div>Chatrooms</div>
            </Link>
            <button className='side-nav main-nav-button' onClick={signOut}>
            <Icon path={logout}
                title='logout'
                size={1}
              />
              <div>Log Out</div>
              </button>
            <button onClick={() => setIsMoreHidden(!isMoreHidden)} className='more-menu main-nav-button'>
              <Icon path={moreDots}
                title='more'
                size={1}
              />
              <div>More</div>
            </button>
          </div>
        </>
      }
    </nav>
  );
}

export default NavBar;
