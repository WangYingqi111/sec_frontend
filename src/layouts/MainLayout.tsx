// layouts/MainLayout.tsx
import { Layout } from 'antd';

export default function MainLayout({ children }) {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Layout.Header style={{ color: '#fff', fontSize: 18 }}>
                Stock Screener
            </Layout.Header>
            <Layout.Content style={{ padding: 24 }}>
                {children}
            </Layout.Content>
        </Layout>
    );
}
