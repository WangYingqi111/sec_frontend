import { useEffect, useMemo, useRef, useState } from 'react';
import { Card, Row, Col, Statistic, Spin, Alert, Segmented, Typography } from 'antd';
import { fetchStockChart } from '../api/screener';
import type { PeriodType, StockChartResponse } from '../types/screener';

const { Text } = Typography;

interface Props {
    secCode: string;
}

function normalize(values: Array<number | null>) {
    const nums = values.map(v => (typeof v === 'number' ? v : null)).filter(v => v !== null) as number[];
    if (nums.length === 0) return { min: 0, max: 1 };
    const min = Math.min(...nums);
    const max = Math.max(...nums);
    return { min, max: max === min ? min + 1 : max };
}

function drawLineChart(
    canvas: HTMLCanvasElement,
    labels: string[],
    series: Array<number | null>,
    title: string
) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // clear
    ctx.clearRect(0, 0, w, h);

    // layout
    const padL = 48;
    const padR = 16;
    const padT = 28;
    const padB = 28;

    // title
    ctx.font = '14px system-ui';
    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    ctx.fillText(title, padL, 18);

    // axis
    ctx.strokeStyle = 'rgba(0,0,0,0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padL, padT);
    ctx.lineTo(padL, h - padB);
    ctx.lineTo(w - padR, h - padB);
    ctx.stroke();

    const { min, max } = normalize(series);
    const n = series.length;
    if (n <= 1) return;

    const x0 = padL;
    const y0 = h - padB;
    const x1 = w - padR;
    const y1 = padT;

    const xStep = (x1 - x0) / (n - 1);

    const getY = (v: number) => y0 - ((v - min) / (max - min)) * (y0 - y1);

    // grid (3 lines)
    ctx.strokeStyle = 'rgba(0,0,0,0.06)';
    for (let i = 1; i <= 3; i++) {
        const y = y0 - ((y0 - y1) * i) / 4;
        ctx.beginPath();
        ctx.moveTo(x0, y);
        ctx.lineTo(x1, y);
        ctx.stroke();
    }

    // y ticks
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.font = '12px system-ui';
    const tickTop = max;
    const tickMid = (min + max) / 2;
    const tickBot = min;

    ctx.fillText(String(Math.round(tickTop)), 6, y1 + 4);
    ctx.fillText(String(Math.round(tickMid)), 6, (y1 + y0) / 2 + 4);
    ctx.fillText(String(Math.round(tickBot)), 6, y0 + 4);

    // line
    ctx.strokeStyle = 'rgba(0,0,0,0.75)'; // 不指定颜色主题，仅用灰阶
    ctx.lineWidth = 2;
    ctx.beginPath();

    let started = false;
    series.forEach((v, i) => {
        if (typeof v !== 'number') return;
        const x = x0 + i * xStep;
        const y = getY(v);
        if (!started) {
            ctx.moveTo(x, y);
            started = true;
        } else {
            ctx.lineTo(x, y);
        }
    });

    ctx.stroke();

    // points
    ctx.fillStyle = 'rgba(0,0,0,0.75)';
    series.forEach((v, i) => {
        if (typeof v !== 'number') return;
        const x = x0 + i * xStep;
        const y = getY(v);
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
    });

    // x labels (show first/last)
    if (labels.length > 0) {
        ctx.fillStyle = 'rgba(0,0,0,0.55)';
        ctx.font = '12px system-ui';
        const first = labels[0];
        const last = labels[labels.length - 1];
        ctx.fillText(first, x0, h - 8);
        const lastWidth = ctx.measureText(last).width;
        ctx.fillText(last, x1 - lastWidth, h - 8);
    }
}

export default function StockChart({ secCode }: Props) {

    const [periodType, setPeriodType] = useState<PeriodType>('season');
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<StockChartResponse | null>(null);
    const revCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const profCanvasRef = useRef<HTMLCanvasElement | null>(null);

    const lastRevenue = useMemo(() => {
        const arr = data?.revenue ?? [];
        for (let i = arr.length - 1; i >= 0; i--) if (typeof arr[i] === 'number') return arr[i] as number;
        return null;
    }, [data]);

    const lastProfit = useMemo(() => {
        const arr = data?.profit ?? [];
        for (let i = arr.length - 1; i >= 0; i--) if (typeof arr[i] === 'number') return arr[i] as number;
        return null;
    }, [data]);

    useEffect(() => {
        let alive = true;

        async function run() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetchStockChart(secCode, periodType);
                if (!alive) return;
                setData(res);
            } catch (e: any) {
                if (!alive) return;
                setError(e?.message || '加载图表失败');
                setData(null);
            } finally {
                if (!alive) return;
                setLoading(false);
            }
        }

        run();
        return () => {
            alive = false;
        };
    }, [secCode, periodType]);

    useEffect(() => {
        if (!data) return;

        // 画图：固定尺寸，保证一致性
        const labels = data.dates ?? [];
        if (revCanvasRef.current) {
            revCanvasRef.current.width = 920;
            revCanvasRef.current.height = 240;
            drawLineChart(revCanvasRef.current, labels, data.revenue ?? [], '营收（TOTAL_OPERATE_INCOME）');
        }
        if (profCanvasRef.current) {
            profCanvasRef.current.width = 920;
            profCanvasRef.current.height = 240;
            drawLineChart(profCanvasRef.current, labels, data.profit ?? [], '归母净利（PARENT_NETPROFIT）');
        }
    }, [data]);

    return (
        <Card
            size="small"
            title={
                <Row align="middle" justify="space-between">
                    <Col>
                        <Text strong>图表</Text> <Text type="secondary">({secCode})</Text>
                    </Col>
                    <Col>
                        <Segmented
                            value={periodType}
                            options={[
                                { label: '季报', value: 'season' },
                                { label: '年报', value: 'year' },
                            ]}
                            onChange={(v) => setPeriodType(v as PeriodType)}
                        />
                    </Col>
                </Row>
            }
        >
            {error && (
                <Alert
                    type="error"
                    showIcon
                    message="图表加载失败"
                    description={error}
                    style={{ marginBottom: 12 }}
                />
            )}

            <Row gutter={16} style={{ marginBottom: 12 }}>
                <Col span={12}>
                    <Statistic
                        title="最新营收"
                        value={lastRevenue ?? undefined}
                        precision={0}
                    />
                </Col>
                <Col span={12}>
                    <Statistic
                        title="最新归母净利"
                        value={lastProfit ?? undefined}
                        precision={0}
                    />
                </Col>
            </Row>

            <Spin spinning={loading}>
                <div style={{ overflowX: 'auto' }}>
                    <canvas ref={revCanvasRef} style={{ width: '100%', maxWidth: 920, borderRadius: 8 }} />
                </div>
                <div style={{ height: 12 }} />
                <div style={{ overflowX: 'auto' }}>
                    <canvas ref={profCanvasRef} style={{ width: '100%', maxWidth: 920, borderRadius: 8 }} />
                </div>
            </Spin>
        </Card>
    );
}
