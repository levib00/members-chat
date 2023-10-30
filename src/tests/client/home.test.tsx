import React from 'react'
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom'
import Home from '../../../client/src/components/home';

describe("Chatroom gets messages then renders them", () => { // TODO: double check all describes
  test('renders error message', () => {
    
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const greeting = screen.getByText('Join to start chatting now!');
    expect(greeting).toBeInTheDocument(); 
    const signUpLink = screen.getByText('Sign up now!')
    expect(signUpLink).toBeInTheDocument()
  });
})