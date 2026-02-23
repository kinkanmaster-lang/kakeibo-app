import React, { useMemo } from 'react';
import type { Expense } from '../../types';
import { calculateCategoryTotals, calculateMonthlyCategoryTotals } from '../../utils/calculations';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { PieChart as PieChartIcon, TrendingUp } from 'lucide-react';

const COLORS = ['#f97316', '#14b8a6', '#8b5cf6', '#64748b', '#eab308'];

type AnalysisProps = {
    expenses: Expense[];
};

export const Analysis: React.FC<AnalysisProps> = ({ expenses }) => {
    const categoryTotals = useMemo(() => calculateCategoryTotals(expenses), [expenses]);
    const monthlyData = useMemo(() => calculateMonthlyCategoryTotals(expenses), [expenses]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '5rem' }}>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>支出の分析</h1>

            {/* Category Pie Chart */}
            <div className="card">
                <div className="flex items-center" style={{ gap: '0.75rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                    <PieChartIcon size={20} style={{ color: 'var(--primary)' }} />
                    <h2 style={{ fontSize: '1.25rem', margin: 0 }}>全期間のカテゴリ割合</h2>
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
                        <div className="flex justify-center items-center" style={{ height: '100%', color: 'var(--text-muted)' }}>データがありません</div>
                    )}
                </div>
            </div>

            {/* Monthly Category Stacked Bar Chart */}
            <div className="card">
                <div className="flex items-center" style={{ gap: '0.75rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                    <TrendingUp size={20} style={{ color: 'var(--success)' }} />
                    <h2 style={{ fontSize: '1.25rem', margin: 0 }}>月別・カテゴリ推移</h2>
                </div>
                {/* Scrollable container for mobile to prevent squishing */}
                <div style={{ width: '100%', overflowX: 'auto' }}>
                    <div style={{ height: '350px', minWidth: '500px', marginTop: '1rem' }}>
                        {monthlyData.data.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyData.data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
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

        </div>
    );
};
