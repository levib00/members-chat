// @ts-nocheck
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import LogIn from '../../components/log-in';

import '@testing-library/jest-dom';

describe('Chatroom gets messages then renders them', () => {
  test('renders messages in chatroom', async () => {
    render(
      <MemoryRouter>
        <LogIn setError={jest.fn()} setHasAuth={jest.fn()} hasAuth={false} />
      </MemoryRouter>,
    );

    const usernameInput = screen.getByLabelText('Username:');
    const passwordInput = screen.getByLabelText('Password:');
    const createButton = screen.getByText('Log in');

    await act(async () => {
      await userEvent.type(usernameInput, 'name test');
      await userEvent.type(passwordInput, '1234');
      await userEvent.click(createButton);
    });

    expect(usernameInput.value).toBe('name test');
    expect(passwordInput.value).toBe('1234');
  });
});
