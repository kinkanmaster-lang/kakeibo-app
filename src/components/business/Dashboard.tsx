import React, { useMemo } from 'react';
import type { Expense } from '../../types';
import { calculateSettlement, calculateTotalAmount } from '../../utils/calculations';
import { Wallet, Users } from 'lucide-react';

type DashboardProps = {
    expenses: Expense[];
    onToggleSettled: (id: string, isSettled: boolean) => void;
    selectedMonth?: string;
    availableMonths?: string[];
    onMonthChange?: (month: string) => void;
};

export const Dashboard: React.FC<DashboardProps> = ({ expenses, onToggleSettled, selectedMonth = 'all', availableMonths = [], onMonthChange }) => {
    // 割り勘の計算は常に全期間で行う
    const settlement = useMemo(() => calculateSettlement(expenses), [expenses]);

    // 合計支出額は選択された月で絞り込む
    const totalAmount = useMemo(() => {
        const filtered = selectedMonth === 'all' ? expenses : expenses.filter(e => e.date.startsWith(selectedMonth));
        return calculateTotalAmount(filtered);
    }, [expenses, selectedMonth]);

    return (
        <div className="flex" style={{ flexDirection: 'column', gap: '2rem' }}>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>

                <div className="card">
                    <div className="flex items-center justify-between" style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                        <div className="flex items-center" style={{ gap: '0.75rem' }}>
                            <Wallet size={20} />
                            <span style={{ fontWeight: 500 }}>
                                {selectedMonth === 'all' ? 'これまでの累計支出' : `${selectedMonth} の支出`}
                            </span>
                        </div>
                        {onMonthChange && availableMonths.length > 0 && (
                            <select
                                value={selectedMonth}
                                onChange={(e) => onMonthChange(e.target.value)}
                                style={{
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '4px',
                                    border: '1px solid #e2e8f0',
                                    fontSize: '0.875rem',
                                    backgroundColor: 'white',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="all">累計</option>
                                {availableMonths.map(m => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                        )}
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        ¥{totalAmount.toLocaleString()}
                    </div>
                </div>

                <div className="card" style={{ background: 'linear-gradient(135deg, var(--primary-light) 0%, #fff 100%)', border: '1px solid var(--primary-light)' }}>
                    <div className="flex items-center justify-between" style={{ marginBottom: '1rem' }}>
                        <div className="flex items-center" style={{ gap: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>
                            <Users size={20} />
                            <span>未精算サマリー</span>
                        </div>
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                        {settlement.whoPaysToWhom}
                    </div>
                    <div className="flex justify-between" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        <span>りょうすけ立替: ¥{settlement.ryosukeTotal.toLocaleString()}</span>
                        <span>まりん立替: ¥{settlement.marinTotal.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Unsettled List Preview (Full width on mobile, 1/2 on desktop) */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>未精算の項目リスト</h2>
                <div style={{ flex: 1, overflowY: 'auto', maxHeight: '350px' }}>
                    {expenses.filter(e => !e.isSettled).length > 0 ? (
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {expenses.filter(e => !e.isSettled).map(e => (
                                <li key={e.id} className="flex justify-between items-center" style={{ padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: 'var(--radius-md)' }}>
                                    <div>
                                        <div style={{ fontWeight: 500 }}>{e.itemName}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{e.date} / {e.category}</div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2" style={{ flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                                        <span style={{ fontWeight: 600 }}>¥{e.amount.toLocaleString()}</span>
                                        <div className="flex gap-2 items-center" style={{ fontSize: '0.75rem' }}>
                                            <span style={{
                                                padding: '0.125rem 0.5rem',
                                                borderRadius: '999px',
                                                backgroundColor: e.payer === 'りょうすけ' ? 'var(--primary-light)' : '#fce7f3',
                                                color: e.payer === 'りょうすけ' ? 'var(--primary)' : 'var(--marin-color)'
                                            }}>
                                                {e.payer}
                                            </span>
                                            <button
                                                className="btn btn-primary"
                                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', height: 'auto' }}
                                                onClick={() => onToggleSettled(e.id, true)}
                                            >
                                                精算済みにする
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="flex justify-center items-center" style={{ height: '200px', color: 'var(--text-muted)' }}>すべて精算済みです！🎉</div>
                    )}
                </div>
            </div>

        </div>
    );
};
