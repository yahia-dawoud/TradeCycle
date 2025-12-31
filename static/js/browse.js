let currentFilter = "All Items";

function getCSRFToken() {
    const name = 'csrftoken=';
    const cookies = document.cookie.split(';');
    for(let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith(name)) return cookie.substring(name.length);
    }
    return '';
}

function renderItems() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    grid.innerHTML = '<p>Loading items...</p>';

    let url = '/users/api/items/';
    const params = new URLSearchParams();
    const search = document.getElementById('search-input').value.trim();
    if (search) params.append('search', search);
    if (currentFilter !== 'All Items') params.append('category', currentFilter);
    if (params.toString()) url += '?' + params.toString();

    fetch(url)
        .then(res => res.json())
        .then(data => {
            grid.innerHTML = '';
            if (data.length === 0) {
                grid.innerHTML = '<div class="no-results"><p>No items found.</p></div>';
                return;
            }

            data.forEach(item => {
                const card = document.createElement('div');
                card.className = 'card';

                const deleteBtn = item.user === 'You' 
                    ? `<div class="delete-btn" data-id="${item.id}"><i class="fa-solid fa-trash"></i></div>`
                    : '';

                card.innerHTML = `
                    <div class="card-img-wrapper">
                        <img src="${item.img}" class="card-img" alt="${item.title}">
                        <div class="wishlist-icon"><i class="fa-regular fa-heart"></i></div>
                        ${deleteBtn}
                    </div>
                    <div class="card-body">
                        <h3>${item.title}</h3>
                        <p>${item.desc.substring(0, 80)}...</p>
                        <div class="card-meta">
                            <span class="meta-user">👤 ${item.user}</span>
                            <span class="meta-dist">📍 ${item.dist}</span>
                        </div>
                        <div class="card-footer">
                            <span class="cat-tag">${item.cat}</span>
                            <span class="view-link">View Details →</span>
                        </div>
                    </div>
                `;

                // Delete functionality
                card.querySelector('.delete-btn')?.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (confirm('Delete this item?')) {
                        fetch(`/users/api/items/${item.id}/delete/`, {
                            method: 'POST',
                            headers: { 'X-CSRFToken': getCSRFToken() }
                        }).then(() => renderItems());
                    }
                });

                grid.appendChild(card);
            });
        })
        .catch(() => grid.innerHTML = '<p>Error loading items.</p>');
}

// Category filter buttons
document.querySelectorAll('.cat-pill').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.cat-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.cat;
        renderItems();
    });
});

// Search on input
document.getElementById('search-input').addEventListener('input', renderItems);

// Post Item button opens modal
document.getElementById('open-upload').addEventListener('click', () => {
    document.getElementById('upload-modal').style.display = 'flex';
});

// Close modal on overlay click
document.querySelector('.modal-overlay').addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.style.display = 'none';
    }
});

// Load items on start
document.addEventListener('DOMContentLoaded', renderItems);