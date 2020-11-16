import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NotFound from './not-found';

test('should render 404 page with a link for home', async () => {
  const { getByText } = render(<NotFound />, { wrapper: MemoryRouter });

  const header = await waitFor(() => getByText(/Not Found/i));

  expect(header).toBeInTheDocument();
  expect(screen.getByText('Go Home')).toBeInTheDocument();
});
