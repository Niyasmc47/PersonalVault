import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionService } from '../services/transactionService';
import type { Transaction, TransactionFilters as FilterParams, CreateTransactionRequest, UpdateTransactionRequest } from '../types';
import FinanceSummary from '../components/FinanceSummary';
import CategoryBreakdown from '../components/CategoryBreakdown';
import TransactionFilters from '../components/TransactionFilters';
import TransactionList from '../components/TransactionList';
import TransactionForm from '../components/TransactionForm';
import DeleteTransactionDialog from '../components/DeleteTransactionDialog';
import { Wallet, Plus } from 'lucide-react';

export default function ExpensesPage() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<FilterParams>({});
  
  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);

  // Queries
  const { data: summary, isLoading: isLoadingSummary } = useQuery({
    queryKey: ['transactionSummary'],
    queryFn: transactionService.getSummary
  });

  const { data: expenseBreakdown } = useQuery({
    queryKey: ['categorySummary', 'EXPENSE'],
    queryFn: () => transactionService.getCategorySummary('EXPENSE')
  });

  const { data: incomeBreakdown } = useQuery({
    queryKey: ['categorySummary', 'INCOME'],
    queryFn: () => transactionService.getCategorySummary('INCOME')
  });

  const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['transactions', filters],
    queryFn: () => transactionService.getTransactions(filters)
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: transactionService.createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transactionSummary'] });
      queryClient.invalidateQueries({ queryKey: ['categorySummary'] });
      setIsFormOpen(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: UpdateTransactionRequest }) => 
      transactionService.updateTransaction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transactionSummary'] });
      queryClient.invalidateQueries({ queryKey: ['categorySummary'] });
      setIsFormOpen(false);
      setEditingTransaction(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: transactionService.deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transactionSummary'] });
      queryClient.invalidateQueries({ queryKey: ['categorySummary'] });
      setIsDeleteDialogOpen(false);
      setTransactionToDelete(null);
    }
  });

  const handleOpenCreateForm = () => {
    setEditingTransaction(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (t: Transaction) => {
    setEditingTransaction(t);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (data: CreateTransactionRequest) => {
    if (editingTransaction) {
      updateMutation.mutate({ id: editingTransaction.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDeleteRequest = (t: Transaction) => {
    setTransactionToDelete(t);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (transactionToDelete) {
      deleteMutation.mutate(transactionToDelete.id);
    }
  };

  return (
    <div className="pv-container" style={{ paddingBottom: '80px' }}>
      
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--sp-48)', marginBottom: 'var(--sp-40)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'var(--color-sunburst)', padding: '12px', borderRadius: '50%', border: '1px solid var(--color-carbon)' }}>
            <Wallet size={32} color="var(--color-carbon)" strokeWidth={2.5} />
          </div>
          <h1 style={{ fontSize: '32px', textTransform: 'uppercase', fontFamily: 'var(--font-lateral)' }}>Income & Expenses</h1>
        </div>
        
        <button className="pv-btn pv-btn--dark" onClick={handleOpenCreateForm}>
          <Plus size={18} /> Add Transaction
        </button>
      </div>

      {/* Summary Section */}
      <section style={{ marginBottom: '40px' }}>
        <FinanceSummary summary={summary} isLoading={isLoadingSummary} />
      </section>

      {/* Charts Section */}
      <section style={{ marginBottom: '40px' }}>
        <div className="pv-features-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <CategoryBreakdown title="Expense Breakdown" data={expenseBreakdown || []} />
          <CategoryBreakdown title="Income Breakdown" data={incomeBreakdown || []} />
        </div>
      </section>

      {/* Filters & History Section */}
      <section>
        <TransactionFilters filters={filters} onChange={setFilters} />
        <TransactionList 
          transactions={transactions} 
          isLoading={isLoadingTransactions} 
          onEdit={handleOpenEditForm}
          onDelete={handleDeleteRequest}
        />
      </section>

      {/* Modals */}
      <TransactionForm 
        isOpen={isFormOpen} 
        onClose={() => { setIsFormOpen(false); setEditingTransaction(null); }}
        onSubmit={handleFormSubmit}
        initialData={editingTransaction}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteTransactionDialog 
        isOpen={isDeleteDialogOpen}
        isDeleting={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => { setIsDeleteDialogOpen(false); setTransactionToDelete(null); }}
      />
      
    </div>
  );
}
