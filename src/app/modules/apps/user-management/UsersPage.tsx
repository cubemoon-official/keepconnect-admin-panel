import React, { useMemo, useState } from 'react'
import { Route, Routes, Outlet, Navigate } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../../_metronic/layout/core'
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table'
import { UserEditModalForm } from './users-list/user-edit-modal/UserEditModalForm'

// 🔹 Breadcrumbs
const usersBreadcrumbs: Array<PageLink> = [
  {
    title: 'Users Management',
    path: '/apps/user-management/users',
    isSeparator: false,
    isActive: false,
  },
  { title: '', path: '', isSeparator: true, isActive: false },
]

// 🔹 Users List Wrapper
const UsersListWrapper: React.FC = () => {
  const usersData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', position: 'Acme Corp', phone: '9876543210', isActive: true },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', position: 'TechSoft', phone: '7896541230', isActive: false },
    { id: 3, name: 'Amit Verma', email: 'amit@example.com', position: 'Verma Traders', phone: '9988776655', isActive: true },
    { id: 4, name: 'Priya Sharma', email: 'priya.sharma@innovex.in', position: 'Innovex Solutions', phone: '9823456712', isActive: true },
    { id: 5, name: 'Michael Smith', email: 'michael@alphatech.com', position: 'AlphaTech', phone: '9123456789', isActive: false },
    { id: 6, name: 'Ravi Patel', email: 'ravi.patel@globex.com', position: 'Globex Corporation', phone: '9785643210', isActive: true },
    { id: 7, name: 'Emily Davis', email: 'emily.davis@brightlabs.com', position: 'Bright Labs', phone: '7890654321', isActive: false },
    { id: 8, name: 'Ananya Gupta', email: 'ananya@nextgen.io', position: 'NextGen Innovations', phone: '9912345678', isActive: true },
    { id: 9, name: 'Daniel Wilson', email: 'daniel@softlink.com', position: 'SoftLink Systems', phone: '8899776655', isActive: true },
    { id: 10, name: 'Neha Kapoor', email: 'neha.kapoor@bluewave.co', position: 'BlueWave Technologies', phone: '9812365470', isActive: true },
    { id: 11, name: 'Carlos Hernandez', email: 'carlos@microzone.com', position: 'Microzone', phone: '9998887770', isActive: false },
    { id: 12, name: 'Meera Nair', email: 'meera.nair@infotech.in', position: 'InfoTech India', phone: '9845123678', isActive: true },
    { id: 13, name: 'David Brown', email: 'david@northstar.com', position: 'NorthStar Solutions', phone: '9745612309', isActive: true },
    { id: 14, name: 'Sanya Singh', email: 'sanya@quantumsoft.io', position: 'QuantumSoft', phone: '9764312580', isActive: true },
    { id: 15, name: 'Olivia Miller', email: 'olivia.miller@novanet.com', position: 'NovaNet', phone: '9632147850', isActive: false },
  ]

  const [data, setData] = useState(usersData)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any | null>(null)
  const pageSize = 10

  const filteredData = useMemo(
    () =>
      data.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [data, searchTerm]
  )

  const totalPages = Math.ceil(filteredData.length / pageSize)
  const paginatedData = useMemo(
    () => filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [filteredData, currentPage]
  )

  // ✅ Toggle Active/Inactive
  const handleToggleStatus = (user: any) => {
    setData((prev) =>
      prev.map((u) =>
        u.id === user.id ? { ...u, isActive: !u.isActive } : u
      )
    )
  }

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      { header: 'Full Name', accessorKey: 'name' },
      { header: 'Business Name', accessorKey: 'position' },
      { header: 'Phone Number', accessorKey: 'phone' },
      { header: 'Email ID', accessorKey: 'email' },
      {
        header: 'Status',
        id: 'actions',
        cell: (info) => {
          const user = info.row.original
          return (
            <div className='d-flex justify-content-end'>
              <button
                className={`btn btn-sm px-3 fw-semibold ${
                  user.isActive ? 'btn-light-success' : 'btn-light-danger'
                }`}
                onClick={() => handleToggleStatus(user)}
              >
                {user.isActive ? (
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
    ],
    []
  )

  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const handleAddUser = (user: any) => {
    if (selectedUser) {
      setData((prev) => prev.map((u) => (u.id === selectedUser.id ? { ...u, ...user } : u)))
    } else {
      const newEntry = { id: Date.now(), isActive: true, ...user }
      setData([...data, newEntry])
    }
    setIsModalOpen(false)
    setSelectedUser(null)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setSelectedUser(null)
  }

  return (
    <div className='container-fluid mt-15' style={{ maxWidth: '95%' }}>
      <div className='d-flex align-items-center justify-content-start mb-10'>
        <h1 className='fw-bold mt-10 ms-3' style={{ fontSize: '1.3rem', color: '#fff' }}>
          Users Management
        </h1>
      </div>

      <div
        className='py-5'
        style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
          padding: '40px',
        }}
      >
        <div className='d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3'>
          <h4 className='fw-bold text-primary mb-0'>Users List</h4>

          <div className='d-flex align-items-center gap-3'>
            <div
              className='d-flex align-items-center px-5 py-0 shadow-sm'
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
                placeholder='Search user...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button
              className='btn btn-primary fw-semibold'
              onClick={() => {
                setSelectedUser(null)
                setIsModalOpen(true)
              }}
            >
              <i className='bi bi-plus-lg me-1'></i> Add User
            </button>
          </div>
        </div>

        {/* ✅ Table */}
        <div className='table-responsive'>
          <table className='table table-hover align-middle'>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className='text-muted text-uppercase fs-7 border-bottom'>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={`${
                        header.column.id === 'actions' ? 'text-end pe-3' : ''
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
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className={`${
                          cell.column.id === 'actions' ? 'text-end pe-3' : ''
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
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className='d-flex justify-content-end align-items-center mt-4 gap-2'>
          <span className='text-muted me-auto'>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className='btn btn-sm btn-light'
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

      {/* ✅ Imported Modal */}
      {isModalOpen && (
        <div
          className='modal fade show'
          style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={(e) => e.target === e.currentTarget && handleCancel()}
        >
          <UserEditModalForm
            user={selectedUser || undefined}
            onCancel={handleCancel}
            onSubmit={handleAddUser}
          />
        </div>
      )}
    </div>
  )
}

// 🔹 Routes Wrapper
const UsersPage = () => (
  <Routes>
    <Route element={<Outlet />}>
      <Route
        path='users'
        element={
          <>
            <PageTitle breadcrumbs={usersBreadcrumbs} >Users Management</PageTitle>
            <UsersListWrapper />
          </>
        }
      />
    </Route>
    <Route index element={<Navigate to='/apps/user-management/users' />} />
  </Routes>
)

export default UsersPage
