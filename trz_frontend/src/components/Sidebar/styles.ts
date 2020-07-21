import styled from 'styled-components';
import { NavLink as LinkComponent, NavLinkProps } from 'react-router-dom';

export const Nav = styled.nav`
  flex: 1;
  max-width: fit-content;
  height: 100vh;
  background-color: var(--second);
  position: fixed;
`;

export const Ul = styled.ul``;

export const Li = styled.li`
  display: flex;
`;

export const Link = styled(LinkComponent)<NavLinkProps>`
  display: flex;
  flex: 1;
  justify-content: left;
  text-decoration: none;
  padding: 5px 21px;
  text-transform: capitalize;
  border-right: 2px inset var(--second);
  color: var(--white);

  &.actived {
    cursor: not-allowed;
    padding: 3px 21px 3px 5px;
    background-color: var(--primary);
    border-bottom: 2px outset var(--second);
    border-top: 2px inset var(--terciary);
    border-right: none;
    &::before {
      content: '|>';
      padding-right: 5px;
      width: fit-content;
      color: var(--orange);
    }
  }
`;
