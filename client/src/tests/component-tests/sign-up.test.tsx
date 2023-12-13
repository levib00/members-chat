// @ts-nocheck
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import * as postFetch from '../../utility-functions/post-fetch';
import SignUp from '../../components/sign-up';

import '@testing-library/jest-dom';

describe('Sign up', () => {
  const submitPost = jest
    .spyOn(postFetch, 'submitPost')
    .mockImplementation((arg1, arg2, e) => {
      e.preventDefault();
      return Promise.resolve();
    });

  test('shows dom and sends request on button press.', async () => {
    render(
      <MemoryRouter>
        <SignUp setError={jest.fn()} setHasAuth={jest.fn()} hasAuth={false} />
      </MemoryRouter>,
    );

    const usernameInput = screen.getByLabelText('Username:');
    const passwordInput = screen.getByLabelText('Password:');
    const createButton = screen.getByText('Sign up');

    await act(async () => {
      await userEvent.type(usernameInput, 'name test');
      await userEvent.type(passwordInput, '1234');
      await userEvent.click(createButton);
    });

    expect(usernameInput.value).toBe('name test');
    expect(passwordInput.value).toBe('1234');
    expect(submitPost).lastCalledWith('http://localhost:3000/users/sign-up', expect.anything(), expect.anything(), expect.anything(), expect.anything(), expect.anything(), null, expect.anything());
  });
});
