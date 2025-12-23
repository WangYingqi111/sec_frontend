import React from 'react';
import { Form, Input, InputNumber, Select, Radio, Button, DatePicker, Row, Col } from 'antd';
import dayjs from 'dayjs';

const { Option } = Select;

const FilterForm = ({ onSearch, loading }) => {
    const [form] = Form.useForm();

    const onFinish = (values) => {
        // 数据格式转换：Antd DatePicker 返回的是 dayjs 对象，需转字符串
        const formattedValues = {
            ...values,
            start_date: values.start_date.format('YYYY-MM-DD'),
            // 如果后端需要 revenue_growth_rate 是 0.2，这里保持原样；
            // 如果界面输入 20 代表 20%，这里可能需要除以 100。
            // 假设用户直接输入小数 0.2
        };
        onSearch(formattedValues);
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
                min_consecutive_periods: 3,
                condition: 'AND',
                period_type: 'season',
                revenue_growth_rate: 0.1, // 默认 10%
                profit_growth_rate: 0.1,
                start_date: dayjs().subtract(2, 'year') // 默认从2年前开始
            }}
        >
            <Form.Item label="开始日期" name="start_date" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item label="行业名称" name="industry_name">
                <Select mode="tags" placeholder="输入行业 (回车添加)" style={{ width: '100%' }}>
                    <Option value="银行">银行</Option>
                    <Option value="房地产开发">房地产开发</Option>
                    <Option value="白酒">白酒</Option>
                </Select>
            </Form.Item>

            <Row gutter={8}>
                <Col span={12}>
                    <Form.Item label="最小连续期数" name="min_consecutive_periods">
                        <InputNumber min={1} style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="周期类型" name="period_type">
                        <Radio.Group buttonStyle="solid">
                            <Radio.Button value="season">季报</Radio.Button>
                            <Radio.Button value="year">年报</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={8}>
                <Col span={12}>
                    <Form.Item label="营收增长率 (>)" name="revenue_growth_rate" tooltip="输入小数，例如 0.2 代表 20%">
                        <InputNumber step={0.01} style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="利润增长率 (>)" name="profit_growth_rate" tooltip="输入小数，例如 0.2 代表 20%">
                        <InputNumber step={0.01} style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item label="连接条件" name="condition">
                <Radio.Group>
                    <Radio value="AND">且 (AND)</Radio>
                    <Radio value="OR">或 (OR)</Radio>
                </Radio.Group>
            </Form.Item>

            <Button type="primary" htmlType="submit" loading={loading} block>
                开始筛选
            </Button>
        </Form>
    );
};

export default FilterForm;