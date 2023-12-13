// @ts-nocheck
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import * as postFetch from '../../utility-functions/post-fetch';
import CreateChat from '../../components/create-chat';

import '@testing-library/jest-dom';

describe('Create chat', () => {
  test('create chat renders for new non-edit chat.', async () => {
    const submitPost = jest
      .spyOn(postFetch, 'submitPost')
      .mockImplementation((arg1, arg2, e) => {
        e.preventDefault();
        return Promise.resolve();
      });

    // Mock fetch
    render(
      <MemoryRouter>
        <CreateChat isEdit={false} chatroom={null} />
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
    expect(submitPost).lastCalledWith('http://localhost:3000/chatrooms/new', expect.anything(), expect.anything(), expect.anything(), expect.anything(), expect.anything(), null, expect.anything());
  });
});
