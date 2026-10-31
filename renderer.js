(() => {
  const IDLE = 'idle.mp4';
  const ACTION_RATE = 2;
  const SKIP_RATE = 10;

  const KEY_MAP = {
    ArrowLeft: 'right.mp4',
    ArrowRight: 'left.mp4',
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

  function playClip(name, { loop, rate }) {
    currentClip = name;
    if (loop) {
      pendingClip = null;
    }

    player.loop = loop;
    player.muted = true;

    const onReady = () => {
      player.removeEventListener('loadeddata', onReady);
      player.playbackRate = rate;
      player.play().catch(() => {});
    };

    player.addEventListener('loadeddata', onReady);
    player.src = videoUrl(name);
    player.load();
  }

  function playIdle() {
    playClip(IDLE, { loop: true, rate: 1 });
  }

  function playAction(name) {
    pendingClip = null;
    playClip(name, { loop: false, rate: ACTION_RATE });
  }

  function requestClip(name) {
    if (currentClip === IDLE) {
      playAction(name);
      return;
    }

    // Finish the current action quickly, then play the requested clip.
    pendingClip = name;
    player.playbackRate = SKIP_RATE;
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
