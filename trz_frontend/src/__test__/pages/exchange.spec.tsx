import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import { uuid } from 'uuidv4';
import Exchange from '../../pages/Exchange';

const mockedAddToast = jest.fn();
const mockedMakeExchange = jest.fn();

jest.mock('../../hooks/ToastProvider', () => ({
  useToast: () => ({
    addToast: mockedAddToast,
  }),
}));

jest.mock('../../hooks/ApiProvider', () => ({
  useApiSurvivor: () => ({
    makeExchange: mockedMakeExchange,
  }),
}));

describe('Exchange', () => {
  afterAll(() => jest.clearAllMocks());

  beforeEach(async () => {
    mockedAddToast.mockClear();
    mockedMakeExchange.mockClear();
  });

  it('should be to able render exchange', () => {
    const exchange = render(<Exchange />);
    expect(exchange).toBeTruthy();
  });

  it('should be to able make exchange', async () => {
    const { getByText, getByTestId } = render(<Exchange />);

    const inputYouId = getByTestId('you.id');
    const inputYouFijiWater = getByTestId('you.fijiWater');
    const inputYouCampbellSoup = getByTestId('you.campbellSoup');
    const inputYouFirstAidPouch = getByTestId('you.firstAidPouch');
    const inputYouAk47 = getByTestId('you.ak47');

    const inputDealerName = getByTestId('dealer.name');
    const inputDealerFijiWater = getByTestId('dealer.fijiWater');
    const inputDealerCampbellSoup = getByTestId('dealer.campbellSoup');
    const inputDealerFirstAidPouch = getByTestId('dealer.firstAidPouch');
    const inputDealerAk47 = getByTestId('dealer.ak47');

    const button = getByText('Trade');

    fireEvent.change(inputYouId, { target: { value: uuid() } });
    fireEvent.change(inputYouFijiWater, { target: { value: 1 } });
    fireEvent.change(inputYouCampbellSoup, { target: { value: 1 } });
    fireEvent.change(inputYouFirstAidPouch, { target: { value: 1 } });
    fireEvent.change(inputYouAk47, { target: { value: 1 } });

    fireEvent.change(inputDealerName, { target: { value: 'John Doe' } });
    fireEvent.change(inputDealerFijiWater, { target: { value: 1 } });
    fireEvent.change(inputDealerCampbellSoup, { target: { value: 1 } });
    fireEvent.change(inputDealerFirstAidPouch, { target: { value: 1 } });
    fireEvent.change(inputDealerAk47, { target: { value: 1 } });

    fireEvent.click(button);
    await waitFor(() => {
      expect(mockedMakeExchange).toHaveBeenCalled();
      expect(mockedAddToast).toHaveBeenCalled();
    });
  });

  it('should be to unable make exchange, inputs wrongs', async () => {
    const { getByText } = render(<Exchange />);

    const button = getByText('Trade');

    fireEvent.click(button);

    await waitFor(() => {
      expect(mockedMakeExchange).not.toHaveBeenCalled();
      expect(mockedAddToast).not.toHaveBeenCalled();
    });
  });

  it('should be to unable make exchange, inputs wrongs', async () => {
    mockedMakeExchange.mockRejectedValue(null);
    const { getByText, getByTestId } = render(<Exchange />);

    const inputYouId = getByTestId('you.id');
    const inputYouFijiWater = getByTestId('you.fijiWater');
    const inputYouCampbellSoup = getByTestId('you.campbellSoup');
    const inputYouFirstAidPouch = getByTestId('you.firstAidPouch');
    const inputYouAk47 = getByTestId('you.ak47');

    const inputDealerName = getByTestId('dealer.name');
    const inputDealerFijiWater = getByTestId('dealer.fijiWater');
    const inputDealerCampbellSoup = getByTestId('dealer.campbellSoup');
    const inputDealerFirstAidPouch = getByTestId('dealer.firstAidPouch');
    const inputDealerAk47 = getByTestId('dealer.ak47');

    const button = getByText('Trade');
    await act(async () => {
      fireEvent.change(inputYouId, { target: { value: uuid() } });
      fireEvent.change(inputYouFijiWater, { target: { value: 1 } });
      fireEvent.change(inputYouCampbellSoup, { target: { value: 1 } });
      fireEvent.change(inputYouFirstAidPouch, { target: { value: 1 } });
      fireEvent.change(inputYouAk47, { target: { value: 1 } });

      fireEvent.change(inputDealerName, { target: { value: 'John Doe' } });
      fireEvent.change(inputDealerFijiWater, { target: { value: 1 } });
      fireEvent.change(inputDealerCampbellSoup, { target: { value: 1 } });
      fireEvent.change(inputDealerFirstAidPouch, { target: { value: 1 } });
      fireEvent.change(inputDealerAk47, { target: { value: 1 } });

      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(mockedMakeExchange).toHaveBeenCalled();
      expect(mockedAddToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Try again later',
        type: 'error',
      });
    });
  });
});
