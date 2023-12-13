// @ts-nocheck
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import * as submitPost from '../../utility-functions/post-fetch';
import Message from '../../components/message';

describe('Chatroom gets messages then renders them', () => {
  const mockUser = {
    _id: '132456789011',
    firstName: 'firstName',
    lastName: 'lastName',
    username: 'thisUser0',
    chatrooms: [],
  };

  const mockMessage = {
    username: mockUser,
    timestamp: 1599288716652,
    content: 'This is message 0',
    _id: '132456789011',
  };

  test('renders messages in chatroom', () => {
    render(
      <MemoryRouter>
        <Message
          messageInfo={mockMessage}
          key={1}
          index={0}
          toggle={ jest.fn() }
          currentUser={ mockUser }
          sendMessage={ jest.fn() }
          handleNewWsMessage={ jest.fn() }
          isEdits={false} />
      </MemoryRouter>,
    );
    const Message1Username = screen.getAllByText('thisUser0');
    expect(Message1Username).toBeTruthy();
    const room1Initial = screen.getByText('5/8/2020');
    expect(room1Initial).toBeInTheDocument();
    const room1IsPublic = screen.getByText('This is message 0');
    expect(room1IsPublic).toBeInTheDocument();
  });

  test('delete sends request', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve(),
    }));

    submitPost.validateCreateDeleteMessage = jest.fn();

    render(
      <MemoryRouter>
        <Message
          messageInfo={mockMessage}
          key={1}
          index={0}
          toggle={ jest.fn() }
          currentUser={ mockUser }
          sendMessage={ jest.fn() }
          handleNewWsMessage={ jest.fn() }
          isEdits={false} />
      </MemoryRouter>,
    );
    const deleteButton = screen.getByText('Delete');

    await act(async () => {
      await userEvent.click(deleteButton);
    });

    expect(submitPost.validateCreateDeleteMessage).toHaveBeenCalledTimes(1);
  });
});
