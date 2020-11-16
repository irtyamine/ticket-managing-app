import React from 'react';
import { render, waitFor, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './app';

test('should render page with success if API returns the correct response', async () => {
  const backend: any = {
    tickets: () => ({
      toPromise: () => [
        {
          id: 1,
          description: 'some desc',
          assigneeId: null,
          completed: false,
        },
      ],
    }),
  };

  const { getByTestId } = render(<App backend={backend} />, { wrapper: MemoryRouter });

  const list = await waitFor(() => getByTestId('tickets'));

  expect(list).toBeInTheDocument();
  expect(list.children.length).toBe(1);
  expect(screen.getByText('Ticket: 1, some desc')).toBeInTheDocument();
});

test('should render page with no tickets message if list is empty', async () => {
  const backend: any = {
    tickets: () => ({
      toPromise: () => [],
    }),
  };

  const { getByText } = render(<App backend={backend} />, { wrapper: MemoryRouter });

  const emptyList = await waitFor(() => getByText('No tickets'));
  expect(emptyList).toBeInTheDocument();
});

test('should filter tickers if search input is filled', async () => {
  const backend: any = {
    tickets: () => ({
      toPromise: () => [
        {
          id: 1,
          description: 'some desc',
          assigneeId: null,
          completed: false,
        },
      ],
    }),
  };

  const { getByLabelText, getByText } = render(<App backend={backend} />, {
    wrapper: MemoryRouter,
  });

  const input = getByLabelText('filter');
  act(() => {
    fireEvent.change(input, { target: { value: 'no-ticket' } });
  });

  const emptyList = await waitFor(() => getByText('No tickets'));
  expect(emptyList).not.toBeInTheDocument();
});
