import constate from 'constate';

const useScrollProvider = () => {
  console.log('__hello');
};

export const [ScrollProvider, useScrollContext] = constate(useScrollProvider);
