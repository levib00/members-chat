import React, { useState } from 'react';

// Defining the structure of the Error object
interface IErrorObject {
  error: {
    status: number,
    info: string
  } | undefined
}

// Error functional component
const Error = (props: IErrorObject) => {
  const { error } = props;

  // State variables for managing status and info of the error
  const [status] = useState(error?.status || 404);
  const [info] = useState(error?.info || 'That page was not found.');

  // JSX rendering for displaying error details
  return (
    <div className="content">
      <p>Something went wrong.</p>
      <h2>{status}</h2>
      <p>{info}</p>
      <a href="/"> Return to Home</a>
    </div>
  );
};

export default Error;
