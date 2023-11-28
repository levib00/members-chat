// @ts-nocheck
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Message from '../../components/message';
import '@testing-library/jest-dom';

describe('Chatroom gets messages then renders them', () => {
  const mockMessage = {
    username: 'thisUser0',
    timeStamp: 1599288716652,
    message: 'This is message 0',
  };

  test('renders messages in chatroom', () => {
    render(
      <MemoryRouter>
        <Message messageInfo={mockMessage} />
      </MemoryRouter>,
    );

    const Message1Username = screen.getByText('thisUser0');
    expect(Message1Username).toBeInTheDocument();
    const room1Initial = screen.getByText('5/8/2020');
    expect(room1Initial).toBeInTheDocument();
    const room1IsPublic = screen.getByText('This is message 0');
    expect(room1IsPublic).toBeInTheDocument();
  });
});
