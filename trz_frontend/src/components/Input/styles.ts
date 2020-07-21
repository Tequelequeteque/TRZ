import styled, { css } from 'styled-components';

import Tooltip from '../Tooltip';

interface ContainerProps {
  isFocused: boolean;
  isFilled: boolean;
  isErrored: boolean;
}

export const Container = styled.div<ContainerProps>`
  background: var(--primary);
  border-radius: 10px;
  padding: 16px;
  width: 100%;
  border: 2px solid var(--second);
  color: var(--second);

  display: flex;
  align-items: center;

  & + div {
    margin-top: 8px;
  }

  ${props =>
    props.isErrored &&
    css`
      border-color: var(--red);
    `}

  ${props =>
    props.isFocused &&
    css`
      color: var(--orange);
      border-color: var(--orange);
    `}

  ${props =>
    props.isFilled &&
    css`
      color: var(--orange);
    `}

  input {
    flex: 1;
    background: transparent;
    border: 0;
    color: var(--white);

    &::placeholder {
      color: var(--terciary);
    }

    /* Chrome, Safari, Edge, Opera */
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    /* Firefox */
    &[type=number] {
      -moz-appearance: textfield;
    }
  }

  svg {
    margin-right: 16px;
  }
`;

export const Error = styled(Tooltip)`
  height: 20px;
  margin-left: 16px;

  svg {
    margin: 0;
  }

  span {
    background: car(--red);
    color: var(--white);

    &::before {
      border-color: car(--red) transparent;
    }
  }
`;
