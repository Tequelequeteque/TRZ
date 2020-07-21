import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

describe('Sidebar', () => {
  it('should be able to render Sidebar', async () => {
    const sidebar = render(<Sidebar paths={['home']} />, {
      wrapper: () => <BrowserRouter />,
    });
    expect(sidebar).toBeTruthy();
  });

  it('should be able to render Sidebar with one link', async () => {
    const { getByTestId } = render(<Sidebar paths={['home']} />, {
      wrapper: ({ children }) => <BrowserRouter>{children}</BrowserRouter>,
    });
    const link = getByTestId('0');
    expect(link).toBeTruthy();
  });

  it('should be able link clicked has class actived ', async () => {
    const { getByTestId } = render(<Sidebar paths={['home']} />, {
      wrapper: ({ children }) => <BrowserRouter>{children}</BrowserRouter>,
    });
    const link = getByTestId('0');
    fireEvent.click(link);
    await waitFor(() => expect(link).toHaveClass('actived'));
    expect(link).toBeTruthy();
  });
});
