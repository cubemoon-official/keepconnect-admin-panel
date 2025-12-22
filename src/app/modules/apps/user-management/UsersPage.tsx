import React, { useMemo, useState, useEffect, useCallback } from 'react'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../../_metronic/layout/core'
import { useReactTable, getCoreRowModel, flexRender, ColumnDef } from '@tanstack/react-table'
import { UserEditModalForm } from './users-list/user-edit-modal/UserEditModalForm'
import axios from 'axios'


const API_URL = import.meta.env.VITE_APP_API_URL
// ------------------- AXIOS CLIENT -------------------
const TOKEN = localStorage.getItem('auth_token')

const axiosClient = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { Authorization: TOKEN ? `Bearer ${TOKEN}` : undefined },
})
// -----------------------------------------------------

const usersBreadcrumbs: PageLink[] = [
  { title: 'Users Management', path: '/apps/user-management/users', isSeparator: false, isActive: false },
]

const PAGE_SIZE = 10

const UsersListWrapper: React.FC = () => {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any | null>(null)
  const [submitLoading, setSubmitLoading] = useState(false)



  // ------------------- Fetch Users -------------------
  const fetchUsers = useCallback(async () => {
    try {
      const res = await axiosClient.get('/admin/users')
      setData(res.data.users || [])
    } catch (err) {
      console.error('Error fetching users:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  // Reset page on search
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  // ------------------- Filtered Data -------------------
  const filteredData = useMemo(() => {
    const term = searchTerm.toLowerCase()
    return data.filter((user) =>
      [user.name, user.email, user.business_name, user.phone]
        .join(' ')
        .toLowerCase()
        .includes(term)
    )
  }, [data, searchTerm])

  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE)

  // ------------------- Toggle Status -------------------
  const handleToggleStatus = useCallback(async (user: any) => {
    try {
      await axiosClient.put(`/admin/users/${user.id}/toggle-status`)
      setData(prev =>
        prev.map(u => (u.id === user.id ? { ...u, isActive: !u.isActive } : u))
      )
    } catch (err) {
      console.error('Error toggling status:', err)
    }
  }, [])

  // ------------------- Columns -------------------
  const columns = useMemo<ColumnDef<any>[]>(() => [
    { header: 'Full Name', accessorKey: 'name' },
    { header: 'Business Name', accessorKey: 'business_name' },
    { header: 'Phone Number', accessorKey: 'phone' },
    { header: 'Email ID', accessorKey: 'email' },
    {
      header: 'Status',
      id: 'actions',
      cell: ({ row }) => {
        const user = row.original
        return (
          <button
            className={`btn btn-sm ${user.isActive ? 'btn-light-success' : 'btn-light-danger'}`}
            onClick={() => handleToggleStatus(user)}
          >
            {user.isActive ? 'Active' : 'Inactive'}
          </button>
        )
      },
    },
  ], [handleToggleStatus])

  // ------------------- React Table -------------------
  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  // Manual pagination (cheap & stable)
  const rows = table.getRowModel().rows.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

 // ------------------- Add / Update User -------------------
const handleAddUser = async (user: any) => {
  if (!user.role) return 

  setSubmitLoading(true)

  try {
    if (selectedUser) {
      await axiosClient.put(`/admin/users/${selectedUser.id}`, user)
    } else {
      await axiosClient.post('/admin/users', user)
    }

    await fetchUsers()

    // ---------------- Auto-close modal ----------------
    setIsModalOpen(false)
    setSelectedUser(null)
  } catch (err: any) {
    alert(err.response?.data?.message || 'Validation error!')
  } finally {
    setSubmitLoading(false)
  }
}


  // ------------------- Loader -------------------
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} />
      </div>
    )
  }

  // ------------------- Render -------------------
  return (
    <div className='container-fluid mt-20' style={{ maxWidth: '70%' }}>
      <div className='d-flex align-items-center justify-content-start mb-5'>
        <h1 className='fw-bold text-white ms-3 mb-6 mt-10' style={{ fontSize: '1.3rem' }}>
          Users Management
        </h1>
      </div>
      <div className='py-5 bg-white rounded-3 shadow-sm px-5'>
        <div className='d-flex justify-content-between mb-4'>
          <h4 className='fw-bold text-primary'>Users List</h4>

          <div className='d-flex gap-3'>
            <input
              type='text'
              className='form-control'
              placeholder='Search user...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '200px' }}
            />
            <button className='btn btn-primary' onClick={() => setIsModalOpen(true)}>
              Add User
            </button>
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
                      className={`py-3 ${header.column.id === 'actions'
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
              {rows.length > 0 ? (
                rows.map((row) => (
                  <tr key={row.id} className='fw-semibold'>
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className={
                          cell.column.id === 'actions'
                            ? 'text-end pe-3'
                            : cell.column.id === 'status'
                              ? 'text-center'
                              : ''
                        }
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
        {/* PAGINATION */}
        <div className='d-flex justify-content-end mt-4 gap-2'>
          <button
            className='btn btn-sm btn-light'
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
          >
            Previous
          </button>

          <span className='align-self-center'>
            Page {currentPage} of {totalPages}
          </span>

          <button
            className='btn btn-sm btn-primary'
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
          >
            Next
          </button>
        </div>
      </div>

      {isModalOpen && (
        <UserEditModalForm
          user={selectedUser || undefined}
          onCancel={() => setIsModalOpen(false)}
          onSubmit={handleAddUser}
          isUserLoading={submitLoading}
        />
      )}
    </div>
  )
}

// ------------------- ROUTES -------------------
const UsersPage = () => (
  <Routes>
    <Route element={<Outlet />}>
      <Route
        path='users'
        element={
          <>
            <PageTitle breadcrumbs={usersBreadcrumbs}>Users Management</PageTitle>
            <UsersListWrapper />
          </>
        }
      />
    </Route>
    <Route index element={<Navigate to='/apps/user-management/users' />} />
  </Routes>
)

export default UsersPage
