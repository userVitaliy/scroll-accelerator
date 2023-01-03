import React, { useMemo } from 'react';

import { Body } from './components/body/body';
import { Audio } from './components/audio/audio';
import { Track } from './components/track/track';

import { Providers } from './components/_providers/_providers';
import { WsProvider } from './components/_providers/ws.provider';
import { AppProvider } from './components/_providers/app.provider';

export const Root = () => {
  const PROVIDERS = useMemo(() => [WsProvider, AppProvider], []);

  return (
    <Providers providers={PROVIDERS}>
      <Body>
        <Audio />
        <Track />
      </Body>
    </Providers>
  );
};
