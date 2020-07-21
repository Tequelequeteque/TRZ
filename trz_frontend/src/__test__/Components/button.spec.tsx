import React from 'react';
import { render } from '@testing-library/react';
import Button from '../../components/Button';

describe('Button', () => {
  it('should be able to render button', () => {
    const button = render(<Button />);
    expect(button).toBeTruthy();
  });

  it('should be able to have button value', () => {
    const button = render(<Button>Button Name</Button>);
    expect(button.container).toHaveTextContent('Button Name');
  });
});
