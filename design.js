'use strict';
const designDialog = document.querySelector('.design-dialog');
const designGallery = document.querySelector('.design-gallery');
const designStage = document.querySelector('.design-stage');
const designImage = designStage.querySelector('img');
const designBack = document.querySelector('.design-back');
const designCount = document.querySelector('.design-count');
let designGroup, designIndex = 0, designTrigger;
function showDesign(index) {
  designIndex = (index + designGroup.images.length) % designGroup.images.length;
  const item = designGroup.images[designIndex];
  designImage.src = item.src;
  designImage.alt = `${designGroup.title} · 作品 ${designIndex + 1}`;
  designGallery.hidden = true; designStage.hidden = false; designBack.hidden = false;
  designCount.textContent = `${designIndex + 1} / ${designGroup.images.length}`;
  designDialog.scrollTop = 0;
}
function showDesignGallery() {
  designStage.hidden = true; designGallery.hidden = false; designBack.hidden = true;
  designCount.textContent = `${designGroup.images.length} 张作品`;
}
designBack.addEventListener('click', showDesignGallery);
document.querySelector('.design-prev').addEventListener('click', () => showDesign(designIndex - 1));
document.querySelector('.design-next').addEventListener('click', () => showDesign(designIndex + 1));
designDialog.querySelector('.design-close').addEventListener('click', () => designDialog.close());
designDialog.addEventListener('close', () => { document.body.style.overflow = ''; designTrigger?.focus(); });
designDialog.addEventListener('keydown', event => {
  if (!designStage.hidden && ['ArrowLeft','ArrowRight'].includes(event.key)) {
    event.preventDefault(); showDesign(designIndex + (event.key === 'ArrowLeft' ? -1 : 1));
  }
});
designDialog.addEventListener('click', event => {
  if (event.target === designDialog) { const r=designDialog.getBoundingClientRect(); if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom) designDialog.close(); }
});
function openDesign(group, trigger) {
  designGroup = group; designTrigger = trigger;
  document.querySelector('#design-title').textContent = group.title;
  designGallery.replaceChildren();
  designGallery.className = `design-gallery layout-${group.id}`;
  group.images.forEach((item, i) => {
    const button = document.createElement('button'); button.type = 'button'; button.className = 'design-thumb';
    button.setAttribute('aria-label', `放大查看 ${group.title} 第 ${i+1} 张`);
    const img = document.createElement('img'); img.src = item.src; img.alt = `${group.title} · ${i+1}`;
    img.loading = 'lazy'; img.width = item.width; img.height = item.height;
    button.append(img); button.addEventListener('click', () => { showDesign(i); designBack.focus(); });
    designGallery.append(button);
  });
  showDesignGallery(); designDialog.showModal(); designDialog.scrollTop = 0; document.body.style.overflow = 'hidden';
}
async function loadDesigns() {
  const error = document.querySelector('.design-error');
  try {
    const response = await fetch('design.json'); if (!response.ok) throw new Error('Missing design collection');
    const groups = await response.json();
    const grid = document.querySelector('.design-grid');
    groups.forEach(group => {
      const button = document.createElement('button'); button.type = 'button'; button.className = `design-card cover-${group.id}`;
      button.setAttribute('aria-label', `查看${group.title}，共 ${group.images.length} 张`);
      const cover = document.createElement('div'); cover.className = 'design-cover';
      const selected = group.id === 'ui' ? [group.images[0], group.images[3], group.images[8]] : group.images.slice(0, group.id === 'illustration' ? 1 : 2);
      selected.forEach(item => { const img=document.createElement('img'); img.src=item.src; img.alt=''; img.loading='lazy'; cover.append(img); });
      const meta = document.createElement('div'); meta.className='design-meta';
      const heading=document.createElement('h3'); heading.textContent=group.title;
      const desc=document.createElement('p'); desc.textContent=group.description;
      const count=document.createElement('span'); count.textContent=`${group.images.length} 张作品 · 查看 ↗`;
      meta.append(heading,desc,count);button.append(cover,meta);button.addEventListener('click',()=>openDesign(group,button));grid.append(button);
    });
    error.hidden = true;
  } catch { error.hidden = false; error.textContent = '设计作品暂时无法加载，请刷新重试。'; }
}
loadDesigns();
