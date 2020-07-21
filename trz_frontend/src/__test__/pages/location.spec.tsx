import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { uuid } from 'uuidv4';
import Location from '../../pages/UpdateLocation';
import { IPerson } from '../../hooks/ApiProvider';

const mockedFindBySurvivorId = jest.fn();
const mockedUpdatePerson = jest.fn();
const mockedAddToast = jest.fn();

jest.mock('../../hooks/ApiProvider', () => ({
  useApiSurvivor: () => ({
    findBySurvivorId: mockedFindBySurvivorId,
    updatePerson: mockedUpdatePerson,
  }),
}));

jest.mock('../../hooks/ToastProvider', () => ({
  useToast: () => ({
    addToast: mockedAddToast,
  }),
}));

describe('Location', () => {
  afterAll(() => jest.clearAllMocks());
  beforeEach(() => {
    mockedFindBySurvivorId.mockClear();
    mockedUpdatePerson.mockClear();
    mockedAddToast.mockClear();
  });

  it('should be to able to render', async () => {
    const location = render(<Location />);
    expect(location).toBeTruthy();
  });

  it('should be to able update location', async () => {
    const id = uuid();
    mockedFindBySurvivorId.mockReturnValueOnce({
      lonlat: 'Point (-25.0 -35.0)',
    });
    mockedUpdatePerson.mockResolvedValueOnce({} as IPerson);
    const { getByPlaceholderText, getByText } = render(<Location />);
    const inputId = getByPlaceholderText('Id');
    const searchButton = getByText('Search');

    fireEvent.change(inputId, { target: { value: id } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(mockedFindBySurvivorId).toHaveBeenCalledWith(id);
    });
    const inputLongitude = getByPlaceholderText('Longitude');
    const inputLatitude = getByPlaceholderText('Latitude');
    const updateButton = getByText('Update');

    expect(inputLongitude).toHaveValue(-25);
    expect(inputLatitude).toHaveValue(-35);

    fireEvent.change(inputLongitude, { target: { value: -35.5 } });
    fireEvent.change(inputLatitude, { target: { value: -25.5 } });
    fireEvent.click(updateButton);
    await waitFor(() => {
      expect(mockedUpdatePerson).toHaveBeenCalled();
      expect(mockedAddToast).toHaveBeenCalled();
    });
  });

  it('should be to unable update location, error api', async () => {
    const id = uuid();
    mockedFindBySurvivorId.mockReturnValueOnce({
      lonlat: 'Point (-25.0 -35.0)',
    });
    mockedUpdatePerson.mockRejectedValueOnce(null);
    const { getByPlaceholderText, getByText } = render(<Location />);
    const inputId = getByPlaceholderText('Id');
    const searchButton = getByText('Search');

    fireEvent.change(inputId, { target: { value: id } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(mockedFindBySurvivorId).toHaveBeenCalledWith(id);
    });
    const inputLongitude = getByPlaceholderText('Longitude');
    const inputLatitude = getByPlaceholderText('Latitude');
    const updateButton = getByText('Update');

    expect(inputLongitude).toHaveValue(-25);
    expect(inputLatitude).toHaveValue(-35);

    fireEvent.change(inputLongitude, { target: { value: -35.5 } });
    fireEvent.change(inputLatitude, { target: { value: -25.5 } });
    fireEvent.click(updateButton);
    await waitFor(() => {
      expect(mockedUpdatePerson).toHaveBeenCalled();
      expect(mockedAddToast).toHaveBeenCalledWith({
        type: 'error',
        title: 'Error',
        description: 'Try again later',
      });
    });
  });
});
