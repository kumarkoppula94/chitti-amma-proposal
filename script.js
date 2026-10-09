const beginBtn = document.getElementById('beginBtn');
const questionBtn = document.getElementById('questionBtn');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const playfulReply = document.getElementById('playfulReply');
const celebration = document.getElementById('celebration');
const proposal = document.getElementById('proposal');
const replayBtn = document.getElementById('replayBtn');
const musicToggle = document.getElementById('musicToggle');
const musicLabel = document.getElementById('musicLabel');

beginBtn.addEventListener('click', () => {
  document.getElementById('letter').scrollIntoView({ behavior: 'smooth' });
});
questionBtn.addEventListener('click', () => {
  proposal.scrollIntoView({ behavior: 'smooth' });
});

const gentleReplies = [
  'Hehe, I’ll wait for your answer with a smile. 💗',
  'No worries, Chitti Amma. Your feelings matter most. 🌷',
  'Sending you one little rose while you think. 🌹',
  'Take your time, my favorite person. ❤️'
];
let replyIndex = 0;
noBtn.addEventListener('click', () => {
  playfulReply.textContent = gentleReplies[replyIndex % gentleReplies.length];
  replyIndex += 1;
});

yesBtn.addEventListener('click', () => {
  celebration.classList.remove('hidden');
  celebration.scrollIntoView({ behavior: 'smooth', block: 'center' });
  launchHearts();
});
replayBtn.addEventListener('click', () => {
  celebration.classList.add('hidden');
  document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
});

function launchHearts() {
  for (let i = 0; i < 18; i++) {
    const heart = document.createElement('span');
    heart.textContent = ['💗', '💕', '❤️', '✨'][i % 4];
    heart.style.position = 'fixed';
    heart.style.left = `${5 + Math.random() * 90}%`;
    heart.style.bottom = '-30px';
    heart.style.zIndex = '10';
    heart.style.fontSize = `${18 + Math.random() * 18}px`;
    heart.style.pointerEvents = 'none';
    heart.style.transition = 'transform 3s ease-out, opacity 3s ease-out';
    document.body.appendChild(heart);
    requestAnimationFrame(() => {
      heart.style.transform = `translateY(-${window.innerHeight + 100}px) rotate(${Math.random() * 80 - 40}deg)`;
      heart.style.opacity = '0';
    });
    setTimeout(() => heart.remove(), 3200);
  }
}

// Gentle original synthesized melody. Browsers require a tap before audio can play.
let audioContext = null;
let musicTimer = null;
let noteStep = 0;
const melody = [523.25, 659.25, 783.99, 659.25, 587.33, 698.46, 880.00, 698.46];
function playNote() {
  if (!audioContext) return;
  const now = audioContext.currentTime;
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  osc.type = 'sine';
  osc.frequency.value = melody[noteStep % melody.length];
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.045, now + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);
  osc.connect(gain);
  gain.connect(audioContext.destination);
  osc.start(now);
  osc.stop(now + 0.45);
  noteStep++;
}
function stopMusic() {
  if (musicTimer) clearInterval(musicTimer);
  musicTimer = null;
  if (audioContext && audioContext.state !== 'closed') audioContext.suspend();
  musicToggle.setAttribute('aria-pressed', 'false');
  musicLabel.textContent = 'Play music';
}
musicToggle.addEventListener('click', async () => {
  if (musicTimer) { stopMusic(); return; }
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) {
    musicLabel.textContent = 'Audio unavailable';
    return;
  }
  if (!audioContext) audioContext = new AudioCtx();
  await audioContext.resume();
  playNote();
  musicTimer = setInterval(playNote, 480);
  musicToggle.setAttribute('aria-pressed', 'true');
  musicLabel.textContent = 'Pause music';
});
