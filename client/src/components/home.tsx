import React from 'react';
import { Link } from 'react-router-dom';

// Defining Props interface for the Home component
export interface IHomeProps {
  hasAuth: boolean;
}

// Home functional component that displays different content based on authentication status
const Home = (props: IHomeProps) => {
  const { hasAuth } = props;

  // Rendering different content based on the authentication status
  return (
    <div>
      {/* Conditional rendering based on the 'hasAuth' prop */}
      {!hasAuth ? ( // Display when the user doesn't have authentication
        <>
          <h2>
            Join to start chatting now!
          </h2>
          <Link to='/sign-up'>
            <button>Sign up now!</button>
          </Link>
        </>
      ) : ( // Display when the user has authentication
        <>
          <h2>
            Start chatting now!
          </h2>
          <Link to='/chatrooms'>
            <button>See servers!</button>
          </Link>
        </>
      )}
    </div>
  );
};

export default Home;
