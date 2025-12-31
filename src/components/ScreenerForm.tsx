import { Button, Card, Form, InputNumber, Select, DatePicker, Space } from 'antd';
import type { ScreenerRequest } from '../types/screener';
import { fetchScreenerList } from '../api/screener';
import dayjs from 'dayjs';

interface Props {
    onResult: (stocks: any[]) => void;
}

const { Option } = Select;

export default function ScreenerForm({ onResult }: Props) {
    const [form] = Form.useForm < ScreenerRequest > ();

    const onFinish = async (values: any) => {
        const payload = {
            ...values,
            start_date: values.start_date?.format?.('YYYY-MM-DD') ?? values.start_date,
        };
        const res = await fetchScreenerList(payload);
        onResult(res.stocks);
    };


    return (
        <Card size="small" style={{ marginBottom: 16 }}>
            <Form
                form={form}
                layout="inline"
                initialValues={{
                    start_date: dayjs().subtract(3, 'year'),
                    min_consecutive_periods: 3,
                    revenue_growth_rate: 0.2,
                    profit_growth_rate: 0.2,
                    condition: 'AND',
                    period_type: 'season',
                }}
                onFinish={onFinish}
            >
                <Form.Item
                    label="起始日期"
                    name="start_date"
                    rules={[{ required: true }]}
                >
                    <DatePicker format="YYYY-MM-DD" />
                </Form.Item>

                <Form.Item
                    label="连续期数"
                    name="min_consecutive_periods"
                    rules={[{ required: true }]}
                >
                    <InputNumber min={1} />
                </Form.Item>

                <Form.Item label="营收增长率" name="revenue_growth_rate">
                    <InputNumber step={0.05} min={0} />
                </Form.Item>

                <Form.Item label="利润增长率" name="profit_growth_rate">
                    <InputNumber step={0.05} min={0} />
                </Form.Item>

                <Form.Item label="条件" name="condition">
                    <Select style={{ width: 80 }}>
                        <Option value="AND">AND</Option>
                        <Option value="OR">OR</Option>
                    </Select>
                </Form.Item>

                <Form.Item label="周期" name="period_type">
                    <Select style={{ width: 90 }}>
                        <Option value="season">季报</Option>
                        <Option value="year">年报</Option>
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            筛选
                        </Button>
                        <Button
                            onClick={() => {
                                form.resetFields();
                            }}
                        >
                            重置
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Card>
    );
}
