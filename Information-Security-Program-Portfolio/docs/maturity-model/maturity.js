const categorySelect = document.getElementById('categorySelect');
const levelSelect = document.getElementById('levelSelect');
const tableBody = document.getElementById('maturityTableBody');

async function loadMaturityModel() {
  try {
    const response = await fetch('data.json');
    const model = await response.json();
    populateCategories(model.categories);
    renderTable(model.categories);
  } catch (error) {
    tableBody.innerHTML = '<tr><td colspan="4">Failed to load maturity data.</td></tr>';
    console.error('Error loading maturity data:', error);
  }
}

function populateCategories(categories) {
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category.name;
    option.textContent = category.name;
    categorySelect.appendChild(option);
  });
}

function renderTable(categories) {
  const selectedCategory = categorySelect.value;
  const selectedLevel = levelSelect.value;
  const filtered = categories
    .filter(category => selectedCategory === 'all' || category.name === selectedCategory)
    .flatMap(category => category.levels.map(level => ({ category: category.name, ...level })));

  const rows = filtered
    .filter(item => selectedLevel === 'all' || String(item.level) === selectedLevel)
    .map(item => {
      return `
        <tr>
          <td>${item.category}</td>
          <td><span class="status-pill status-${item.level}">Level ${item.level}</span></td>
          <td>${item.description}</td>
          <td>${item.outcome}</td>
        </tr>
      `;
    });

  tableBody.innerHTML = rows.length ? rows.join('') : '<tr><td colspan="4">No matching entries found.</td></tr>';
}

categorySelect.addEventListener('change', () => loadMaturityModel());
levelSelect.addEventListener('change', () => loadMaturityModel());

loadMaturityModel();
