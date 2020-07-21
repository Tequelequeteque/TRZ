import React from 'react';
import { render, waitFor, fireEvent, act } from '@testing-library/react';
import Create from '../../pages/Create';

const mockedCreatePerson = jest.fn().mockResolvedValue({
  id: 'string-uuid',
});
const mockedAddToast = jest.fn();
const mockedHistory = jest.fn();

jest.mock('../../hooks/ApiProvider', () => ({
  useApiSurvivor: () => ({
    createPerson: mockedCreatePerson,
  }),
}));

jest.mock('../../hooks/ToastProvider', () => ({
  useToast: () => ({
    addToast: mockedAddToast,
  }),
}));

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: mockedHistory,
  }),
}));

describe('Create', () => {
  afterAll(() => jest.clearAllMocks());

  beforeEach(() => {
    mockedCreatePerson.mockClear();
    mockedAddToast.mockClear();
    mockedHistory.mockClear();
  });

  it('should be able to render Create', () => {
    const create = render(<Create />);
    expect(create).toBeTruthy();
  });

  it('should be able to create Person', async () => {
    const { getByPlaceholderText, getByText } = render(<Create />);
    const name = getByPlaceholderText('Name');
    const age = getByPlaceholderText('Age');
    const gender = getByPlaceholderText('Gender');
    const latitude = getByPlaceholderText('Latitude');
    const longitude = getByPlaceholderText('Longitude');
    const fijiWater = getByPlaceholderText('Fiji Water');
    const campbellSoup = getByPlaceholderText('Campbell Soup');
    const firstAidPouch = getByPlaceholderText('First Aid Pouch');
    const ak47 = getByPlaceholderText('AK47');

    const button = getByText('Create');

    fireEvent.change(name, { target: { value: 'John Doe' } });
    fireEvent.change(age, { target: { value: 25 } });
    fireEvent.change(gender, { target: { value: 'male' } });
    fireEvent.change(latitude, { target: { value: -25.0 } });
    fireEvent.change(longitude, { target: { value: -25.0 } });
    fireEvent.change(fijiWater, { target: { value: 25 } });
    fireEvent.change(campbellSoup, { target: { value: 25 } });
    fireEvent.change(firstAidPouch, { target: { value: 25 } });
    fireEvent.change(ak47, { target: { value: 25 } });

    fireEvent.click(button);

    await waitFor(() => {
      expect(mockedCreatePerson).toHaveBeenCalled();
      expect(mockedAddToast).toHaveBeenCalled();
      expect(mockedHistory).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should be unable to create Person,input wrong', async () => {
    const { getByPlaceholderText, getByText } = render(<Create />);
    const name = getByPlaceholderText('Name');
    const age = getByPlaceholderText('Age');

    const button = getByText('Create');

    fireEvent.change(name, { target: { value: 'John Doe' } });
    fireEvent.change(age, { target: { value: 'vinte e cinco' } });

    fireEvent.click(button);
    await waitFor(() => {
      expect(mockedCreatePerson).not.toHaveBeenCalled();
      expect(mockedAddToast).not.toHaveBeenCalled();
      expect(mockedHistory).not.toHaveBeenCalled();
    });
  });

  it('should be unable to create person, error api, show toast', async () => {
    mockedCreatePerson.mockRejectedValueOnce(null);
    const { getByPlaceholderText, getByText } = render(<Create />);
    const name = getByPlaceholderText('Name');
    const age = getByPlaceholderText('Age');
    const gender = getByPlaceholderText('Gender');
    const latitude = getByPlaceholderText('Latitude');
    const longitude = getByPlaceholderText('Longitude');
    const fijiWater = getByPlaceholderText('Fiji Water');
    const campbellSoup = getByPlaceholderText('Campbell Soup');
    const firstAidPouch = getByPlaceholderText('First Aid Pouch');
    const ak47 = getByPlaceholderText('AK47');

    const button = getByText('Create');

    fireEvent.change(name, { target: { value: 'John Doe' } });
    fireEvent.change(age, { target: { value: 25 } });
    fireEvent.change(gender, { target: { value: 'male' } });
    fireEvent.change(latitude, { target: { value: -25.0 } });
    fireEvent.change(longitude, { target: { value: -25.0 } });
    fireEvent.change(fijiWater, { target: { value: 25 } });
    fireEvent.change(campbellSoup, { target: { value: 25 } });
    fireEvent.change(firstAidPouch, { target: { value: 25 } });
    fireEvent.change(ak47, { target: { value: 25 } });

    fireEvent.click(button);
    await waitFor(() => {
      expect(mockedCreatePerson).toHaveBeenCalled();
      expect(mockedAddToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Try again later',
        type: 'error',
      });
      expect(mockedHistory).not.toHaveBeenCalled();
    });
  });
});
