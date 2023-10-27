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
      <h1>{props.error.status && true}</h1>
      <p>{props.error.info && true}</p>
      <a href="/"> Return to Home</a>
    </div>
  )
}

export default Error