import React from 'react';

export const Providers = ({ providers, children }) => {
  return providers.reduce((Prev, Curr) => <Curr>{Prev}</Curr>, children);
};
