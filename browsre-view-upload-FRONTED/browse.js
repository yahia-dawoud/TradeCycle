// 1. Dummy Database Data
const dummyData = [
    { id: 1, title: "Mechanical Keyboard", cat: "Electronics", desc: "Barely used custom mechanical keyboard with tactile switches.", user: "Alex M.", dist: "2 mi", img: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500" },
    { id: 2, title: "Vintage Wooden Chair", cat: "Furniture", desc: "Mid-century modern style chair. Needs some minor refinishing.", user: "Elena K.", dist: "5 mi", img: "https://images.unsplash.com/photo-1503602642458-232111445657?w=500" },
    { id: 3, title: "Sci-Fi Book Bundle", cat: "Books & Media", desc: "Bundle of 5 classic sci-fi novels. Good condition.", user: "Marcus T.", dist: "12 mi", img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500" },
    { id: 4, title: "Nike Running Shoes", cat: "Clothing", desc: "Size 10 US. Worn twice, practically new.", user: "John D.", dist: "1 mi", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500" },
];

// 2. Global State
let currentFilter = "All Items";
let selectedQuality = "";
let uploadedImgData = null; // Stores the local image file

// 3. Core Functions
function renderItems(searchTerm = "") {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    
    grid.innerHTML = "";

    const filtered = dummyData.filter(item => {
        const matchCat = currentFilter === "All Items" || item.cat === currentFilter;
        const matchSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
        return matchCat && matchSearch;
    });

    filtered.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.cursor = 'pointer';
        
        card.innerHTML = `
            <div class="card-img-wrapper">
                <img src="${item.img}" class="card-img">
                <div class="wishlist-icon"><i class="fa-regular fa-heart"></i></div>
            </div>
            <div class="card-body">
                <h3>${item.title}</h3>
                <p>${item.desc.substring(0, 60)}...</p>
                <div class="card-meta">
                    <span class="meta-user">👤 ${item.user}</span>
                    <span class="meta-dist">📍 ${item.dist}</span>
                </div>
                <div class="card-footer">
                    <span class="cat-tag">${item.cat}</span>
                    <span class="view-link">View Details</span>
                </div>
            </div>`;
        
        card.addEventListener('click', () => openProductDetails(item));
        grid.appendChild(card);
    });
}

function openProductDetails(item) {
    const modal = document.getElementById('product-modal');
    if (!modal) return;

    document.getElementById('modal-img').src = item.img;
    document.getElementById('modal-title').innerText = item.title;
    document.getElementById('modal-desc').innerText = item.desc;
    document.getElementById('modal-cat').innerText = item.cat.toUpperCase();
    document.getElementById('modal-user').innerText = item.user;
    document.getElementById('modal-dist').innerText = item.dist;
    document.getElementById('modal-seller-initial').innerText = item.user.charAt(0);
    document.getElementById('modal-email').value = `${item.user.toLowerCase().replace(/\s/g, '')}@tradecycle.com`;

    modal.style.display = 'flex';
}

// 4. Initialization and Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    renderItems();

    // --- DROPDOWN SETUP ---
    const setupDropdown = (btnId, menuId) => {
        const btn = document.getElementById(btnId);
        const menu = document.getElementById(menuId);
        if (btn && menu) {
            btn.onclick = (e) => {
                e.stopPropagation();
                menu.classList.toggle('show');
            };
        }
    };
    setupDropdown('profile-toggle', 'profile-dropdown');
    setupDropdown('filter-toggle', 'filter-dropdown');

    // --- MODAL CONTROLS ---
    const postBtn = document.querySelector('.post-btn');
    const uploadModal = document.getElementById('upload-modal');
    
    if (postBtn) postBtn.onclick = () => uploadModal.style.display = 'flex';
    document.getElementById('close-modal-btn').onclick = () => document.getElementById('product-modal').style.display = 'none';
    document.getElementById('close-upload-btn').onclick = () => uploadModal.style.display = 'none';
    document.getElementById('cancel-upload').onclick = () => uploadModal.style.display = 'none';

    // --- IMAGE UPLOAD LOGIC ---
    const dropZone = document.getElementById('drop-zone');
    const imageInput = document.getElementById('up-image-input');
    const previewContainer = document.getElementById('image-preview-container');
    const previewImg = document.getElementById('upload-preview');

    if (dropZone && imageInput) {
        dropZone.onclick = () => imageInput.click();
        imageInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    uploadedImgData = event.target.result; // Base64 string
                    previewImg.src = uploadedImgData;
                    previewContainer.style.display = 'block';
                    dropZone.style.display = 'none';
                };
                reader.readAsDataURL(file);
            }
        };
    }

    // --- QUALITY SELECTION ---
    const qualityButtons = document.querySelectorAll('.q-btn');
    qualityButtons.forEach(btn => {
        btn.onclick = () => {
            qualityButtons.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedQuality = btn.dataset.val;
        };
    });

    // --- SUBMIT NEW ITEM ---
    document.getElementById('submit-upload').onclick = () => {
        const name = document.getElementById('up-name').value.trim();
        const cat = document.getElementById('up-category').value;
        const desc = document.getElementById('up-desc').value.trim();
        const errorMsg = document.getElementById('upload-error');

        if (!name || !cat || !desc || !selectedQuality || !uploadedImgData) {
            errorMsg.style.display = 'block';
            return;
        }

        const newItem = {
            id: dummyData.length + 1,
            title: name, cat: cat, desc: desc,
            user: "You", dist: "0 mi", img: uploadedImgData
        };

        dummyData.unshift(newItem);
        renderItems();
        uploadModal.style.display = 'none';
        resetForm();
        alert("Item posted successfully!");
    };

    function resetForm() {
        document.getElementById('up-name').value = "";
        document.getElementById('up-desc').value = "";
        previewContainer.style.display = 'none';
        dropZone.style.display = 'flex';
        uploadedImgData = null;
        qualityButtons.forEach(b => b.classList.remove('selected'));
        selectedQuality = "";
    }

    // --- SEARCH AND FILTERS ---
    document.querySelectorAll('.cat-pill').forEach(pill => {
        pill.onclick = () => {
            document.querySelector('.cat-pill.active')?.classList.remove('active');
            pill.classList.add('active');
            currentFilter = pill.innerText;
            renderItems(document.getElementById('search-input')?.value || "");
        };
    });

    document.getElementById('search-input').oninput = (e) => renderItems(e.target.value);
});

// Close UI on outside click
window.onclick = (event) => {
    if (event.target.classList.contains('modal-overlay')) {
        event.target.style.display = 'none';
    }
    document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('show'));
};