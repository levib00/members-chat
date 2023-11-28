// @ts-nocheck
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import * as SWR from 'swr';
import Chatroom from '../../components/chatroom';

describe('Chatroom gets messages then renders them', () => {
  const mockResponse = [
    {
      username: 'thisUser0',
      timeStamp: 1599288716652,
      message: 'This is message 0',
    },
    {
      username: 'thisUser1',
      timeStamp: 1593288716652,
      message: 'This is message 1',
    },
  ];

  test('renders messages in chatroom', () => {
    jest
      .spyOn(SWR, 'default')
      .mockImplementation(
        () => ({ data: mockResponse, isValidating: false, mutate: () => Promise.resolve() }),
      );

    render(
      <MemoryRouter>
        <Chatroom />
      </MemoryRouter>,
    );

    const Message1Username = screen.getByText('thisUser0');
    expect(Message1Username).toBeInTheDocument();
    const room1Initial = screen.getByText('5/8/2020');
    expect(room1Initial).toBeInTheDocument();
    const room1IsPublic = screen.getByText('This is message 0');
    expect(room1IsPublic).toBeInTheDocument();

    const Message2Username = screen.getByText('thisUser1');
    expect(Message2Username).toBeInTheDocument();
    const room2Initial = screen.getByText('27/5/2020');
    expect(room2Initial).toBeInTheDocument();
    const room2IsPublic = screen.getByText('This is message 1');
    expect(room2IsPublic).toBeInTheDocument();
  });
});
