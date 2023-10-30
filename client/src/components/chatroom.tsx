import React from "react";
import { getFetcher } from "../utility-functions/fetcher";
import Message from "./message"
import useSWR from "swr";
import { randomUUID } from "crypto";

interface MessageObject {
  username: string,
  timeStamp: string,
  message: string
};

const Chatroom = () => {

  const {data: messages,  error: commentError} = useSWR(`http://localhost:8000/chatrooms`, getFetcher)

  return (
      <div>
        {messages ? messages.map((response: MessageObject) => <Message key={randomUUID()} messageInfo={response} />) : null}
      </div>
  )
}

export default Chatroom