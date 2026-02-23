import React, { useState } from 'react';
import type { Expense } from '../../types';
import { v4 as uuidv4 } from 'uuid';

type AddExpenseFormProps = {
    onAdd: (expense: Expense) => Promise<void>;
};

export const AddExpenseForm: React.FC<AddExpenseFormProps> = ({ onAdd }) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [itemName, setItemName] = useState('');
    const [category, setCategory] = useState('食費');
    const [amount, setAmount] = useState('');
    const [payer, setPayer] = useState<'りょうすけ' | 'まりん'>('りょうすけ');
    const [isSettled, setIsSettled] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!itemName || !amount) return;

        setIsSubmitting(true);

        const newExpense: Expense = {
            id: uuidv4(), // Client generated
            date: date.replace(/-/g, '/'), // YYYY/MM/DD
            itemName,
            category,
            amount: parseInt(amount, 10),
            payer,
            isSettled
        };

        try {
            await onAdd(newExpense);
            // reset forms partially
            setItemName('');
            setAmount('');
        } catch (err) {
            console.error(err);
            alert('エラーが発生しました');
        } finally {
            setIsSubmitting(false);
        }
    };

    const categories = ['食費', '日用品', '住居・インフラ', '交際費', 'その他'];

    return (
        <div className="card">
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>新しく記録する</h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                <div className="form-row">
                    <div style={{ minWidth: 0 }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>日付</label>
                        <input
                            type="date"
                            required
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            style={{ boxSizing: 'border-box', width: '100%', maxWidth: '200px' }}
                        />
                    </div>

                    <div style={{ minWidth: 0 }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>カテゴリ</label>
                        <select value={category} onChange={e => setCategory(e.target.value)} className="w-full" style={{ boxSizing: 'border-box' }}>
                            {categories.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div style={{ minWidth: 0 }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>項目名</label>
                        <input
                            type="text"
                            required
                            placeholder="例: スーパー"
                            value={itemName}
                            onChange={e => setItemName(e.target.value)}
                            className="w-full"
                            style={{ boxSizing: 'border-box' }}
                        />
                    </div>

                    <div style={{ minWidth: 0 }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>金額 (¥)</label>
                        <input
                            type="number"
                            required
                            min="0"
                            placeholder="0"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            className="w-full"
                            style={{ boxSizing: 'border-box' }}
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>支払った人</label>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setPayer('りょうすけ')}
                                style={{
                                    padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)',
                                    border: `1px solid ${payer === 'りょうすけ' ? 'var(--ryosuke-color)' : '#d1d5db'}`,
                                    backgroundColor: payer === 'りょうすけ' ? 'var(--primary-light)' : 'transparent',
                                    color: payer === 'りょうすけ' ? 'var(--primary)' : 'var(--text-primary)',
                                    fontWeight: payer === 'りょうすけ' ? 600 : 400
                                }}
                            >りょうすけ</button>
                            <button
                                type="button"
                                onClick={() => setPayer('まりん')}
                                style={{
                                    padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)',
                                    border: `1px solid ${payer === 'まりん' ? 'var(--marin-color)' : '#d1d5db'}`,
                                    backgroundColor: payer === 'まりん' ? '#fce7f3' : 'transparent',
                                    color: payer === 'まりん' ? 'var(--marin-color)' : 'var(--text-primary)',
                                    fontWeight: payer === 'まりん' ? 600 : 400
                                }}
                            >まりん</button>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>精算状態</label>
                        <label className="flex items-center gap-2" style={{ cursor: 'pointer', padding: '0.5rem 0' }}>
                            <input
                                type="checkbox"
                                checked={isSettled}
                                onChange={e => setIsSettled(e.target.checked)}
                                style={{ width: '1.2rem', height: '1.2rem' }}
                            />
                            <span style={{ fontSize: '0.875rem' }}>もう精算した（割り勘済み）</span>
                        </label>
                    </div>
                </div>

                <div style={{ marginTop: '1rem' }}>
                    <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting} style={{ padding: '0.875rem', fontSize: '1rem' }}>
                        {isSubmitting ? '保存中...' : '登録する'}
                    </button>
                </div>
            </form>
        </div>
    );
};
