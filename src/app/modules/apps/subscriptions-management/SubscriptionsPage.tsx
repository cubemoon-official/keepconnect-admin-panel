import React, { useMemo, useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table'
import { SubscriptionsEditModalForm } from './SubscriptionsEditModalForm' // ✅ import modal

type Subscription = {
  subscription_id: number
  planName: string
  slug: string
  amount: number
  user_count: number
  isActive: boolean
}

// Dummy Data
const initialData: Subscription[] = [
  { subscription_id: 1, planName: 'Startup Plan', slug: 'startup-plan', amount: 49, user_count: 15, isActive: true },
  { subscription_id: 2, planName: 'Enterprise Plan', slug: 'enterprise-plan', amount: 199, user_count: 100, isActive: false },
  { subscription_id: 3, planName: 'Premium Plan', slug: 'premium-plan', amount: 99, user_count: 40, isActive: true },
]

export const SubscriptionsPage: React.FC = () => {
  const [data, setData] = useState<Subscription[]>(initialData)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPlan, setSelectedPlan] = useState<Subscription | null>(null)
  const [showModal, setShowModal] = useState(false)

  // 🔍 Filter data
  const filteredData = useMemo(() => {
    return data.filter(
      (item) =>
        item.planName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.slug.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [data, searchTerm])

  // 🧭 Toggle Active/Inactive
  const handleToggleStatus = (plan: Subscription) => {
    setData((prev) =>
      prev.map((p) =>
        p.subscription_id === plan.subscription_id
          ? { ...p, isActive: !p.isActive }
          : p
      )
    )
  }

  // ✏️ Open Modal
  const handleEdit = (plan: Subscription) => {
    setSelectedPlan(plan)
    setShowModal(true)
  }

  // 💾 Save Edited Plan
  const handleSave = (updatedPlan: any) => {
    setData((prev) =>
      prev.map((p) =>
        p.subscription_id === selectedPlan?.subscription_id
          ? {
              ...p,
              planName: updatedPlan.name,
              amount: updatedPlan.amount,
              slug: updatedPlan.name.toLowerCase().replace(/\s+/g, '-'),
            }
          : p
      )
    )
    setShowModal(false)
    setSelectedPlan(null)
  }

  // ❌ Close Modal
  const handleCancel = () => {
    setShowModal(false)
    setSelectedPlan(null)
  }

  // 🧱 Table Columns
  const columns = useMemo<ColumnDef<Subscription>[]>(
    () => [
      { header: 'SUBSCRIPTION ID', accessorKey: 'subscription_id' },
      {
        header: 'Plan Name',
        accessorKey: 'planName',
        cell: (info) => <span className='fw-semibold text-dark'>{info.getValue() as string}</span>,
      },
      { header: 'Amount', accessorKey: 'amount' },
      { header: 'Users COUNT', accessorKey: 'user_count' },
      {
        header: 'Status',
        id: 'status',
        cell: (info) => {
          const plan = info.row.original
          return (
            <div className='text-end'>
              <button
                className={`btn btn-sm px-3 fw-semibold ${
                  plan.isActive ? 'btn-light-success' : 'btn-light-danger'
                }`}
                onClick={() => handleToggleStatus(plan)}
              >
                {plan.isActive ? (
                  <>
                    <i className='bi bi-check-circle me-1 text-success'></i> Active
                  </>
                ) : (
                  <>
                    <i className='bi bi-x-circle me-1 text-danger'></i> Inactive
                  </>
                )}
              </button>
            </div>
          )
        },
      },
      {
        header: 'Actions',
        id: 'actions',
        cell: (info) => {
          const plan = info.row.original
          return (
            <div className='d-flex justify-content-end'>
              <button
                className='btn btn-sm btn-light-primary px-3'
                onClick={() => handleEdit(plan)}
              >
                <i className='bi bi-pencil-square'></i> Edit
              </button>
            </div>
          )
        },
      },
    ],
    []
  )

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className='container-fluid mt-15'>
      {/* Header */}
      <div className='d-flex align-items-center justify-content-start mb-5'>
        <h1 className='fw-bold text-white ms-15 mb-6 mt-10' style={{ fontSize: '1.3rem' }}>
          Subscriptions Management
        </h1>
      </div>

      {/* Table Card */}
      <div
        className='py-5'
        style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
          maxWidth: '95%',
          margin: '0 auto',
          padding: '60px',
        }}
      >
        {/* Top Bar */}
        <div className='d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3'>
          <h4 className='fw-bold text-primary mb-0'>Subscriptions</h4>

          {/* Search */}
          <div
            className='d-flex align-items-center px-3 py-0 shadow-sm'
            style={{
              backgroundColor: '#f5f8fa',
              borderRadius: '5px',
              border: '1px solid #e1e3ea',
              width: '180px',
            }}
          >
            <i className='bi bi-search text-muted me-2'></i>
            <input
              type='text'
              className='form-control border-0 bg-transparent'
              placeholder='Search...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className='table-responsive px-15'>
          <table className='table table-hover align-middle'>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className='text-muted text-uppercase fs-7 border-bottom'>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={`py-3 ${
                        header.column.id === 'actions' || header.column.id === 'status'
                          ? 'text-end pe-3'
                          : 'ps-2'
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
                          cell.column.id === 'actions' || cell.column.id === 'status'
                            ? 'text-end pe-3'
                            : 'ps-2'
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
                    No subscriptions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🔹 Edit Modal */}
      {showModal && (
        <SubscriptionsEditModalForm
          plan={{
            name: selectedPlan?.planName || '',
            description: selectedPlan?.slug || '',
            amount: selectedPlan?.amount || 0,
            tenure: selectedPlan?.isActive ? 'Active' : 'Inactive',
          }}
          onSubmit={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  )
}

export default SubscriptionsPage
