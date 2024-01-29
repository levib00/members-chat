// @ts-nocheck
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import * as submitPost from '../../utility-functions/post-fetch';
import Message from '../../components/message';

describe('Messages renders', () => {
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

  test('renders message', () => {
    render(
      <MemoryRouter>
        <Message
          messageInfo={mockMessage}
          key={1}
          index={0}
          toggleEditing={ jest.fn() }
          toggleDeleteModal={ jest.fn() }
          currentUser={ mockUser }
          sendMessage={ jest.fn() }
          handleNewWsMessage={ jest.fn() }
          isBeingEdited={false}
          deleteConfirmation={true}
        />
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
          toggleEditing={ jest.fn() }
          toggleDeleteModal={ jest.fn() }
          currentUser={ mockUser }
          sendMessage={ jest.fn() }
          handleNewWsMessage={ jest.fn() }
          isBeingEdited={false}
          deleteConfirmation={true} />
      </MemoryRouter>,
    );

    const confirmButton = screen.getByText('confirm');

    await act(async () => {
      await userEvent.click(confirmButton);
    });

    expect(submitPost.validateCreateDeleteMessage).toHaveBeenCalledTimes(1);
  });
});
