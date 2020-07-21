/* eslint-disable react/no-array-index-key */
import React, { useMemo } from 'react';
import { Nav, Ul, Li, Link } from './styles';

interface TopbarProps {
  paths: string[];
}

const Sidebar: React.FC<TopbarProps> = ({ paths }) => {
  const pathsLowerCase = useMemo(() => paths.map(path => path.toLowerCase()), [
    paths,
  ]);
  return (
    <Nav>
      <Ul>
        {pathsLowerCase.map((path, index) => (
          <Li key={index}>
            <Link
              exact
              activeClassName="actived"
              to={`/${path}`}
              data-testid={index}
            >
              {path.replace('-', ' ')}
            </Link>
          </Li>
        ))}
      </Ul>
    </Nav>
  );
};

export default Sidebar;
