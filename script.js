document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('schoolForm');
    const schoolsContainer = document.getElementById('schoolsContainer');

    // Load schools from local storage
    let schools = JSON.parse(localStorage.getItem('schools')) || [];

    // Render schools on load
    renderSchools();

    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const newSchool = {
            id: Date.now(),
            name: document.getElementById('schoolName').value,
            address: document.getElementById('address').value,
            hours: document.getElementById('hours').value
        };

        schools.unshift(newSchool); // Add to beginning of array
        saveAndRender();
        form.reset();
    });

    function saveAndRender() {
        localStorage.setItem('schools', JSON.stringify(schools));
        renderSchools();
    }

    function renderSchools() {
        schoolsContainer.innerHTML = '';

        if (schools.length === 0) {
            schoolsContainer.innerHTML = `
                <div class="empty-state">
                    <p>Nenhuma escola cadastrada ainda.</p>
                </div>
            `;
            return;
        }

        const listTitle = document.createElement('h2');
        listTitle.style.marginBottom = '1rem';
        listTitle.style.fontSize = '1.5rem';
        listTitle.style.color = 'var(--text-primary)';
        listTitle.textContent = 'Escolas Cadastradas';
        schoolsContainer.appendChild(listTitle);

        const list = document.createElement('div');
        list.className = 'school-list';

        schools.forEach(school => {
            const item = document.createElement('div');
            item.className = 'school-item';
            
            item.innerHTML = `
                <div class="school-info">
                    <h3>${escapeHtml(school.name)}</h3>
                    <p>📍 ${escapeHtml(school.address)}</p>
                    <p>⏰ ${escapeHtml(school.hours)}</p>
                </div>
                <button class="delete-btn" onclick="deleteSchool(${school.id})" title="Remover">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            `;
            
            list.appendChild(item);
        });

        schoolsContainer.appendChild(list);
    }

    // Identify utility to prevent XSS
    function escapeHtml(text) {
        if (!text) return '';
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Expose delete function to window so onclick works
    window.deleteSchool = (id) => {
        if(confirm('Tem certeza que deseja remover esta escola?')) {
            schools = schools.filter(school => school.id !== id);
            saveAndRender();
        }
    };
});
