(function () {
  const d = document;
  // inputs
  const hresInput = d.querySelector('[name="hres"]');
  const fovInput = d.querySelector('[name="fov"]');
  const VtInput = d.querySelector('[name="vt"]');
  const VpInput = d.querySelector('[name="vp"]');
  // results
  const maxAngleDgRes = d.getElementById('max-lead-angle');
  const maxAnglePxRes = d.getElementById('max-lead-px');
  const reticleSizeRes = d.getElementById('reticle-size');
  const reticleDetailsRes = d.getElementById('reticle-details');
  const reticleGapRes = d.getElementById('reticle-gap');
  const reticleLengthRes = d.getElementById('reticle-length');
  const reticleTooLargeRes = d.getElementById('reticle-too-large');
  const variousAngles = d.getElementById('various-angles');

  function toDegrees(angle) {
    return angle * (180 / Math.PI);
  }

  function toRadians(angle) {
    return angle * (Math.PI / 180);
  }

  function getMaxLeadAngleDeg(Vt, Vp) {
    return toDegrees(Math.atan(Vt / Vp));
  }

  function getMaxLeadAnglePx(Vt, Vp, fov, hres) {
    return (Vt / Vp) / Math.tan(toRadians(fov / 2)) * (hres / 2);
  }

  function getIdealReticle(Vt, Vp, fov) {
    const size = getMaxLeadAnglePx(Vt, Vp, fov, 1920) * 2;
    const gap = Math.round(Math.min(size, 100));
    return {
      size: Math.round(size),
      gap: Math.round(Math.min(size, 100)),
      length: size > 100 ? Math.round(Math.max((size - 100) / 2)) : 0,
      tooLarge: size > 200
    };
  }

  function getLead(angle, Vt, Vp, fov, hres) {
    const rAngle = toRadians(angle);
    const distancePlayerToTarget = Math.sqrt(Math.pow(Vt, 2) + Math.pow(Vp, 2) - 2 * Vt * Vp * Math.cos(rAngle));
    const rLeadAngle = Math.asin(Math.sin(rAngle) * Vt / distancePlayerToTarget);
    const leadPixels = Math.tan(rLeadAngle) / Math.tan(toRadians(fov / 2)) * (hres / 2);
    return {
      angle: toDegrees(rLeadAngle),
      pixels: leadPixels
    };
  }

  function fancyRound(n) {
    return Math.round(n * 1000) / 1000;
  }

  function calc() {
    const hres = +hresInput.value;
    const fov = +fovInput.value;
    const Vt = +VtInput.value;
    const Vp = +VpInput.value;

    maxAngleDgRes.textContent = getMaxLeadAngleDeg(Vt, Vp);
    const maxLeadPx = getMaxLeadAnglePx(Vt, Vp, fov, hres);
    maxAnglePxRes.textContent = maxLeadPx;
    const idealReticle = getIdealReticle(Vt, Vp, fov);
    reticleSizeRes.textContent = idealReticle.size;
    reticleGapRes.textContent = idealReticle.gap;
    reticleLengthRes.textContent = idealReticle.length;
    reticleDetailsRes.hidden = idealReticle.tooLarge;
    reticleTooLargeRes.hidden = !idealReticle.tooLarge;

    variousAngles.textContent = '';
    for (let i = 0; i <= 180; i += 15) {
      const div = d.createElement('div');
      const lead = getLead(i, Vt, Vp, fov, hres);
      const ratio = fancyRound(lead.pixels / maxLeadPx * 100);
      div.innerHTML = `&plusmn;${i}&deg;: lead by &plusmn;${fancyRound(lead.angle)}&deg;/&plusmn;${fancyRound(lead.pixels)}px (${ratio}% of 90&deg;)`;
      variousAngles.appendChild(div);
    }
  }

  hresInput.addEventListener('input', calc);
  fovInput.addEventListener('input', calc);
  VtInput.addEventListener('input', calc);
  VpInput.addEventListener('input', calc);
  calc();
})()
