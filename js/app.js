/* ======================
   Tema claro/oscuro
   ====================== */
(function themeInit(){
  const html = document.documentElement;
  const STORAGE_KEY = 'pref-theme';
  const btn = document.getElementById('themeToggle');

  // Preferencia guardada o sistema
  let saved = localStorage.getItem(STORAGE_KEY);
  if(!saved){
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    saved = prefersDark ? 'dark' : 'light';
  }
  const htmlAttr = html.getAttribute('data-theme');
  if(htmlAttr && !localStorage.getItem(STORAGE_KEY)){ saved = htmlAttr; }

  applyTheme(saved);

  const mql = window.matchMedia('(prefers-color-scheme: dark)');
  const onSystem = (e) => { if(!localStorage.getItem(STORAGE_KEY)) applyTheme(e.matches ? 'dark' : 'light'); };
  try { mql.addEventListener('change', onSystem); } catch { mql.addListener(onSystem); }

  btn?.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  });

  function applyTheme(mode){
    html.setAttribute('data-theme', mode);
    if(btn){
      const isDark = mode === 'dark';
      btn.setAttribute('aria-pressed', String(isDark));
      btn.querySelector('.icon').textContent = isDark ? '☀️' : '🌙';
      btn.title = isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
    }
  }
})();

/* ======================
   Contenido (demo)
   ====================== */
const CONTENT = {
  dax: {
    about: "Productos deliciosos con ingredientes seleccionados para cada momento especial.",
    mission: "Crear experiencias memorables a través del sabor.",
    vision: "Ser la elección favorita en celebraciones y regalos.",
    values: ["Calidad", "Innovación", "Cercanía"],
    whatsapp: "https://wa.me/5215555555555?text=Hola%20Deliciux%20DAX",
    facebook: "https://facebook.com/",
    instagram: "https://instagram.com/",
    tiktok: "https://tiktok.com/@",
    products: [
      { id:"dax1", name:"Box Deli Sencilla", price:199, img:"https://picsum.photos/seed/dax1/640/420", desc:"Caja sencilla con mix de dulces."},
      { id:"dax2", name:"Box Deli Premium", price:349, img:"https://picsum.photos/seed/dax2/640/420", desc:"Selección premium para regalo especial."},
      { id:"dax6", name:"DAX Gift",           price:399, img:"https://picsum.photos/seed/dax6/640/420", desc:"Edición para ocasiones especiales."}
    ]
  },
  maranti: {
    about: "Líneas premium pensadas para regalo y ocasión especial.",
    mission:"Elevar momentos cotidianos con productos únicos.",
    vision:"Inspirar detalles que conecten a las personas.",
    values:["Diseño","Excelencia","Responsabilidad"],
    whatsapp: "https://wa.me/5215555555556?text=Hola%20Maranti",
    facebook: "https://facebook.com/",
    instagram: "https://instagram.com/",
    tiktok: "https://tiktok.com/@",
    products: [
      { id:"ma1", name:"Maranti Classic", price:299, img:"https://picsum.photos/seed/ma1/640/420", desc:"Presentación clásica elegante."},
      { id:"ma2", name:"Maranti Rosa",    price:329, img:"https://picsum.photos/seed/ma2/640/420", desc:"Detalles rosa para eventos."},
      { id:"ma3", name:"Maranti Oro",     price:389, img:"https://picsum.photos/seed/ma3/640/420", desc:"Toques dorados premium."}
    ]
  },
  ballon: {
    about: "Ambientaciones creativas para eventos que se recuerdan.",
    mission:"Crear atmósferas alegres con detalles sorprendentes.",
    vision:"Ser referentes en decoración temática responsable.",
    values:["Creatividad","Compromiso","Puntualidad"],
    whatsapp: "https://wa.me/5215555555557?text=Hola%20Ballon%20Land",
    facebook: "https://facebook.com/",
    instagram: "https://instagram.com/",
    tiktok: "https://tiktok.com/@",
    products: [
      { id:"ba1", name:"Arco Orgánico", price:799, img:"https://picsum.photos/seed/ba1/640/420", desc:"Arco de globos con paleta de color a elegir."},
      { id:"ba2", name:"Back Panel",    price:1299, img:"https://picsum.photos/seed/ba2/640/420", desc:"Fondo para fotos con lettering."},
      { id:"ba3", name:"Mesa de Dulces",price:1699, img:"https://picsum.photos/seed/ba3/640/420", desc:"Montaje completo con decoración."}
    ]
  },
  general: {
    whatsapp: "https://wa.me/5215555555550?text=Hola%20me%20interesa%20su%20cat%C3%A1logo",
  }
};

/* ==============
   Utilidades DOM
   ============== */
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));
const el = (tag, attrs={}) => Object.assign(document.createElement(tag), attrs);

/* =============================
   Navegación móvil + nav smooth
   ============================= */
const nav = $('#mainNav');
const btnMenu = $('#btnMenu');
btnMenu?.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  btnMenu.setAttribute('aria-expanded', String(open));
});
$$('#mainNav a').forEach(a => a.addEventListener('click', () => nav.classList.remove('is-open')));

/* Año en footer */
$('#year').textContent = new Date().getFullYear();

/* ================
   Carrusel sencillo
   ================ */
