export type Expense = {
  id: string; // 一意の識別子
  date: string; // YYYY/MM/DD 形式
  itemName: string; // 項目名
  category: string; // カテゴリ (食費, 日用品, その他, etc.)
  amount: number; // 金額
  payer: 'りょうすけ' | 'まりん'; // 支払った人
  isSettled: boolean; // 精算済みかどうか
};

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
};
