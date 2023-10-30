// @ts-nocheck
import React from 'react'
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom'
import Error from '../../../client/src/components/error';

describe("Chatroom gets messages then renders them", () => { // TODO: double check all describes
  test('renders error message', () => {

    const errorMock = {
      status: 403,
      info: 'Forbidden'
    }
    
    render(
      <MemoryRouter>
        <Error error={errorMock} />
      </MemoryRouter>
    );

    const statusCode = screen.getByText('403');
    expect(statusCode).toBeInTheDocument(); 
    const errorMessage = screen.getByText('Forbidden')
    expect(errorMessage).toBeInTheDocument()
  });
})