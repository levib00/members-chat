// @ts-nocheck
import React from 'react';
import {
  render, screen, waitFor,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import * as SWR from 'swr';
import userEvent from '@testing-library/user-event';
import * as submitPost from '../../utility-functions/post-fetch';
import Chatroom from '../../components/chatroom';

const setErrorMock = jest.fn();

describe('Chatroom gets messages then renders them', () => {
  const mockUser = {
    _id: '123456',
    firstName: 'thisUser0',
    lastName: 'lastName',
    username: 'thisUser0',
    chatrooms: [],
  };

  const mockUser2 = {
    firstName: 'thisUser0',
    lastName: 'lastName',
    username: 'thisUser1',
    chatrooms: [],
  };

  const mockMessageResponse = {
    chatroom: {
      roomName: 'this Room1',
      password: '1234',
      isPublic: false,
      chatroomId: '4321',
      createdBy: '123456',
    },
    messages: [
      {
        username: mockUser,
        timestamp: 1599288716652,
        content: 'This is message 0',
      },
      {
        username: mockUser2,
        timestamp: 1593288716652,
        content: 'This is message 1',
      },
    ],
  };

  const mockUserResponse = {
    _id: '123456',
    firstName: 'thisUser0',
    lastName: 'lastName',
    username: 'username',
    chatrooms: [],
  };

  jest
    .spyOn(SWR, 'default')
    .mockImplementation((url) => {
      if (url.includes('messages')) {
        return {
          data: mockMessageResponse,
          isValidating: false,
          mutate: () => Promise.resolve(),
        };
      }
      if (url.includes('users')) {
        return {
          data: mockUserResponse,
          isValidating: false,
          mutate: () => Promise.resolve(),
        };
      }
      return null;
    });

  test('renders messages in chatroom', async () => {
    render(
      <MemoryRouter>
        <Chatroom setError={setErrorMock} />
      </MemoryRouter>,
    );

    const Message1Username = screen.getByText('thisUser0');
    expect(Message1Username).toBeInTheDocument();
    const room1Initial = screen.getByText('5/8/2020');
    expect(room1Initial).toBeInTheDocument();
    const room1IsPublic = screen.getByText('This is message 0');
    expect(room1IsPublic).toBeInTheDocument();

    const Message2Username = screen.getByText('thisUser1');
    expect(Message2Username).toBeInTheDocument();
    const room2Initial = screen.getByText('27/5/2020');
    expect(room2Initial).toBeInTheDocument();
    const room2IsPublic = screen.getByText('This is message 1');
    expect(room2IsPublic).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('This is message 0')).toBeInTheDocument();
    });
  });

  test('message is sent', async () => {
    submitPost.submitPost = jest.fn().mockImplementationOnce(() => 'test');

    render(
      <MemoryRouter>
        <Chatroom setError={setErrorMock} />
      </MemoryRouter>,
    );

    const messageInput = screen.getByRole('textbox');

    const submitButton = screen.getByText('Send');

    await userEvent.type(messageInput, 'message');
    await userEvent.click(submitButton);

    expect(submitPost.submitPost).toHaveBeenCalledTimes(1);
  });

  test('leave chat request is sent leave chat.', async () => {
    submitPost.submitPost = jest.fn().mockImplementationOnce(() => 'test');

    render(
      <MemoryRouter>
        <Chatroom setError={setErrorMock} />
      </MemoryRouter>,
    );

    const leaveButton = screen.getByText('Leave chat');

    await userEvent.click(leaveButton);
    expect(submitPost.submitPost).toHaveBeenCalledTimes(1);
  });

  test('edit modal works.', async () => {
    submitPost.submitPost = jest.fn().mockImplementationOnce(() => 'test');

    render(
      <MemoryRouter>
        <Chatroom setError={setErrorMock} />
      </MemoryRouter>,
    );

    const submitButton = screen.getByText('Edit chatroom');

    await userEvent.click(submitButton);

    const cancelButton = screen.getByText('cancel');

    expect(cancelButton).toBeInTheDocument();
  });

  test('validation errors show.', async () => {
    submitPost.submitPost = jest.fn().mockImplementationOnce(() => ({ error: ['error'] }));

    render(
      <MemoryRouter>
        <Chatroom setError={setErrorMock} />
      </MemoryRouter>,
    );

    const messageInput = screen.getByRole('textbox');
    const submitButton = screen.getByText('Send');

    await userEvent.type(messageInput, '300+ characters, 300+ characters, 300+ characters, 300+ characters, 300+ characters, 300+ characters, 300+ characters, 300+ characters, 300+ characters, 300+ characters, 300+ characters, 300+ characters, 300+ characters, 300+ characters, 300+ characters, 300+ characters, 300+ characters, 300+ characters, ');
    await userEvent.click(submitButton);

    expect(submitPost.submitPost).toHaveBeenCalledTimes(1);
    const errorMessage = screen.getByText('error');

    expect(errorMessage).toBeInTheDocument();
  });
});
