import React, { useState } from 'react';
import { Lock } from 'lucide-react';

type LoginProps = {
    onLogin: () => void;
};

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const correctPassword = import.meta.env.VITE_APP_PASSWORD;
        // 環境変数にパスワードが設定されていない場合はスルー（開発用）
        if (!correctPassword || password === correctPassword) {
            localStorage.setItem('kakeibo_password', password);
            onLogin();
        } else {
            setError(true);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 100%)',
            padding: '1rem'
        }}>
            <div className="card" style={{ maxWidth: '400px', width: '100%', padding: '2.5rem 2rem', textAlign: 'center' }}>
                <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    color: 'var(--primary)'
                }}>
                    <Lock size={32} />
                </div>

                <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                    家計簿にログイン
                </h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.875rem' }}>
                    アクセスするには合言葉を入力してください
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <input
                            type="password"
                            placeholder="合言葉（パスワード）"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError(false);
                            }}
                            className="input-field"
                            style={{
                                width: '100%',
                                padding: '0.875rem',
                                border: error ? '2px solid #ef4444' : '1px solid #e2e8f0',
                                outline: 'none'
                            }}
                            autoFocus
                        />
                        {error && (
                            <div style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.5rem', textAlign: 'left' }}>
                                パスワードが間違っています
                            </div>
                        )}
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.875rem', fontSize: '1rem' }}>
                        ログインする
                    </button>
                </form>
            </div>
        </div>
    );
};
