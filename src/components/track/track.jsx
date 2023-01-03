import React, { useRef, useEffect } from 'react';

import { useWsContext } from '../_providers/ws.provider';
import styles from './_track.module.scss';

export const Track = () => {
  const { trackElements, onWheel, onScroll } = useWsContext();
  const container = useRef(null);
  const feed = useRef(null);

  useEffect(() => {
    trackElements.current.push([container.current, feed.current]);
  }, []);

  useEffect(() => {
    const element = container.current;
    element.addEventListener('wheel', onWheel);
    element.addEventListener('scroll', onScroll);
    return () => {
      element.removeEventListener('wheel', onWheel);
      element.removeEventListener('scroll', onScroll);
    };
  }, []);
  
  return (
    <div className={styles.Track}>
      <div ref={container} className={styles.Track__body}>
        <div ref={feed} className={styles.Track__feed}>
          {Array.from(Array(10)).map((el, i) => (
            <div className={styles.Track__cell} key={i}>
              {i}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
