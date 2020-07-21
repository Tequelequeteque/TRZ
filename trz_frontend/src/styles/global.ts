import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    outline: 0;
  }

  body {
    --primary: #282a36;
    --second: #44475a;
    --terciary:#6272a4;

    --white: #f8f8f2;
    --red: #ff5555;
    --orange: #ffb86c;
    --green: #50fa7b;
    
    background: var(--primary);
    color: var(--white);
    -webkit-font-smoothing: antialiased;
  }
  body, input, button {
    font-family: 'Roboto Slab', serif;
    font-size: 16px;
  }
  h1, h2, h3, h4, h5, h6, strong {
    font-weight: 500;
  }
  button {
    cursor: pointer;
  }  

  #root{
    display:flex;
  }
`;
