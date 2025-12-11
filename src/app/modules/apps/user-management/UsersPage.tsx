import React, { useMemo, useState, useEffect } from 'react'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../../_metronic/layout/core'
import { useReactTable, getCoreRowModel, flexRender, ColumnDef } from '@tanstack/react-table'
import { UserEditModalForm } from './users-list/user-edit-modal/UserEditModalForm'
import axios from 'axios'

// ------------------- AXIOS CLIENT -------------------
const TOKEN = localStorage.getItem('auth_token')
const axiosClient = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: { Authorization: TOKEN ? `Bearer ${TOKEN}` : undefined },
})
// -----------------------------------------------------

const usersBreadcrumbs: PageLink[] = [
  { title: 'Users Management', path: '/apps/user-management/users', isSeparator: false, isActive: false },
]

const UsersListWrapper: React.FC = () => {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [tableLoading, setTableLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any | null>(null)
  const [submitLoading, setSubmitLoading] = useState(false)
  const pageSize = 10

  // ------------------- Fetch Users -------------------
  const fetchUsers = async () => {
    setTableLoading(true)
    try {
      const res = await axiosClient.get('/admin/users')
      setData(res.data.users || [])
      setLoading(false)
    } catch (err) {
      console.error('Error fetching users:', err)
    } finally {
      setLoading(false)
      setTableLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // ------------------- Search + Pagination -------------------
  const filteredData = useMemo(
    () =>
      data.filter((user) =>
        [user.name, user.email, user.business_name, user.phone]
          .join(' ')
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      ),
    [data, searchTerm]
  )

  const totalPages = Math.ceil(filteredData.length / pageSize)
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // ------------------- Toggle Status -------------------
  const handleToggleStatus = async (user: any) => {
    try {
      await axiosClient.put(`/admin/users/${user.id}/toggle-status`)
      setData((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, isActive: !u.isActive } : u))
      )
    } catch (err) {
      console.error('Error toggling status:', err)
    }
  }

  // ------------------- Table Columns -------------------
  const columns: ColumnDef<any>[] = [
    { header: 'Full Name', accessorKey: 'name' },
    { header: 'Business Name', accessorKey: 'business_name' },
    { header: 'Phone Number', accessorKey: 'phone' },
    { header: 'Email ID', accessorKey: 'email' },
    {
      header: 'Status',
      id: 'actions',
      cell: (info) => {
        const user = info.row.original
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
  ]

  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  // ------------------- Add or Update User -------------------
  const handleAddUser = async (user: any) => {
    if (!user.role) return alert('Role is required!')

    setSubmitLoading(false)

    try {
      if (selectedUser) {
        await axiosClient.put(`/admin/users/${selectedUser.id}`, user)
      } else {
        await axiosClient.post('/admin/users', user)
      }

      fetchUsers()
      setIsModalOpen(false)
      setSelectedUser(null)
    } catch (err: any) {
      console.error('User save error:', err.response?.data)
      alert(err.response?.data?.message || 'Validation error!')
    }

    setSubmitLoading(false)
  }

  // ------------------- Render -------------------
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}></div>
      </div>
    )
  }

  return (
    <div className='container-fluid mt-15' style={{ maxWidth: '95%' }}>
      <div className='d-flex align-items-center justify-content-start mb-10'>
        <h1 className='fw-bold mt-10 ms-3' style={{ fontSize: '1.3rem', color: '#fff' }}>
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
            <button
              className='btn btn-primary'
              onClick={() => {
                setSelectedUser(null)
                setIsModalOpen(true)
              }}
            >
              Add User
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className='table-responsive'>
          <table className='table table-hover'>
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((h) => (
                    <th key={h.id}>
                      {flexRender(h.column.columnDef.header, h.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody>
              {tableLoading && (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={columns.length} className='py-4 text-center'>
                      <div className="placeholder-glow">
                        <span className="placeholder col-6"></span>
                      </div>
                    </td>
                  </tr>
                ))
              )}

              {!tableLoading && table.getRowModel().rows.length === 0 && (
                <tr>
                  <td colSpan={columns.length} className='text-center py-5'>
                    No users found.
                  </td>
                </tr>
              )}

              {!tableLoading &&
                table.getRowModel().rows.length > 0 &&
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className='d-flex justify-content-end mt-4 align-items-center gap-2'>
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

      {isModalOpen && (
        <UserEditModalForm
          user={selectedUser || undefined}
          onCancel={() => {
            setIsModalOpen(false)
            setSelectedUser(null)
          }}
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
