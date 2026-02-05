// API通信ユーティリティ

const API = {
    async request(url, options = {}) {
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include' // セッションCookie送信
        };

        try {
            const response = await fetch(url, { ...defaultOptions, ...options });

            if (!response.ok) {
                if (response.status === 401 && window.location.pathname !== '/index.html' && window.location.pathname !== '/') {
                    // 未認証の場合はログイン画面へ
                    window.location.href = '/index.html';
                    throw new Error('認証が必要です');
                }

                const error = await response.json().catch(() => ({ error: '不明なエラーが発生しました' }));
                throw new Error(error.error || 'リクエストに失敗しました');
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    get(url) {
        return this.request(url);
    },

    post(url, data) {
        return this.request(url, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    put(url, data) {
        return this.request(url, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    delete(url) {
        return this.request(url, {
            method: 'DELETE'
        });
    }
};
