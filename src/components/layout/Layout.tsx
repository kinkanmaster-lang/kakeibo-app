import React from 'react';

type LayoutProps = {
    children: React.ReactNode;
};

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <header style={{
                backgroundColor: 'var(--surface-color)',
                padding: '1rem 2rem',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'sticky',
                top: 0,
                zIndex: 10
            }}>
                <div className="flex items-center gap-2">
                    {/* Logo Placeholder */}
                    <div style={{
                        width: '32px', height: '32px', borderRadius: '8px',
                        background: 'linear-gradient(135deg, var(--primary), #818cf8)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontWeight: 'bold'
                    }}>
                        K
                    </div>
                    <h1 style={{ fontSize: '1.25rem', letterSpacing: '-0.025em' }}>Kakeibo App</h1>
                </div>

                {/* Navigation - could be expanded later */}
                <nav className="flex gap-4">
                    {/* Menu items here */}
                </nav>
            </header>

            <main style={{
                flex: 1,
                width: '100%',
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '2rem 1rem'
            }}>
                {children}
            </main>

            <footer style={{
                padding: '2rem',
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontSize: '0.875rem'
            }}>
                &copy; {new Date().getFullYear()} Ryosuke & Marin Kakeibo.
            </footer>
        </div>
    );
};
