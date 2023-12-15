import React from 'react';
import { Link } from 'react-router-dom';

// Props interface for the NavBar component
export interface INavProps {
  hasAuth: boolean, // Indicates whether the user is authenticated
  // Function to update the authentication status
  setHasAuth: React.Dispatch<React.SetStateAction<boolean>>,
}

// NavBar functional component that displays navigation links based on authentication status
function NavBar(props: INavProps) {
  const { hasAuth, setHasAuth } = props; // Destructuring props

  // Function to handle user sign out
  const signOut = () => {
    setHasAuth(false); // Update authentication status to false
    localStorage.removeItem('jwt'); // Remove JWT token from localStorage
  };

  // JSX rendering for navigation buttons based on authentication status
  return (
    <nav>
      { !hasAuth
        // eslint-disable-next-line operator-linebreak
        ? // Display these links if user is not authenticated
        <>
          <Link to={'/'}><button>Home</button></Link>
          <Link to={'/log-in'}><button>Log in</button></Link>
          <Link to={'/sign-up'}><button>Sign up</button></Link>
        </>
        // eslint-disable-next-line operator-linebreak
        : // Display these links if user is authenticated
        <>
          <Link to={'/'}><button>Home</button></Link>
          <Link to={'/chatrooms'}><button>Chatrooms</button></Link>
          <button onClick={signOut}>Log Out</button>
        </>
      }
    </nav>
  );
}

export default NavBar;
