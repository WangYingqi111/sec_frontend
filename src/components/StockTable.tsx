import { Card, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { StockItem } from '../types/screener';
import { useMemo, useState } from 'react';

const { Text } = Typography;

interface Props {
    data: StockItem[];
    onSelect: (secCode: string) => void;
}

export default function StockTable({ data, onSelect }: Props) {
    const [activeKey, setActiveKey] = useState<string | null>(null);

    const columns: ColumnsType<StockItem> = useMemo(
        () => [
            {
                title: '代码',
                dataIndex: 'security_code',
                key: 'security_code',
                width: 120,
                render: (v: string) => <Text code>{v}</Text>,
            },
            {
                title: '名称',
                dataIndex: 'security_name',
                key: 'security_name',
                width: 160,
            },
            {
                title: '行业',
                dataIndex: 'industry',
                key: 'industry',
                ellipsis: true,
            },
        ],
        []
    );

    return (
        <Card
            size="small"
            style={{ marginBottom: 16 }}
            title={`筛选结果（${data?.length ?? 0}）`}
        >
            <Table<StockItem>
                rowKey={(r) => r.security_code}
                columns={columns}
                dataSource={data}
                size="middle"
                pagination={{ pageSize: 15, showSizeChanger: true }}
                rowClassName={(record) =>
                    record.security_code === activeKey ? 'row-active' : ''
                }
                onRow={(record) => ({
                    onClick: () => {
                        setActiveKey(record.security_code);
                        onSelect(record.security_code);
                    },
                })}
            />
        </Card>
    );
}
