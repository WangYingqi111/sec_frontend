import React from 'react';
import { List, Tag } from 'antd';

const StockList = ({ data, onSelect, selectedCode }) => {
    return (
        <List
            itemLayout="horizontal"
            dataSource={data}
            style={{ maxHeight: 'calc(100vh - 450px)', overflowY: 'auto' }}
            renderItem={(item) => (
                <List.Item
                    onClick={() => onSelect(item)}
                    style={{
                        cursor: 'pointer',
                        padding: '10px',
                        backgroundColor: selectedCode === item.security_code ? '#e6f7ff' : 'transparent',
                        transition: 'all 0.3s'
                    }}
                >
                    <List.Item.Meta
                        title={<span>{item.security_name} <small style={{ color: '#999' }}>{item.security_code}</small></span>}
                        description={<Tag color="blue">{item.industry}</Tag>}
                    />
                </List.Item>
            )}
        />
    );
};

export default StockList;