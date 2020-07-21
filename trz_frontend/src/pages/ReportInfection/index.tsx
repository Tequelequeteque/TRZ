import React, { useCallback, useRef, useState, useEffect } from 'react';
import { MdReportProblem } from 'react-icons/md';
import { FaBiohazard } from 'react-icons/fa';
import * as Yup from 'yup';
import { FormHandles } from '@unform/core';
import { Container, Form } from './styles';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useApiSurvivor, IPerson } from '../../hooks/ApiProvider';
import getValidationUuid from '../../Utils/getValidationUuid';
import getValidationErrors from '../../Utils/getValidationErrors';
import { useToast } from '../../hooks/ToastProvider';

interface IData {
  reportedId: string;
  infectedId: string;
  name: string;
}

const ReportInfectionForm: React.FC = () => {
  const { reportInfection } = useApiSurvivor();
  const { addToast } = useToast();

  const reportInfectionRef = useRef<FormHandles>(null);

  const handleReportInfection = useCallback(
    async (data: IData) => {
      reportInfectionRef.current?.setErrors({});
      try {
        const schema = Yup.object().shape({
          reportedId: getValidationUuid(
            'Reported id is required',
            'reportedId',
          ),
          infectedId: getValidationUuid(
            'Infected id is required',
            'infectedId',
          ),
        });
        await schema.validate(data, { abortEarly: false });
        await reportInfection(data.reportedId, data.infectedId);
        addToast({ title: 'Success', type: 'success' });
        return;
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          reportInfectionRef.current?.setErrors(errors);
          return;
        }
        addToast({
          title: 'Error',
          type: 'error',
          description: 'Try again later',
        });
      }
    },
    [reportInfection, addToast],
  );
  return (
    <Form onSubmit={handleReportInfection} ref={reportInfectionRef as any}>
      <Input
        name="reportedId"
        placeholder="Reported Id"
        icon={MdReportProblem}
      />
      <Input name="infectedId" placeholder="Infected Id" icon={FaBiohazard} />
      <Button type="submit">Report Infection</Button>
    </Form>
  );
};

const SearchByNameForm: React.FC = () => {
  const searchByNameFormRef = useRef<FormHandles>(null);

  const { findAllSurvivors } = useApiSurvivor();
  const { addToast } = useToast();

  const [people, setPeople] = useState<IPerson[]>([] as IPerson[]);
  const [person, setPerson] = useState<IPerson | undefined>();

  const getSurvivors = useCallback(async () => {
    try {
      setPeople(await findAllSurvivors());
    } catch (error) {
      addToast({
        title: 'Error',
        type: 'error',
        description: 'Try again later',
      });
    }
  }, [setPeople, findAllSurvivors, addToast]);

  useEffect(() => {
    getSurvivors();
  }, [getSurvivors]);

  const handleSearch = useCallback(
    async ({ name }: IData) => {
      searchByNameFormRef.current?.setErrors({});
      const schema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
      });
      try {
        await schema.validate({ name }, { abortEarly: false });
        const personData = people.find(p =>
          p.name.toLowerCase().includes(name.toLowerCase()),
        );
        if (!personData) {
          setPerson(undefined);
          return;
        }

        const locationArray = personData?.location?.split('/') || [''];
        setPerson({
          ...personData,
          id: locationArray[locationArray.length - 1],
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          searchByNameFormRef.current?.setErrors(errors);
          return;
        }
      }
      getSurvivors();
    },
    [getSurvivors, searchByNameFormRef, people],
  );

  return (
    <Form onSubmit={handleSearch} ref={searchByNameFormRef as any}>
      <Input name="name" placeholder="Name" />
      <Button type="submit">Search</Button>
      {person && (
        <p data-testid="p">
          <strong>Id: </strong> {person.id}
          <br />
          <strong>Name: </strong> {person.name}
          <br />
          <strong>Infected: </strong> {String(person.infected)}
        </p>
      )}
    </Form>
  );
};

const ReportInfection: React.FC = () => {
  return (
    <Container>
      <ReportInfectionForm />
      <SearchByNameForm />
    </Container>
  );
};

export default ReportInfection;
