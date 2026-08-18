const $=id=>document.getElementById(id);
let state={settings:{whatsapp:'5511999999999',instagram:'https://instagram.com/',cnpj:'Não informado',completedBase:0,completedAdded:0},works:[]};
let editingIndex=-1;

async function api(url,options={}){
  const response=await fetch(url,{cache:'no-store',...options});
  const data=await response.json().catch(()=>({}));
  if(response.status===401){window.location.replace('/admin/login.html');throw new Error('Sessão expirada.');}
  if(!response.ok) throw new Error(data.error||'Erro de comunicação com o servidor.');
  return data;
}

async function ensureSession(){
  const response=await fetch('/api/session',{cache:'no-store'});
  if(!response.ok){window.location.replace('/admin/login.html');return false;}
  return true;
}

function setStatus(message,type='ok'){
  const el=$('globalStatus');
  if(!el)return;
  el.textContent=message;
  el.dataset.type=type;
  clearTimeout(setStatus.timer);
  setStatus.timer=setTimeout(()=>{el.textContent='';},5000);
}

function escapeHtml(value=''){
  return String(value).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}

async function loadState(){
  const data=await api('/api/cms');
  state=data;
  ['whatsapp','instagram','cnpj'].forEach(k=>$(k).value=state.settings?.[k]||'');
  $('completedBase').value=Number(state.settings?.completedBase)||0;
  updateDashboard();
  renderWorks();
}

async function saveState(message='Alterações salvas.'){
  const data=await api('/api/cms',{
    method:'PUT',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(state)
  });
  state=data.state;
  updateDashboard();
  setStatus(message);
}

