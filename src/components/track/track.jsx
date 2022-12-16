import React, { useRef, useEffect } from 'react';
import styles from './_track.module.scss';

// TODO: https://github.com/basilfx/normalize-wheel

const ACCELERATION_RATIO = 330;
const WHEEL_SPEED_RATIO = 1.1;
const MAX_ZOOM = 14;
const VAR__TRANSITION = '--track-transition-speed';

export const Track = () => {
  const container = useRef(null);
  const width = useRef(1);
  const zoom = useRef(1);
  const touchPad = useRef(false);

  const prevDate = useRef(0);
  const prevInterval = useRef(0);

  const isTouchPad = (e) => {
    // https://stackoverflow.com/questions/10744645/detect-touchpad-vs-mouse-in-javascript
    return e.wheelDeltaY ? e.wheelDeltaY === -3 * e.deltaY : e.deltaMode === 0;
  };

  const accelerator = (delta) => {
    return (delta / ACCELERATION_RATIO) * (Math.abs(delta) / ACCELERATION_RATIO);
  };

  const handleZoom = (step) => {
    const nextVal = zoom.current - step;
    zoom.current = nextVal < 1 ? 1 : nextVal > MAX_ZOOM ? MAX_ZOOM : nextVal;
    container.current.style.width = width.current * zoom.current + 'px';
  };

  const handleInterval = (e) => {
    const now = Date.now();
    const interval = now - prevDate.current;
    if (interval > 188 && interval < 500 && prevInterval.current < 77) console.log('__startScrolling');
    prevInterval.current = interval;
    prevDate.current = now;
    return interval;
  };

  const handleTouchPad = (e) => {
    handleZoom(accelerator(e.deltaY));
  };

  const getMouseWheelDelta = (interval) => {
    let delta = 0;
    console.log(interval);
    if (interval > 177) delta = 22;
    else if (interval > 122) delta = 44;
    else if (interval > 77) delta = 77;
    else if (interval > 33) delta = 100;
    else if (interval > 17) delta = 250;
    else delta = 400;
    return delta * WHEEL_SPEED_RATIO;
  };

  const handleMouseWheel = (e, interval) => {
    const delta = getMouseWheelDelta(interval);
    handleZoom(accelerator(e.deltaY < 0 ? -1 * delta : delta));
  };

  const onWheel = (e) => {
    e.preventDefault();
    const interval = handleInterval(e);
    if (interval > 400) {
      touchPad.current = isTouchPad(e);
      container.current.style.setProperty(VAR__TRANSITION, touchPad.current ? 0 : 0.2 + 's');
    }
    if (touchPad.current) handleTouchPad(e);
    else handleMouseWheel(e, interval);
  };

  useEffect(() => {
    const element = container.current;
    element.addEventListener('wheel', onWheel);
    return () => element.removeEventListener('wheel', onWheel);
  }, []);

  useEffect(() => {
    width.current = container.current.offsetWidth;
  }, []);

  return (
    <div className={styles.Track}>
      <div ref={container} className={styles.Track__feed}>
        {Array.from(Array(10)).map((el, i) => (
          <div className={styles.Track__cell} key={i}>
            {i}
          </div>
        ))}
      </div>
    </div>
  );
};
