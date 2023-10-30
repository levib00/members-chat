// @ts-nocheck
import React, {useState} from 'react'
import { render, screen } from '@testing-library/react';
import LogIn from '../../../client/src/components/log-in';
import { MemoryRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';

import '@testing-library/jest-dom'

describe("Chatroom gets messages then renders them", () => {
  const mockMessage = {
      username: 'thisUser0',
      timeStamp: 1599288716652,
      message: 'This is message 0',
    }


  test('renders messages in chatroom', async() => {

    render(
      <MemoryRouter>
        <LogIn setError={jest.fn()} setHasAuth={jest.fn()} hasAuth={false} />
      </MemoryRouter>
    );

    const usernameInput = screen.getByLabelText('Username:');
    const passwordInput = screen.getByLabelText('Password:');
    const createButton = screen.getByText('Log in');

    await act( async() => {
      await userEvent.type(usernameInput, 'name test')
      await userEvent.type(passwordInput, '1234')
      await userEvent.click(createButton)
    });

    expect(usernameInput.value).toBe('name test'); 
    expect(passwordInput.value).toBe('1234');
  });
})