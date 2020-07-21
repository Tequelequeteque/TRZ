import styled from 'styled-components';

interface ContainerProps {
  show: boolean;
}

export const Container = styled.div<ContainerProps>`
  transition: opacity 2s;
  opacity: ${props => Number(props.show)};
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
  padding-left: 170px;
  form {
    flex: 0.5;
    background-color: var(--second);
    padding: 20px;
    border-radius: 5px;
  }
`;
