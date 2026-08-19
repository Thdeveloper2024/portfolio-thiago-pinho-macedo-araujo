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
      services: [{"id": "demolicao", "name": "Demolição", "description": "Remoção segura e planejada, com organização e descarte responsável.", "icon": "demolition"}, {"id": "alvenaria", "name": "Alvenaria", "description": "Levantamento de paredes, adequações e estruturas com qualidade.", "icon": "masonry"}, {"id": "pintura", "name": "Pintura", "description": "Pintura interna e externa com preparação e acabamento cuidadoso.", "icon": "painting"}, {"id": "eletrica", "name": "Elétrica", "description": "Instalações, adequações e manutenções elétricas com segurança.", "icon": "electrical"}, {"id": "gesso", "name": "Gesso", "description": "Forros, sancas, divisórias e acabamentos em gesso para valorizar o ambiente.", "icon": "plaster"}, {"id": "hidraulica", "name": "Hidráulica", "description": "Instalações e manutenção hidráulica residencial e comercial.", "icon": "plumbing"}]
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
    if (digits.length === 13 && digits.startsWith('55')) {
      return `(${digits.slice(2, 4)}) ${digits.slice(4, 9)}-${digits.slice(9)}`;
    }
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

  const serviceIconSymbols = {
    demolition: '⌁', masonry: '▦', painting: '▭', electrical: 'ϟ', plaster: '⌔', plumbing: '⌘', tools: '⚒'
  };

  function getServices(settings) {
    const source = Array.isArray(settings?.services) ? settings.services : fallback.settings.services;
    return source.map((service, index) => typeof service === 'string'
      ? { id: `service-${index}`, name: service, description: '', icon: 'tools' }
      : service).filter(service => service?.name);
  }

  function serviceIcon(service) {
    return serviceIconSymbols[service?.icon] || serviceIconSymbols.tools;
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
      const shape = ratio > 1.08 ? 'landscape' : ratio < .92 ? 'portrait' : 'square';
      frame.dataset.mediaShape = shape;
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

  return { fallback, esc, getData, waLink, phoneLabel, categoryLabel, workMeta, getServices, serviceIcon, whatsappIcon, adaptImageFrame, initAdaptiveMedia, initNavigation };
})();
