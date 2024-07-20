// Math utilities
export const lerp = (a, b, t) => a + (b - a) * t;

// Vec2 class
export class Vec2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  set(x, y) {
    this.x = x;
    this.y = y;
  }

  lerp(v, t) {
    this.x = lerp(this.x, v.x, t);
    this.y = lerp(this.y, v.y, t);
  }
}

// RequestAnimationFrame utility class
export class Raf {
  constructor() {
    this.rafId = 0;
    this.callbacks = [];
    this.raf = this.raf.bind(this);
    this.start();
  }

  start() {
    this.raf();
  }

  stop() {
    cancelAnimationFrame(this.rafId);
  }

  raf() {
    this.callbacks.forEach(({ callback, id }) => callback({ id }));
    this.rafId = requestAnimationFrame(this.raf);
  }

  add(callback, id) {
    this.callbacks.push({ callback, id: id || this.genId() });
  }

  remove(id) {
    this.callbacks = this.callbacks.filter((callback) => callback.id !== id);
  }

  genId() {
    return this.callbacks.length.toString();
  }
}

// Resolve options for tilt
export function resolveOptions(node, options) {
  return {
    trigger: options?.trigger ?? node,
    target: options?.target
      ? Array.isArray(options.target)
        ? options.target
        : [options.target]
      : [node]
  };
}

// Tilt function
export function tilt(node, options) {
  let { trigger, target } = resolveOptions(node, options);

  let lerpAmount = 0.06;
  const rotDeg = { current: new Vec2(), target: new Vec2() };
  const bgPos = { current: new Vec2(), target: new Vec2() };

  const update = (newOptions) => {
    destroy();
    ({ trigger, target } = resolveOptions(node, newOptions));
    init();
  };

  let rafId;
  const ticker = ({ id }) => {
    rafId = id;
    rotDeg.current.lerp(rotDeg.target, lerpAmount);
    bgPos.current.lerp(bgPos.target, lerpAmount);

    target.forEach(el => {
      el.style.setProperty("--rotX", `${rotDeg.current.y.toFixed(2)}deg`);
      el.style.setProperty("--rotY", `${rotDeg.current.x.toFixed(2)}deg`);
      el.style.setProperty("--bgPosX", `${bgPos.current.x.toFixed(2)}%`);
      el.style.setProperty("--bgPosY", `${bgPos.current.y.toFixed(2)}%`);
    });
  };

  const onMouseMove = ({ offsetX, offsetY }) => {
    lerpAmount = 0.1;

    target.forEach(el => {
      const ox = (offsetX - el.clientWidth * 0.5) / (Math.PI * 3);
      const oy = -(offsetY - el.clientHeight * 0.5) / (Math.PI * 4);

      rotDeg.target.set(ox, oy);
      bgPos.target.set(-ox * 0.3, oy * 0.3);
    });
  };

  const onMouseLeave = () => {
    lerpAmount = 0.06;
    rotDeg.target.set(0, 0);
    bgPos.target.set(0, 0);
  };

  const addListeners = () => {
    trigger.addEventListener("mousemove", onMouseMove);
    trigger.addEventListener("mouseleave", onMouseLeave);
  };

  const removeListeners = () => {
    trigger.removeEventListener("mousemove", onMouseMove);
    trigger.removeEventListener("mouseleave", onMouseLeave);
  };

  const init = () => {
    addListeners();
    raf.add(ticker);
  };

  const destroy = () => {
    removeListeners();
    raf.remove(rafId);
  };

  init();
  return { destroy, update };
}

const raf = new Raf();
