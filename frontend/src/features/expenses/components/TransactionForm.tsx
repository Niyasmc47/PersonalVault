import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Transaction, CreateTransactionRequest, PaymentMethod, ExpenseCategory, IncomeCategory } from '../types';
import { X } from 'lucide-react';
import { useEffect } from 'react';

const expenseCategories: ExpenseCategory[] = ['FOOD', 'TRANSPORT', 'EDUCATION', 'SHOPPING', 'BILLS', 'ENTERTAINMENT', 'HEALTHCARE', 'TRAVEL', 'OTHER'];
const incomeCategories: IncomeCategory[] = ['SALARY', 'FREELANCE', 'BUSINESS', 'SCHOLARSHIP', 'GIFT', 'OTHER'];
const paymentMethods: PaymentMethod[] = ['CASH', 'UPI', 'CARD', 'BANK_TRANSFER', 'OTHER'];

const schema = z.object({
  type: z.enum(['INCOME', 'EXPENSE']),
  amount: z.number().positive('Amount must be greater than 0'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().max(255, 'Description is too long').optional().nullable(),
  transactionDate: z.string().min(1, 'Date is required'),
  paymentMethod: z.enum(['CASH', 'UPI', 'CARD', 'BANK_TRANSFER', 'OTHER'])
});

interface TransactionFormProps {
  initialData?: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTransactionRequest) => void;
  isSubmitting: boolean;
}

export default function TransactionForm({ initialData, isOpen, onClose, onSubmit, isSubmitting }: TransactionFormProps) {
  const { register, handleSubmit, watch, formState: { errors }, reset, setValue } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: 'EXPENSE',
      amount: undefined,
      category: 'FOOD',
      description: '',
      transactionDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'UPI'
    }
  });

  const transactionType = watch('type');

  useEffect(() => {
    if (initialData) {
      reset({
        type: initialData.type,
        amount: initialData.amount,
        category: initialData.category,
        description: initialData.description || '',
        transactionDate: initialData.transactionDate,
        paymentMethod: initialData.paymentMethod
      });
    } else {
      reset({
        type: 'EXPENSE',
        amount: undefined,
        category: 'FOOD',
        description: '',
        transactionDate: new Date().toISOString().split('T')[0],
        paymentMethod: 'UPI'
      });
    }
  }, [initialData, isOpen, reset]);

  // Ensure category is valid when type changes
  useEffect(() => {
    if (transactionType === 'EXPENSE') {
      setValue('category', expenseCategories[0]);
    } else {
      setValue('category', incomeCategories[0]);
    }
  }, [transactionType, setValue]);

  if (!isOpen) return null;

  const categories = transactionType === 'EXPENSE' ? expenseCategories : incomeCategories;

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '12px',
    border: '1px solid var(--color-concrete-gray)',
    fontFamily: 'inherit',
    fontSize: '14px',
    marginTop: '6px'
  };

  const labelStyle = {
    fontSize: '13px',
    fontWeight: 'var(--font-weight-bold)',
    color: 'var(--color-carbon)'
  };

  const errorStyle = {
    color: 'var(--color-ember)',
    fontSize: '12px',
    marginTop: '4px',
    fontWeight: 'var(--font-weight-bold)'
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div className="pv-card" style={{ maxWidth: '500px', width: '100%', margin: '24px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px' }}>{initialData ? 'Edit Transaction' : 'Add Transaction'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={24} color="var(--color-carbon)" />
          </button>
        </div>

        <form onSubmit={handleSubmit((data) => onSubmit(data as CreateTransactionRequest))} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Type</label>
              <select {...register('type')} style={inputStyle}>
                <option value="EXPENSE">Expense</option>
                <option value="INCOME">Income</option>
              </select>
            </div>
            
            <div>
              <label style={labelStyle}>Amount</label>
              <input 
                type="number" 
                step="0.01" 
                {...register('amount', { valueAsNumber: true })} 
                style={inputStyle} 
                placeholder="0.00"
              />
              {errors.amount && <div style={errorStyle}>{errors.amount.message}</div>}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Category</label>
              <select {...register('category')} style={inputStyle}>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <div style={errorStyle}>{errors.category.message}</div>}
            </div>

            <div>
              <label style={labelStyle}>Date</label>
              <input 
                type="date" 
                {...register('transactionDate')} 
                style={inputStyle} 
              />
              {errors.transactionDate && <div style={errorStyle}>{errors.transactionDate.message}</div>}
            </div>
          </div>

          <div>
            <label style={labelStyle}>Payment Method</label>
            <select {...register('paymentMethod')} style={inputStyle}>
              {paymentMethods.map(pm => (
                <option key={pm} value={pm}>{pm.replace('_', ' ')}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Description (Optional)</label>
            <input 
              type="text" 
              {...register('description')} 
              style={inputStyle} 
              placeholder="What was this for?"
            />
            {errors.description && <div style={errorStyle}>{errors.description.message}</div>}
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
            <button type="button" onClick={onClose} className="pv-btn pv-btn--light">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="pv-btn pv-btn--dark">
              {isSubmitting ? 'Saving...' : 'Save Transaction'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
