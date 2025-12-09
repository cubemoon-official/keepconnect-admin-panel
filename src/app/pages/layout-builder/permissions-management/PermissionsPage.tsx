import React, { useMemo, useState } from 'react'
import { useReactTable, getCoreRowModel, ColumnDef, flexRender } from '@tanstack/react-table'

// 🔹 Type Definition
type Permission = {
  id: number
  permissionName: string
}

// 🔹 Add Permission Modal
const AddPermissionModal: React.FC<{
  onClose: () => void
  onSave: (permissionName: string) => void
}> = ({ onClose, onSave }) => {
  const [permissionName, setPermissionName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (permissionName.trim()) {
      onSave(permissionName.trim())
    }
  }

  return (
    <div
      className='modal fade show'
      style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div className='modal-dialog modal-dialog-centered'>
        <div className='modal-content p-4 rounded-3 shadow-sm'>
          <div className='modal-header border-0'>
            <h5 className='modal-title fw-bold'>Add Permission</h5>
            <button type='button' className='btn-close' onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className='modal-body'>
              <div className='mb-3'>
                <label className='form-label fw-semibold'>Permission Name</label>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Enter permission name'
                  value={permissionName}
                  onChange={(e) => setPermissionName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className='modal-footer border-0'>
              <button type='button' className='btn btn-light' onClick={onClose}>
                Cancel
              </button>
              <button type='submit' className='btn btn-primary'>
                Save Permission
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// 🔹 Permissions List Page
const PermissionsPage: React.FC = () => {
  const initialPermissionsData: Permission[] = [
    { id: 1, permissionName: 'View Users' },
    { id: 2, permissionName: 'Edit Users' },
    { id: 3, permissionName: 'Delete Users' },
    { id: 4, permissionName: 'Manage Roles' },
    { id: 5, permissionName: 'Access Dashboard' },
    { id: 6, permissionName: 'Update Settings' },
    { id: 7, permissionName: 'Create Reports' },
    { id: 8, permissionName: 'View Logs' },
    { id: 9, permissionName: 'Manage Permissions' },
    { id: 10, permissionName: 'Audit Activity' },
  ]

  const [permissionsData, setPermissionsData] = useState<Permission[]>(initialPermissionsData)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const pageSize = 5

  const filteredData = permissionsData.filter((item) =>
    item.permissionName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredData.length / pageSize)

  const paginatedData = useMemo(
    () => filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [filteredData, currentPage]
  )

  const columns = useMemo<ColumnDef<Permission>[]>(
    () => [
      {
        header: 'Permission Name',
        accessorKey: 'permissionName',
        cell: (info) => <span className='fw-semibold text-dark'>{info.getValue() as string}</span>,
      },
      {
        header: () => <div className='text-end'>Actions</div>,
        id: 'actions',
        cell: (info) => {
          const permission = info.row.original
          return (
            <div className='text-end'>
              <button
                className='btn btn-sm btn-light-primary me-2'
                onClick={() => alert(`Edit: ${permission.permissionName}`)}
              >
                <i className='bi bi-pencil-square'></i> Edit
              </button>
              <button
                className='btn btn-sm btn-light-danger'
                onClick={() => alert(`Delete: ${permission.permissionName}`)}
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

  const handleAddPermission = (name: string) => {
    const newPermission: Permission = {
      id: permissionsData.length + 1,
      permissionName: name,
    }
    setPermissionsData([...permissionsData, newPermission])
    setIsModalOpen(false)
  }

  return (
    <div className='container-fluid mt-15' style={{ maxWidth: '95%' }}>
      {/* Page Header */}
      <div
        className='d-flex align-items-center justify-content-start mb-5'
        style={{ borderRadius: '8px', padding: '10px 20px', color: '#fff' }}
      >
        <h5 className='fw-bold mb-0' style={{ fontSize: '1.2rem', letterSpacing: '0.3px', color: '#fff' }}>
          Permissions-Management
        </h5>
      </div>

      {/* Table Section */}
      <div
        className='py-5'
        style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', padding: '60px' }}
      >
        {/* Table Header + Search + Add Button */}
        <div className='d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3'>
          <h4 className='fw-bold text-primary mb-0'>Permissions List</h4>

          <div className='d-flex align-items-center gap-2'>
            {/* Search */}
            <div
              className='d-flex align-items-center px-3 py-1 shadow-sm'
              style={{ backgroundColor: '#f5f8fa', borderRadius: '5px', border: '1px solid #e1e3ea', width: '180px' }}
            >
              <i className='bi bi-search text-muted me-2'></i>
              <input
                type='text'
                className='form-control border-0 bg-transparent'
                placeholder='Search permission...'
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
              />
            </div>

            {/* Add Permission Button */}
            <button className='btn btn-primary fw-semibold' onClick={() => setIsModalOpen(true)}>
              <i className='bi bi-plus-lg me-1'></i> Add Permission
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
                    <th key={header.id} className={header.column.id === 'actions' ? 'text-end py-3' : 'py-3'}>
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
                      <td key={cell.id} className={cell.column.id === 'actions' ? 'text-end' : ''}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className='text-center py-5 text-muted'>
                    No permissions found.
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
            <button className='btn btn-sm btn-light me-2' disabled={currentPage === 1} onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}>
              Previous
            </button>
            <button className='btn btn-sm btn-primary' disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}>
              Next
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && <AddPermissionModal onClose={() => setIsModalOpen(false)} onSave={handleAddPermission} />}
    </div>
  )
}

export default PermissionsPage
