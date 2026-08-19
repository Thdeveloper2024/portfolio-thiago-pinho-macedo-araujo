window.EJSCommon = (() => {
  const fallback = {
    settings: {
      whatsapp: '5511999999999',
      phone: '(11) 3456-7890',
      instagram: 'https://instagram.com/',
      cnpj: 'Não informado',
      serviceArea: 'São Paulo e Região',
      businessHours: 'Seg a Sex das 8h às 18h',
      experienceYears: 6,
      satisfactionRate: 98,
      completedBase: 0,
      completedAdded: 0,
      services: [
        { id: 'demolicao', name: 'Demolição', description: 'Remoção segura e planejada, com organização e descarte responsável.', icon: 'demolition' },
        { id: 'alvenaria', name: 'Alvenaria', description: 'Levantamento de paredes, adequações e estruturas com qualidade.', icon: 'masonry' },
        { id: 'pintura', name: 'Pintura', description: 'Pintura interna e externa com preparação e acabamento cuidadoso.', icon: 'painting' },
        { id: 'eletrica', name: 'Elétrica', description: 'Instalações, adequações e manutenções elétricas com segurança.', icon: 'electrical' },
        { id: 'gesso', name: 'Gesso', description: 'Forros, sancas, divisórias e acabamentos em gesso para valorizar o ambiente.', icon: 'plaster' },
        { id: 'hidraulica', name: 'Hidráulica', description: 'Instalações e manutenção hidráulica residencial e comercial.', icon: 'plumbing' }
      ]
    },
    works: [
      {id:'obra-1',title:'Reforma completa residencial',desc:'Reforma completa com modernização dos ambientes, revisão das instalações e novos acabamentos.',category:'Reforma',type:'Reforma Residencial',location:'São Paulo/SP',area:'120 m²',duration:'45 dias',year:String(new Date().getFullYear()),status:'Concluída',services:['Alvenaria','Elétrica','Hidráulica','Pintura','Gesso'],featured:true,cover:'assets/img/hero-stages/08-todas.webp',gallery:['assets/img/hero-stages/01.webp','assets/img/hero-stages/07.webp','assets/img/hero-stages/08-todas.webp'],videos:[]},
      {id:'obra-2',title:'Construção e alvenaria',desc:'Execução de etapas de alvenaria e preparação para acabamentos.',category:'Alvenaria',type:'Construção Residencial',location:'São Paulo/SP',duration:'30 dias',year:String(new Date().getFullYear()),status:'Concluída',services:['Alvenaria'],featured:false,cover:'assets/img/hero-stages/04.webp',gallery:['assets/img/hero-stages/04.webp','assets/img/hero-stages/05.webp'],videos:[]},
      {id:'obra-3',title:'Pintura e acabamento residencial',desc:'Preparação de superfícies, correções e pintura para renovação completa do ambiente.',category:'Pintura',type:'Pintura Residencial',location:'São Paulo/SP',duration:'12 dias',year:String(new Date().getFullYear()),status:'Concluída',services:['Pintura'],featured:false,cover:'assets/img/hero-stages/07.webp',gallery:['assets/img/hero-stages/06.webp','assets/img/hero-stages/07.webp'],videos:[]}
    ]
  };

  const esc = (value = '') => String(value).replace(/[&<>'"]/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[c]));

  function iconSvg(name, className = 'ui-icon') {
    switch (name) {
      case 'grid':
        return `<svg class="${className}" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="6" height="6" rx="1.2" fill="none" stroke="currentColor" stroke-width="1.8"/><rect x="14" y="4" width="6" height="6" rx="1.2" fill="none" stroke="currentColor" stroke-width="1.8"/><rect x="4" y="14" width="6" height="6" rx="1.2" fill="none" stroke="currentColor" stroke-width="1.8"/><rect x="14" y="14" width="6" height="6" rx="1.2" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>`;
      case 'demolition':
        return `<svg class="${className}" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 18h16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M6 15l4-4 2 2-4 4zM9 8l2-2 5 5-2 2z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="18" cy="8" r="2.2" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>`;
      case 'masonry':
        return `<svg class="${className}" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9h18M3 15h18M8 3v6M16 9v6M8 15v6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><rect x="3" y="3" width="18" height="18" rx="2.2" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>`;
      case 'painting':
        return `<svg class="${className}" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h11a2 2 0 0 1 2 2v1H8a4 4 0 0 1-4-4V7z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M17 10v3M12 10l1 8M10 18h6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`;
      case 'electrical':
        return `<svg class="${className}" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7v5M15 7v5M7 12h10v2a4 4 0 0 1-4 4h-2a4 4 0 0 1-4-4v-2z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M13 4l-2 4h3l-3 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
      case 'plaster':
        return `<svg class="${className}" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h15l-2 6H7L4 8z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M11 14l-1.5 4h5L13 14M19 8l1.5-2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
      case 'plumbing':
        return `<svg class="${className}" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 8V5h7a3 3 0 0 1 3 3v2M10 8v3a4 4 0 0 0 4 4h3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M18 15v3a2 2 0 0 1-2 2h-1" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M5 8h5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`;
      case 'flooring':
        return `<svg class="${className}" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16M9 7v10M15 7v10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>`;
      case 'roofing':
        return `<svg class="${className}" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l8-6 8 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 11.5V19h12v-7.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
      case 'finish':
        return `<svg class="${className}" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 17l4-4 3 3 7-7 2 2-9 9-3-3-2 2z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
      case 'budget':
        return `<svg class="${className}" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="2.4" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8 3v4M16 3v4M7 11h10M8 15h3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`;
      case 'phone':
        return `<svg class="${className}" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 4.5h3l1.2 4-2 1.5a14 14 0 0 0 5 5l1.5-2 4 1.2v3c0 1-0.8 1.8-1.8 1.8C11.3 18.9 5.1 12.7 5.1 6.3c0-1 .8-1.8 1.4-1.8z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
      case 'location':
        return `<svg class="${className}" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s6-4.8 6-10a6 6 0 1 0-12 0c0 5.2 6 10 6 10z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="10" r="2.2" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>`;
      case 'area':
        return `<svg class="${className}" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10V4h6M20 10V4h-6M4 14v6h6M20 14v6h-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
      case 'time':
        return `<svg class="${className}" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 8v5l3 2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
      case 'year':
        return `<svg class="${className}" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="2.2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8 3v4M16 3v4M4 10h16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`;
      case 'type':
        return `<svg class="${className}" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 18h12M7 18v-6l5-6 5 6v6M10 18v-4h4v4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
      case 'status':
        return `<svg class="${className}" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 7l-10 10-5-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
      case 'tools':
      default:
        return `<svg class="${className}" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 6a4 4 0 0 0 4 4l-6.5 6.5a2 2 0 1 1-2.8-2.8L15.2 7A4 4 0 0 0 14 6zM6 4l4 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    }
  }

  async function getData() {
    try {
      const response = await fetch('/api/cms', { cache: 'no-store' });
      if (response.ok) {
        const data = await response.json();
        return {
          settings: { ...fallback.settings, ...(data.settings || {}) },
          works: Array.isArray(data.works) ? data.works : []
        };
      }
    } catch {}
    return fallback;
  }

  function waLink(settings, message = 'Olá! Gostaria de solicitar um orçamento com a EJS Empreiteira.') {
    const number = String(settings?.whatsapp || '').replace(/\D/g, '');
    return number ? `https://wa.me/${number}?text=${encodeURIComponent(message)}` : '#';
  }

  function phoneLabel(value) {
    const digits = String(value || '').replace(/\D/g, '');
    if (digits.length === 13 && digits.startsWith('55')) return `(${digits.slice(2, 4)}) ${digits.slice(4, 9)}-${digits.slice(9)}`;
    if (digits.length === 11) return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7)}`;
    if (digits.length === 10) return `(${digits.slice(0,2)}) ${digits.slice(2,6)}-${digits.slice(6)}`;
    return value || 'Fale conosco';
  }

  function categoryLabel(work) {
    return String(work?.category || 'Reforma');
  }

  function workMeta(work) {
    return [work?.location, work?.type].filter(Boolean);
  }

  function getServices(settings) {
    const source = Array.isArray(settings?.services) ? settings.services : fallback.settings.services;
    return source.map((service, index) => typeof service === 'string'
      ? { id: `service-${index}`, name: service, description: '', icon: 'tools' }
      : service).filter(service => service?.name);
  }

  function serviceIcon(service, className = 'ui-icon') {
    return (window.EJSIcons?.svg || iconSvg)(service?.icon || 'tools', className);
  }

  function uiIcon(name, className = 'ui-icon') {
    return (window.EJSIcons?.svg || iconSvg)(name || 'tools', className);
  }

  function whatsappIcon(pathPrefix = 'assets') {
    return `<img class="whatsapp-icon" src="${pathPrefix}/img/whatsapp.svg" alt="" aria-hidden="true">`;
  }

  function adaptImageFrame(frame, image) {
    if (!frame || !image) return;
    frame.classList.add('adaptive-media-frame');
    const apply = () => {
      const width = image.naturalWidth || 0;
      const height = image.naturalHeight || 0;
      if (!width || !height) return;
      const ratio = width / height;
      let shape = 'square';
      if (ratio >= 2) shape = 'ultrawide';
      else if (ratio > 1.08) shape = 'landscape';
      else if (ratio < .62) shape = 'tall';
      else if (ratio < .92) shape = 'portrait';
      frame.dataset.mediaShape = shape;
      frame.style.setProperty('--adaptive-ratio', String(ratio));
      const src = image.currentSrc || image.src;
      if (src) frame.style.setProperty('--adaptive-backdrop', `url("${String(src).replace(/"/g, '\\"')}")`);
    };
    if (image.complete && image.naturalWidth) apply();
    else image.addEventListener('load', apply, { once: true });
  }

  function initAdaptiveMedia(root = document) {
    root.querySelectorAll('[data-adaptive-media]').forEach(frame => {
      const image = frame.querySelector('img');
      if (image) adaptImageFrame(frame, image);
    });
  }

  function initNavigation(settings) {
    const menuToggle = document.getElementById('menuToggle');
    const mobileNav = document.getElementById('mobileNav');
    if (menuToggle && mobileNav) {
      menuToggle.addEventListener('click', () => {
        const open = mobileNav.classList.toggle('open');
        menuToggle.classList.toggle('open', open);
        menuToggle.setAttribute('aria-expanded', String(open));
      });
      mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }));
    }

    const link = waLink(settings);
    const formatted = phoneLabel(settings?.whatsapp);
    ['headerWhatsapp', 'mobileWhatsapp', 'contactWhatsapp', 'footerWhatsapp', 'floatingWhatsapp'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.href = link;
    });
    const headerText = document.getElementById('headerWhatsappText');
    if (headerText) headerText.textContent = formatted;
    const contactText = document.getElementById('contactWhatsappText');
    if (contactText) contactText.textContent = formatted;

    document.querySelectorAll('[data-whatsapp]').forEach(el => {
      el.addEventListener('click', () => window.open(link, '_blank', 'noopener'));
    });

    const footerServices = document.getElementById('footerServices');
    if (footerServices) footerServices.innerHTML = '<strong>Serviços</strong>' + getServices(settings).slice(0, 8).map(service => `<span>${esc(service.name)}</span>`).join('');

    const footerInstagram = document.getElementById('footerInstagram');
    if (footerInstagram) footerInstagram.href = settings?.instagram || '#';

    const footerCnpj = document.getElementById('footerCnpj');
    if (footerCnpj) footerCnpj.textContent = `CNPJ: ${settings?.cnpj || 'Não informado'}`;

    const phone = document.getElementById('contactPhone');
    if (phone) phone.textContent = settings?.phone || 'Não informado';
    const hours = document.getElementById('contactHours');
    if (hours) hours.textContent = settings?.businessHours || 'Atendimento comercial';
    const area = document.getElementById('contactArea');
    if (area) area.textContent = settings?.serviceArea || 'São Paulo e Região';

    const completed = (Number(settings?.completedBase) || 0) + (Number(settings?.completedAdded) || 0);
    const completedEl = document.getElementById('completedProjectsCount');
    if (completedEl) completedEl.textContent = `${completed}+`;

    const rate = document.getElementById('satisfactionRate');
    if (rate) rate.textContent = `${Number(settings?.satisfactionRate) || 98}%`;

    const yearsValue = Number(settings?.experienceYears) || 6;
    ['experienceYears', 'aboutExperienceYears'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = `${yearsValue}+`;
    });

    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();
  }

  return {
    fallback,
    esc,
    iconSvg,
    getData,
    waLink,
    phoneLabel,
    categoryLabel,
    workMeta,
    getServices,
    serviceIcon,
    uiIcon,
    whatsappIcon,
    adaptImageFrame,
    initAdaptiveMedia,
    initNavigation
  };
})();
