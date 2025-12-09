import React, { useMemo, useState } from 'react'
import { Route, Routes, Outlet, Navigate } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../../_metronic/layout/core'
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table'

// 🔹 Breadcrumbs
const usersBreadcrumbs: Array<PageLink> = [
  {
    title: 'Roles Management',
    path: '/apps/roles-management/roles',
    isSeparator: false,
    isActive: false,
  },
  {
    title: '',
    path: '',
    isSeparator: true,
    isActive: false,
  },
]

// 🔹 Add/Edit Role Modal (reused for both)
const RoleModal = ({
  onClose,
  onSave,
  initialData,
}: {
  onClose: () => void
  onSave: (role: any) => void
  initialData?: any
}) => {
  const [roleName, setRoleName] = useState(initialData?.roleName || initialData?.role || '')
  const [permissions, setPermissions] = useState<string[]>(initialData?.permissions || [])

  const allPermissions = [
    'View Users',
    'Create Users',
    'Edit Users',
    'Delete Users',
    'View Roles',
    'Edit Roles',
    'Manage Permissions',
  ]

  const togglePermission = (perm: string) => {
    if (permissions.includes(perm)) {
      setPermissions(permissions.filter((p) => p !== perm))
    } else {
      setPermissions([...permissions, perm])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...initialData,
      roleName,
      role: roleName,
      permissions,
    })
  }

  return (
    <div
      className='modal fade show'
      style={{
        display: 'block',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}
    >
      <div className='modal-dialog modal-dialog-centered'>
        <div className='modal-content p-4 rounded-3 shadow-sm'>
          <div className='modal-header border-0'>
            <h5 className='modal-title fw-bold'>
              {initialData ? 'Edit Role' : 'Add Role'}
            </h5>
            <button type='button' className='btn-close' onClick={onClose}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className='modal-body'>
              <div className='mb-3'>
                <label className='form-label fw-semibold'>Role Name</label>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Enter role name'
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  required
                />
              </div>

              <div className='mb-3'>
                <label className='form-label fw-semibold'>Permissions</label>
                <div
                  className='border rounded-3 p-3'
                  style={{ maxHeight: '200px', overflowY: 'auto' }}
                >
                  {allPermissions.map((perm) => (
                    <div key={perm} className='form-check mb-2'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        id={perm}
                        checked={permissions.includes(perm)}
                        onChange={() => togglePermission(perm)}
                      />
                      <label className='form-check-label' htmlFor={perm}>
                        {perm}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className='modal-footer border-0'>
              <button type='button' className='btn btn-light' onClick={onClose}>
                Cancel
              </button>
              <button type='submit' className='btn btn-primary'>
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// 🔹 Main Roles List Wrapper
const RolesListWrapper: React.FC = () => {
  const initialRoles = [
    { id: 1, fullName: 'John Carter', role: 'Administrator', lastLogin: '2025-11-08', joinedDate: '2024-01-20' },
    { id: 2, fullName: 'Sarah Johnson', role: 'Manager', lastLogin: '2025-11-06', joinedDate: '2024-03-15' },
    { id: 3, fullName: 'Amit Verma', role: 'Editor', lastLogin: '2025-11-05', joinedDate: '2024-04-10' },
    { id: 4, fullName: 'Lisa Wong', role: 'HR Executive', lastLogin: '2025-10-30', joinedDate: '2024-05-12' },
  ]

  const [data, setData] = useState(initialRoles)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [modalData, setModalData] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const pageSize = 5

  const filteredData = useMemo(() => {
    return data.filter(
      (role) =>
        role.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.role.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [data, searchTerm])

  const totalPages = Math.ceil(filteredData.length / pageSize)
  const paginatedData = useMemo(
    () => filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [filteredData, currentPage]
  )

  const handleAddRole = () => {
    setModalData(null)
    setIsModalOpen(true)
  }

  const handleEdit = (role: any) => {
    setModalData(role)
    setIsModalOpen(true)
  }

  const handleDelete = (role: any) => {
    if (window.confirm(`Are you sure you want to delete ${role.role}?`)) {
      setData((prev) => prev.filter((r) => r.id !== role.id))
    }
  }

  const handleSave = (updatedRole: any) => {
    if (updatedRole.id) {
      // Editing existing role
      setData((prev) =>
        prev.map((r) => (r.id === updatedRole.id ? { ...r, ...updatedRole } : r))
      )
    } else {
      // Adding new role
      const newEntry = {
        id: data.length + 1,
        fullName: updatedRole.roleName,
        role: updatedRole.roleName,
        lastLogin: new Date().toISOString().split('T')[0],
        joinedDate: new Date().toISOString().split('T')[0],
      }
      setData([...data, newEntry])
    }
    setIsModalOpen(false)
  }

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      { header: 'Full Name', accessorKey: 'fullName' },
      { header: 'Role', accessorKey: 'role' },
      { header: 'Last Login', accessorKey: 'lastLogin' },
      { header: 'Joined Date', accessorKey: 'joinedDate' },
      {
        header: 'Actions',
        id: 'actions',
        cell: (info) => {
          const role = info.row.original
          return (
            <div className='d-flex justify-content-end gap-2'>
              <button
                className='btn btn-sm btn-light-primary px-3'
                onClick={() => handleEdit(role)}
              >
                <i className='bi bi-pencil-square'></i> Edit
              </button>
              <button
                className='btn btn-sm btn-light-danger px-3'
                onClick={() => handleDelete(role)}
              >
                <i className='bi bi-trash'></i> Delete
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

  return (
    <div className='container-fluid mt-15' style={{ maxWidth: '95%' }}>
      <div className='d-flex align-items-center justify-content-start mb-5'>
        <h1 className='fw-bold mb-0' style={{ fontSize: '1.2rem', letterSpacing: '0.3px', color: '#fff' }}>
          Roles Management
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
          <h4 className='fw-bold text-primary mb-0'>Roles List</h4>

          <div className='d-flex align-items-center gap-3'>
            <div
              className='d-flex align-items-center px-3 py-1 shadow-sm'
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
                placeholder='Search role...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button className='btn btn-primary fw-semibold' onClick={handleAddRole}>
              <i className='bi bi-plus-lg me-1'></i> Add Role
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
                      className={`${header.column.id === 'actions' ? 'text-end pe-3' : ''}`}
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
                        className={`${cell.column.id === 'actions' ? 'text-end pe-3' : ''}`}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className='text-center py-5 text-muted'>
                    No roles found.
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

      {isModalOpen && (
        <RoleModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          initialData={modalData}
        />
      )}
    </div>
  )
}

// 🔹 Routes Wrapper
const RolesPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='roles'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>Roles Management</PageTitle>
              <RolesListWrapper />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/apps/roles-management/roles' />} />
    </Routes>
  )
}

export default RolesPage
