import React from 'react';
import styles from './_body.module.scss';

export const Body = ({children}) => {
  return <div className={styles.root}>
    <h2>Zoom Acceleration Playground</h2>
    {children}
  </div>;
};
