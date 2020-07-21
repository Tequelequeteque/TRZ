import styled from 'styled-components';
import { Form as FormComponent } from '@unform/web';
import { FormProps as FormComponentProps } from '@unform/core';

export const Container = styled.div`
  flex: 1;
  flex-direction: column;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
  padding-left: 170px;
`;

export const Form = styled(FormComponent)<FormComponentProps>`
  width: 400px;
  background-color: var(--second);
  padding: 20px;
  border-radius: 5px;
  & + form {
    margin-top: 50px;
  }
  & > p {
    padding: 20px;
  }
`;
