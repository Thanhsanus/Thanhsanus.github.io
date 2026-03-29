// ===== Data Store =====
const Store = {
    get(key) {
        return JSON.parse(localStorage.getItem(key) || '[]');
    },
    set(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    },
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }
};

// ===== Pet Type Icons =====
const PET_ICONS = {
    'Chó': '🐕',
    'Mèo': '🐈',
    'Chim': '🐦',
    'Cá': '🐟',
    'Hamster': '🐹',
    'Thỏ': '🐰',
    'Khác': '🐾'
};

const HEALTH_TYPE_LABELS = {
    'vaccination': 'Tiêm Chủng',
    'checkup': 'Khám Tổng Quát',
    'treatment': 'Điều Trị',
    'surgery': 'Phẫu Thuật',
    'medication': 'Thuốc'
};

const HEALTH_TYPE_COLORS = {
    'vaccination': 'background: #dbeafe; color: #1e40af;',
    'checkup': 'background: #d1fae5; color: #065f46;',
    'treatment': 'background: #fef3c7; color: #92400e;',
    'surgery': 'background: #fee2e2; color: #991b1b;',
    'medication': 'background: #e0e7ff; color: #3730a3;'
};

// ===== Navigation =====
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        const page = item.dataset.page;
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById(`page-${page}`).classList.add('active');
        document.getElementById('pageTitle').textContent = item.textContent.trim();

        // Close sidebar on mobile
        document.getElementById('sidebar').classList.remove('open');

        // Refresh page data
        refreshPage(page);
    });
});

// Mobile menu toggle
document.getElementById('menuToggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
});

// Global search
document.getElementById('globalSearch').addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const activePage = document.querySelector('.page.active').id.replace('page-', '');
    if (activePage === 'pets') renderPets(query);
    if (activePage === 'owners') renderOwners(query);
    if (activePage === 'health') renderHealthRecords(query);
    if (activePage === 'appointments') renderAppointments(query);
});

// Filter event listeners
document.getElementById('filterPetType').addEventListener('change', () => renderPets());
document.getElementById('filterPetStatus').addEventListener('change', () => renderPets());
document.getElementById('filterHealthPet').addEventListener('change', () => renderHealthRecords());
document.getElementById('filterHealthType').addEventListener('change', () => renderHealthRecords());
document.getElementById('filterApptStatus').addEventListener('change', () => renderAppointments());

function refreshPage(page) {
    if (page === 'dashboard') renderDashboard();
    if (page === 'pets') renderPets();
    if (page === 'owners') renderOwners();
    if (page === 'health') { populatePetSelects(); renderHealthRecords(); }
    if (page === 'appointments') { populatePetSelects(); renderAppointments(); }
}

