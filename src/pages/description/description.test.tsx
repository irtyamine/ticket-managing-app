import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Description from './description';

test('should render page with success if API returns the correct response', async () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const backend: any = {
    ticket: (id: number) => ({
      toPromise: () => ({
        id,
        description: 'some desc',
        assigneeId: null,
        completed: false,
      }),
    }),
  };

  const { getByText } = render(<Description backend={backend} id={1} />, { wrapper: MemoryRouter });

  const header = await waitFor(() => getByText('Ticket'));
  expect(header).toBeInTheDocument();
  expect(getByText('some desc')).toBeInTheDocument();
});

test('should render page with error for ticket if API returns an error', async () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const backend: any = {
    ticket: (id: number) => ({
      toPromise: () => {
        throw new Error(`Error with id ${id}`);
      },
    }),
  };

  const { getByText } = render(<Description backend={backend} id={1} />);

  const header = await waitFor(() => getByText('Ticket'));
  expect(header).toBeInTheDocument();
  expect(getByText(`We couldn't find the ticket with id "1"`)).toBeInTheDocument();
});

test('should render page with loading state when requesting API', async () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const backend: any = {
    ticket: () => ({
      toPromise: () => null,
    }),
  };

  const { getByText } = render(<Description backend={backend} id={1} />);

  const header = await waitFor(() => getByText('...Loading ticket information'));
  expect(header).toBeInTheDocument();
});
