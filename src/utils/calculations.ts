import type { Expense } from '../types';

/**
 * 精算サマリーの計算
 * - 未精算（isSettled === false）のものだけを対象にして、
 *   りょうすけ・まりんのそれぞれの支払額合計を出し、どちらがいくら支払うべきかを計算します。
 */
export const calculateSettlement = (expenses: Expense[]) => {
    const unsettled = expenses.filter(e => !e.isSettled);

    let ryosukeTotal = 0;
    let marinTotal = 0;

    unsettled.forEach(e => {
        if (e.payer === 'りょうすけ') {
            ryosukeTotal += e.amount;
        } else if (e.payer === 'まりん') {
            marinTotal += e.amount;
        }
    });

    const diff = ryosukeTotal - marinTotal;
    const settlementAmount = Math.abs(diff) / 2;

    let whoPaysToWhom = '';
    if (diff > 0) {
        whoPaysToWhom = `まりん が りょうすけ に ¥${Math.floor(settlementAmount).toLocaleString()} 支払う`;
    } else if (diff < 0) {
        whoPaysToWhom = `りょうすけ が まりん に ¥${Math.floor(settlementAmount).toLocaleString()} 支払う`;
    } else {
        whoPaysToWhom = '精算不要（ぴったりです！）';
    }

    return {
        ryosukeTotal,
        marinTotal,
        settlementAmount: Math.floor(settlementAmount),
        whoPaysToWhom
    };
};

/**
 * カテゴリ別の集計（全データまたは月などのフィルタ後データから）
 */
export const calculateCategoryTotals = (expenses: Expense[]) => {
    const totals: Record<string, number> = {};

    expenses.forEach(e => {
        if (!totals[e.category]) {
            totals[e.category] = 0;
        }
        totals[e.category] += e.amount;
    });

    // Rechartsで使いやすい配列形式に変換
    return Object.keys(totals).map(category => ({
        name: category,
        value: totals[category]
    })).sort((a, b) => b.value - a.value); // 金額が大きい順
};

/**
 * 合計支出額の計算
 */
export const calculateTotalAmount = (expenses: Expense[]) => {
    return expenses.reduce((sum, e) => sum + e.amount, 0);
};

/**
 * 月別・カテゴリ別の集計 (RechartsのStacked Bar対応)
 */
export const calculateMonthlyCategoryTotals = (expenses: Expense[]) => {
    const monthlyData: Record<string, any> = {};
    const categoriesSet = new Set<string>();

    expenses.forEach(e => {
        // e.date は "2026/01/18" なので、"2026/01" の部分を抽出
        const month = e.date.substring(0, 7);
        if (!monthlyData[month]) {
            monthlyData[month] = { month };
        }
        if (!monthlyData[month][e.category]) {
            monthlyData[month][e.category] = 0;
        }
        monthlyData[month][e.category] += e.amount;
        categoriesSet.add(e.category);
    });

    // 配列にして、月順（古い順）にソート
    const data = Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
    const categories = Array.from(categoriesSet);

    return { data, categories };
};