// ===== Toast Notification =====
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast toast-${type} active`;
    setTimeout(() => toast.classList.remove('active'), 3000);
}

// ===== Modal Functions =====
function openModal(id) {
    document.getElementById(id).classList.add('active');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

// Close modal on backdrop click
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });
});

// ===== Populate Pet Select Dropdowns =====
function populatePetSelects() {
    const pets = Store.get('pets');
    const selects = ['healthPet', 'apptPet', 'filterHealthPet'];
    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (!select) return;
        const currentVal = select.value;
        const firstOption = select.options[0].outerHTML;
        select.innerHTML = firstOption;
        pets.forEach(pet => {
            const opt = document.createElement('option');
            opt.value = pet.id;
            opt.textContent = `${PET_ICONS[pet.type] || '🐾'} ${pet.name}`;
            select.appendChild(opt);
        });
        select.value = currentVal;
    });
}

// ===== Populate Owner Select =====
function populateOwnerSelect() {
    const owners = Store.get('owners');
    const select = document.getElementById('petOwner');
    const currentVal = select.value;
    select.innerHTML = '<option value="">Chọn chủ nuôi</option>';
    owners.forEach(owner => {
        const opt = document.createElement('option');
        opt.value = owner.id;
        opt.textContent = owner.name;
        select.appendChild(opt);
    });
    select.value = currentVal;
}

// ===== OWNERS =====
function openOwnerModal(id) {
    document.getElementById('ownerForm').reset();
    document.getElementById('ownerId').value = '';
    if (id) {
        const owner = Store.get('owners').find(o => o.id === id);
        if (owner) {
            document.getElementById('ownerId').value = owner.id;
            document.getElementById('ownerFullName').value = owner.name;
            document.getElementById('ownerPhone').value = owner.phone;
            document.getElementById('ownerEmail').value = owner.email || '';
            document.getElementById('ownerAddress').value = owner.address || '';
            document.getElementById('ownerModalTitle').textContent = 'Sửa Chủ Nuôi';
        }
    } else {
        document.getElementById('ownerModalTitle').textContent = 'Thêm Chủ Nuôi';
    }
    openModal('ownerModal');
}

function saveOwner(e) {
    e.preventDefault();
    const owners = Store.get('owners');
    const id = document.getElementById('ownerId').value;
    const ownerData = {
        id: id || Store.generateId(),
        name: document.getElementById('ownerFullName').value,
        phone: document.getElementById('ownerPhone').value,
        email: document.getElementById('ownerEmail').value,
        address: document.getElementById('ownerAddress').value,
        createdAt: id ? (owners.find(o => o.id === id)?.createdAt || new Date().toISOString()) : new Date().toISOString()
    };

    if (id) {
        const index = owners.findIndex(o => o.id === id);
        owners[index] = ownerData;
        showToast('Cập nhật chủ nuôi thành công!');
    } else {
        owners.push(ownerData);
        showToast('Thêm chủ nuôi thành công!');
    }

    Store.set('owners', owners);
    closeModal('ownerModal');
    renderOwners();
    addActivity(`${id ? 'Cập nhật' : 'Thêm'} chủ nuôi: ${ownerData.name}`);
}

function deleteOwner(id) {
    if (!confirm('Bạn có chắc muốn xóa chủ nuôi này?')) return;
    const owners = Store.get('owners').filter(o => o.id !== id);
    Store.set('owners', owners);
    showToast('Đã xóa chủ nuôi!', 'info');
    renderOwners();
}

function renderOwners(searchQuery) {
    let owners = Store.get('owners');
    const pets = Store.get('pets');

    if (searchQuery) {
        owners = owners.filter(o =>
            o.name.toLowerCase().includes(searchQuery) ||
            o.phone.includes(searchQuery) ||
            (o.email && o.email.toLowerCase().includes(searchQuery))
        );
    }

    const tbody = document.getElementById('ownersList');
    if (owners.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">Chưa có chủ nuôi nào</td></tr>';
        return;
    }

    tbody.innerHTML = owners.map(owner => {
        const petCount = pets.filter(p => p.ownerId === owner.id).length;
        return `<tr>
            <td><strong>${escapeHtml(owner.name)}</strong></td>
            <td>${escapeHtml(owner.phone)}</td>
            <td>${escapeHtml(owner.email || '-')}</td>
            <td>${escapeHtml(owner.address || '-')}</td>
            <td>${petCount}</td>
            <td>
                <button class="btn-icon" onclick="openOwnerModal('${owner.id}')" title="Sửa">✏️</button>
                <button class="btn-icon" onclick="deleteOwner('${owner.id}')" title="Xóa">🗑️</button>
            </td>
        </tr>`;
    }).join('');
}

// ===== PETS =====
function openPetModal(id) {
    document.getElementById('petForm').reset();
    document.getElementById('petId').value = '';
    populateOwnerSelect();

    if (id) {
        const pet = Store.get('pets').find(p => p.id === id);
        if (pet) {
            document.getElementById('petId').value = pet.id;
            document.getElementById('petName').value = pet.name;
            document.getElementById('petType').value = pet.type;
            document.getElementById('petBreed').value = pet.breed || '';
            document.getElementById('petGender').value = pet.gender || 'Đực';
            document.getElementById('petBirthDate').value = pet.birthDate || '';
            document.getElementById('petWeight').value = pet.weight || '';
            document.getElementById('petColor').value = pet.color || '';
            document.getElementById('petMicrochip').value = pet.microchip || '';
            document.getElementById('petOwner').value = pet.ownerId;
            document.getElementById('petStatus').value = pet.status || 'Khỏe mạnh';
            document.getElementById('petNotes').value = pet.notes || '';
            document.getElementById('petModalTitle').textContent = 'Sửa Thú Cưng';
        }
    } else {
        document.getElementById('petModalTitle').textContent = 'Thêm Thú Cưng';
    }
    openModal('petModal');
}

function savePet(e) {
    e.preventDefault();
    const pets = Store.get('pets');
    const id = document.getElementById('petId').value;
    const petData = {
        id: id || Store.generateId(),
        name: document.getElementById('petName').value,
        type: document.getElementById('petType').value,
        breed: document.getElementById('petBreed').value,
        gender: document.getElementById('petGender').value,
        birthDate: document.getElementById('petBirthDate').value,
        weight: document.getElementById('petWeight').value,
        color: document.getElementById('petColor').value,
        microchip: document.getElementById('petMicrochip').value,
        ownerId: document.getElementById('petOwner').value,
        status: document.getElementById('petStatus').value,
        notes: document.getElementById('petNotes').value,
        createdAt: id ? (pets.find(p => p.id === id)?.createdAt || new Date().toISOString()) : new Date().toISOString()
    };

    if (id) {
        const index = pets.findIndex(p => p.id === id);
        pets[index] = petData;
        showToast('Cập nhật thú cưng thành công!');
    } else {
        pets.push(petData);
        showToast('Thêm thú cưng thành công!');
    }

    Store.set('pets', pets);
    closeModal('petModal');
    renderPets();
    addActivity(`${id ? 'Cập nhật' : 'Thêm'} thú cưng: ${petData.name} (${petData.type})`);
}

function deletePet(id) {
    if (!confirm('Bạn có chắc muốn xóa thú cưng này? Toàn bộ hồ sơ sức khỏe liên quan sẽ bị xóa.')) return;
    const pets = Store.get('pets').filter(p => p.id !== id);
    const health = Store.get('healthRecords').filter(h => h.petId !== id);
    const appts = Store.get('appointments').filter(a => a.petId !== id);
    Store.set('pets', pets);
    Store.set('healthRecords', health);
    Store.set('appointments', appts);
    showToast('Đã xóa thú cưng!', 'info');
    renderPets();
}

function calculateAge(birthDate) {
    if (!birthDate) return 'N/A';
    const diff = Date.now() - new Date(birthDate).getTime();
    const years = Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
    const months = Math.floor((diff % (365.25 * 24 * 60 * 60 * 1000)) / (30.44 * 24 * 60 * 60 * 1000));
    if (years > 0) return `${years} tuổi ${months} tháng`;
    return `${months} tháng`;
}

function renderPets(searchQuery) {
    let pets = Store.get('pets');
    const owners = Store.get('owners');
    const typeFilter = document.getElementById('filterPetType').value;
    const statusFilter = document.getElementById('filterPetStatus').value;

    if (typeFilter) pets = pets.filter(p => p.type === typeFilter);
    if (statusFilter) pets = pets.filter(p => p.status === statusFilter);
    if (searchQuery) {
        pets = pets.filter(p =>
            p.name.toLowerCase().includes(searchQuery) ||
            p.type.toLowerCase().includes(searchQuery) ||
            (p.breed && p.breed.toLowerCase().includes(searchQuery))
        );
    }

    const container = document.getElementById('petsList');
    if (pets.length === 0) {
        container.innerHTML = '<div class="empty-state">Chưa có thú cưng nào</div>';
        return;
    }

    container.innerHTML = pets.map(pet => {
        const owner = owners.find(o => o.id === pet.ownerId);
        const statusClass = pet.status === 'Khỏe mạnh' ? 'badge-success' :
                          pet.status === 'Đang điều trị' ? 'badge-danger' : 'badge-warning';
        return `<div class="pet-card">
            <div class="pet-card-header">
                <div class="pet-avatar">${PET_ICONS[pet.type] || '🐾'}</div>
                <div>
                    <div class="pet-card-name">${escapeHtml(pet.name)}</div>
                    <div class="pet-card-type">${escapeHtml(pet.type)}${pet.breed ? ' - ' + escapeHtml(pet.breed) : ''}</div>
                </div>
                <span class="badge ${statusClass}" style="margin-left:auto">${escapeHtml(pet.status)}</span>
            </div>
            <div class="pet-card-body">
                <div class="pet-detail"><span class="pet-detail-label">Giới tính</span><span>${escapeHtml(pet.gender)}</span></div>
                <div class="pet-detail"><span class="pet-detail-label">Tuổi</span><span>${calculateAge(pet.birthDate)}</span></div>
                <div class="pet-detail"><span class="pet-detail-label">Cân nặng</span><span>${pet.weight ? pet.weight + ' kg' : 'N/A'}</span></div>
                <div class="pet-detail"><span class="pet-detail-label">Chủ nuôi</span><span>${owner ? escapeHtml(owner.name) : 'N/A'}</span></div>
            </div>
            <div class="pet-card-footer">
                <button class="btn btn-sm btn-primary" onclick="viewPetProfile('${pet.id}')">📋 Hồ Sơ</button>
                <button class="btn btn-sm btn-secondary" onclick="openPetModal('${pet.id}')">✏️ Sửa</button>
                <button class="btn btn-sm btn-danger" onclick="deletePet('${pet.id}')">🗑️ Xóa</button>
            </div>
        </div>`;
    }).join('');
}

// ===== PET HEALTH PROFILE =====
function viewPetProfile(petId) {
    const pet = Store.get('pets').find(p => p.id === petId);
    if (!pet) return;
    const owner = Store.get('owners').find(o => o.id === pet.ownerId);
    const records = Store.get('healthRecords').filter(h => h.petId === petId)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    const vaccinations = records.filter(r => r.type === 'vaccination');
    const appointments = Store.get('appointments').filter(a => a.petId === petId && a.status === 'upcoming');

    document.getElementById('petProfileTitle').textContent = `Hồ Sơ Sức Khỏe - ${pet.name}`;

    const statusClass = pet.status === 'Khỏe mạnh' ? 'badge-success' :
                      pet.status === 'Đang điều trị' ? 'badge-danger' : 'badge-warning';

    let html = `
        <div class="profile-header">
            <div class="profile-avatar">${PET_ICONS[pet.type] || '🐾'}</div>
            <div class="profile-info">
                <h3>${escapeHtml(pet.name)} <span class="badge ${statusClass}">${escapeHtml(pet.status)}</span></h3>
                <p>${escapeHtml(pet.type)}${pet.breed ? ' - ' + escapeHtml(pet.breed) : ''} | ${escapeHtml(pet.gender)} | ${calculateAge(pet.birthDate)}</p>
                <p>Chủ nuôi: ${owner ? escapeHtml(owner.name) + ' - ' + escapeHtml(owner.phone) : 'N/A'}</p>
                ${pet.microchip ? `<p>Microchip: ${escapeHtml(pet.microchip)}</p>` : ''}
            </div>
        </div>
        <div class="profile-stats">
            <div class="profile-stat">
                <div class="profile-stat-value">${pet.weight || '-'}</div>
                <div class="profile-stat-label">Cân nặng (kg)</div>
            </div>
            <div class="profile-stat">
                <div class="profile-stat-value">${vaccinations.length}</div>
                <div class="profile-stat-label">Lần tiêm chủng</div>
            </div>
            <div class="profile-stat">
                <div class="profile-stat-value">${records.length}</div>
                <div class="profile-stat-label">Hồ sơ khám</div>
            </div>
        </div>`;

    if (appointments.length > 0) {
        html += `<div class="profile-section">
            <h4>📅 Lịch Hẹn Sắp Tới</h4>
            ${appointments.map(a => `<div class="upcoming-item">
                <strong>${formatDate(a.date)}</strong> ${a.time} - ${escapeHtml(a.reason)}
            </div>`).join('')}
        </div>`;
    }

    if (records.length > 0) {
        html += `<div class="profile-section">
            <h4>📜 Lịch Sử Khám Bệnh</h4>
            <div class="timeline">
                ${records.map(r => `<div class="timeline-item">
                    <div class="timeline-date">${formatDate(r.date)}</div>
                    <div class="timeline-content">
                        <span class="timeline-type" style="${HEALTH_TYPE_COLORS[r.type] || ''}">${HEALTH_TYPE_LABELS[r.type] || r.type}</span>
                        <div>${escapeHtml(r.description || '')}</div>
                        ${r.vaccineName ? `<div><strong>Vắc-xin:</strong> ${escapeHtml(r.vaccineName)}</div>` : ''}
                        ${r.diagnosis ? `<div><strong>Chẩn đoán:</strong> ${escapeHtml(r.diagnosis)}</div>` : ''}
                        ${r.prescription ? `<div><strong>Đơn thuốc:</strong> ${escapeHtml(r.prescription)}</div>` : ''}
                        ${r.vet ? `<div><strong>Bác sĩ:</strong> ${escapeHtml(r.vet)}</div>` : ''}
                        ${r.notes ? `<div class="activity-time">${escapeHtml(r.notes)}</div>` : ''}
                    </div>
                </div>`).join('')}
            </div>
        </div>`;
    } else {
        html += '<div class="profile-section"><p class="empty-state">Chưa có hồ sơ sức khỏe</p></div>';
    }

    document.getElementById('petProfileContent').innerHTML = html;
    openModal('petProfileModal');
}

// ===== HEALTH RECORDS =====
function openHealthModal(id) {
    document.getElementById('healthForm').reset();
    document.getElementById('healthId').value = '';
    populatePetSelects();
    hideAllHealthFields();

    if (id) {
        const record = Store.get('healthRecords').find(h => h.id === id);
        if (record) {
            document.getElementById('healthId').value = record.id;
            document.getElementById('healthPet').value = record.petId;
            document.getElementById('healthDate').value = record.date;
            document.getElementById('healthType').value = record.type;
            document.getElementById('healthVet').value = record.vet || '';
            document.getElementById('healthDescription').value = record.description || '';
            document.getElementById('healthNotes').value = record.notes || '';

            toggleHealthFields();

            if (record.type === 'vaccination') {
                document.getElementById('vaccineName').value = record.vaccineName || '';
                document.getElementById('vaccineNextDate').value = record.vaccineNextDate || '';
            }
            if (record.type === 'treatment' || record.type === 'surgery') {
                document.getElementById('diagnosis').value = record.diagnosis || '';
                document.getElementById('prescription').value = record.prescription || '';
            }
            if (record.type === 'checkup') {
                document.getElementById('checkupWeight').value = record.checkupWeight || '';
                document.getElementById('checkupTemp').value = record.checkupTemp || '';
                document.getElementById('checkupHeartRate').value = record.checkupHeartRate || '';
                document.getElementById('checkupResult').value = record.checkupResult || 'Bình thường';
            }
            if (record.type === 'medication') {
                document.getElementById('medName').value = record.medName || '';
                document.getElementById('medDosage').value = record.medDosage || '';
                document.getElementById('medFrequency').value = record.medFrequency || '';
                document.getElementById('medEndDate').value = record.medEndDate || '';
            }

            document.getElementById('healthModalTitle').textContent = 'Sửa Hồ Sơ Sức Khỏe';
        }
    } else {
        document.getElementById('healthDate').value = new Date().toISOString().split('T')[0];
        document.getElementById('healthModalTitle').textContent = 'Thêm Hồ Sơ Sức Khỏe';
    }
    openModal('healthModal');
}

function hideAllHealthFields() {
    document.querySelectorAll('.conditional-fields').forEach(f => f.style.display = 'none');
}

function toggleHealthFields() {
    hideAllHealthFields();
    const type = document.getElementById('healthType').value;
    if (type === 'vaccination') document.getElementById('vaccinationFields').style.display = 'block';
    if (type === 'treatment' || type === 'surgery') document.getElementById('treatmentFields').style.display = 'block';
    if (type === 'checkup') document.getElementById('checkupFields').style.display = 'block';
    if (type === 'medication') document.getElementById('medicationFields').style.display = 'block';
}

function saveHealthRecord(e) {
    e.preventDefault();
    const records = Store.get('healthRecords');
    const id = document.getElementById('healthId').value;
    const type = document.getElementById('healthType').value;

    const recordData = {
        id: id || Store.generateId(),
        petId: document.getElementById('healthPet').value,
        date: document.getElementById('healthDate').value,
        type: type,
        vet: document.getElementById('healthVet').value,
        description: document.getElementById('healthDescription').value,
        notes: document.getElementById('healthNotes').value,
        createdAt: id ? (records.find(r => r.id === id)?.createdAt || new Date().toISOString()) : new Date().toISOString()
    };

    // Add type-specific fields
    if (type === 'vaccination') {
        recordData.vaccineName = document.getElementById('vaccineName').value;
        recordData.vaccineNextDate = document.getElementById('vaccineNextDate').value;
    }
    if (type === 'treatment' || type === 'surgery') {
        recordData.diagnosis = document.getElementById('diagnosis').value;
        recordData.prescription = document.getElementById('prescription').value;
    }
    if (type === 'checkup') {
        recordData.checkupWeight = document.getElementById('checkupWeight').value;
        recordData.checkupTemp = document.getElementById('checkupTemp').value;
        recordData.checkupHeartRate = document.getElementById('checkupHeartRate').value;
        recordData.checkupResult = document.getElementById('checkupResult').value;

        // Update pet weight if provided
        if (recordData.checkupWeight) {
            const pets = Store.get('pets');
            const petIndex = pets.findIndex(p => p.id === recordData.petId);
            if (petIndex !== -1) {
                pets[petIndex].weight = recordData.checkupWeight;
                Store.set('pets', pets);
            }
        }
    }
    if (type === 'medication') {
        recordData.medName = document.getElementById('medName').value;
        recordData.medDosage = document.getElementById('medDosage').value;
        recordData.medFrequency = document.getElementById('medFrequency').value;
        recordData.medEndDate = document.getElementById('medEndDate').value;
    }

    if (id) {
        const index = records.findIndex(r => r.id === id);
        records[index] = recordData;
        showToast('Cập nhật hồ sơ thành công!');
    } else {
        records.push(recordData);
        showToast('Thêm hồ sơ sức khỏe thành công!');
    }

    Store.set('healthRecords', records);
    closeModal('healthModal');
    renderHealthRecords();

    const pet = Store.get('pets').find(p => p.id === recordData.petId);
    addActivity(`${id ? 'Cập nhật' : 'Thêm'} hồ sơ ${HEALTH_TYPE_LABELS[type]}: ${pet ? pet.name : ''}`);
}

function deleteHealthRecord(id) {
    if (!confirm('Bạn có chắc muốn xóa hồ sơ này?')) return;
    const records = Store.get('healthRecords').filter(r => r.id !== id);
    Store.set('healthRecords', records);
    showToast('Đã xóa hồ sơ!', 'info');
    renderHealthRecords();
}

function renderHealthRecords(searchQuery) {
    let records = Store.get('healthRecords');
    const pets = Store.get('pets');
    const petFilter = document.getElementById('filterHealthPet').value;
    const typeFilter = document.getElementById('filterHealthType').value;

    if (petFilter) records = records.filter(r => r.petId === petFilter);
    if (typeFilter) records = records.filter(r => r.type === typeFilter);
    if (searchQuery) {
        records = records.filter(r => {
            const pet = pets.find(p => p.id === r.petId);
            return (pet && pet.name.toLowerCase().includes(searchQuery)) ||
                   (r.description && r.description.toLowerCase().includes(searchQuery)) ||
                   (r.vet && r.vet.toLowerCase().includes(searchQuery));
        });
    }

    records.sort((a, b) => new Date(b.date) - new Date(a.date));

    const tbody = document.getElementById('healthList');
    if (records.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-state">Chưa có hồ sơ sức khỏe nào</td></tr>';
        return;
    }

    tbody.innerHTML = records.map(record => {
        const pet = pets.find(p => p.id === record.petId);
        return `<tr>
            <td>${formatDate(record.date)}</td>
            <td>${pet ? `${PET_ICONS[pet.type] || '🐾'} ${escapeHtml(pet.name)}` : 'N/A'}</td>
            <td><span class="timeline-type" style="${HEALTH_TYPE_COLORS[record.type] || ''}">${HEALTH_TYPE_LABELS[record.type] || record.type}</span></td>
            <td>${escapeHtml(record.description || '-')}</td>
            <td>${escapeHtml(record.vet || '-')}</td>
            <td>${escapeHtml(record.notes || '-')}</td>
            <td>
                <button class="btn-icon" onclick="openHealthModal('${record.id}')" title="Sửa">✏️</button>
                <button class="btn-icon" onclick="deleteHealthRecord('${record.id}')" title="Xóa">🗑️</button>
            </td>
        </tr>`;
    }).join('');
}

// ===== APPOINTMENTS =====
function openAppointmentModal(id) {
    document.getElementById('appointmentForm').reset();
    document.getElementById('appointmentId').value = '';
    populatePetSelects();

    if (id) {
        const appt = Store.get('appointments').find(a => a.id === id);
        if (appt) {
            document.getElementById('appointmentId').value = appt.id;
            document.getElementById('apptPet').value = appt.petId;
            document.getElementById('apptDate').value = appt.date;
            document.getElementById('apptTime').value = appt.time;
            document.getElementById('apptReason').value = appt.reason;
            document.getElementById('apptNotes').value = appt.notes || '';
            document.getElementById('appointmentModalTitle').textContent = 'Sửa Lịch Hẹn';
        }
    } else {
        document.getElementById('appointmentModalTitle').textContent = 'Tạo Lịch Hẹn';
    }
    openModal('appointmentModal');
}

function saveAppointment(e) {
    e.preventDefault();
    const appointments = Store.get('appointments');
    const id = document.getElementById('appointmentId').value;
    const apptData = {
        id: id || Store.generateId(),
        petId: document.getElementById('apptPet').value,
        date: document.getElementById('apptDate').value,
        time: document.getElementById('apptTime').value,
        reason: document.getElementById('apptReason').value,
        notes: document.getElementById('apptNotes').value,
        status: 'upcoming',
        createdAt: id ? (appointments.find(a => a.id === id)?.createdAt || new Date().toISOString()) : new Date().toISOString()
    };

    if (id) {
        const index = appointments.findIndex(a => a.id === id);
        apptData.status = appointments[index].status;
        appointments[index] = apptData;
        showToast('Cập nhật lịch hẹn thành công!');
    } else {
        appointments.push(apptData);
        showToast('Tạo lịch hẹn thành công!');
    }

    Store.set('appointments', appointments);
    closeModal('appointmentModal');
    renderAppointments();

    const pet = Store.get('pets').find(p => p.id === apptData.petId);
    addActivity(`${id ? 'Cập nhật' : 'Tạo'} lịch hẹn: ${pet ? pet.name : ''} - ${apptData.reason}`);
}

function updateAppointmentStatus(id, status) {
    const appointments = Store.get('appointments');
    const index = appointments.findIndex(a => a.id === id);
    if (index !== -1) {
        appointments[index].status = status;
        Store.set('appointments', appointments);
        showToast(`Lịch hẹn đã ${status === 'completed' ? 'hoàn thành' : 'hủy'}!`);
        renderAppointments();
    }
}

function deleteAppointment(id) {
    if (!confirm('Bạn có chắc muốn xóa lịch hẹn này?')) return;
    const appointments = Store.get('appointments').filter(a => a.id !== id);
    Store.set('appointments', appointments);
    showToast('Đã xóa lịch hẹn!', 'info');
    renderAppointments();
}

function renderAppointments(searchQuery) {
    let appointments = Store.get('appointments');
    const pets = Store.get('pets');
    const owners = Store.get('owners');
    const statusFilter = document.getElementById('filterApptStatus').value;

    if (statusFilter) appointments = appointments.filter(a => a.status === statusFilter);
    if (searchQuery) {
        appointments = appointments.filter(a => {
            const pet = pets.find(p => p.id === a.petId);
            return (pet && pet.name.toLowerCase().includes(searchQuery)) ||
                   a.reason.toLowerCase().includes(searchQuery);
        });
    }

    appointments.sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time));

    const tbody = document.getElementById('appointmentsList');
    if (appointments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">Chưa có lịch hẹn nào</td></tr>';
        return;
    }

    tbody.innerHTML = appointments.map(appt => {
        const pet = pets.find(p => p.id === appt.petId);
        const owner = pet ? owners.find(o => o.id === pet.ownerId) : null;
        const statusBadge = appt.status === 'upcoming' ? 'badge-info' :
                           appt.status === 'completed' ? 'badge-success' : 'badge-danger';
        const statusText = appt.status === 'upcoming' ? 'Sắp tới' :
                          appt.status === 'completed' ? 'Hoàn thành' : 'Đã hủy';

        return `<tr>
            <td>${formatDate(appt.date)} ${appt.time}</td>
            <td>${pet ? `${PET_ICONS[pet.type] || '🐾'} ${escapeHtml(pet.name)}` : 'N/A'}</td>
            <td>${owner ? escapeHtml(owner.name) : 'N/A'}</td>
            <td>${escapeHtml(appt.reason)}</td>
            <td><span class="badge ${statusBadge}">${statusText}</span></td>
            <td>
                ${appt.status === 'upcoming' ? `
                    <button class="btn-icon" onclick="updateAppointmentStatus('${appt.id}', 'completed')" title="Hoàn thành">✅</button>
                    <button class="btn-icon" onclick="updateAppointmentStatus('${appt.id}', 'cancelled')" title="Hủy">❌</button>
                ` : ''}
                <button class="btn-icon" onclick="openAppointmentModal('${appt.id}')" title="Sửa">✏️</button>
                <button class="btn-icon" onclick="deleteAppointment('${appt.id}')" title="Xóa">🗑️</button>
            </td>
        </tr>`;
    }).join('');
}

// ===== DASHBOARD =====
function renderDashboard() {
    const pets = Store.get('pets');
    const owners = Store.get('owners');
    const records = Store.get('healthRecords');
    const appointments = Store.get('appointments');
    const today = new Date().toISOString().split('T')[0];

    // Stats
    document.getElementById('totalPets').textContent = pets.length;
    document.getElementById('totalOwners').textContent = owners.length;
    document.getElementById('totalVaccinations').textContent = records.filter(r => r.type === 'vaccination').length;
    document.getElementById('upcomingAppointments').textContent = appointments.filter(a => a.status === 'upcoming').length;

    // Pet type chart
    const typeCounts = {};
    pets.forEach(p => {
        typeCounts[p.type] = (typeCounts[p.type] || 0) + 1;
    });
    const maxCount = Math.max(...Object.values(typeCounts), 1);
    const chartColors = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#8b5cf6', '#ec4899'];

    const chartContainer = document.getElementById('petTypeChart');
    if (Object.keys(typeCounts).length === 0) {
        chartContainer.innerHTML = '<p class="empty-state">Chưa có dữ liệu</p>';
    } else {
        chartContainer.innerHTML = Object.entries(typeCounts).map(([type, count], i) => `
            <div class="chart-bar">
                <span class="chart-bar-label">${PET_ICONS[type] || '🐾'} ${type}</span>
                <div class="chart-bar-track">
                    <div class="chart-bar-fill" style="width: ${(count / maxCount) * 100}%; background: ${chartColors[i % chartColors.length]}">${count}</div>
                </div>
            </div>
        `).join('');
    }

    // Recent activity
    const activities = Store.get('activities').slice(-10).reverse();
    const activityContainer = document.getElementById('recentActivity');
    if (activities.length === 0) {
        activityContainer.innerHTML = '<p class="empty-state">Chưa có hoạt động</p>';
    } else {
        activityContainer.innerHTML = activities.map(a => `
            <div class="activity-item">
                <span class="activity-icon">📝</span>
                <div>
                    <div class="activity-text">${escapeHtml(a.text)}</div>
                    <span class="activity-time">${formatDateTime(a.time)}</span>
                </div>
            </div>
        `).join('');
    }

    // Upcoming vaccinations
    const upcomingVax = records
        .filter(r => r.type === 'vaccination' && r.vaccineNextDate && r.vaccineNextDate >= today)
        .sort((a, b) => new Date(a.vaccineNextDate) - new Date(b.vaccineNextDate))
        .slice(0, 5);

    const vaxContainer = document.getElementById('upcomingVaccinations');
    if (upcomingVax.length === 0) {
        vaxContainer.innerHTML = '<p class="empty-state">Không có lịch tiêm nhắc</p>';
    } else {
        vaxContainer.innerHTML = upcomingVax.map(v => {
            const pet = pets.find(p => p.id === v.petId);
            return `<div class="upcoming-item">
                <strong>${pet ? escapeHtml(pet.name) : 'N/A'}</strong> - ${escapeHtml(v.vaccineName || 'Vắc-xin')}
                <br><span class="activity-time">Ngày nhắc: ${formatDate(v.vaccineNextDate)}</span>
            </div>`;
        }).join('');
    }

    // Today's appointments
    const todayAppts = appointments
        .filter(a => a.date === today && a.status === 'upcoming')
        .sort((a, b) => a.time.localeCompare(b.time));

    const todayContainer = document.getElementById('todayAppointments');
    if (todayAppts.length === 0) {
        todayContainer.innerHTML = '<p class="empty-state">Không có lịch hẹn hôm nay</p>';
    } else {
        todayContainer.innerHTML = todayAppts.map(a => {
            const pet = pets.find(p => p.id === a.petId);
            return `<div class="upcoming-item">
                <strong>${a.time}</strong> - ${pet ? escapeHtml(pet.name) : 'N/A'} - ${escapeHtml(a.reason)}
            </div>`;
        }).join('');
    }
}

// ===== Activity Log =====
function addActivity(text) {
    const activities = Store.get('activities');
    activities.push({ text, time: new Date().toISOString() });
    if (activities.length > 50) activities.shift();
    Store.set('activities', activities);
}

// ===== Utility Functions =====
function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatDateTime(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    renderDashboard();
    populatePetSelects();
    populateOwnerSelect();
});
