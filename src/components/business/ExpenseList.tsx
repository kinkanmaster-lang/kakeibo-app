import React from 'react';
import type { Expense } from '../../types';
import { Trash2 } from 'lucide-react';

type ExpenseListProps = {
    expenses: Expense[];
    isLoading: boolean;
    onDelete: (id: string) => void;
};

export const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, isLoading, onDelete }) => {
    return (
        <div className="card">
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>履歴一覧</h2>

            {isLoading ? (
                <div className="flex justify-center items-center" style={{ height: '200px', color: 'var(--text-muted)' }}>
                    読み込み中...
                </div>
            ) : expenses.length === 0 ? (
                <div className="flex justify-center items-center" style={{ height: '200px', color: 'var(--text-muted)' }}>
                    データがありません
                </div>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #e5e7eb', color: 'var(--text-secondary)' }}>
                                <th style={{ padding: '0.75rem', whiteSpace: 'nowrap' }}>日付</th>
                                <th style={{ padding: '0.75rem', whiteSpace: 'nowrap' }}>項目</th>
                                <th style={{ padding: '0.75rem', whiteSpace: 'nowrap' }}>カテゴリ</th>
                                <th style={{ padding: '0.75rem', whiteSpace: 'nowrap', textAlign: 'right' }}>金額</th>
                                <th style={{ padding: '0.75rem', whiteSpace: 'nowrap' }}>支払った人</th>
                                <th style={{ padding: '0.75rem', whiteSpace: 'nowrap', textAlign: 'center' }}>精算有無</th>
                                <th style={{ padding: '0.75rem', whiteSpace: 'nowrap', textAlign: 'center' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map(e => (
                                <tr key={e.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                    <td style={{ padding: '0.75rem', whiteSpace: 'nowrap' }}>{e.date}</td>
                                    <td style={{ padding: '0.75rem', minWidth: '150px' }}>{e.itemName}</td>
                                    <td style={{ padding: '0.75rem', whiteSpace: 'nowrap' }}>
                                        <span style={{
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '999px',
                                            backgroundColor: '#f3f4f6',
                                            color: 'var(--text-secondary)'
                                        }}>
                                            {e.category}
                                        </span>
                                    </td>
                                    <td style={{ padding: '0.75rem', whiteSpace: 'nowrap', textAlign: 'right', fontWeight: 600 }}>
                                        ¥{e.amount.toLocaleString()}
                                    </td>
                                    <td style={{ padding: '0.75rem', whiteSpace: 'nowrap' }}>
                                        <span style={{
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '999px',
                                            backgroundColor: e.payer === 'りょうすけ' ? 'var(--primary-light)' : '#fce7f3',
                                            color: e.payer === 'りょうすけ' ? 'var(--primary)' : 'var(--marin-color)',
                                            fontWeight: 500
                                        }}>
                                            {e.payer}
                                        </span>
                                    </td>
                                    <td style={{ padding: '0.75rem', whiteSpace: 'nowrap', textAlign: 'center' }}>
                                        {e.isSettled ? (
                                            <span style={{ color: 'var(--success)', fontWeight: 600 }}>済</span>
                                        ) : (
                                            <span style={{ color: 'var(--warning)', fontWeight: 600 }}>未</span>
                                        )}
                                    </td>
                                    <td style={{ padding: '0.75rem', whiteSpace: 'nowrap', textAlign: 'center' }}>
                                        <button
                                            onClick={() => onDelete(e.id)}
                                            style={{ color: 'var(--danger)', padding: '0.25rem', borderRadius: '4px' }}
                                            title="削除する"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
