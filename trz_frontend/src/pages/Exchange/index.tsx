import React, { useRef, useCallback, useState, useMemo } from 'react';
import {
  GiWaterBottle,
  GiHotMeal,
  GiFirstAidKit,
  GiAk47,
} from 'react-icons/gi';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { Container, Form, ContainerInputs } from './styles';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationUuid from '../../Utils/getValidationUuid';
import getValidationErrors from '../../Utils/getValidationErrors';
import { useToast } from '../../hooks/ToastProvider';
import { useApiSurvivor } from '../../hooks/ApiProvider';

interface ITrade {
  fijiWater: string | number;
  campbellSoup: string | number;
  firstAidPouch: string | number;
  ak47: string | number;
}

type IKey = keyof ITrade;

interface IData {
  dealer: ITrade & { name: string };
  you: ITrade & { id: string };
}

const Exchange: React.FC = () => {
  const { addToast } = useToast();
  const { makeExchange } = useApiSurvivor();

  const formRef = useRef<FormHandles>(null);

  const [yourPoints, setYourPoints] = useState(0);
  const [dealerPoints, setDealerPoints] = useState(0);

  const itemsPoints = useMemo(
    () =>
      ({
        fijiWater: 14,
        campbellSoup: 12,
        firstAidPouch: 10,
        ak47: 8,
      } as ITrade),
    [],
  );

  const calcPoints = useCallback(() => {
    if (!formRef.current) return;
    const { you, dealer } = formRef.current.getData() as IData;
    const keys = Object.keys(you).splice(1);
    setYourPoints(
      keys.reduce(
        (acc, key) =>
          Number(you[key as IKey]) * (itemsPoints[key as IKey] as number) + acc,
        0,
      ),
    );
    setDealerPoints(
      keys.reduce(
        (acc, key) =>
          Number(dealer[key as IKey]) * (itemsPoints[key as IKey] as number) +
          acc,
        0,
      ),
    );
  }, [formRef, itemsPoints]);

  const handleTrade = useCallback(
    async ({ you, dealer }: IData) => {
      if (yourPoints !== dealerPoints) {
        addToast({ title: 'Points', description: 'Points is not equal' });
        return;
      }

      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        you: Yup.object().shape({
          id: getValidationUuid('Your id is required', 'you.id'),
          fijiWater: Yup.number()
            .min(0, 'Fiji Water must be greater or equal than 0')
            .required('Fiji Water is required'),
          campbellSoup: Yup.number()
            .min(0, 'Campbell Soup must be greater or equal than 0')
            .required('Campbell Soup is required'),
          firstAidPouch: Yup.number()
            .min(0, 'First Aid Pouch must be greater or equal than 0')
            .required('First Aid Pouch is required'),
          ak47: Yup.number()
            .min(0, 'Ak47 must be greater or equal than 0')
            .required('Ak47 is required'),
        }),
        dealer: Yup.object().shape({
          name: Yup.string().required(),
          fijiWater: Yup.number()
            .min(0, 'Fiji Water must be greater or equal than 0')
            .required('Fiji Water is required'),
          campbellSoup: Yup.number()
            .min(0, 'Campbell Soup must be greater or equal than 0')
            .required('Campbell Soup is required'),
          firstAidPouch: Yup.number()
            .min(0, 'First Aid Pouch must be greater or equal than 0')
            .required('First Aid Pouch is required'),
          ak47: Yup.number()
            .min(0, 'Ak47 must be greater or equal than 0')
            .required('Ak47 is required'),
        }),
      });
      try {
        await schema.validate({ you, dealer }, { abortEarly: false });
        const fd = new FormData();
        fd.append('consumer[name]', dealer.name);
        fd.append(
          'consumer[pick]',
          `Fiji Water:${dealer.fijiWater};Campbell Soup:${dealer.campbellSoup};` +
            `First Aid Pouch:${dealer.firstAidPouch};AK47:${dealer.ak47}`,
        );
        fd.append(
          'consumer[payment]',
          `Fiji Water:${you.fijiWater};Campbell Soup:${you.campbellSoup};` +
            `First Aid Pouch:${you.firstAidPouch};AK47:${you.ak47}`,
        );
        await makeExchange(you.id, fd);
        addToast({
          title: 'Success',
          description: 'Exchange make with success',
          type: 'success',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);
          return;
        }
        addToast({
          title: 'Error',
          description: 'Try again later',
          type: 'error',
        });
      }
    },
    [yourPoints, addToast, dealerPoints, makeExchange],
  );
  return (
    <Container>
      <Form onSubmit={handleTrade} ref={formRef as any} onChange={calcPoints}>
        <ContainerInputs>
          <Input
            name="you.id"
            type="text"
            placeholder="Your id"
            data-testid="you.id"
          />
          <h3>Items offered</h3>
          <Input
            type="number"
            name="you.fijiWater"
            placeholder="Fiji Water"
            icon={GiWaterBottle}
            data-testid="you.fijiWater"
          />
          <Input
            type="number"
            name="you.campbellSoup"
            placeholder="Campbell Soup"
            icon={GiHotMeal}
            data-testid="you.campbellSoup"
          />
          <Input
            type="number"
            name="you.firstAidPouch"
            placeholder="First Aid Pouch"
            icon={GiFirstAidKit}
            data-testid="you.firstAidPouch"
          />
          <Input
            type="number"
            name="you.ak47"
            placeholder="AK47"
            icon={GiAk47}
            data-testid="you.ak47"
          />
          <h3>Points: {yourPoints}</h3>
        </ContainerInputs>
        <ContainerInputs>
          <Input
            name="dealer.name"
            type="text"
            placeholder="Full name dealer"
            data-testid="dealer.name"
          />
          <h3>Desired items</h3>
          <Input
            type="number"
            name="dealer.fijiWater"
            placeholder="Fiji Water"
            icon={GiWaterBottle}
            data-testid="dealer.fijiWater"
          />
          <Input
            type="number"
            name="dealer.campbellSoup"
            placeholder="Campbell Soup"
            icon={GiHotMeal}
            data-testid="dealer.campbellSoup"
          />
          <Input
            type="number"
            name="dealer.firstAidPouch"
            placeholder="First Aid Pouch"
            icon={GiFirstAidKit}
            data-testid="dealer.firstAidPouch"
          />
          <Input
            type="number"
            name="dealer.ak47"
            placeholder="AK47"
            icon={GiAk47}
            data-testid="dealer.ak47"
          />
          <h3>Points: {dealerPoints}</h3>
        </ContainerInputs>
        <Button type="submit">Trade</Button>
      </Form>
    </Container>
  );
};

export default Exchange;
