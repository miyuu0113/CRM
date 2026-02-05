// ユーザー管理機能

let users = [];
let editingUserId = null;

document.addEventListener('DOMContentLoaded', async () => {
    // 認証チェック
    const isAuth = await Auth.checkAuth();
    if (!isAuth) return;

    // 管理者でない場合はアクセス拒否
    if (!Auth.isAdmin()) {
        alert('この機能は管理者のみアクセスできます');
        window.location.href = '/dashboard.html';
        return;
    }

    displayUserInfo();

    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', async () => {
        await Auth.logout();
    });

    // ユーザー一覧を読み込み
    await loadUsers();

    // 新規登録ボタン
    const addUserBtn = document.getElementById('addUserBtn');
    addUserBtn.addEventListener('click', openAddModal);

    // モーダルクローズ
    const modalClose = document.getElementById('modalClose');
    const cancelBtn = document.getElementById('cancelBtn');
    modalClose.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    // モーダル外クリックで閉じる
    const modal = document.getElementById('userModal');
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // フォーム送信
    const userForm = document.getElementById('userForm');
    userForm.addEventListener('submit', handleFormSubmit);
});

function displayUserInfo() {
    if (!Auth.currentUser) return;

    const userFullName = document.getElementById('userFullName');
    const userRole = document.getElementById('userRole');

    if (userFullName) {
        userFullName.textContent = Auth.currentUser.full_name;
    }

    if (userRole) {
        userRole.textContent = '管理者';
    }
}

async function loadUsers() {
    try {
        users = await API.get('/api/users');
        displayUsers(users);
    } catch (error) {
        console.error('Failed to load users:', error);
        alert('ユーザー一覧の読み込みに失敗しました');
    }
}

function displayUsers(data) {
    const tbody = document.getElementById('usersTableBody');

    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">登録されたユーザーがいません</td></tr>';
        return;
    }

    tbody.innerHTML = data.map(user => `
        <tr>
            <td>${escapeHtml(user.username)}</td>
            <td>${escapeHtml(user.full_name)}</td>
            <td>${escapeHtml(user.email)}</td>
            <td>${user.role === 'admin' ? '管理者' : '一般ユーザー'}</td>
            <td>
                <button class="btn-action" onclick="editUser(${user.id})">編集</button>
                ${user.id !== Auth.currentUser.id ? `<button class="btn-action btn-danger" onclick="deleteUser(${user.id})">削除</button>` : ''}
            </td>
        </tr>
    `).join('');
}

function openAddModal() {
    editingUserId = null;
    document.getElementById('modalTitle').textContent = '新規ユーザー登録';
    document.getElementById('userForm').reset();
    document.getElementById('userId').value = '';
    document.getElementById('password').required = true;
    document.getElementById('passwordRequired').style.display = 'inline';
    document.getElementById('userModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('userModal').style.display = 'none';
    editingUserId = null;
}

async function editUser(id) {
    try {
        const user = await API.get(`/api/users/${id}`);
        editingUserId = id;

        document.getElementById('modalTitle').textContent = 'ユーザー情報編集';
        document.getElementById('userId').value = user.id;
        document.getElementById('username').value = user.username;
        document.getElementById('fullName').value = user.full_name;
        document.getElementById('email').value = user.email;
        document.getElementById('role').value = user.role;
        document.getElementById('password').value = '';
        document.getElementById('password').required = false;
        document.getElementById('passwordRequired').style.display = 'none';

        document.getElementById('userModal').style.display = 'flex';
    } catch (error) {
        console.error('Failed to load user:', error);
        alert('ユーザー情報の読み込みに失敗しました');
    }
}

async function handleFormSubmit(e) {
    e.preventDefault();

    const formData = {
        username: document.getElementById('username').value,
        full_name: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        role: document.getElementById('role').value,
        password: document.getElementById('password').value
    };

    // 編集時、パスワードが空なら削除
    if (editingUserId && !formData.password) {
        delete formData.password;
    }

    try {
        if (editingUserId) {
            // 更新
            await API.put(`/api/users/${editingUserId}`, formData);
            alert('ユーザー情報を更新しました');
        } else {
            // 新規作成
            if (!formData.password) {
                alert('パスワードを入力してください');
                return;
            }
            await API.post('/api/users', formData);
            alert('ユーザーを登録しました');
        }

        closeModal();
        await loadUsers();
    } catch (error) {
        console.error('Failed to save user:', error);
        alert('保存に失敗しました: ' + error.message);
    }
}

async function deleteUser(id) {
    if (!confirm('このユーザーを削除してもよろしいですか？')) {
        return;
    }

    try {
        await API.delete(`/api/users/${id}`);
        alert('ユーザーを削除しました');
        await loadUsers();
    } catch (error) {
        console.error('Failed to delete user:', error);
        alert('削除に失敗しました: ' + error.message);
    }
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
