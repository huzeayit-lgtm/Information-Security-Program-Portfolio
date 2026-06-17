(async function(){
  const tbody = document.getElementById('controlsBody');
  try{
    const r = await fetch('controls.json');
    const data = await r.json();
    const rows = data.controls.map(c => `\n      <tr>\n        <td>${c.name} <small>(${c.id})</small></td>\n        <td>${c.category}</td>\n        <td>${c.stage}</td>\n        <td>${c.description}</td>\n      </tr>`);
    tbody.innerHTML = rows.join('');
  }catch(e){
    tbody.innerHTML = '<tr><td colspan="4">Failed to load controls.</td></tr>';
    console.error(e);
  }
})();
