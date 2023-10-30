// @ts-nocheck
import React from 'react'
import { render, screen } from '@testing-library/react';
import ChatroomList from '../../../client/src/components/chat-list';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom'
import * as SWR from 'swr';

describe("List fetches listings then makes cards", () => {
  const mockResponse = [
    {
      name: 'room0',
      password: '1234',
      isPublic: true,
      chatroomId: '4321'
    },
    {
      name: 'this Room1',
      password: '1234',
      isPublic: false,
      chatroomId: '4321'
    }
  ]  


  test('render chat cards in list', () => {

    jest
      .spyOn(SWR, 'default')
      .mockImplementation(() => ({ data: mockResponse, isValidating: false, mutate: () => Promise.resolve() }));    

    render(
      <MemoryRouter>
        <ChatroomList />
      </MemoryRouter>
    );

    const chatroom1Name = screen.getByText('room0');
    expect(chatroom1Name).toBeInTheDocument(); 
    const room1Initial = screen.getByText('r')
    expect(room1Initial).toBeInTheDocument()
    const room1IsPublic = screen.getByText('public');
    expect(room1IsPublic).toBeInTheDocument()

    const chatroom2Name = screen.getByText('this Room1');
    expect(chatroom2Name).toBeInTheDocument(); 
    const room2Initial = screen.getByText('t')
    expect(room2Initial).toBeInTheDocument()
    const room2IsPublic = screen.getByText('private');
    expect(room2IsPublic).toBeInTheDocument()
  });
})