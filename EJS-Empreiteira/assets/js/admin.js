if(sessionStorage.getItem('ejsAdminAuth')!=='1') window.location.replace('/admin/login.html');

const defaultWorks=[
  {id:'obra-1',title:'Residência contemporânea fictícia',desc:'Conceito visual demonstrativo com fachada moderna, iluminação arquitetônica e acabamento sofisticado.',cover:'../assets/img/hero-stages/07.webp',gallery:['../assets/img/hero-stages/07.webp'],counted:false,builtin:true},
  {id:'obra-2',title:'Projeto interno contemporâneo',desc:'Ambiente renovado com materiais de visual sofisticado e iluminação valorizada.',cover:'../assets/img/hero-ejs.webp',gallery:['../assets/img/hero-ejs.webp'],counted:false,builtin:true},
  {id:'obra-3',title:'Acabamentos e manutenção',desc:'Soluções sob medida para renovar, corrigir e finalizar ambientes.',cover:'../assets/img/logo-ejs.webp',gallery:['../assets/img/logo-ejs.webp'],counted:false,builtin:true}
];
const defaults={whatsapp:'5511999999999',instagram:'https://instagram.com/',cnpj:'Não informado',completedBase:0,completedAdded:0};
let settings={...defaults,...JSON.parse(localStorage.getItem('ejsSettings')||'{}')};
let storedWorks=JSON.parse(localStorage.getItem('ejsWorks')||'null');
let works;
if(!Array.isArray(storedWorks)){
  works=defaultWorks.map(w=>({...w,gallery:[...w.gallery]}));
  localStorage.setItem('ejsAdminDefaultsInitialized','1');
} else if(localStorage.getItem('ejsAdminDefaultsInitialized')!=='1'){
  const existingIds=new Set(storedWorks.map(w=>w.id));
  works=[...defaultWorks.filter(w=>!existingIds.has(w.id)),...storedWorks];
  localStorage.setItem('ejsAdminDefaultsInitialized','1');
  const publicWorks=works.map(w=>({...w,cover:(w.cover||'').replace(/^\.\.\//,''),gallery:(w.gallery||[]).map(x=>(x||'').replace(/^\.\.\//,''))}));
  localStorage.setItem('ejsWorks',JSON.stringify(publicWorks));
} else {
  works=storedWorks;
}
let editingIndex=-1;

const $=id=>document.getElementById(id);
['whatsapp','instagram','cnpj'].forEach(k=>$(k).value=settings[k]||'');
$('completedBase').value=Number(settings.completedBase)||0;

$('saveSettings').onclick=()=>{
  settings={...settings,
    whatsapp:$('whatsapp').value.trim(),
    instagram:$('instagram').value.trim(),
    cnpj:$('cnpj').value.trim(),
    completedBase:Math.max(0,parseInt($('completedBase').value||'0',10)||0)
  };
  localStorage.setItem('ejsSettings',JSON.stringify(settings));
  $('settingsMsg').textContent='Dados salvos com sucesso.';
};

const toData=file=>new Promise((res,rej)=>{
  const r=new FileReader();
  r.onload=()=>res(r.result);
  r.onerror=rej;
  r.readAsDataURL(file);
});

function normalizePublicPath(path){
  if(typeof path!=='string') return path;
  return path.replace(/^\.\.\//,'');
}
function normalizeAdminPath(path){
  if(typeof path!=='string') return path;
  if(path.startsWith('data:')||path.startsWith('http')) return path;
  return path.startsWith('../')?path:'../'+path;
}
function saveWorks(){
  const publicWorks=works.map(w=>({
    ...w,
    cover:normalizePublicPath(w.cover),
    gallery:(w.gallery||[]).map(normalizePublicPath)
  }));
  localStorage.setItem('ejsWorks',JSON.stringify(publicWorks));
}
function resetForm(){
  editingIndex=-1;
  $('workFormTitle').textContent='Adicionar obra ao portfólio';
  $('addWork').textContent='Adicionar obra';
  $('cancelEdit').hidden=true;
  $('workTitle').value='';
  $('workDesc').value='';
  $('workImage').value='';
  $('workGallery').value='';
}
$('cancelEdit').onclick=resetForm;

$('addWork').onclick=async()=>{
  const title=$('workTitle').value.trim();
  if(!title) return alert('Informe o título da obra.');

  if(editingIndex<0 && !$('workImage').files[0]) {
    return alert('Informe a imagem principal.');
  }

  if(editingIndex>=0){
    const current=works[editingIndex];
    let cover=current.cover;
    let gallery=[...(current.gallery||[])];
    if($('workImage').files[0]){
      cover=await toData($('workImage').files[0]);
      gallery=[cover];
    }
    if($('workGallery').files.length){
      if(!$('workImage').files[0]) gallery=[cover];
      for(const f of $('workGallery').files) gallery.push(await toData(f));
    }
    works[editingIndex]={...current,title,desc:$('workDesc').value.trim(),cover,gallery};
  } else {
    const cover=await toData($('workImage').files[0]);
    const gallery=[cover];
    for(const f of $('workGallery').files) gallery.push(await toData(f));
    works.push({id:'obra-'+Date.now(),title,desc:$('workDesc').value.trim(),cover,gallery,counted:true,builtin:false});
    settings.completedAdded=(Number(settings.completedAdded)||0)+1;
    localStorage.setItem('ejsSettings',JSON.stringify(settings));
  }
  saveWorks();
  resetForm();
  render();
};

function startEdit(i){
  editingIndex=i;
  const w=works[i];
  $('workFormTitle').textContent='Editar obra';
  $('addWork').textContent='Salvar alterações';
  $('cancelEdit').hidden=false;
  $('workTitle').value=w.title||'';
  $('workDesc').value=w.desc||'';
  $('workImage').value='';
  $('workGallery').value='';
  $('workFormTitle').scrollIntoView({behavior:'smooth',block:'center'});
}

function removeWork(i){
  const w=works[i];
  if(!confirm(`Excluir a obra "${w.title}"?`)) return;
  works.splice(i,1);
  if(w?.counted){
    settings.completedAdded=Math.max(0,(Number(settings.completedAdded)||0)-1);
    localStorage.setItem('ejsSettings',JSON.stringify(settings));
  }
  saveWorks();
  if(editingIndex===i) resetForm();
  render();
}

function render(){
  const host=$('adminWorks');
  host.innerHTML='';
  if(!works.length){
    host.innerHTML='<p>Nenhuma obra cadastrada.</p>';
    return;
  }
  works.forEach((w,i)=>{
    const row=document.createElement('div');
    row.className='admin-work';
    const imgSrc=normalizeAdminPath(w.cover);
    row.innerHTML=`
      <img src="${imgSrc}" alt="">
      <div><strong>${w.title}</strong><p>${w.desc||''}</p><small>${w.builtin?'Projeto inicial/fictício':'Projeto cadastrado no painel'}</small></div>
      <div class="admin-work-actions"><button class="edit-work" type="button">Editar</button><button class="delete-work" type="button">Excluir</button></div>`;
    row.querySelector('.edit-work').onclick=()=>startEdit(i);
    row.querySelector('.delete-work').onclick=()=>removeWork(i);
    host.appendChild(row);
  });
}
render();

$('logout').onclick=()=>{
  sessionStorage.removeItem('ejsAdminAuth');
  window.location.replace('/admin/login.html');
};
