/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createGlobalStyle } from 'styled-components';

export const baseColors = {
  orange: '#f77f00',
  pink: '#ef476f',
  red: '#d62828',
  yellow: '#ffd166',
  green: '#06d6a0',
  blue: '#118ab2',
  purple: '#7209b7',
  brown: '#bc6c25',
  grey: '#8d99ae',
  beige: '#eae2b7',
};

export const colors = {
  ...baseColors,
  background: '#003049',
};

export const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    background-color: ${colors.background};
    font-size: 24px;
    font-family: 'Nunito', sans-serif;
    font-weight: 900;
  }
`;
