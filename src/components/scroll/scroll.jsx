import React, { useRef, useEffect } from 'react';
import _throttle from 'lodash/throttle';
import styles from './_scroll.module.scss';

export const Scroll = () => {
  const container = useRef(null);
  const container2 = useRef(null);

  const onWheel = (e) => {
    e.preventDefault();
    console.log(e.deltaX, e.deltaY, e.wheelDelta);
  };

  useEffect(() => {
    container.current.addEventListener('wheel', onWheel);
    container2.current.addEventListener('wheel', _throttle(onWheel, 0, { leading: true }));
  }, []);

  return (
    <div className={styles.root}>
      <div ref={container} className={styles.scrollBox}>
        scroll me
      </div>
      <div ref={container2} className={styles.scrollBox}>
        scroll me <br />
        <span>(with throttle)</span>
      </div>
    </div>
  );
};
