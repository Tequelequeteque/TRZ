import React, { createContext, useCallback, useContext } from 'react';
import api from '../services/api';

export interface IReport {
  average_infected: number;
  average_healthy: number;
  average_items_quantity_per_person: number;
  average_items_quantity_per_healthy_person: number;
  total_points_lost: number;
  average_quantity_of_each_item_per_person: {
    AK47: number | undefined;
    'Campbell Soup': number | undefined;
    'Fiji Water': number | undefined;
    'First Aid Pouch': number | undefined;
  };
}

export interface IPerson {
  id?: string;
  name: string;
  age: number;
  gender: 'M' | 'F';
  lonlat: string;
  created_at: Date;
  updated_at: Date;
  infected: boolean;
  location?: string;
}

interface IApiSurvivor {
  findAllSurvivors(): Promise<IPerson[]>;
  findBySurvivorId(id: string): Promise<IPerson>;
  getReports(): Promise<IReport>;
  createPerson(data: FormData): Promise<IPerson>;
  updatePerson(id: string, data: FormData): Promise<IPerson>;
  reportInfection(reportedId: string, infectedId: string): Promise<void>;
  makeExchange(id: string, data: FormData): Promise<any>;
}

const ContextApi = createContext<IApiSurvivor>({} as IApiSurvivor);

const ApiProvider: React.FC = ({ children }) => {
  const findAllSurvivors = useCallback(
    async () => (await api.get<IPerson[]>('people')).data,
    [],
  );

  const findBySurvivorId = useCallback(
    async (id: string) => (await api.get<IPerson>(`people/${id}`)).data,
    [],
  );

  const getReports = useCallback(async () => {
    const promises = [
      api.get('report/infected'),
      api.get('report/non_infected'),
      api.get('report/people_inventory'),
      api.get('report/infected_points'),
    ];
    return (await Promise.all(promises))
      .map(response => response.data.report)
      .reduce((result, data) => ({ ...result, ...data }), {} as IReport);
  }, []);

  const createPerson = useCallback(
    async (fd: FormData): Promise<IPerson> =>
      (await api.post<IPerson>('people', fd)).data,
    [],
  );

  const updatePerson = useCallback(
    async (id: string, fd: FormData) =>
      (await api.patch(`people/${id}`, fd)).data,
    [],
  );

  const reportInfection = useCallback(
    async (reportedId: string, infectedId: string) => {
      const fd = new FormData();
      fd.append('infected', infectedId);
      await api.post(`people/${reportedId}/report_infection`, fd);
    },
    [],
  );

  const makeExchange = useCallback(async (id: string, fd: FormData) => {
    await api.post(`people/${id}/properties/trade_item`, fd);
  }, []);

  return (
    <ContextApi.Provider
      value={{
        findAllSurvivors,
        findBySurvivorId,
        getReports,
        createPerson,
        updatePerson,
        reportInfection,
        makeExchange,
      }}
    >
      {children}
    </ContextApi.Provider>
  );
};

function useApiSurvivor(): IApiSurvivor {
  return useContext(ContextApi);
}

export { ApiProvider, useApiSurvivor };
