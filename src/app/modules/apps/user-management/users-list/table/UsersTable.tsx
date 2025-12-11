import React from 'react'
import { flexRender } from '@tanstack/react-table'

type Props = {
  table: any
  tableLoading: boolean
  columns: any[]
}

const UsersTable: React.FC<Props> = ({ table, tableLoading, columns }) => {
  return (
    <div className='table-responsive'>
      <table className='table table-hover'>
        <thead>
          {table.getHeaderGroups().map((hg: any) => (
            <tr key={hg.id}>
              {hg.headers.map((h: any) => (
                <th key={h.id}>{flexRender(h.column.columnDef.header, h.getContext())}</th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {tableLoading ? (
            [...Array(5)].map((_, i) => (
              <tr key={i}>
                <td colSpan={columns.length} className='py-4 text-center'>
                  <div className='placeholder-glow'>
                    <span className='placeholder col-6'></span>
                  </div>
                </td>
              </tr>
            ))
          ) : table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row: any) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell: any) => (
                  <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className='text-center py-5'>
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default UsersTable
