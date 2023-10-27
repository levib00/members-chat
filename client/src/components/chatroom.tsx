import Message from "./message"
import useSWR from "swr";

interface MessageObject {
  username: string,
  timeStamp: string,
  message: string
};

const Chatroom = () => {
  const fetcher = (url: string) => fetch(url, { 
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    // 'Access-Control-Allow-Origin': '*',
    mode: 'cors'
  })
  .then(res => res.json())
  .catch(function(error) {
    console.log("error---", error)
  });

  const {data: messages, mutate, error: commentError} = useSWR(`http://localhost:8000/chatrooms`, fetcher)

  return (
      <div>
        {messages.map((response: MessageObject) => <Message message={response.message} username={response.username} timeStamp={response.timeStamp} />)}
      </div>
  )
}

export default Chatroom