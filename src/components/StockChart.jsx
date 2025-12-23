import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import request from '../api/request';
import { Spin, Empty } from 'antd';

const StockChart = ({ secCode, periodType }) => {
    const [chartOption, setChartOption] = useState({});
    const [loading, setLoading] = useState(false);
    const [hasData, setHasData] = useState(true);

    useEffect(() => {
        if (!secCode) return;
        fetchData();
    }, [secCode, periodType]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // 假设我们之前设计的 API 路径是 /api/stock_screener/chart/{sec_code}?period_type=...
            // 注意：我们在 main.py 里写的 router prefix 是 /api/stock_screener
            // 并且在 screener_api.py 里定义了 @router.get("/chart/{sec_code}")
            const res = await request.get(`/api/stock_screener/chart/${secCode}`, {
                params: { period_type: periodType }
            });

            const data = res.data || [];

            if (data.length === 0) {
                setHasData(false);
            } else {
                setHasData(true);
                composeChart(data);
            }
        } catch (error) {
            console.error(error);
            setHasData(false);
        } finally {
            setLoading(false);
        }
    };

    const composeChart = (data) => {
        // 提取轴数据
        const dates = data.map(item => item.report_date);
        const revenue = data.map(item => item.revenue);
        const profit = data.map(item => item.net_profit);
        const revGrowth = data.map(item => item.revenue_growth);
        const profitGrowth = data.map(item => item.profit_growth);

        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'cross' }
            },
            legend: {
                data: ['营收', '净利润', '营收增长率%', '利润增长率%']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: dates,
                    axisPointer: { type: 'shadow' }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '金额',
                    axisLabel: {
                        formatter: (value) => {
                            // 简单格式化：亿
                            return (value / 100000000).toFixed(1) + '亿';
                        }
                    }
                },
                {
                    type: 'value',
                    name: '增长率',
                    axisLabel: {
                        formatter: '{value} %'
                    },
                    splitLine: { show: false } // 隐藏右轴网格线，防止乱
                }
            ],
            series: [
                {
                    name: '营收',
                    type: 'bar',
                    data: revenue,
                    yAxisIndex: 0,
                    itemStyle: { color: '#5470C6' }
                },
                {
                    name: '净利润',
                    type: 'bar',
                    data: profit,
                    yAxisIndex: 0,
                    itemStyle: { color: '#91CC75' }
                },
                {
                    name: '营收增长率%',
                    type: 'line',
                    yAxisIndex: 1,
                    data: revGrowth,
                    itemStyle: { color: '#EE6666' }
                },
                {
                    name: '利润增长率%',
                    type: 'line',
                    yAxisIndex: 1,
                    data: profitGrowth,
                    itemStyle: { color: '#FAC858' }
                }
            ]
        };
        setChartOption(option);
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;
    if (!hasData) return <Empty description="暂无数据" />;

    return <ReactECharts option={chartOption} style={{ height: '100%', width: '100%' }} />;
};

export default StockChart;