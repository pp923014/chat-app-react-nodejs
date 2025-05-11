import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";

export default function ChatContainer({ currentChat, socket }) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        );
        const response = await axios.post(recieveMessageRoute, {
          from: data._id,
          to: currentChat._id,
        });
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    
    if (currentChat) {
      fetchMessages();
    }
  }, [currentChat]);

  const handleSendMsg = async (msg) => {
    try {
      const data = await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      );
      
      socket.current.emit("send-msg", {
        to: currentChat._id,
        from: data._id,
        msg,
      });
      
      await axios.post(sendMessageRoute, {
        from: data._id,
        to: currentChat._id,
        message: msg,
      });

      setMessages(prev => [...prev, { fromSelf: true, message: msg }]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }

    return () => {
      if (socket.current) {
        socket.current.off("msg-recieve");
      }
    };
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Container>
      <ChatHeader>
        <UserDetails>
          <Avatar>
            <img
              src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
              alt={currentChat.username}
            />
          </Avatar>
          <Username>
            <h3>{currentChat.username}</h3>
            <Status>Online</Status>
          </Username>
        </UserDetails>
        <Logout />
      </ChatHeader>
      
      <MessagesContainer>
        {messages.map((message) => (
          <MessageWrapper ref={scrollRef} key={uuidv4()}>
            <MessageBubble $isSelf={message.fromSelf}>
              <MessageContent>{message.message}</MessageContent>
            </MessageBubble>
          </MessageWrapper>
        ))}
      </MessagesContainer>
      
      <ChatInput handleSendMsg={handleSendMsg} />
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 80px 1fr 80px;
  height: 100%;
  background: #0f0f1a;
  border-left: 1px solid #2d2d42;
`;

const ChatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  background: #1a1a2e;
  border-bottom: 1px solid #2d2d42;
`;

const UserDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const Avatar = styled.div`
  img {
    height: 3.5rem;
    width: 3.5rem;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #4e0eff;
  }
`;

const Username = styled.div`
  h3 {
    color: white;
    margin: 0;
    font-size: 1.2rem;
  }
`;

const Status = styled.span`
  color: #4e0eff;
  font-size: 0.8rem;
  font-weight: 500;
`;

const MessagesContainer = styled.div`
  padding: 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: #4e0eff;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-track {
    background-color: #1a1a2e;
  }
`;

const MessageWrapper = styled.div`
  display: flex;
`;

const MessageBubble = styled.div`
  max-width: 60%;
  padding: 0.8rem 1.2rem;
  border-radius: 1.2rem;
  font-size: 1rem;
  line-height: 1.4;
  color: #e6e6e6;
  background: ${props => props.$isSelf ? '#4e0eff' : '#2d2d42'};
  align-self: ${props => props.$isSelf ? 'flex-end' : 'flex-start'};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  word-wrap: break-word;
  
  @media (max-width: 768px) {
    max-width: 80%;
  }
`;

const MessageContent = styled.p`
  margin: 0;
`;