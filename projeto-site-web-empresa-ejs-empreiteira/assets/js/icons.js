(function(){
  const icons = {
    grid: '<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/>',
    demolition: '<path d="M3 20h8"/><path d="M5 20v-3l3-2 3 2v3"/><path d="M8 15V8l6-4 2 2-5 4"/><path d="M15 6l3 5"/><circle cx="19" cy="14" r="2.5"/><path d="M18 16.2 16.5 20"/>',
    masonry: '<path d="M3 7h7v4H3zM10 7h7v4h-7zM17 7h4v4h-4zM5 11h7v4H5zM12 11h7v4h-7zM3 15h7v4H3zM10 15h7v4h-7zM17 15h4v4h-4z"/>',
    painting: '<path d="M4 5h12a2 2 0 0 1 2 2v3H6a2 2 0 0 1-2-2V5Z"/><path d="M18 8h2v4a2 2 0 0 1-2 2h-5"/><path d="M13 14v6"/><path d="M10 20h6"/>',
    electrical: '<path d="M7 3v5M11 3v5"/><path d="M5 8h8v3a4 4 0 0 1-4 4v5"/><path d="m16 9 4-4-1 5h3l-5 6 1-5h-3z"/>',
    plaster: '<path d="M4 8h16l-3 5H7L4 8Z"/><path d="M9 13v5h6v-5"/><path d="M7 18h10"/>',
    plumbing: '<path d="M7 5V3h6v2"/><path d="M10 5v4"/><path d="M5 9h10"/><path d="M15 9h3a3 3 0 0 1 3 3v2h-5v-2"/><path d="M4 9v8h6V9"/><path d="M18.5 18.5c0 1-.8 1.8-1.8 1.8s-1.8-.8-1.8-1.8c0-.9 1.8-3.2 1.8-3.2s1.8 2.3 1.8 3.2Z"/>',
    tools: '<path d="m4 20 7-7"/><path d="M7 4a4 4 0 0 0 5 5l7 7-3 3-7-7a4 4 0 0 0-5-5l3 3 3-3-3-3Z"/>',
    hammer: '<path d="m14 5 5 5"/><path d="m12 7 4-4 4 4-4 4"/><path d="m13 10-9 10"/>',
    drill: '<path d="M4 7h11v7H4z"/><path d="M15 9h4v3h-4"/><path d="M19 10.5h3"/><path d="M8 14v6h5l-1-6"/><path d="M6 9h4"/>',
    wrench: '<path d="M14 6a5 5 0 0 0-6.5 6.5L3 17l4 4 4.5-4.5A5 5 0 0 0 18 10l-3 2-3-3 2-3Z"/>',
    helmet: '<path d="M4 14a8 8 0 0 1 16 0"/><path d="M3 14h18v4H3z"/><path d="M9 6v8M15 6v8"/>',
    building: '<path d="M4 21V7l8-4v18"/><path d="M12 21V9l8-3v15"/><path d="M7 10h2M7 14h2M7 18h2M15 11h2M15 15h2M15 19h2"/>',
    roofing: '<path d="m3 12 9-8 9 8"/><path d="M6 10v10h12V10"/><path d="M9 20v-6h6v6"/>',
    flooring: '<path d="M4 5h16v14H4z"/><path d="M4 10h16M4 15h16M9 5v5M15 10v5M10 15v4"/>',
    tile: '<rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/>',
    waterproof: '<path d="M12 3s6 6.4 6 11a6 6 0 1 1-12 0c0-4.6 6-11 6-11Z"/><path d="M9 15a3 3 0 0 0 6 0"/>',
    carpentry: '<path d="M5 5h14v14H5z"/><path d="M8 8h8v8H8z"/><path d="M3 3l3 3M21 3l-3 3M3 21l3-3M21 21l-3-3"/>',
    welding: '<path d="M4 16h7l2-4 2 4h5"/><path d="m12 3 1 4M7 5l3 3M17 5l-3 3"/><path d="M8 19h8"/>',
    cleaning: '<path d="M8 4h8l-1 5H9L8 4Z"/><path d="M10 9v10M14 9v10"/><path d="M7 19h10"/><path d="M18 5h3M19.5 3.5v3"/>',
    landscaping: '<path d="M12 3v18"/><path d="M12 8c-4 0-6-2-6-5 4 0 6 2 6 5ZM12 12c4 0 6-2 6-5-4 0-6 2-6 5Z"/><path d="M7 21h10"/>',
    stairs: '<path d="M3 19h5v-4h4v-4h4V7h5"/>',
    ruler: '<path d="m5 19 14-14 3 3L8 22 5 19Z"/><path d="m12 12 2 2M15 9l2 2M9 15l2 2"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/>',
    location: '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
    home: '<path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z"/>',
    users: '<circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0"/><circle cx="17" cy="9" r="2"/><path d="M15 15a5 5 0 0 1 6 5"/>',
    shield: '<path d="M12 3 20 6v6c0 5-3.4 8-8 10-4.6-2-8-5-8-10V6l8-3Z"/><path d="m8 12 3 3 5-6"/>',
    phone: '<path d="M6 3h4l2 5-3 2a14 14 0 0 0 5 5l2-3 5 2v4c0 1.7-1.3 3-3 3C10.3 21 3 13.7 3 5c0-1.1.9-2 2-2h1Z"/>',
    quote: '<path d="M7 17H3v-5a6 6 0 0 1 6-6v3a3 3 0 0 0-3 3h1v5ZM18 17h-4v-5a6 6 0 0 1 6-6v3a3 3 0 0 0-3 3h1v5Z"/>'
  };

  const catalog = [
    ['tools','Ferramentas'],['demolition','Demolição / Escavadeira'],['masonry','Alvenaria / Tijolos'],['painting','Pintura / Rolo'],
    ['electrical','Elétrica / Plugue'],['plaster','Gesso / Forro'],['plumbing','Hidráulica / Torneira'],['hammer','Martelo'],
    ['drill','Furadeira'],['wrench','Chave / Manutenção'],['helmet','Capacete / Obra'],['building','Construção / Prédio'],
    ['roofing','Telhado'],['flooring','Piso'],['tile','Revestimento / Azulejo'],['waterproof','Impermeabilização'],
    ['carpentry','Marcenaria'],['welding','Solda'],['cleaning','Limpeza pós-obra'],['landscaping','Paisagismo'],['stairs','Escadas']
  ].map(([key,label])=>({key,label}));

  function svg(key, className='ejs-icon'){
    const body = icons[key] || icons.tools;
    return `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
  }

  window.EJSIcons={catalog,svg,has:key=>Boolean(icons[key])};
})();
