(() => {
  const IDLE = 'idle.mp4';

  const KEY_MAP = {
    ArrowLeft: 'left.mp4',
    ArrowRight: 'right.mp4',
    ArrowUp: 'up.mp4',
    ArrowDown: 'down.mp4',
    m: 'mouse.mp4',
    M: 'mouse.mp4',
    s: 'shake.mp4',
    S: 'shake.mp4',
    n: 'nod.mp4',
    N: 'nod.mp4',
    '=': 'zoomin.mp4',
    '-': 'zoomout.mp4',
  };

  const player = document.getElementById('player');

  let currentClip = null;
  let pendingClip = null;

  function videoUrl(name) {
    return `poses/${name}`;
  }

  function playClip(name, { loop }) {
    currentClip = name;
    if (loop) {
      pendingClip = null;
    }

    player.loop = loop;
    player.muted = true;

    const onReady = () => {
      player.removeEventListener('loadeddata', onReady);
      player.play().catch(() => {});
    };

    player.addEventListener('loadeddata', onReady);
    player.src = videoUrl(name);
    player.load();
  }

  function playIdle() {
    playClip(IDLE, { loop: true });
  }

  function playAction(name) {
    pendingClip = null;
    playClip(name, { loop: false });
  }

  function requestClip(name) {
    if (currentClip === IDLE) {
      playAction(name);
      return;
    }

    // Action clip is playing: finish it, then play the requested clip.
    pendingClip = name;
  }

  player.addEventListener('ended', () => {
    if (currentClip === IDLE) {
      return;
    }

    if (pendingClip) {
      const next = pendingClip;
      pendingClip = null;
      playAction(next);
      return;
    }

    playIdle();
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      if (currentClip === 'zoomin.mp4') {
        event.preventDefault();
        playAction('zoominkeep.mp4');
      }
      return;
    }

    const clip = KEY_MAP[event.key];
    if (!clip) {
      return;
    }

    event.preventDefault();
    requestClip(clip);
  });

  playIdle();
})();
