(function(){
  const root=document.documentElement;
  // Tema inicial de uma nova sessão: Claro. Se o visitante alterar,
  // a escolha permanece enquanto ele navega entre as páginas do site.
  const savedTheme=sessionStorage.getItem('ejsTheme')||'cimento';
  const savedSize=localStorage.getItem('ejsTextSize')||'normal';
  root.dataset.theme=savedTheme;
  root.dataset.textSize=savedSize;

  function applyTheme(theme){
    root.dataset.theme=theme;
    sessionStorage.setItem('ejsTheme',theme);
    const meta=document.querySelector('meta[name="theme-color"]');
    const themeColors={cimento:'#fffefc',areia:'#fffaf3',escuro:'#262120',contraste:'#000000'};
    if(meta) meta.setAttribute('content',themeColors[theme]||themeColors.escuro);
    document.querySelectorAll('[data-theme-option]').forEach(btn=>{
      const active=btn.dataset.themeOption===theme;
      btn.classList.toggle('active',active);
      btn.setAttribute('aria-pressed',String(active));
    });
  }

  function applySize(size){
    root.dataset.textSize=size;
    localStorage.setItem('ejsTextSize',size);
    document.querySelectorAll('[data-text-size]').forEach(btn=>{
      const active=btn.dataset.textSize===size;
      btn.classList.toggle('active',active);
      btn.setAttribute('aria-pressed',String(active));
    });
  }

  document.addEventListener('DOMContentLoaded',()=>{
    const toggle=document.getElementById('accessibilityToggle');
    const panel=document.getElementById('accessibilityPanel');
    if(toggle&&panel){
      toggle.addEventListener('click',e=>{
        e.stopPropagation();
        const open=panel.classList.toggle('open');
        toggle.setAttribute('aria-expanded',String(open));
      });
      panel.addEventListener('click',e=>e.stopPropagation());
      document.addEventListener('click',()=>{
        panel.classList.remove('open');
        toggle.setAttribute('aria-expanded','false');
      });
    }
    document.querySelectorAll('[data-theme-option]').forEach(btn=>btn.addEventListener('click',()=>applyTheme(btn.dataset.themeOption)));
    document.querySelectorAll('[data-text-size]').forEach(btn=>btn.addEventListener('click',()=>applySize(btn.dataset.textSize)));
    applyTheme(savedTheme);
    applySize(savedSize);
  });
})();
