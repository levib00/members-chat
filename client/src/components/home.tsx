import React from "react";
import { Link } from "react-router-dom";

export interface IHomeProps {
  hasAuth: boolean
};

const Home = (props: IHomeProps) => {

  const { hasAuth } = props
  return (
    <div>
      {
       !hasAuth ? 
       <>
        <h2>
          Join to start chatting now!
        </h2>
        <Link to='/sign-up'>
          <button>Sign up now!</button>
        </Link>
      </>
      :
      <>
        <h2>
          Start chatting now!
        </h2>
        <Link to='/chatrooms'>
          <button>See servers!</button>
        </Link>
      </>
      }
      
    </div>
  )
}

export default Home