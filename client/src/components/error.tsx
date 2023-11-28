import React, { useState } from 'react';

interface IErrorObject {
  error: {
    status: number,
    info: string
  } | undefined
}

const Error = (props: IErrorObject) => {
  const { error } = props;
  const [status] = useState(error?.status || 404);
  const [info] = useState(error?.info || 'That page was not found.');

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
