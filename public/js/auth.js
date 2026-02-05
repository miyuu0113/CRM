// 認証管理ユーティリティ

const Auth = {
    currentUser: null,

    async login(username, password) {
        try {
            const user = await API.post('/api/auth/login', { username, password });
            this.currentUser = user;
            return user;
        } catch (error) {
            throw error;
        }
    },

    async logout() {
        try {
            await API.post('/api/auth/logout');
            this.currentUser = null;
            window.location.href = '/index.html';
        } catch (error) {
            console.error('Logout error:', error);
            window.location.href = '/index.html';
        }
    },

    async checkAuth() {
        try {
            const user = await API.get('/api/auth/me');
            this.currentUser = user;
            return true;
        } catch (error) {
            // 認証失敗時はログイン画面へ（index.html以外）
            if (window.location.pathname !== '/index.html' && window.location.pathname !== '/') {
                window.location.href = '/index.html';
            }
            return false;
        }
    },

    isAdmin() {
        return this.currentUser && this.currentUser.role === 'admin';
    },

    isAuthenticated() {
        return this.currentUser !== null;
    }
};