async function uploadFile(file){
  if(!file)return null;
  const response=await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`,{
    method:'POST',
    headers:{'Content-Type':file.type||'application/octet-stream'},
    body:file
  });
  const data=await response.json().catch(()=>({}));
  if(response.status===401){window.location.replace('/admin/login.html');throw new Error('Sessão expirada.');}
  if(!response.ok)throw new Error(data.error||'Falha no upload da imagem.');
  return data;
}

$('saveSettings').addEventListener('click',async()=>{
  const btn=$('saveSettings');btn.disabled=true;
  try{
    state.settings={...state.settings,
      whatsapp:$('whatsapp').value.trim(),
      instagram:$('instagram').value.trim(),
      cnpj:$('cnpj').value.trim(),
      completedBase:Math.max(0,parseInt($('completedBase').value||'0',10)||0)
    };
    await saveState('Configurações salvas online.');
    $('settingsMsg').textContent='Dados salvos e sincronizados com o Vercel Blob.';
  }catch(error){$('settingsMsg').textContent=error.message;setStatus(error.message,'error');}
  finally{btn.disabled=false;}
});

function resetForm(){
  editingIndex=-1;
  $('workFormTitle').textContent='Cadastrar nova obra';
  $('addWork').textContent='Publicar obra';
  $('cancelEdit').hidden=true;
  $('workTitle').value='';$('workDesc').value='';$('workImage').value='';$('workGallery').value='';
}
$('cancelEdit').onclick=resetForm;

$('addWork').addEventListener('click',async()=>{
  const title=$('workTitle').value.trim();
  if(!title)return alert('Informe o título da obra.');
  if(editingIndex<0&&!$('workImage').files[0])return alert('Informe a imagem principal.');
  const btn=$('addWork');btn.disabled=true;btn.textContent='Salvando...';
  try{
    if(editingIndex>=0){
      const current={...state.works[editingIndex]};
      let cover=current.cover,coverPath=current.coverPath||'';
      let gallery=[...(current.gallery||[])],galleryPaths=[...(current.galleryPaths||[])];
      const main=$('workImage').files[0];
      if(main){
        const up=await uploadFile(main);cover=up.url;coverPath=up.pathname;gallery=[up.url];galleryPaths=[up.pathname];
      }
      if($('workGallery').files.length){
        if(!main){gallery=[cover];galleryPaths=coverPath?[coverPath]:[];}
        for(const file of $('workGallery').files){const up=await uploadFile(file);gallery.push(up.url);galleryPaths.push(up.pathname);}
      }
      state.works[editingIndex]={...current,title,desc:$('workDesc').value.trim(),cover,coverPath,gallery,galleryPaths};
      await saveState('Obra atualizada online.');
    }else{
      const main=await uploadFile($('workImage').files[0]);
      const gallery=[main.url],galleryPaths=[main.pathname];
      for(const file of $('workGallery').files){const up=await uploadFile(file);gallery.push(up.url);galleryPaths.push(up.pathname);}
      state.works.push({id:`obra-${Date.now()}`,title,desc:$('workDesc').value.trim(),cover:main.url,coverPath:main.pathname,gallery,galleryPaths,counted:true,builtin:false});
      state.settings.completedAdded=(Number(state.settings.completedAdded)||0)+1;
      await saveState('Nova obra publicada e salva online.');
    }
    resetForm();renderWorks();updateDashboard();showView('works');
  }catch(error){setStatus(error.message,'error');alert(error.message);}
  finally{btn.disabled=false;if(editingIndex<0)btn.textContent='Publicar obra';}
});

function startEdit(i){
  editingIndex=i;const w=state.works[i];
  $('workFormTitle').textContent='Editar obra';$('addWork').textContent='Salvar alterações';$('cancelEdit').hidden=false;
  $('workTitle').value=w.title||'';$('workDesc').value=w.desc||'';$('workImage').value='';$('workGallery').value='';
  showView('new');window.scrollTo({top:0,behavior:'smooth'});
}

async function removeWork(i){
  const w=state.works[i];if(!confirm(`Excluir a obra "${w.title}"?`))return;
  state.works.splice(i,1);
  if(w.counted)state.settings.completedAdded=Math.max(0,(Number(state.settings.completedAdded)||0)-1);
  try{await saveState('Obra excluída do portfólio.');renderWorks();updateDashboard();}catch(error){setStatus(error.message,'error');await loadState();}
}

function renderWorks(){
  const host=$('adminWorks');host.innerHTML='';
  if(!state.works.length){host.innerHTML='<div class="admin-empty">Nenhuma obra cadastrada.</div>';return;}
  state.works.forEach((w,i)=>{
    const row=document.createElement('article');row.className='admin-work';
    row.innerHTML=`<img src="${escapeHtml(w.cover)}" alt=""><div class="admin-work-copy"><strong>${escapeHtml(w.title)}</strong><p>${escapeHtml(w.desc||'')}</p><small>${w.builtin?'Projeto inicial/fictício':'Projeto publicado pelo painel'}</small></div><div class="admin-work-actions"><button class="edit-work" type="button">Editar</button><button class="delete-work" type="button">Excluir</button></div>`;
    row.querySelector('.edit-work').onclick=()=>startEdit(i);row.querySelector('.delete-work').onclick=()=>removeWork(i);host.appendChild(row);
  });
}

function updateDashboard(){
  $('dashProjects').textContent=state.works.length;
  $('dashCompleted').textContent=(Number(state.settings.completedBase)||0)+(Number(state.settings.completedAdded)||0);
  $('dashSync').textContent='Online';
  const preview=$('recentWorks');preview.innerHTML='';
  state.works.slice(-4).reverse().forEach(w=>{const el=document.createElement('div');el.className='recent-work';el.innerHTML=`<img src="${escapeHtml(w.cover)}" alt=""><div><strong>${escapeHtml(w.title)}</strong><span>${w.builtin?'Projeto inicial':'Projeto cadastrado'}</span></div>`;preview.appendChild(el);});
}

function showView(name){
  document.querySelectorAll('[data-admin-view]').forEach(el=>el.hidden=el.dataset.adminView!==name);
  document.querySelectorAll('[data-nav]').forEach(el=>el.classList.toggle('active',el.dataset.nav===name));
  if(name==='works')renderWorks();
  document.body.classList.remove('admin-menu-open');
}
document.querySelectorAll('[data-nav]').forEach(btn=>btn.addEventListener('click',()=>showView(btn.dataset.nav)));
$('adminMenuToggle')?.addEventListener('click',()=>document.body.classList.toggle('admin-menu-open'));
$('logout').onclick=async()=>{try{await fetch('/api/logout',{method:'POST'});}finally{window.location.replace('/admin/login.html');}};

(async()=>{if(await ensureSession()){try{await loadState();showView('home');}catch(error){setStatus(error.message,'error');}}})();
