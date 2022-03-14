const hueDial = document.querySelector('#hue');
const satDial = document.querySelector('#sat');
const lumDial = document.querySelector('#lum');

const hsl = { h: 0, s: 0, l: 0 };

const getCenter = (element) => {
  const { x, y, width, height } = element.getBoundingClientRect();
  return { x: x + width * 0.5, y: y + height * 0.5 };
};

const getDelta = (posOne, posTwo) => {
  return { dx: posOne.x - posTwo.x, dy: posOne.y - posTwo.y };
};

const arctanRad = (delta) => {
  return Math.atan2(delta.dy, delta.dx);
};

const toDegrees = (radians) => {
  return radians * (180 / Math.PI);
};

const calculateAngle = (e) => {
  const center = getCenter(e.target);
  const touch = { x: e.clientX, y: e.clientY };
  const delta = getDelta(center, touch);
  const radians = arctanRad(delta);
  const degrees = toDegrees(radians) - 90;
  const degreesNorm = degrees < 0 ? 360 - Math.abs(degrees) : degrees;
  return degreesNorm;
};

const rotate = (e) => {
  const degrees = Math.floor(calculateAngle(e));
  e.target.style.transform = `rotate(${degrees}deg)`;
  dispatchDialChangeEvent(e.target);
};

const handleInput = (e) => {
  e.target.style.cursor = 'grabbing';
  e.target.addEventListener('mousemove', rotate);
  e.target.addEventListener(
    'mouseup',
    (e) => {
      e.target.style.cursor = 'grab';
      e.target.removeEventListener('mousemove', rotate);
    },
    { once: true }
  );
  e.target.addEventListener(
    'mouseout',
    (e) => {
      e.target.style.cursor = 'grab';
      e.target.removeEventListener('mousemove', rotate);
    },
    { once: true }
  );
};

hueDial.addEventListener('mousedown', handleInput);
satDial.addEventListener('mousedown', handleInput);
lumDial.addEventListener('mousedown', handleInput);

const dispatchDialChangeEvent = (element) => {
  const angle = element.style.transform.match(/rotate\((.*)\)/)[1];
  const hsl = element.getAttribute('data-hsl');
  document.dispatchEvent(
    new CustomEvent('dialchange', {
      detail: { hsl, angle },
    })
  );
};

document.addEventListener('dialchange', (e) => {
  hsl[e.detail.hsl] = e.detail.hsl === 'h' ? e.detail.angle : (Number.parseInt(e.detail.angle) / 360) * 100;
  document.body.style.backgroundColor = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
});