import React, { useMemo, useState } from 'react';
import type { Expense } from '../../types';
import { calculateCategoryTotals, calculateMonthlyCategoryTotals } from '../../utils/calculations';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { PieChart as PieChartIcon, TrendingUp, List, Calendar } from 'lucide-react';

const COLORS = ['#f97316', '#14b8a6', '#8b5cf6', '#64748b', '#eab308'];

type AnalysisProps = {
    expenses: Expense[];
};

export const Analysis: React.FC<AnalysisProps> = ({ expenses }) => {
    // 選択月の状態（デフォルトは当月）
    const [selectedMonth, setSelectedMonth] = useState<string>(() => {
        const now = new Date();
        return `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}`;
    });

    const [sortOrder, setSortOrder] = useState<'date_desc' | 'amount_desc' | 'category'>('date_desc');

    // 選択可能な月のリストを抽出
    const availableMonths = useMemo(() => {
        const months = new Set<string>();
        const now = new Date();
        months.add(`${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}`);

        expenses.forEach(e => {
            const parts = e.date.split('/');
            if (parts.length >= 2) {
                months.add(`${parts[0]}/${parts[1]}`);
            }
        });
        return Array.from(months).sort().reverse();
    }, [expenses]);

    // 選択月でフィルタリングされたデータ
    const filteredExpenses = useMemo(() => {
        if (selectedMonth === 'all') return expenses;
        return expenses.filter(e => e.date.startsWith(selectedMonth));
    }, [expenses, selectedMonth]);

    // グラフ用の計算（円グラフは選択月のみ対象、棒グラフは常に全期間対象）
    const categoryTotals = useMemo(() => calculateCategoryTotals(filteredExpenses), [filteredExpenses]);
    const monthlyData = useMemo(() => calculateMonthlyCategoryTotals(expenses), [expenses]);

    // リストのソート処理
    const sortedExpenses = useMemo(() => {
        return [...filteredExpenses].sort((a, b) => {
            if (sortOrder === 'date_desc') {
                return b.date.localeCompare(a.date);
            } else if (sortOrder === 'amount_desc') {
                return b.amount - a.amount;
            } else if (sortOrder === 'category') {
                return a.category.localeCompare(b.category);
            }
            return 0;
        });
    }, [filteredExpenses, sortOrder]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '5rem' }}>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>支出の分析</h1>

            {/* Monthly Category Stacked Bar Chart */}
            <div className="card">
                <div className="flex items-center" style={{ gap: '0.75rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                    <TrendingUp size={20} style={{ color: 'var(--success)' }} />
                    <h2 style={{ fontSize: '1.25rem', margin: 0 }}>月別・カテゴリ推移</h2>
                </div>
                {/* Scrollable container for mobile */}
                <div style={{ width: '100%', overflowX: 'auto' }}>
                    <div style={{ height: '300px', minWidth: '500px', marginTop: '1rem' }}>
                        {monthlyData.data.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={monthlyData.data}
                                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                                    onClick={(state) => {
                                        if (state && state.activeLabel) {
                                            setSelectedMonth(String(state.activeLabel));
                                            // 円グラフやリストが見える位置までスクロールする
                                            window.scrollTo({ top: document.body.scrollHeight / 2, behavior: 'smooth' });
                                        }
                                    }}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(value) => `¥${value.toLocaleString()}`} width={70} />
                                    <RechartsTooltip
                                        formatter={(value: any) => `¥${Number(value || 0).toLocaleString()}`}
                                        cursor={{ fill: 'rgba(0,0,0,0.04)' }}
                                    />
                                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                    {monthlyData.categories.map((category, index) => (
                                        <Bar
                                            key={category}
                                            dataKey={category}
                                            stackId="a"
                                            fill={COLORS[index % COLORS.length]}
                                            radius={index === monthlyData.categories.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                                            maxBarSize={50}
                                        />
                                    ))}
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex justify-center items-center" style={{ height: '100%', color: 'var(--text-muted)' }}>データがありません</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Category Pie Chart & Month Selector */}
            <div className="card">
                <div className="flex items-center justify-between" style={{ marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div className="flex items-center" style={{ gap: '0.75rem', color: 'var(--text-primary)' }}>
                        <PieChartIcon size={20} style={{ color: 'var(--primary)' }} />
                        <h2 style={{ fontSize: '1.25rem', margin: 0 }}>カテゴリ割合</h2>
                    </div>
                    {availableMonths.length > 0 && (
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            style={{
                                padding: '0.25rem 0.5rem', borderRadius: '4px', border: '1px solid #e2e8f0',
                                fontSize: '0.875rem', backgroundColor: 'white', cursor: 'pointer'
                            }}
                        >
                            <option value="all">累計</option>
                            {availableMonths.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    )}
                </div>

                <div style={{ height: '300px', width: '100%' }}>
                    {categoryTotals.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart margin={{ top: 0, bottom: 20 }}>
                                <Pie
                                    data={categoryTotals}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={2}
                                    dataKey="value"
                                >
                                    {categoryTotals.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip formatter={(value: any) => `¥${Number(value || 0).toLocaleString()}`} />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex justify-center items-center" style={{ height: '100%', color: 'var(--text-muted)' }}>指定された月のデータがありません</div>
                    )}
                </div>
            </div>

            {/* Detailed Purchase List */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="flex items-center justify-between" style={{ marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div className="flex items-center" style={{ gap: '0.75rem', color: 'var(--text-primary)' }}>
                        <List size={20} style={{ color: 'var(--primary)' }} />
                        <h2 style={{ fontSize: '1.25rem', margin: 0 }}>購入内容リスト</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>並び替え:</span>
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value as any)}
                            style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '0.875rem', backgroundColor: 'white' }}
                        >
                            <option value="date_desc">日付順 (新しい順)</option>
                            <option value="amount_desc">金額順 (高い順)</option>
                            <option value="category">カテゴリ別</option>
                        </select>
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    {sortedExpenses.length > 0 ? (
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {sortedExpenses.map(e => (
                                <li key={e.id} className="flex justify-between items-center" style={{ padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: 'var(--radius-md)' }}>
                                    <div>
                                        <div style={{ fontWeight: 500 }}>{e.itemName}</div>
                                        <div className="flex items-center gap-2" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                                            <Calendar size={12} /> {e.date}
                                            <span style={{ display: 'inline-block', width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#cbd5e1' }} />
                                            {e.category}
                                        </div>
                                    </div>
                                    <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)' }}>
                                        ¥{e.amount.toLocaleString()}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="flex justify-center items-center" style={{ height: '100px', color: 'var(--text-muted)' }}>指定された月のデータがありません</div>
                    )}
                </div>
            </div>

        </div>
    );
};
