// ダッシュボード機能

document.addEventListener('DOMContentLoaded', async () => {
    // 認証チェック
    const isAuth = await Auth.checkAuth();
    if (!isAuth) {
        return; // checkAuth内でログイン画面にリダイレクトされる
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
});

function displayUserInfo() {
    if (!Auth.currentUser) return;

    const userFullName = document.getElementById('userFullName');
    const userRole = document.getElementById('userRole');
    const welcomeUserName = document.getElementById('welcomeUserName');

    if (userFullName) {
        userFullName.textContent = Auth.currentUser.full_name;
    }

    if (userRole) {
        userRole.textContent = Auth.currentUser.role === 'admin' ? '管理者' : '一般ユーザー';
    }

    if (welcomeUserName) {
        welcomeUserName.textContent = Auth.currentUser.full_name;
    }
}
