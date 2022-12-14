import React from 'react';
import ReactDOM from 'react-dom/client';
import { Root } from './root';
import './styles/styles.scss';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
