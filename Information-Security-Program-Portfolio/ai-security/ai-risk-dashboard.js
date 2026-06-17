(async function(){
  const tbody = document.getElementById('aiTableBody');
  const severitySelect = document.getElementById('severitySelect');

  async function load(){
    try{
      const r = await fetch('ai-controls.json');
      const data = await r.json();
      render(data.controls);
    }catch(e){
      tbody.innerHTML = '<tr><td colspan="4">Failed to load AI controls.</td></tr>';
      console.error(e);
    }
  }

  function render(controls){
    const s = severitySelect.value;
    const rows = controls
      .filter(c => s === 'all' || c.severity === s)
      .map(c => `\n      <tr>\n        <td>${c.control} <small>(${c.id})</small></td>\n        <td>${c.risk}</td>\n        <td>${c.severity}</td>\n        <td>${c.status}</td>\n      </tr>`);
    tbody.innerHTML = rows.length ? rows.join('') : '<tr><td colspan="4">No matching controls.</td></tr>';
  }

  severitySelect.addEventListener('change', load);
  await load();
})();
