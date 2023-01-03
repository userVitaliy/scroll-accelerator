import { useRef } from 'react';
import constate from 'constate';

import { useAppContext } from './app.provider';

// TODO: https://github.com/basilfx/normalize-wheel

const WHEEL_RATIO = 1.1;
const SWIPE_RATIO = 330;
const MAX_ZOOM = 14;

const useWsProvider = () => {
  const { setWaveIsReady } = useAppContext();

  const timeout = useRef();
  const listenWheel = useRef(false);
  const touchPad = useRef(false);

  const prevDate = useRef(0);
  const scale = useRef(0);
  const zoom = useRef(1);

  const ws = useRef();
  const wsProxy = useRef(null);
  const trackElements = useRef([]);

  const getInterval = () => {
    const now = Date.now();
    const interval = now - prevDate.current;
    prevDate.current = now;
    return interval;
  };

  const isTouchPad = (e) => {
    // TODO: https://stackoverflow.com/questions/10744645/detect-touchpad-vs-mouse-in-javascript
    const { wheelDeltaY, deltaY, deltaMode } = e;
    return wheelDeltaY ? wheelDeltaY === -3 * deltaY : deltaMode === 0;
  };

  const resetWheelListener = () => {
    const cb = () => (listenWheel.current = false);
    clearTimeout(timeout.current);
    timeout.current = setTimeout(cb, 200);
  };

  const setScale = () => {
    if (!ws.current) return;
    scale.current = ws.current.drawer.getWidth() / ws.current.getDuration() / ws.current.params.pixelRatio;
  };

  const setZoom = (step) => {
    const nextVal = zoom.current - step;
    zoom.current = nextVal < 1 ? 1 : nextVal > MAX_ZOOM ? MAX_ZOOM : nextVal;
  };

  const setWidth = (element) => {
    element.style.width = wsProxy.current.scrollWidth + 'px';
  };

  const handleZoom = () => {
    ws.current.zoom(scale.current * zoom.current);
    trackElements.current.forEach((el) => {
      // NOTE: don't swap this sequence of actions
      setWidth(el[1]);
      el[0].scrollLeft = wsProxy.current.scrollLeft;
    });
  };

  const swipeAccelerator = (deltaY, absY) => {
    const step = (deltaY / SWIPE_RATIO) * (absY / SWIPE_RATIO);
    return step;
  };

  const wheelAccelerator = (deltaY) => {
    let step = 0;
    const interval = getInterval();
    if (interval > 177) step = 0.005;
    else if (interval > 122) step = 0.018;
    else if (interval > 77) step = 0.055;
    else if (interval > 33) step = 0.092;
    else if (interval > 17) step = 0.574;
    else step = 1.47;
    step *= WHEEL_RATIO;
    if (deltaY < 0) step *= -1;
    return step;
  };

  const wheelZoom = (deltaY, absY) => {
    const step = touchPad.current ? swipeAccelerator(deltaY, absY) : wheelAccelerator(deltaY);
    setZoom(step);
    handleZoom();
  };

  const wheelScroll = (deltaX) => {
    wsProxy.current.scrollLeft += deltaX;
    trackElements.current.forEach((el) => (el[0].scrollLeft = wsProxy.current.scrollLeft));
  };

  /* LISTENERS */

  const onReady = () => {
    wsProxy.current = ws.current.drawer.wrapper;
    setScale();
    setWaveIsReady(true);
  };

  const onScroll = (event) => {
    if (listenWheel.current) return;
    const element = event.target;
    if (element === trackElements.current[0][0]) wsProxy.current.scrollLeft = element.scrollLeft;
    else trackElements.current.forEach((el) => (el[0].scrollLeft = element.scrollLeft));
  };

  const onWheel = (event) => {
    event.preventDefault();

    const { deltaX, deltaY } = event;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    if (absX < 3 && absY < 3) return;

    if (!listenWheel.current) {
      touchPad.current = isTouchPad(event);
      listenWheel.current = true;
    }
    resetWheelListener();

    if (absX > absY) wheelScroll(deltaX);
    else if (event.shiftKey) wheelScroll(deltaY);
    else wheelZoom(deltaY, absY);
  };

  const onResize = () => {
    setScale();
    handleZoom();
  };

  return { ws, wsProxy, trackElements, onReady, onScroll, onResize, onWheel };
};

export const [WsProvider, useWsContext] = constate(useWsProvider);
