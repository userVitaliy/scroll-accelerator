import React, { useRef, useEffect } from 'react';
import waveSurfer from 'wavesurfer.js';
import SRC from './Shouse-Love_Tonight-[AudioTrimmer.com].mp3';
import { useWsContext } from '../_providers/ws.provider';
import { useAppContext } from '../_providers/app.provider';
import styles from './_audio.module.scss';

export const Audio = () => {
  const { setWaveIsReady, waveIsReady } = useAppContext();
  const { ws, wsProxy, onReady, onResize, onScroll, onWheel } = useWsContext();
  const container = useRef(null);

  useEffect(() => {
    ws.current = waveSurfer.create({
      container: container.current,
      backend: 'MediaElement',
      scrollParent: false,
      barWidth: 2,
      barHeight: 1,
      plugins: [],
    });
    ws.current.load(SRC);
    ws.current.on('waveform-ready', onReady);

    return () => {
      ws.current.destroy();
      ws.current.unAll();
      setWaveIsReady(false);
    };
  }, []);

  useEffect(() => {
    const element = container.current;
    element.addEventListener('wheel', onWheel);
    return () => element.removeEventListener('wheel', onWheel);
  }, []);

  useEffect(() => {
    if (!waveIsReady) return;
    window.addEventListener('resize', onResize);
    wsProxy.current.addEventListener('scroll', onScroll);
    return () => {
      if (waveIsReady) return;
      window.removeEventListener('resize', onResize);
      wsProxy.current.removeEventListener('scroll', onScroll);
    };
  }, [waveIsReady])

  return (
    <div className={styles.root}>
      <h1>Hello there</h1>
      <div ref={container} className={styles.body} />
    </div>
  );
};
