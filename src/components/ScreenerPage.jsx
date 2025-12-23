import React, { useState } from 'react';
import { Layout, Card, message } from 'antd';
import FilterForm from './FilterForm';
import StockList from './StockList';
import StockChart from './StockChart';
import request from '../api/request';

const { Sider, Content } = Layout;

const ScreenerPage = () => {
    const [stockList, setStockList] = useState([]);
    const [selectedStock, setSelectedStock] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchParams, setSearchParams] = useState(null); // 保存当前的查询条件(周期类型等)用于绘图

    // 处理筛选查询
    const handleSearch = async (values) => {
        setLoading(true);
        setStockList([]);
        setSelectedStock(null);

        try {
            // 保存一下当前的周期类型，因为右侧绘图也需要知道是年报还是季报
            setSearchParams({ period_type: values.period_type });

            // 发送请求给后端
            const res = await request.post('/api/stock_screener/list', values);

            if (res.stocks && res.stocks.length > 0) {
                setStockList(res.stocks);
                message.success(`Found ${res.count} stocks`);
            } else {
                message.warning('No stocks found matching criteria');
            }
        } catch (error) {
            message.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout style={{ height: '100vh', padding: '10px' }}>
            {/* 左侧：筛选器 + 列表 */}
            <Sider width={400} theme="light" style={{ padding: '10px', overflow: 'auto', borderRight: '1px solid #ddd' }}>
                <h3>股票筛选器 (Stock Screener)</h3>
                <FilterForm onSearch={handleSearch} loading={loading} />
                <div style={{ marginTop: '20px' }}>
                    <h4>筛选结果 ({stockList.length})</h4>
                    <StockList
                        data={stockList}
                        onSelect={setSelectedStock}
                        selectedCode={selectedStock?.security_code}
                    />
                </div>
            </Sider>

            {/* 右侧：图表展示 */}
            <Content style={{ padding: '20px', backgroundColor: '#fff' }}>
                {selectedStock ? (
                    <div style={{ height: '100%' }}>
                        <h2>{selectedStock.security_name} ({selectedStock.security_code})</h2>
                        <p>行业: {selectedStock.industry}</p>
                        <div style={{ height: '500px', marginTop: '20px' }}>
                            <StockChart
                                secCode={selectedStock.security_code}
                                periodType={searchParams?.period_type || 'season'}
                            />
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#999' }}>
                        请在左侧筛选并点击一只股票查看详情
                    </div>
                )}
            </Content>
        </Layout>
    );
};

export default ScreenerPage;