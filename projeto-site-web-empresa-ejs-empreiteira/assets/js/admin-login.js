const form = document.getElementById('loginForm');

async function checkExistingSession(){
  try{
    const r=await fetch('/api/session',{cache:'no-store'});
    if(r.ok) window.location.replace('/admin/index.html');
  }catch{}
}
checkExistingSession();

if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const user = document.getElementById('user').value.trim();
    const password = document.getElementById('pass').value;
    const message = document.getElementById('loginMsg');
    const button=form.querySelector('button[type="submit"]');
    message.textContent='Entrando...';
    button.disabled=true;
    try{
      const response=await fetch('/api/login',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({user,password})
      });
      const data=await response.json().catch(()=>({}));
      if(!response.ok) throw new Error(data.error||'Não foi possível entrar.');
      window.location.replace('/admin/index.html');
    }catch(error){
      message.textContent=error.message||'Erro ao realizar login.';
      button.disabled=false;
    }
  });
}
