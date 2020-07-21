import React, { useState, useCallback, useRef } from 'react';

import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { Container, Form } from './styles';
import { useApiSurvivor, IPerson } from '../../hooks/ApiProvider';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../Utils/getValidationErrors';
import { useToast } from '../../hooks/ToastProvider';
import getValidationUuid from '../../Utils/getValidationUuid';

type FindPersonProps = {
  submit(id: string): Promise<void>;
  formRef: any;
};

const FindPerson: React.FC<FindPersonProps> = ({ submit, formRef }) => (
  <Form onSubmit={submit} ref={formRef}>
    <Input name="id" type="text" placeholder="Id" />
    <Button type="submit">Search</Button>
  </Form>
);

interface IInitialLocation {
  latitude: number;
  longitude: number;
}

interface UpdateLocationPersonProps {
  submit(data: IPerson): void;
  initData: IInitialLocation | null;
  formRef: any;
}

const UpdateLocationPerson: React.FC<UpdateLocationPersonProps> = ({
  submit,
  initData,
  formRef,
}) => (
  <Form onSubmit={submit} initialData={{ ...initData }} ref={formRef}>
    <Input name="latitude" type="number" placeholder="Latitude" step=".001" />
    <Input name="longitude" type="number" placeholder="Longitude" step=".001" />
    <Button type="submit">Update</Button>
  </Form>
);

const UpdateLocation: React.FC = () => {
  const { findBySurvivorId, updatePerson } = useApiSurvivor();
  const { addToast } = useToast();

  const formRefSearchPerson = useRef<FormHandles>(null);
  const formRefUpdatePerson = useRef<FormHandles>(null);

  const [location, setLocation] = useState<IInitialLocation | null>(null);
  const [person, setPerson] = useState<IPerson>({} as IPerson);

  const handleFindPerson = useCallback(
    async ({ id }) => {
      try {
        formRefSearchPerson.current?.setErrors({});
        const schema = getValidationUuid('Id is required');
        await schema.validate(id, { abortEarly: false });

        const personData = await findBySurvivorId(id);
        const { lonlat = '' } = personData;
        const [, longitude, latitude] = /(-?\d*\.\d*) (-?\d*\.\d*)/.exec(
          lonlat,
        ) || [null, 0, 0];
        setLocation({
          longitude: Number(longitude),
          latitude: Number(latitude),
        } as IInitialLocation);
        setPerson(personData);
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRefSearchPerson.current?.setErrors(errors);
        }
      }
    },
    [findBySurvivorId, setPerson, setLocation],
  );

  const handleUpdateLocation = useCallback(
    async ({ longitude, latitude }) => {
      try {
        formRefUpdatePerson.current?.setErrors({});

        const schema = Yup.object().shape({
          latitude: Yup.number().required('Latitude is required'),
          longitude: Yup.number().required('Longitude is required'),
        });
        await schema.validate({ longitude, latitude }, { abortEarly: false });

        const formData = new FormData();
        formData.append('person[name]', person.name);
        formData.append('person[age]', String(person.age));
        formData.append('person[gender]', person.gender);
        formData.append('person[lonlat]', `Point(${longitude} ${latitude})`);
        await updatePerson(String(person.id), formData);
        addToast({
          title: 'Success',
          description: 'Your location has been updated',
          type: 'success',
        });
        return;
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRefUpdatePerson.current?.setErrors(errors);
          return;
        }
      }
      addToast({
        title: 'Error',
        description: 'Try again later',
        type: 'error',
      });
    },
    [person, addToast, updatePerson],
  );

  return (
    <Container>
      {!location && (
        <FindPerson submit={handleFindPerson} formRef={formRefSearchPerson} />
      )}
      {!!location && (
        <UpdateLocationPerson
          submit={handleUpdateLocation}
          formRef={formRefUpdatePerson}
          initData={location}
        />
      )}
    </Container>
  );
};

export default UpdateLocation;
