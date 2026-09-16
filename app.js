'use strict';
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const progress = document.querySelector('.reading-progress');
let scrollQueued = false;
function updateProgress() {
  const range = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${range > 0 ? Math.min(1, Math.max(0, scrollY / range)) : 0})`;
  scrollQueued = false;
}
addEventListener('scroll', () => { if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateProgress); } }, { passive: true });
addEventListener('resize', updateProgress);
updateProgress();
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.remove('pending'); observer.unobserve(entry.target); }
  }), { threshold: 0.08 });
  document.querySelectorAll('.section-heading, .project, .about-intro, .experience, .skill-grid article, .contact>div').forEach(el => {
    el.classList.add('reveal');
    if (el.getBoundingClientRect().top > innerHeight) el.classList.add('pending');
    observer.observe(el);
  });
  reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) document.querySelectorAll('.pending').forEach(el => el.classList.remove('pending')); });
  addEventListener('beforeprint', () => document.querySelectorAll('.pending').forEach(el => el.classList.remove('pending')));
}
const dialog = document.querySelector('.video-dialog');
const player = dialog.querySelector('video');
const error = dialog.querySelector('.player-error');
let activeButton;
dialog.querySelector('.player-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const r=dialog.getBoundingClientRect(); if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom) dialog.close(); } });
dialog.addEventListener('close', () => {
  player.pause(); player.removeAttribute('src'); player.load(); document.body.style.overflow = ''; activeButton?.focus();
});
player.addEventListener('error', () => { if (player.hasAttribute('src')) error.hidden = false; });
function safeURL(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  try { const u = new URL(value, location.href); return ['http:', 'https:'].includes(u.protocol) ? u.href : null; } catch { return null; }
}
async function loadVideos() {
  const grid = document.querySelector('.video-grid');
  const empty = document.querySelector('.video-empty');
  try {
    const response = await fetch('videos.json');
    if (!response.ok) throw new Error('Video list unavailable');
    const videos = await response.json();
    if (!Array.isArray(videos)) throw new Error('Invalid video list');
    videos.forEach(item => {
      const src = safeURL(item.src); if (!src) return;
      const card = document.createElement('article'); card.className = 'video-card';
      const button = document.createElement('button'); button.className = 'video-launch'; button.type = 'button';
      const title = String(item.title || '视频作品'); button.setAttribute('aria-label', `播放：${title}`);
      const poster = safeURL(item.poster);
      if (poster) { const image = document.createElement('img'); image.src = poster; image.alt = ''; image.loading = 'lazy'; button.append(image); }
      const play = document.createElement('span'); play.className = 'play-disc'; play.textContent = '▶'; play.setAttribute('aria-hidden','true'); button.append(play);
      if (item.duration) { const duration = document.createElement('span'); duration.className = 'video-duration'; duration.textContent = item.duration; button.append(duration); }
      const heading = document.createElement('h3'); heading.textContent = title;
      const caption = document.createElement('p'); caption.textContent = String(item.description || '');
      button.addEventListener('click', () => {
        activeButton = button; dialog.querySelector('h2').textContent = title; error.hidden = true;
        player.src = src; if (poster) player.poster = poster; else player.removeAttribute('poster');
        dialog.showModal(); document.body.style.overflow = 'hidden';
        player.play().catch(() => { /* Native controls allow retry when autoplay is restricted. */ });
      });
      card.append(button, heading, caption); grid.append(card);
    });
    empty.hidden = true;
  } catch {
    empty.textContent = '作品列表暂时无法加载，请稍后刷新重试。';
    empty.hidden = false;
  }
}
loadVideos();
