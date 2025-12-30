// pages/ScreenerPage.tsx
import { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import ScreenerForm from '../components/ScreenerForm';
import StockTable from '../components/StockTable';
import StockChart from '../components/StockChart';

export default function ScreenerPage() {
    const [stocks, setStocks] = useState([]);
    const [selected, setSelected] = useState(null);

    return (
        <MainLayout>
            <ScreenerForm onResult={setStocks} />
            <StockTable data={stocks} onSelect={setSelected} />
            {selected && <StockChart secCode={selected} />}
        </MainLayout>
    );
}
