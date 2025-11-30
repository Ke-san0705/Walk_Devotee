(() => {
  const path = window.location.pathname.toLowerCase();
  const isTutorial = path.endsWith('tutorial.html');
  const tutorialDone = localStorage.getItem('tutorialCompleted');
  if (!tutorialDone && !isTutorial) {
    window.location.replace('Tutorial.html');
  }
})();

(() => {
  const detailTargets = {
    '1': { lat: 35.681236, lon: 139.767125, title: '駅前の灯り' },
    '2': { lat: 35.094595019366935, lon: 139.07175446663524, title: '水辺の反射' },
    '3': { lat: 35.011564, lon: 135.768148, title: '古都の橋' }
  };

  function getQueryParam(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  function rememberDetailId(id) {
    if (!id) return;
    localStorage.setItem('currentDetailId', String(id));
  }

  function readDetailId() {
    return getQueryParam('detailId') || localStorage.getItem('currentDetailId') || '1';
  }

  function getDetailTarget(detailId) {
    return detailTargets[String(detailId)] || detailTargets['1'];
  }

  function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // 地球半径[m]
    const toRad = x => (x * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const rLat1 = toRad(lat1);
    const rLat2 = toRad(lat2);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(rLat1) * Math.cos(rLat2) * Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  function markSuccess(detailId) {
    const key = 'successfulDetails';
    let stored = [];
    try {
      stored = JSON.parse(localStorage.getItem(key) || '[]');
    } catch (e) {
      stored = [];
    }
    if (!stored.includes(String(detailId))) {
      stored.push(String(detailId));
      localStorage.setItem(key, JSON.stringify(stored));
    }
    const progress = Math.min(100, 20 * stored.length + 20);
    localStorage.setItem('progress', progress);
    return progress;
  }

  function formatDistance(meters) {
    return Math.round(Number(meters) || 0);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const progressEl = document.getElementById('progressValue');
    if (progressEl) {
      const val = localStorage.getItem('progress') || '12';
      progressEl.textContent = `${val}%`;
    }

    document.querySelectorAll('[data-detail-link]').forEach(el => {
      el.addEventListener('click', () => rememberDetailId(el.dataset.detailLink));
    });
  });

  window.App = Object.assign({}, window.App || {}, {
    detailTargets,
    getDetailTarget,
    rememberDetailId,
    readDetailId,
    haversineDistance,
    markSuccess,
    formatDistance,
    getQueryParam
  });
})();

