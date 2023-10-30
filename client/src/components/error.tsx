import React from "react"

interface IErrorObject {
  error: {
    status: number,
    info: string
  },
};

const Error = (props: IErrorObject) => {
  return (
    <div className="content">
      <p>Something went wrong.</p>
      <h1>{props.error.status}</h1>
      <p>{props.error.info}</p>
      <a href="/"> Return to Home</a>
    </div>
  )
}

export default Error