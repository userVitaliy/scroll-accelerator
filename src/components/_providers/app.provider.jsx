import { useState } from 'react';
import constate from 'constate';

const useAppProvider = () => {
  const [waveIsReady, setWaveIsReady] = useState(false);
  return { waveIsReady, setWaveIsReady };
};

export const [AppProvider, useAppContext] = constate(useAppProvider);
