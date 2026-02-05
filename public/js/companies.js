// 顧客一覧機能

let companies = [];
let editingCompanyId = null;

document.addEventListener('DOMContentLoaded', async () => {
    // 認証チェック
    const isAuth = await Auth.checkAuth();
    if (!isAuth) {
        return;
    }

    // ユーザー情報を表示
    displayUserInfo();

    // ログアウトボタンイベント
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await Auth.logout();
        });
    }

    // 管理者の場合、ユーザー管理リンクを表示
    if (Auth.isAdmin()) {
        const usersLink = document.getElementById('usersLink');
        if (usersLink) {
            usersLink.style.display = 'flex';
        }
    }

    // 顧客一覧を読み込み
    await loadCompanies();

    // 検索機能
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', filterCompanies);

    // 新規登録ボタン
    const addCompanyBtn = document.getElementById('addCompanyBtn');
    addCompanyBtn.addEventListener('click', openAddModal);

    // モーダルクローズ
    const modalClose = document.getElementById('modalClose');
    const cancelBtn = document.getElementById('cancelBtn');
    modalClose.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    // モーダル外クリックで閉じる
    const modal = document.getElementById('companyModal');
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // フォーム送信
    const companyForm = document.getElementById('companyForm');
    companyForm.addEventListener('submit', handleFormSubmit);
});

function displayUserInfo() {
    if (!Auth.currentUser) return;

    const userFullName = document.getElementById('userFullName');
    const userRole = document.getElementById('userRole');

    if (userFullName) {
        userFullName.textContent = Auth.currentUser.full_name;
    }

    if (userRole) {
        userRole.textContent = Auth.currentUser.role === 'admin' ? '管理者' : '一般ユーザー';
    }
}

async function loadCompanies() {
    try {
        companies = await API.get('/api/companies');
        displayCompanies(companies);
    } catch (error) {
        console.error('Failed to load companies:', error);
        alert('顧客一覧の読み込みに失敗しました');
    }
}

function displayCompanies(data) {
    const tbody = document.getElementById('companiesTableBody');

    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">登録された顧客がありません</td></tr>';
        return;
    }

    tbody.innerHTML = data.map(company => `
        <tr>
            <td><a href="/company-detail.html?id=${company.id}" style="color: #667eea; text-decoration: none;">${escapeHtml(company.company_name)}</a></td>
            <td>${escapeHtml(company.industry || '-')}</td>
            <td>${escapeHtml(company.phone || '-')}</td>
            <td>${escapeHtml(company.assigned_users || '-')}</td>
            <td>
                <button class="btn-action" onclick="viewCompany(${company.id})">詳細</button>
                <button class="btn-action" onclick="editCompany(${company.id})">編集</button>
                ${Auth.isAdmin() ? `<button class="btn-action btn-danger" onclick="deleteCompany(${company.id})">削除</button>` : ''}
            </td>
        </tr>
    `).join('');
}

function filterCompanies() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filtered = companies.filter(company =>
        company.company_name.toLowerCase().includes(searchTerm)
    );
    displayCompanies(filtered);
}

function openAddModal() {
    editingCompanyId = null;
    document.getElementById('modalTitle').textContent = '新規法人登録';
    document.getElementById('companyForm').reset();
    document.getElementById('companyId').value = '';
    document.getElementById('companyModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('companyModal').style.display = 'none';
    editingCompanyId = null;
}

async function editCompany(id) {
    try {
        const company = await API.get(`/api/companies/${id}`);
        editingCompanyId = id;

        document.getElementById('modalTitle').textContent = '法人情報編集';
        document.getElementById('companyId').value = company.id;
        document.getElementById('companyName').value = company.company_name;
        document.getElementById('industry').value = company.industry || '';
        document.getElementById('postalCode').value = company.postal_code || '';
        document.getElementById('address').value = company.address || '';
        document.getElementById('phone').value = company.phone || '';
        document.getElementById('fax').value = company.fax || '';
        document.getElementById('website').value = company.website || '';
        document.getElementById('notes').value = company.notes || '';

        document.getElementById('companyModal').style.display = 'flex';
    } catch (error) {
        console.error('Failed to load company:', error);
        alert('顧客情報の読み込みに失敗しました');
    }
}

async function handleFormSubmit(e) {
    e.preventDefault();

    const formData = {
        company_name: document.getElementById('companyName').value,
        industry: document.getElementById('industry').value,
        postal_code: document.getElementById('postalCode').value,
        address: document.getElementById('address').value,
        phone: document.getElementById('phone').value,
        fax: document.getElementById('fax').value,
        website: document.getElementById('website').value,
        notes: document.getElementById('notes').value
    };

    try {
        if (editingCompanyId) {
            // 更新
            await API.put(`/api/companies/${editingCompanyId}`, formData);
            alert('顧客情報を更新しました');
        } else {
            // 新規作成
            await API.post('/api/companies', formData);
            alert('顧客を登録しました');
        }

        closeModal();
        await loadCompanies();
    } catch (error) {
        console.error('Failed to save company:', error);
        alert('保存に失敗しました: ' + error.message);
    }
}

async function deleteCompany(id) {
    if (!confirm('この顧客を削除してもよろしいですか？\n関連する担当者や活動ログも削除されます。')) {
        return;
    }

    try {
        await API.delete(`/api/companies/${id}`);
        alert('顧客を削除しました');
        await loadCompanies();
    } catch (error) {
        console.error('Failed to delete company:', error);
        alert('削除に失敗しました: ' + error.message);
    }
}

function viewCompany(id) {
    window.location.href = `/company-detail.html?id=${id}`;
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
