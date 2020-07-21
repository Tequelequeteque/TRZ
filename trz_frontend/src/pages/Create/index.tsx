import React, {
  useCallback,
  useMemo,
  useRef,
  useEffect,
  useState,
} from 'react';
import { AiOutlineUserDelete } from 'react-icons/ai';
import {
  GiEmptyHourglass,
  GiPositionMarker,
  GiWaterBottle,
  GiHotMeal,
  GiFirstAidKit,
  GiAk47,
} from 'react-icons/gi';
import { FaTransgender } from 'react-icons/fa';
import * as Yup from 'yup';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { useHistory } from 'react-router-dom';
import { Container } from './styles';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../Utils/getValidationErrors';
import { useApiSurvivor } from '../../hooks/ApiProvider';
import { useToast } from '../../hooks/ToastProvider';

const Create: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { createPerson } = useApiSurvivor();
  const { addToast } = useToast();
  const history = useHistory();
  const [flag, setFlag] = useState(false);
  const schemaSurvivor = useMemo(
    () =>
      Yup.object().shape({
        name: Yup.string().required('Name is required'),
        age: Yup.number()
          .integer('Age is required')
          .min(0, 'Age is required')
          .required('Age is required'),
        gender: Yup.string()
          .oneOf(['male', 'female'])
          .required('Gender is required'),
        latitude: Yup.number().required('Latitude is required'),
        longitude: Yup.number().required('Longitude is required'),
        fiji_water: Yup.number()
          .integer('Age is required')
          .min(0, 'Age is required')
          .required('Age is required'),
        campbell_soup: Yup.number()
          .integer('Age is required')
          .min(0, 'Age is required')
          .required('Age is required'),
        first_aid_pouch: Yup.number()
          .integer('Age is required')
          .min(0, 'Age is required')
          .required('Age is required'),
        ak47: Yup.number()
          .integer('Age is required')
          .min(0, 'Age is required')
          .required('Age is required'),
      }),
    [],
  );
  const handleSubmit = useCallback(
    async data => {
      try {
        formRef.current?.setErrors({});
        await schemaSurvivor.validate(data, {
          abortEarly: false,
        });
        const formData = new FormData();
        formData.append('person[name]', data.name);
        formData.append('person[age]', data.age);
        formData.append('person[gender]', data.gender === 'male' ? 'M' : 'F');
        formData.append(
          'person[lonlat]',
          `Point(${data.longitude} ${data.latitude})`,
        );
        formData.append(
          'items',
          `Fiji Water:${data.fiji_water};Campbell Soup:${data.campbell_soup};` +
            `First Aid Pouch:${data.first_aid_pouch};AK47:${data.ak47}`,
        );
        const { id } = await createPerson(formData);
        history.push('/dashboard');
        addToast({
          title: 'Success',
          description: `Create a new person with id: ${id}. Please save your id.`,
          type: 'success',
        });
        return;
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);
          return;
        }
      }
      addToast({
        title: 'Error',
        description: 'Try again later',
        type: 'error',
      });
    },
    [schemaSurvivor, formRef, createPerson, history, addToast],
  );

  useEffect(() => setFlag(true), []);

  return (
    <Container show={flag}>
      <Form onSubmit={handleSubmit} ref={formRef}>
        <Input
          type="text"
          name="name"
          placeholder="Name"
          icon={AiOutlineUserDelete}
        />
        <Input
          type="number"
          name="age"
          placeholder="Age"
          icon={GiEmptyHourglass}
        />
        <Input
          type="text"
          name="gender"
          placeholder="Gender"
          icon={FaTransgender}
        />
        <Input
          type="number"
          name="latitude"
          placeholder="Latitude"
          icon={GiPositionMarker}
          step="0.1"
        />
        <Input
          type="number"
          name="longitude"
          placeholder="Longitude"
          icon={GiPositionMarker}
          step="0.1"
        />
        <Input
          type="number"
          name="fiji_water"
          placeholder="Fiji Water"
          icon={GiWaterBottle}
        />
        <Input
          type="number"
          name="campbell_soup"
          placeholder="Campbell Soup"
          icon={GiHotMeal}
        />
        <Input
          type="number"
          name="first_aid_pouch"
          placeholder="First Aid Pouch"
          icon={GiFirstAidKit}
        />
        <Input type="number" name="ak47" placeholder="AK47" icon={GiAk47} />
        <Button type="submit">Create</Button>
      </Form>
    </Container>
  );
};
export default Create;
