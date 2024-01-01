import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ChatroomCard from '../../components/chatroom-card';
import '@testing-library/jest-dom';

describe('Cards renders correct info', () => {
  const mockResponse = {
    roomName: 'room0',
    password: '1234',
    isPublic: true,
    _id: '4321',
  };

  test('Card shows with info', () => {
    render(
      <MemoryRouter>
        <ChatroomCard chatroomInfo={mockResponse} hasUser={true} />
      </MemoryRouter>,
    );

    const chatroomName = screen.getByText('room0');
    expect(chatroomName).toBeInTheDocument();
    const isPublic = screen.getByText('public');
    expect(isPublic).toBeInTheDocument();
  });
});
