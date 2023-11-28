// @ts-nocheck
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import CreateChat from '../../components/create-chat';

import '@testing-library/jest-dom';

describe('Chatroom gets messages then renders them', () => {
  test('renders messages in chatroom', async () => {
    render(
      <MemoryRouter>
        <CreateChat setError={() => false} />
      </MemoryRouter>,
    );

    const chatNameInput = screen.getByLabelText('Chat Name:');
    const passwordInput = screen.getByLabelText('Password:');
    const passwordConfirmInput = screen.getByLabelText('Confirm password:');
    const createButton = screen.getByText('Create chat');

    await act(async () => {
      await userEvent.type(chatNameInput, 'name test');
      await userEvent.type(passwordInput, '1234');
      await userEvent.type(passwordConfirmInput, '1234');
      await userEvent.click(createButton);
    });

    expect(chatNameInput.value).toBe('name test');
    expect(passwordInput.value).toBe('1234');
    expect(passwordConfirmInput.value).toBe('1234');
  });
});
