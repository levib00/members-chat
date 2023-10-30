import React, { useState } from "react"
import { render, screen } from '@testing-library/react';
import ChatroomCard from '../../../client/src/components/chatroom-card';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom'
import '@testing-library/jest-dom'

describe("Cards renders correct info", () => {
  const mockResponse = {
    name: 'room0',
    password: '1234',
    isPublic: true,
    chatroomId: '4321' 
  }

  test('Card shows with info', () => {
    render(
      <MemoryRouter>
        <ChatroomCard chatroomInfo={mockResponse} />
      </MemoryRouter>
    );

    const chatroomName = screen.getByText('room0');
    expect(chatroomName).toBeInTheDocument();
    const firstInitial = screen.getByText('r')
    expect(firstInitial).toBeInTheDocument()
    const isPublic = screen.getByText('public');
    expect(isPublic).toBeInTheDocument()
  });
})