import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Robot from "../assets/robot.gif";

export default function Welcome() {
  const [userName, setUserName] = useState("");
  
  useEffect(() => {
    const userData = JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    if (userData) {
      setUserName(userData.username);
    }
  }, []);

  return (
    <Container>
      <GlassPanel>
        <Content>
          <RobotImage src={Robot} alt="Welcome Robot" />
          <WelcomeText>
            Welcome, <UserName>{userName}!</UserName>
          </WelcomeText>
          <SubText>Please select a chat to start messaging</SubText>
        </Content>
      </GlassPanel>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 90vh;
  background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
  padding: 2rem;
`;

const GlassPanel = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  border-radius: 20px;
  background: rgba(25, 25, 50, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 4px 15px rgba(255, 255, 255, 0.05),
    0 0 0 1px rgba(78, 14, 255, 0.3),
    0 0 30px rgba(78, 14, 255, 0.2);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 
      0 12px 40px rgba(0, 0, 0, 0.4),
      inset 0 4px 20px rgba(255, 255, 255, 0.08),
      0 0 0 1px rgba(78, 14, 255, 0.4),
      0 0 40px rgba(78, 14, 255, 0.3);
    transform: translateY(-5px);
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  max-width: 500px;
  text-align: center;
`;

const RobotImage = styled.img`
  height: 15rem;
  border-radius: 50%;
  border: 4px solid #4e0eff;
  padding: 0.5rem;
  box-shadow: 
    0 0 20px rgba(78, 14, 255, 0.4),
    inset 0 0 10px rgba(78, 14, 255, 0.2);
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05) rotate(5deg);
    box-shadow: 0 0 30px rgba(78, 14, 255, 0.6);
  }
`;

const WelcomeText = styled.h1`
  color: white;
  font-size: 2.2rem;
  margin: 0;
  font-weight: 500;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const UserName = styled.span`
  color: #4e0eff;
  font-weight: 600;
  text-shadow: 0 0 10px rgba(78, 14, 255, 0.5);
`;

const SubText = styled.h3`
  color: #d1d1ff;
  font-size: 1.1rem;
  font-weight: 400;
  margin: 0.5rem 0 0;
  opacity: 0.9;
`;