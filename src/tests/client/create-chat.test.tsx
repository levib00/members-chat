// @ts-nocheck
import React, {useState} from 'react'
import { render, screen } from '@testing-library/react';
import CreateChat from '../../../client/src/components/create-chat';
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
        <CreateChat setError={() => false} />
      </MemoryRouter>
    );

    const chatNameInput = screen.getByLabelText('Chat Name:');
    const passwordInput = screen.getByLabelText('Password:');
    const passwordConfirmInput = screen.getByLabelText('Confirm password:');
    const createButton = screen.getByText('Create chat');

    await act( async() => {
      await userEvent.type(chatNameInput, 'name test')
      await userEvent.type(passwordInput, '1234')
      await userEvent.type(passwordConfirmInput, '1234')
      await userEvent.click(createButton)
    });

    expect(chatNameInput.value).toBe('name test'); 
    expect(passwordInput.value).toBe('1234');
    expect(passwordConfirmInput.value).toBe('1234');
  });
})