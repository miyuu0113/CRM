// 顧客詳細機能

let companyId = null;
let company = null;

document.addEventListener('DOMContentLoaded', async () => {
    // URLからIDを取得
    const params = new URLSearchParams(window.location.search);
    companyId = params.get('id');

    if (!companyId) {
        alert('顧客IDが指定されていません');
        window.location.href = '/companies.html';
        return;
    }

    // 認証チェック
    const isAuth = await Auth.checkAuth();
    if (!isAuth) return;

    displayUserInfo();

    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', async () => {
        await Auth.logout();
    });

    if (Auth.isAdmin()) {
        const usersLink = document.getElementById('usersLink');
        if (usersLink) usersLink.style.display = 'flex';
    }

    // データ読み込み
    await loadCompanyDetails();
    await loadContacts();
    await loadAssignedUsers();
    await loadActivities();

    // 担当者追加ボタン
    const addContactBtn = document.getElementById('addContactBtn');
    addContactBtn.addEventListener('click', openContactModal);

    const contactModalClose = document.getElementById('contactModalClose');
    const contactCancelBtn = document.getElementById('contactCancelBtn');
    contactModalClose.addEventListener('click', closeContactModal);
    contactCancelBtn.addEventListener('click', closeContactModal);

    // フォーム送信
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', handleContactSubmit);
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

async function loadCompanyDetails() {
    try {
        company = await API.get(`/api/companies/${companyId}`);

        document.getElementById('companyName').textContent = company.company_name;

        const info = `
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                <div><strong>業種:</strong> ${company.industry || '-'}</div>
                <div><strong>電話:</strong> ${company.phone || '-'}</div>
                <div><strong>郵便番号:</strong> ${company.postal_code || '-'}</div>
                <div><strong>FAX:</strong> ${company.fax || '-'}</div>
                <div style="grid-column: 1 / -1;"><strong>住所:</strong> ${company.address || '-'}</div>
                <div style="grid-column: 1 / -1;"><strong>ウェブサイト:</strong> ${company.website ? `<a href="${company.website}" target="_blank">${company.website}</a>` : '-'}</div>
                ${company.notes ? `<div style="grid-column: 1 / -1;"><strong>備考:</strong> ${escapeHtml(company.notes)}</div>` : ''}
            </div>
        `;

        document.getElementById('companyInfo').innerHTML = info;
    } catch (error) {
        console.error('Failed to load company:', error);
        alert('顧客情報の読み込みに失敗しました');
    }
}

async function loadContacts() {
    try {
        const contacts = await API.get(`/api/companies/${companyId}/contacts`);

        const contactsList = document.getElementById('contactsList');

        if (contacts.length === 0) {
            contactsList.innerHTML = '<p style="color: #999;">登録された担当者がいません</p>';
            return;
        }

        contactsList.innerHTML = contacts.map(contact => `
            <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
                <div style="font-weight: 600;">${escapeHtml(contact.full_name)}</div>
                <div style="font-size: 13px; color: #666; margin-top: 5px;">
                    ${contact.department ? `${escapeHtml(contact.department)} ` : ''}
                    ${contact.position ? `${escapeHtml(contact.position)}` : ''}
                </div>
                ${contact.email ? `<div style="font-size: 13px; color: #666;">✉ ${escapeHtml(contact.email)}</div>` : ''}
                ${contact.phone ? `<div style="font-size: 13px; color: #666;">☎ ${escapeHtml(contact.phone)}</div>` : ''}
            </div>
        `).join('');
    } catch (error) {
        console.error('Failed to load contacts:', error);
    }
}

async function loadAssignedUsers() {
    try {
        const users = await API.get(`/api/companies/${companyId}/users`);

        const usersList = document.getElementById('usersList');

        if (users.length === 0) {
            usersList.innerHTML = '<p style="color: #999;">担当者が割り当てられていません</p>';
            return;
        }

        usersList.innerHTML = users.map(user => `
            <div style="border-bottom: 1px solid #eee; padding: 10px 0; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <div style="font-weight: 600;">${escapeHtml(user.full_name)}</div>
                    <div style="font-size: 13px; color: #666;">${escapeHtml(user.email)}</div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Failed to load assigned users:', error);
    }
}

function openContactModal() {
    document.getElementById('contactForm').reset();
    document.getElementById('contactModal').style.display = 'flex';
}

function closeContactModal() {
    document.getElementById('contactModal').style.display = 'none';
}

async function handleContactSubmit(e) {
    e.preventDefault();

    const formData = {
        company_id: companyId,
        full_name: document.getElementById('contactName').value,
        department: document.getElementById('department').value,
        position: document.getElementById('position').value,
        email: document.getElementById('contactEmail').value,
        phone: document.getElementById('contactPhone').value,
        mobile: document.getElementById('contactMobile').value,
        notes: document.getElementById('contactNotes').value
    };

    try {
        await API.post('/api/contacts', formData);
        alert('担当者を追加しました');
        closeContactModal();
        await loadContacts();
    } catch (error) {
        console.error('Failed to add contact:', error);
        alert('担当者の追加に失敗しました: ' + error.message);
    }
}

async function loadActivities() {
    try {
        const activities = await API.get(`/api/activities/company/${companyId}`);

        const activitiesList = document.getElementById('activitiesList');

        if (activities.length === 0) {
            activitiesList.innerHTML = '<p style="color: #999;">活動履歴がありません</p>';
            return;
        }

        const activityTypeMap = {
            'visit': '訪問',
            'call': '電話',
            'email': 'メール',
            'meeting': '会議',
            'other': 'その他'
        };

        activitiesList.innerHTML = activities.map(activity => `
            <div style="border-bottom: 1px solid #eee; padding: 15px 0;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span style="font-weight: 600; color: #667eea;">${activityTypeMap[activity.activity_type] || activity.activity_type}</span>
                    <span style="font-size: 13px; color: #999;">${new Date(activity.activity_date).toLocaleDateString('ja-JP')}</span>
                </div>
                <div style="font-weight: 600; margin-bottom: 5px;">${escapeHtml(activity.subject)}</div>
                ${activity.description ? `<div style="font-size: 14px; color: #666; margin-bottom: 5px;">${escapeHtml(activity.description)}</div>` : ''}
                <div style="font-size: 13px; color: #999;">担当: ${escapeHtml(activity.user_name)}</div>
                ${activity.next_action ? `<div style="margin-top: 10px; padding: 8px; background-color: #fff3cd; border-radius: 4px; font-size: 13px;">
                    <strong>次回アクション:</strong> ${escapeHtml(activity.next_action)}
                    ${activity.next_action_date ? ` (${new Date(activity.next_action_date).toLocaleDateString('ja-JP')})` : ''}
                </div>` : ''}
            </div>
        `).join('');
    } catch (error) {
        console.error('Failed to load activities:', error);
    }
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
