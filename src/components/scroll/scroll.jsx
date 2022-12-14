import React, { useRef, useEffect } from 'react';
import styles from './_scroll.module.scss';

export const Scroll = () => {
  const container = useRef(null);

  const onWheel = (e) => {
    e.preventDefault();
    console.log(e.deltaX, e.deltaY);
  };

  useEffect(() => {
    container.current.addEventListener('wheel', onWheel);
  }, []);

  return (
    <div className={styles.root}>
      <div ref={container} className={styles.scrollBox}>
        scroll me
      </div>
    </div>
  );
};
