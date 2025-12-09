import React, { useMemo, useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table'

type Transaction = {
  id: number
  transactionName: string
  user_id: number
  date: string
  amount: number
  status: 'Credited' | 'Debited'
}

const TransactionsPage: React.FC = () => {
  const [transactionsData, setTransactionsData] = useState<Transaction[]>([
    { id: 1, transactionName: 'Invoice #1001', user_id: 101, date: '2025-09-12', amount: 250, status: 'Credited' },
    { id: 2, transactionName: 'Invoice #1002', user_id: 102, date: '2025-10-01', amount: 120, status: 'Debited' },
    { id: 3, transactionName: 'Subscription Payment', user_id: 103, date: '2025-10-15', amount: 499, status: 'Credited' },
    { id: 4, transactionName: 'Credit Adjustment', user_id: 104, date: '2025-11-02', amount: 75, status: 'Credited' },
    { id: 5, transactionName: 'Order #2023', user_id: 105, date: '2025-11-04', amount: 189, status: 'Credited' },
    { id: 6, transactionName: 'Order #2022', user_id: 106, date: '2025-09-29', amount: 89, status: 'Debited' },
    { id: 7, transactionName: 'Renewal Payment', user_id: 107, date: '2025-10-10', amount: 299, status: 'Credited' },
    { id: 8, transactionName: 'Chargeback', user_id: 108, date: '2025-08-22', amount: 150, status: 'Debited' },
    { id: 9, transactionName: 'Invoice #1010', user_id: 109, date: '2025-09-05', amount: 350, status: 'Credited' },
    { id: 10, transactionName: 'Invoice #1011', user_id: 110, date: '2025-11-06', amount: 110, status: 'Debited' },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const pageSize = 10

  // 🔍 Filter data by Transaction ID only
  const filteredData = useMemo(() => {
    return transactionsData.filter((item) =>
      item.id.toString().includes(searchTerm.trim())
    )
  }, [transactionsData, searchTerm])

  const totalPages = Math.ceil(filteredData.length / pageSize)

  const paginatedData = useMemo(
    () => filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [filteredData, currentPage]
  )

  // 🧱 Table columns
  const columns = useMemo<ColumnDef<Transaction>[]>(
    () => [
      {
        header: 'Transaction ID',
        accessorKey: 'id',
        cell: (info) => <span className='fw-semibold text-dark'>{info.getValue() as number}</span>,
      },
      {
        header: 'User ID',
        accessorKey: 'user_id',
        cell: (info) => <span className='text-dark'>{info.getValue() as number}</span>,
      },
      {
        header: 'Date',
        accessorKey: 'date',
        cell: (info) => <span className='text-dark'>{info.getValue() as string}</span>,
      },
      {
        header: 'Amount',
        accessorKey: 'amount',
        cell: (info) => <span className='text-dark fw-semibold'>{info.getValue() as number}</span>,
      },
      {
        header: 'Status',
        id: 'status',
        cell: (info) => {
          const transaction = info.row.original
          const isCredited = transaction.status === 'Credited'

          return (
            <div className='d-flex justify-content-center'>
              <button
                className={`btn btn-sm fw-semibold px-5 ${
                  isCredited ? 'btn-light-success' : 'btn-light-danger'
                }`}
                onClick={() =>
                  setTransactionsData((prev) =>
                    prev.map((t) =>
                      t.id === transaction.id
                        ? { ...t, status: isCredited ? 'Debited' : 'Credited' }
                        : t
                    )
                  )
                }
              >
                {isCredited ? 'Credited' : 'Debited'}
              </button>
            </div>
          )
        },
      },
    ],
    [transactionsData]
  )

  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className='container-fluid mt-20' style={{ maxWidth: '95%' }}>
      {/* 🔹 Page Header */}
      <div
        className='d-flex align-items-center justify-content-start mb-5'
        style={{
          borderRadius: '8px',
          padding: '10px 20px',
          color: '#fff',
        }}
      >
        <h1 className='fw-bold mb-0 ms-0' style={{ fontSize: '1.3rem', letterSpacing: '0.3px', color: '#fff' }}>
          Transactions Management
        </h1>
      </div>

      {/* 🔹 Table Section */}
      <div
        className='py-5 px-20'
        style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
          padding: '60px',
        }}
      >
        {/* Header: Title + Search */}
        <div className='d-flex justify-content-between align-items-center mb-4'>
          <h4 className='fw-bold text-primary mb-0'>Transactions</h4>

          {/* Search bar */}
          <div
            className='d-flex align-items-center px-3 py-1 shadow-sm'
            style={{
              backgroundColor: '#f5f8fa',
              borderRadius: '5px',
              border: '1px solid #e1e3ea',
              width: '200px',
            }}
          >
            <i className='bi bi-search text-muted me-2'></i>
            <input
              type='text'
              className='form-control border-0 bg-transparent'
              placeholder='Search by ID...'
              style={{ outline: 'none', boxShadow: 'none', fontSize: '0.9rem' }}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
            />
          </div>
        </div>

        {/* Table */}
        <div className='table-responsive'>
          <table className='table table-hover align-middle'>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className='text-muted text-uppercase fs-7 border-bottom'>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={`py-3 ${
                        header.column.id === 'actions'
                          ? 'text-end pe-3'
                          : header.column.id === 'status'
                          ? 'text-center'
                          : ''
                      }`}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className='fw-semibold'>
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className={`${
                          cell.column.id === 'actions'
                            ? 'text-end pe-3'
                            : cell.column.id === 'status'
                            ? 'text-center'
                            : ''
                        }`}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className='text-center py-5 text-muted'>
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className='d-flex justify-content-between align-items-center mt-4'>
          <span className='text-muted'>
            Page {currentPage} of {totalPages}
          </span>
          <div>
            <button
              className='btn btn-sm btn-light me-2'
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            >
              Previous
            </button>
            <button
              className='btn btn-sm btn-primary'
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransactionsPage
