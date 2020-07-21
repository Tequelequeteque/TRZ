import React from 'react';
import { render, act, waitFor } from '@testing-library/react';
import Dashboard from '../../pages/Dashboard';

jest.mock('../../hooks/ApiProvider').clearAllMocks();
const mockedGetReports = jest.fn().mockResolvedValue({
  average_healthy: 0,
  average_infected: 0,
  total_points_lost: 0,
  average_items_quantity_per_healthy_person: 0,
  average_quantity_of_each_item_per_person: {
    'Fiji Water': 0,
    'Campbell Soup': 0,
    'First Aid Pouch': 0,
    AK47: 0,
  },
});

jest.mock('../../hooks/ApiProvider', () => ({
  useApiSurvivor: () => ({
    getReports: mockedGetReports,
  }),
}));

describe('Dashboard', () => {
  afterAll(() => jest.clearAllMocks());

  beforeEach(() => mockedGetReports.mockClear());

  it('should be to able render dashboard', async () => {
    await act(async () => {
      const dashboard = render(<Dashboard />);
      expect(dashboard).toBeTruthy();
    });
  });

  it('should be to able call getReports', async () => {
    await act(async () => {
      render(<Dashboard />);
      await waitFor(() => {
        expect(mockedGetReports).toHaveBeenCalled();
      });
    });
  });
});
