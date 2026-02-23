import type { Expense } from '../types';

// GASのWebアプリURLは環境変数から取得
const GAS_URL = import.meta.env.VITE_GAS_WEB_URL;

export const fetchExpenses = async (): Promise<Expense[]> => {
    if (!GAS_URL) throw new Error('GASのWebアプリURLが設定されていません(.envファイルを確認してください)');

    // GASへのリクエストはGETで action 指定
    const response = await fetch(`${GAS_URL}?action=getExpenses`);
    const result = await response.json();

    if (!result.success) throw new Error(result.message || 'データ取得に失敗しました');

    return result.data as Expense[];
};

export const addExpense = async (expense: Omit<Expense, 'id'> & { id?: string }): Promise<Expense> => {
    if (!GAS_URL) throw new Error('GASのWebアプリURLが設定されていません');

    // idが未指定の場合はクライアント側で生成する前提だが、ここではそのまま送信
    const response = await fetch(GAS_URL, {
        method: 'POST',
        // GASのdoPostで受け取りやすいように text/plain で送信 (CORS回避のためよく使われる手法)
        headers: {
            'Content-Type': 'text/plain',
        },
        body: JSON.stringify({ action: 'addExpense', data: expense })
    });

    const result = await response.json();
    if (!result.success) throw new Error(result.message || '新規登録に失敗しました');

    return result.data as Expense;
};

export const toggleSettled = async (id: string, isSettled: boolean): Promise<boolean> => {
    if (!GAS_URL) throw new Error('GASのWebアプリURLが設定されていません');

    const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain',
        },
        body: JSON.stringify({ action: 'toggleSettled', id, isSettled })
    });

    const result = await response.json();
    if (!result.success) throw new Error(result.message || '精算状態の更新に失敗しました');

    return true;
};

export const deleteExpense = async (id: string): Promise<boolean> => {
    if (!GAS_URL) throw new Error('GASのWebアプリURLが設定されていません');

    const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain',
        },
        body: JSON.stringify({ action: 'deleteExpense', id })
    });

    const result = await response.json();
    if (!result.success) throw new Error(result.message || 'データの削除に失敗しました');

    return true;
};
