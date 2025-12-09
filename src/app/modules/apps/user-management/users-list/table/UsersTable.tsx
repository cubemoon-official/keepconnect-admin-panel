import { useMemo, useState } from 'react'
import { useReactTable, Row, getCoreRowModel } from '@tanstack/react-table'
import { CustomHeaderColumn } from './columns/CustomHeaderColumn'
import { CustomRow } from './columns/CustomRow'
import { useQueryResponseData, useQueryResponseLoading } from '../core/QueryResponseProvider'
import { usersColumns } from './columns/_columns'
import { User } from '../core/_models'
import { UsersListLoading } from '../components/loading/UsersListLoading'
import { UsersListPagination } from '../components/pagination/UsersListPagination'
import { KTCardBody } from '../../../../../../_metronic/helpers'

const UsersTable = () => {
  // ✅ Dummy data
  const dummyData: User[] = [
    {
      id: 1,
      name: 'Billu Dilwala',
      email: 'billu@gmail.com',
      position: 'Billu Chaii Shop',
      phone: '+91 87656 76767',
    },
    {
      id: 2,
      name: 'Ravi Kumar',
      email: 'ravi@business.com',
      position: 'Ravi Electronics',
      phone: '+91 98234 22345',
    },
    {
      id: 3,
      name: 'Sita Sharma',
      email: 'sita@fashion.com',
      position: 'Sita Boutique',
      phone: '+91 90012 55555',
    },
    {
      id: 4,
      name: 'Aman Verma',
      email: 'aman@techhub.com',
      position: 'TechHub Solutions',
      phone: '+91 91234 67890',
    },
    {
      id: 5,
      name: 'Priya Singh',
      email: 'priya@designs.com',
      position: 'Priya Designs',
      phone: '+91 90123 45678',
    },
    {
      id: 6,
      name: 'Karan Patel',
      email: 'karan@foodies.com',
      position: 'Foodies Delight',
      phone: '+91 98765 43210',
    },
  ]

  const isLoading = false // we’re using dummy data, so not loading
  const data = useMemo(() => dummyData, [])
  const columns = useMemo(
    () => [
      {
        header: 'Full Name',
        accessorKey: 'name',
      },
      {
        header: 'Email',
        accessorKey: 'email',
      },
      {
        header: 'Business Name',
        accessorKey: 'position',
      },
      {
        header: 'Phone',
        accessorKey: 'phone',
      },
    ],
    []
  )

  // ✅ Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 3 // show 3 rows per page

  const totalPages = Math.ceil(data.length / pageSize)
  const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <KTCardBody className="py-4">
      <div className="table-responsive">
        <table
          id="kt_table_users"
          className="table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer"
        >
          <thead>
            {table.getHeaderGroups().map((columnGroup) => (
              <tr
                key={columnGroup.id}
                className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0"
              >
                {columnGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.column.columnDef.header as string}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="text-gray-600 fw-bold">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row: Row<User>) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {cell.getValue() as string}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4}>
                  <div className="d-flex text-center w-100 align-content-center justify-content-center">
                    No matching records found
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Pagination + Loading */}
      <div className='mt-5'>
        <UsersListPagination />
      </div>


      {isLoading && <UsersListLoading />}
    </KTCardBody>
  )
}

export { UsersTable }
