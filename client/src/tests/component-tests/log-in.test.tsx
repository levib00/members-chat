// @ts-nocheck
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import * as postFetch from '../../utility-functions/post-fetch';
import LogIn from '../../components/log-in';

import '@testing-library/jest-dom';

describe('Log in', () => {
  test('shows dom and sends request on button press.', async () => {
    const submitPost = jest
      .spyOn(postFetch, 'submitPost')
      .mockImplementation((arg1, arg2, e) => {
        e.preventDefault();
        return Promise.resolve();
      });

    render(
      <MemoryRouter>
        <LogIn setHasAuth={jest.fn()} hasAuth={false} />
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
    expect(submitPost).lastCalledWith('https://levib00-chatroom.adaptable.app/api/users/log-in', expect.anything(), expect.anything(), expect.anything(), expect.anything(), expect.anything(), expect.anything(), expect.anything());
  });
});
