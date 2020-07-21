import styled from 'styled-components';
import { Form as FormCompenent } from '@unform/web';
import { FormProps as FormPropsCompenent } from '@unform/core';

export const Container = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
  padding-left: 170px;
`;

export const Form = styled(FormCompenent)<FormPropsCompenent>`
  display: flex;
  background-color: var(--second);
  flex-wrap: wrap;
  padding: 20px;
  border-radius: 5px;
  width: max-content;
  justify-content: space-around;
`;

export const ContainerInputs = styled.div`
  width: 300px;
  & > h3 {
    text-align: center;
    padding: 10px 0px;
  }
`;
