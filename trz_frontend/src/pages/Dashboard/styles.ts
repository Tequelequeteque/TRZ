import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding-left: 170px;
`;
interface WrapperTextProps {
  show: boolean;
}

export const WrapperText = styled.div<WrapperTextProps>`
  transition: opacity 2s;
  opacity: ${props => Number(props.show)};
  padding: 15px;
  border-radius: 5px;
  background-color: var(--second);
  color: var(--white);
  display: flex;
  flex-direction: column;
  width: fit-content;
  height: fit-content;
  text-align: left;
  & > div {
    margin-left: auto;
  }
`;

interface LabelProps {
  value?: string | number;
  show: boolean;
}

export const Label = styled.h3<LabelProps>`
  opacity: ${props => Number(props.show)};
  font-weight:400;
  &::after {
    content: '${props => String(props.value)}';
    margin-left: 5px;
    font-size: 25px;
    font-weight: 500;
  }
`;
