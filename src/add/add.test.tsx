import React from 'react';
import { render, waitFor, act, fireEvent, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Add from './add';

test('should render success message if ticket is added', async () => {
  const backend: any = {
    newTicket: () => ({
      toPromise: () => [],
    }),
  };

  const { getByLabelText } = render(<Add backend={backend} />, { wrapper: MemoryRouter });

  const input = getByLabelText('description');
  fireEvent.change(input, { target: { value: 'new ticket' } });

  expect((input as any).value).toBe('new ticket');
  act(() => {
    fireEvent.click(getByLabelText('submit'));
  });

  const emptyList = await waitFor(() => screen.getByText('Ticket "new ticket" Added'));
  expect(emptyList).toBeInTheDocument();
});

test('should render error message if form is empty', async () => {
  const backend: any = {
    newTicket: () => ({
      toPromise: () => [],
    }),
  };

  const { getByLabelText } = render(<Add backend={backend} />, { wrapper: MemoryRouter });

  const input = getByLabelText('description');
  fireEvent.change(input, { target: { value: '   ' } });

  expect((input as any).value).toBe('   ');
  act(() => {
    fireEvent.click(getByLabelText('submit'));
  });

  const error = await waitFor(() => screen.getByText('Description should not be empty'));
  expect(error).toBeInTheDocument();
});

test('should render error message if API fails', async () => {
  const backend: any = {
    newTicket: () => ({
      toPromise: () => {
        throw new Error('API Error');
      },
    }),
  };

  const { getByLabelText } = render(<Add backend={backend} />, { wrapper: MemoryRouter });

  const input = getByLabelText('description');
  fireEvent.change(input, { target: { value: 'error message' } });

  expect((input as any).value).toBe('error message');
  act(() => {
    fireEvent.click(getByLabelText('submit'));
  });

  const error = await waitFor(() => screen.getByText('API Error'));
  expect(error).toBeInTheDocument();
});
