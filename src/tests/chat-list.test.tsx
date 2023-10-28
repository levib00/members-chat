// @ts-nocheck
import React from 'react'
import { render, screen } from '@testing-library/react';
import ChatroomList from '../../client/src/components/chat-list';
import { MemoryRouter } from 'react-router-dom';
import * as utils from '../../client/src/utility-functions/fetcher';
import '@testing-library/jest-dom'
import * as SWR from 'swr';

describe("List fetches listings then makes cards", () => {
  const mockResponse = [
    {
      name: 'room0',
      password: '1234',
      isPublic: true,
      chatroomId: '4321'
    }
  ]  


  test('render chat cards in list', () => {
    console.log(SWR)

    jest
      .spyOn(SWR, 'default')
      .mockImplementation(() => ({ data: mockResponse, isValidating: false, mutate: () => Promise.resolve() }));
    
    render(
      <MemoryRouter>
        <ChatroomList />
      </MemoryRouter>
    );

    const chatroomName = screen.getByText('room0');
    expect(chatroomName).toBeInTheDocument(); // TODO: rename
    const settings = screen.getByText('r')
    expect(settings).toBeInTheDocument()
    const about = screen.getByText('public');
    expect(about).toBeInTheDocument()
  });
})