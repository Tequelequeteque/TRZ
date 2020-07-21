import React from 'react';
import {
  render,
  fireEvent,
  waitFor,
  act,
  RenderResult,
} from '@testing-library/react';
import { uuid } from 'uuidv4';
import ReportInfection from '../../pages/ReportInfection';
import { IPerson } from '../../hooks/ApiProvider';

const id = uuid();
const person: IPerson = {
  id,
  age: 25,
  gender: 'M',
  created_at: new Date(),
  updated_at: new Date(),
  infected: false,
  lonlat: 'Point (-25 -35)',
  name: 'John Doe',
  location: id,
};

const mockedFindAllSurvivors = jest.fn();
const mockedReportInfection = jest.fn();
const mockedAddToast = jest.fn();

jest.mock('../../hooks/ApiProvider', () => ({
  useApiSurvivor: () => ({
    findAllSurvivors: mockedFindAllSurvivors,
    reportInfection: mockedReportInfection,
  }),
}));

jest.mock('../../hooks/ToastProvider', () => ({
  useToast: () => ({
    addToast: mockedAddToast,
  }),
}));

describe('Report Infection', () => {
  afterAll(() => jest.clearAllMocks());

  beforeEach(() => {
    mockedFindAllSurvivors.mockClear();
    mockedReportInfection.mockClear();
    mockedAddToast.mockClear();
  });

  it('should be able to render Report Infection', async () => {
    mockedFindAllSurvivors.mockResolvedValue([person]);
    await act(async () => {
      const reportInfection = render(<ReportInfection />);
      expect(reportInfection).toBeTruthy();
    });
  });

  it('should be able to show result find survivor by name', async () => {
    mockedFindAllSurvivors.mockResolvedValue([person]);
    let reportInfection: RenderResult;

    await act(async () => {
      reportInfection = render(<ReportInfection />);
    });

    const inputName = reportInfection.getByPlaceholderText('Name');
    const button = reportInfection.getByText('Search');

    fireEvent.change(inputName, { target: { value: person.name } });
    fireEvent.click(button);

    await waitFor(() => {
      const context = reportInfection.getByTestId('p');
      expect(context).toBeTruthy();
    });
  });

  it('should be able to report infection', async () => {
    mockedFindAllSurvivors.mockResolvedValue([person]);
    let reportInfection: RenderResult;
    await act(async () => {
      reportInfection = render(<ReportInfection />);
    });

    const inputReporteId = reportInfection.getByPlaceholderText('Reported Id');
    const inputInfectdId = reportInfection.getByPlaceholderText('Infected Id');
    const button = reportInfection.getByText('Report Infection');

    fireEvent.change(inputReporteId, { target: { value: id } });
    fireEvent.change(inputInfectdId, { target: { value: id } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockedReportInfection).toHaveBeenCalled();
      expect(mockedAddToast).toHaveBeenCalled();
    });
  });

  it('should be unable to show result find survivor by name,error api', async () => {
    mockedFindAllSurvivors
      .mockResolvedValue([person])
      .mockRejectedValueOnce(null);
    let reportInfection: RenderResult;

    await act(async () => {
      reportInfection = render(<ReportInfection />);
    });

    const inputName = reportInfection.getByPlaceholderText('Name');
    const button = reportInfection.getByText('Search');

    fireEvent.change(inputName, { target: { value: person.name } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockedAddToast).toHaveBeenCalledWith({
        title: 'Error',
        type: 'error',
        description: 'Try again later',
      });
    });
  });

  it('should be unable to show result find survivor by name,dont have survivor with name', async () => {
    mockedFindAllSurvivors.mockResolvedValue([person]);
    let reportInfection: RenderResult;

    await act(async () => {
      reportInfection = render(<ReportInfection />);
    });

    const inputName = reportInfection.getByPlaceholderText('Name');
    const button = reportInfection.getByText('Search');

    fireEvent.change(inputName, { target: { value: 'unnamed' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(() => reportInfection.getByTestId('p')).toThrowError();
    });
  });

  it('should be unable to report infected, api error', async () => {
    mockedFindAllSurvivors.mockResolvedValue([person]);
    mockedReportInfection.mockRejectedValueOnce(null);
    let reportInfection: RenderResult;

    await act(async () => {
      reportInfection = render(<ReportInfection />);
    });

    const inputReporteId = reportInfection.getByPlaceholderText('Reported Id');
    const inputInfectdId = reportInfection.getByPlaceholderText('Infected Id');
    const button = reportInfection.getByText('Report Infection');

    fireEvent.change(inputReporteId, { target: { value: id } });
    fireEvent.change(inputInfectdId, { target: { value: id } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockedAddToast).toHaveBeenCalledWith({
        title: 'Error',
        type: 'error',
        description: 'Try again later',
      });
    });
  });
});