(function initCarousel(){
  const root = $('[data-carousel]');
  if(!root) return;
  const slides = $$('[data-slides] .slide', root);
  const next = $('[data-next]', root);
  const prev = $('[data-prev]', root);
  let i = slides.findIndex(s => s.classList.contains('is-active'));
  const show = (idx) => {
    slides.forEach(s => s.classList.remove('is-active'));
    slides[idx].classList.add('is-active');
  };
  const go = (dir=1) => { i = (i + dir + slides.length) % slides.length; show(i); };
  next?.addEventListener('click', () => go(1));
  prev?.addEventListener('click', () => go(-1));
  setInterval(() => go(1), 5000);
})();

/* ===========================
   Render dinámico de catálogos
   =========================== */
function renderGrid(sectionKey){
  const grid = document.querySelector(`[data-grid="${sectionKey}"]`);
  if(!grid) return;
  grid.innerHTML = '';
  CONTENT[sectionKey].products.forEach(p => {
    const card = el('article', {
      className:'gallery-item', tabIndex:0, role:'button', 'aria-label':p.name,
      'data-section': sectionKey, 'data-product-id': p.id
    });
    const img = el('img', { src:p.img, alt:p.name });
    const meta = el('div', { className:'meta' });
    const title = el('strong', { textContent:p.name });
    const price = el('span', { className:'price', textContent:`$${p.price}` });
    meta.append(title, price);
    card.append(img, meta);
    grid.append(card);
  });
}
['dax','maranti','ballon'].forEach(renderGrid);

/* ==================
   Textos y enlaces
   ================== */
function applyTexts(){
  $$('[data-text]').forEach(n => {
    const [k, prop] = n.getAttribute('data-text').split('.');
    n.textContent = CONTENT[k]?.[prop] ?? n.textContent;
  });
  $$('[data-list]').forEach(n => {
    const [k, prop] = n.getAttribute('data-list').split('.');
    const arr = CONTENT[k]?.[prop] ?? [];
    n.innerHTML = arr.map(x => `<li>${x}</li>`).join('');
  });
  $$('[data-href]').forEach(a => {
    const [k, prop] = a.getAttribute('data-href').split('.');
    a.href = CONTENT[k]?.[prop] ?? '#';
  });
  $$('[data-open-gallery]').forEach(btn => {
    const key = btn.getAttribute('data-open-gallery');
    btn.addEventListener('click', () => showGallery(key));
  });
  $$('[data-whatsapp]').forEach(btn => {
    btn.addEventListener('click', () => window.open(CONTENT.general.whatsapp, '_blank'));
  });
}
applyTexts();

/* =========
   Modal con <template>
   ========= */
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modalContent');
const tplGallery = document.getElementById('tpl-gallery');
const tplProduct = document.getElementById('tpl-product');

function openModal() {
  modal.setAttribute('aria-hidden','false');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  modal.setAttribute('aria-hidden','true');
  modalContent.replaceChildren();
  document.body.style.overflow = '';
}
modal.addEventListener('click', (e) => {
  if (e.target.hasAttribute('data-close')) closeModal();
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

/* ==============
   Render: Galería
   ============== */
function showGallery(sectionKey){
  const items = CONTENT[sectionKey]?.products ?? [];
  const node = tplGallery.content.cloneNode(true);

  node.querySelector('.modal-title').textContent = `Galería — ${sectionKey.toUpperCase()}`;
  node.querySelector('.modal-count').textContent = `${items.length} productos`;

  const grid = node.querySelector('.gallery-mini');
  grid.innerHTML = items.map(p => `
    <figure class="card mini" data-section="${sectionKey}" data-product-id="${p.id}">
      <img src="${p.img}" alt="${p.name}" />
      <figcaption class="mini-cap">
        <strong>${p.name}</strong>
        <span class="price">${'$'+p.price}</span>
      </figcaption>
    </figure>
  `).join('');

  modalContent.replaceChildren(node);
  openModal();
}

/* ==============
   Render: Producto
   ============== */
function showProduct(sectionKey, productId){
  const p = (CONTENT[sectionKey]?.products ?? []).find(x => x.id === productId);
  if(!p) return;

  const node = tplProduct.content.cloneNode(true);

  node.querySelector('.modal-title').textContent = p.name;
  node.querySelector('.price-xl').textContent = `$${p.price}`;
  const img = node.querySelector('.modal-img');
  img.src = p.img; img.alt = p.name;
  node.querySelector('.desc').textContent = p.desc ?? '';
  node.querySelector('.modal-id').textContent = `ID: ${p.id}`;

  modalContent.replaceChildren(node);
  openModal();

  modalContent.querySelector('[data-action="whatsapp"]')
    ?.addEventListener('click', () => window.open(CONTENT.general.whatsapp, '_blank'));
  modalContent.querySelector('[data-action="back"]')
    ?.addEventListener('click', () => showGallery(sectionKey));
}

/* =========================================
   Delegación: abrir galería / producto
   ========================================= */
document.addEventListener('click', (e) => {
  // Abrir galería desde botón
  const btnGal = e.target.closest('[data-open-gallery]');
  if (btnGal) {
    e.preventDefault();
    showGallery(btnGal.getAttribute('data-open-gallery'));
    return;
  }

  // Dentro del modal: click en mini-card => producto
  const mini = e.target.closest('#modal [data-product-id]');
  if (mini) {
    showProduct(mini.getAttribute('data-section'), mini.getAttribute('data-product-id'));
    return;
  }

  // Click directo en card del grid público
  const card = e.target.closest('.gallery-item');
  if (card) {
    showProduct(card.getAttribute('data-section'), card.getAttribute('data-product-id'));
  }
});
