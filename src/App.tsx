import { useEffect, useState, useMemo } from 'react';
import type { Expense } from './types';
import { fetchExpenses, addExpense as apiAddExpense, toggleSettled as apiToggleSettled, deleteExpense as apiDeleteExpense } from './api/gas';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './components/business/Dashboard';
import { AddExpenseForm } from './components/business/AddExpenseForm';
import { ExpenseList } from './components/business/ExpenseList';
import { Login } from './components/auth/Login';
import { Analysis } from './components/business/Analysis';
import { Home, PieChart as ChartIcon } from 'lucide-react';

// 仮のモックデータ（GASが空の場合などに利用）
const MOCK_DATA: Expense[] = [
  { id: '1', date: '2026/01/18', itemName: 'スーパー', category: '食費', amount: 1691, payer: 'りょうすけ', isSettled: true },
  { id: '2', date: '2026/01/22', itemName: 'スーパー', category: '食費', amount: 1040, payer: 'りょうすけ', isSettled: false },
  { id: '3', date: '2026/01/25', itemName: 'スーパー', category: '食費', amount: 1959, payer: 'りょうすけ', isSettled: false },
  { id: '4', date: '2026/01/14', itemName: '退去費用', category: 'その他', amount: 56100, payer: 'まりん', isSettled: true },
  { id: '5', date: '2026/01/30', itemName: '家賃', category: '住居・インフラ', amount: 74000, payer: 'まりん', isSettled: false },
];

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'home' | 'analysis'>('home');
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    // 常に当月をリストに含める（まだデータがない場合でも当月を選べるようにするため）
    const now = new Date();
    months.add(`${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}`);
    
    expenses.forEach(e => {
      const parts = e.date.split('/');
      if (parts.length >= 2) {
        months.add(`${parts[0]}/${parts[1]}`);
      }
    });
    return Array.from(months).sort().reverse(); // 新しい月順
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    if (selectedMonth === 'all') return expenses;
    return expenses.filter(e => e.date.startsWith(selectedMonth));
  }, [expenses, selectedMonth]);

  // 認証の初期ステート（保存された合言葉が環境変数と一致するか）
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const saved = localStorage.getItem('kakeibo_password');
    const correct = import.meta.env.VITE_APP_PASSWORD;
    if (!correct) return true; // 設定がない場合は認証不要
    return saved === correct;
  });

  // 初回データ読み込み
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchExpenses();
        if (data && data.length > 0) {
          setExpenses(data);
        } else {
          // GASから空配列が来た場合や、エラーでなく0件の場合
          setExpenses(MOCK_DATA);
        }
      } catch (err) {
        console.warn('API fetch failed, using mock data:', err);
        setExpenses(MOCK_DATA);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleAddExpense = async (newExpense: Expense) => {
    try {
      // APIリクエストに失敗したらエラーになるが、とりあえずローカル側は先行して更新させる (Optimistic UI update)
      const isApiConfigured = !!import.meta.env.VITE_GAS_WEB_URL;
      if (isApiConfigured) {
        await apiAddExpense(newExpense);
      }
      setExpenses([newExpense, ...expenses]);
    } catch (err) {
      console.error(err);
      alert('GASが正しく設定されていない可能性があります。ローカル表示のみ更新します。');
      setExpenses([newExpense, ...expenses]);
    }
  };

  const handleToggleSettled = async (id: string, isSettled: boolean) => {
    try {
      const isApiConfigured = !!import.meta.env.VITE_GAS_WEB_URL;
      if (isApiConfigured) {
        await apiToggleSettled(id, isSettled);
      }
      setExpenses(expenses.map(e => e.id === id ? { ...e, isSettled } : e));
    } catch (err) {
      console.error(err);
      alert('通信エラー: ローカル表示のみ更新します。');
      setExpenses(expenses.map(e => e.id === id ? { ...e, isSettled } : e));
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (!window.confirm('この記録を削除しますか？')) return;

    try {
      const isApiConfigured = !!import.meta.env.VITE_GAS_WEB_URL;
      if (isApiConfigured) {
        await apiDeleteExpense(id);
      }
      setExpenses(expenses.filter(e => e.id !== id));
    } catch (err) {
      console.error(err);
      alert('通信エラー: ローカルの表示のみ更新します。');
      setExpenses(expenses.filter(e => e.id !== id));
    }
  };

  // 認証されていない場合はログイン画面を表示
  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <Layout>
      {activeTab === 'home' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '6rem' }}>
          <Dashboard
            expenses={expenses}
            onToggleSettled={handleToggleSettled}
            selectedMonth={selectedMonth}
            availableMonths={availableMonths}
            onMonthChange={setSelectedMonth}
          />

          <div className="form-container">
            <style>{`
               .grid-layout { display: grid; grid-template-columns: 1fr 2fr; gap: 2rem; align-items: start; }
               .grid-layout > * { min-width: 0; }
               @media (max-width: 768px) {
                 .grid-layout { grid-template-columns: 1fr; }
               }
             `}</style>
            <div className="grid-layout">
              <AddExpenseForm onAdd={handleAddExpense} />
              <ExpenseList expenses={filteredExpenses} isLoading={isLoading} onDelete={handleDeleteExpense} />
            </div>
          </div>
        </div>
      ) : (
        <div style={{ paddingBottom: '6rem' }}>
          <Analysis
            expenses={expenses}
            onMonthClick={(month) => {
              setSelectedMonth(month);
              setActiveTab('home');
            }}
          />
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <div className="bottom-nav">
        <button
          className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          <Home size={24} />
          <span>ホーム</span>
        </button>
        <button
          className={`nav-item ${activeTab === 'analysis' ? 'active' : ''}`}
          onClick={() => setActiveTab('analysis')}
        >
          <ChartIcon size={24} />
          <span>分析</span>
        </button>
      </div>

    </Layout>
  );
}

export default App;
