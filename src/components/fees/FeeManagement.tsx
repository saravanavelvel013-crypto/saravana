import React, { useState, useMemo } from 'react';
import {
  CreditCard,
  Search,
  Plus,
  Download,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Printer,
  DollarSign,
  X
} from 'lucide-react';
import { FeeRecord, Student, ClassSection } from '../../types';

interface FeeManagementProps {
  fees: FeeRecord[];
  students: Student[];
  classes: ClassSection[];
  onRecordPayment: (
    feeId: string,
    amount: number,
    paymentMethod: 'Card' | 'Bank Transfer' | 'Cash' | 'Cheque'
  ) => void;
  onCreateInvoice: (data: Omit<FeeRecord, 'id' | 'paidAmount' | 'status'>) => void;
  onExportCsv: () => void;
  userRole: string;
}

export const FeeManagement: React.FC<FeeManagementProps> = ({
  fees,
  students,
  classes,
  onRecordPayment,
  onCreateInvoice,
  onExportCsv,
  userRole
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');
  const [selectedFeeForPayment, setSelectedFeeForPayment] = useState<FeeRecord | null>(null);
  const [selectedFeeForReceipt, setSelectedFeeForReceipt] = useState<FeeRecord | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  // Payment form states
  const [payAmount, setPayAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'Card' | 'Bank Transfer' | 'Cash' | 'Cheque'>('Card');

  // New Invoice form states
  const [invStudentId, setInvStudentId] = useState(students[0]?.id || '');
  const [invTitle, setInvTitle] = useState('Term 2 Laboratory & Materials Fee');
  const [invCategory, setInvCategory] = useState<'Tuition' | 'Library' | 'Laboratory' | 'Transport' | 'Sports' | 'Exam'>('Laboratory');
  const [invAmount, setInvAmount] = useState<number>(350);
  const [invDueDate, setInvDueDate] = useState('2026-11-15');

  // Filtering
  const filteredFees = useMemo(() => {
    return fees.filter(f => {
      const matchSearch =
        f.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.admissionNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (f.receiptNo && f.receiptNo.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchStatus = statusFilter === 'all' || f.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [fees, searchTerm, statusFilter]);

  // Aggregate stats
  const totalCollected = fees.reduce((acc, f) => acc + Number(f.paidAmount), 0);
  const totalDues = fees.reduce((acc, f) => acc + Math.max(0, f.amount - f.paidAmount), 0);
  const overdueCount = fees.filter(f => f.status === 'overdue').length;

  const handleOpenPay = (fee: FeeRecord) => {
    setSelectedFeeForPayment(fee);
    setPayAmount(fee.amount - fee.paidAmount);
  };

  const handleConfirmPay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFeeForPayment) return;
    onRecordPayment(selectedFeeForPayment.id, payAmount, paymentMethod);
    setSelectedFeeForPayment(null);
  };

  const handleCreateInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find(s => s.id === invStudentId);
    if (!st) return;

    onCreateInvoice({
      studentId: st.id,
      studentName: `${st.firstName} ${st.lastName}`,
      admissionNo: st.admissionNo,
      classId: st.classId,
      className: `${st.className} - ${st.section}`,
      title: invTitle,
      category: invCategory,
      amount: invAmount,
      dueDate: invDueDate
    });

    setIsInvoiceModalOpen(false);
  };

  const isAdmin = userRole === 'admin';

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Fee Ledger & Billing</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Student fee tracking, receipts, dues settlements, and collection analytics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Fees CSV</span>
          </button>
          {isAdmin && (
            <button
              onClick={() => setIsInvoiceModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors shadow-xs whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Generate Fee Invoice</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Fees Collected</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              ${totalCollected.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Across {fees.filter(f => f.status === 'paid').length} settled invoices
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Outstanding Receivables</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-amber-600 tabular-nums">
              ${totalDues.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Term 1 & Term 2 Dues pending collection
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Overdue Invoices</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-rose-700 tabular-nums">
              {overdueCount}
            </span>
            <span className="text-xs text-rose-600 font-medium">accounts flagged</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Late payment reminders automatically issued
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search invoice, student, or receipt..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-md focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md self-stretch sm:self-auto">
          {(['all', 'paid', 'pending', 'overdue'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded capitalize font-medium transition-colors ${
                statusFilter === st
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Fees Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[11px]">
                <th className="py-3 px-4">Invoice Title & Category</th>
                <th className="py-3 px-4">Student & Class</th>
                <th className="py-3 px-4 text-right">Invoiced</th>
                <th className="py-3 px-4 text-right">Paid</th>
                <th className="py-3 px-4 text-right">Balance Due</th>
                <th className="py-3 px-4 text-center">Due Date</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFees.map(fee => {
                const balance = fee.amount - fee.paidAmount;
                const isPaid = fee.status === 'paid';
                const isOverdue = fee.status === 'overdue';

                return (
                  <tr key={fee.id} className="hover:bg-slate-50/70">
                    {/* Title */}
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-900 block">{fee.title}</span>
                      <span className="text-slate-500 text-[11px] font-mono">
                        {fee.category} {fee.receiptNo && `· ${fee.receiptNo}`}
                      </span>
                    </td>

                    {/* Student */}
                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-900 block">{fee.studentName}</span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {fee.admissionNo} · {fee.className}
                      </span>
                    </td>

                    {/* Invoiced */}
                    <td className="py-3 px-4 text-right font-mono font-medium text-slate-800 tabular-nums">
                      ${fee.amount.toFixed(2)}
                    </td>

                    {/* Paid */}
                    <td className="py-3 px-4 text-right font-mono font-semibold text-emerald-700 tabular-nums">
                      ${fee.paidAmount.toFixed(2)}
                    </td>

                    {/* Balance */}
                    <td className="py-3 px-4 text-right font-mono font-bold tabular-nums">
                      <span className={balance > 0 ? (isOverdue ? 'text-rose-600' : 'text-amber-600') : 'text-slate-400'}>
                        ${balance.toFixed(2)}
                      </span>
                    </td>

                    {/* Due Date */}
                    <td className="py-3 px-4 text-center font-mono text-slate-600 tabular-nums">
                      {fee.dueDate}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`capitalize font-semibold text-[11px] px-2 py-0.5 rounded ${
                          isPaid
                            ? 'text-emerald-700 bg-emerald-50'
                            : isOverdue
                            ? 'text-rose-700 bg-rose-50'
                            : 'text-amber-700 bg-amber-50'
                        }`}
                      >
                        {fee.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {isPaid || fee.paidAmount > 0 ? (
                          <button
                            onClick={() => setSelectedFeeForReceipt(fee)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                          >
                            <Printer className="w-3 h-3" />
                            <span>Receipt</span>
                          </button>
                        ) : null}

                        {!isPaid && (
                          <button
                            onClick={() => handleOpenPay(fee)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded transition-colors shadow-xs"
                          >
                            <DollarSign className="w-3 h-3" />
                            <span>Collect</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {selectedFeeForPayment && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-5 max-w-sm w-full space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm">Record Fee Payment</h3>
              <button onClick={() => setSelectedFeeForPayment(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded text-xs space-y-1">
              <span className="font-semibold text-slate-900 block">{selectedFeeForPayment.title}</span>
              <div className="text-slate-500 font-mono text-[11px]">
                Student: {selectedFeeForPayment.studentName} ({selectedFeeForPayment.admissionNo})
              </div>
              <div className="text-slate-700 font-semibold text-[11px]">
                Total: ${selectedFeeForPayment.amount.toFixed(2)} · Due: ${(selectedFeeForPayment.amount - selectedFeeForPayment.paidAmount).toFixed(2)}
              </div>
            </div>

            <form onSubmit={handleConfirmPay} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Payment Amount ($)</label>
                <input
                  type="number"
                  required
                  min={1}
                  max={selectedFeeForPayment.amount - selectedFeeForPayment.paidAmount}
                  value={payAmount}
                  onChange={e => setPayAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded font-mono font-bold text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded bg-white font-medium"
                >
                  <option value="Card">Credit / Debit Card</option>
                  <option value="Bank Transfer">Bank Wire Transfer</option>
                  <option value="Cash">Cash at Bursar Office</option>
                  <option value="Cheque">Bank Cashier Cheque</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedFeeForPayment(null)}
                  className="px-3 py-1.5 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded shadow-xs"
                >
                  Process Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Payment Receipt Modal */}
      {selectedFeeForReceipt && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full space-y-4 shadow-xl border border-slate-200">
            <div className="no-print flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="font-bold text-slate-900 text-sm">Official Fee Receipt Voucher</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-2.5 py-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded"
                >
                  Print Voucher
                </button>
                <button onClick={() => setSelectedFeeForReceipt(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4 border-2 border-dashed border-slate-300 rounded space-y-4 text-xs font-sans">
              <div className="text-center border-b pb-2">
                <div className="font-bold text-sm tracking-tight uppercase text-slate-900">
                  Oakridge International Academy
                </div>
                <div className="text-[10px] text-slate-500">Official Payment Receipt & Voucher</div>
              </div>

              <div className="flex justify-between items-center text-[11px] font-mono">
                <span>Receipt: <strong>{selectedFeeForReceipt.receiptNo || 'REC-2026-9041'}</strong></span>
                <span>Date: {selectedFeeForReceipt.paymentDate || '2026-10-15'}</span>
              </div>

              <div className="space-y-1 text-slate-700">
                <div>Received From: <strong>{selectedFeeForReceipt.studentName}</strong></div>
                <div>Admission No: <span className="font-mono">{selectedFeeForReceipt.admissionNo}</span></div>
                <div>Class & Section: {selectedFeeForReceipt.className}</div>
                <div>Fee Description: {selectedFeeForReceipt.title}</div>
                <div>Method: {selectedFeeForReceipt.paymentMethod || 'Bank Transfer'}</div>
              </div>

              <div className="p-2.5 bg-slate-100 rounded flex justify-between items-center font-bold text-sm">
                <span>Amount Paid:</span>
                <span className="font-mono text-emerald-700">${selectedFeeForReceipt.paidAmount.toFixed(2)}</span>
              </div>

              <div className="pt-4 flex justify-between items-end text-[10px] text-slate-500 border-t">
                <div>Bursar Signature: <i>M. Vance</i></div>
                <div className="font-mono text-right">[ COMPUTER GENERATED ]</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generate Fee Invoice Modal */}
      {isInvoiceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-5 max-w-md w-full space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm">Issue New Fee Invoice</h3>
              <button onClick={() => setIsInvoiceModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoiceSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Target Student</label>
                <select
                  value={invStudentId}
                  onChange={e => setInvStudentId(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded bg-white font-medium"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.firstName} {s.lastName} (Roll #{s.rollNo} · {s.className})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Fee Title</label>
                <input
                  type="text"
                  required
                  value={invTitle}
                  onChange={e => setInvTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Category</label>
                  <select
                    value={invCategory}
                    onChange={e => setInvCategory(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded bg-white"
                  >
                    <option value="Tuition">Tuition</option>
                    <option value="Laboratory">Laboratory</option>
                    <option value="Transport">Transport</option>
                    <option value="Library">Library</option>
                    <option value="Sports">Sports</option>
                    <option value="Exam">Exam Fee</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Amount ($)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={invAmount}
                    onChange={e => setInvAmount(parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Due Date</label>
                <input
                  type="date"
                  required
                  value={invDueDate}
                  onChange={e => setInvDueDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsInvoiceModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded shadow-xs"
                >
                  Create Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
