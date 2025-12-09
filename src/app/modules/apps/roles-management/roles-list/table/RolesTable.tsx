// import { useMemo } from 'react'
// import {
//   useReactTable,
//   Row,
//   getCoreRowModel,
//   ColumnDef,
//   flexRender,
// } from '@tanstack/react-table'
// import { KTCardBody } from '../../../../../../_metronic/helpers'
// import { RolesListPagination } from '../components/pagination/RolesListPagination'
// import { RolesListLoading } from '../components/loading/RolesListLoading'

// type User = {
//   id: number
//   fullName: string
//   role: string
//   lastLogin: string
//   joinedDay: string
// }

// const RolesTable = () => {
//   const usersData: User[] = [
//     { id: 1, fullName: 'John Doe', role: 'Administrator', lastLogin: '2025-11-03', joinedDay: '2023-09-15' },
//     { id: 2, fullName: 'Emma Smith', role: 'Editor', lastLogin: '2025-10-29', joinedDay: '2024-01-12' },
//     { id: 3, fullName: 'Liam Brown', role: 'Viewer', lastLogin: '2025-10-10', joinedDay: '2023-12-05' },
//     { id: 4, fullName: 'Sophia Johnson', role: 'Manager', lastLogin: '2025-11-06', joinedDay: '2023-11-20' },
//     { id: 5, fullName: 'Olivia Davis', role: 'Support', lastLogin: '2025-11-01', joinedDay: '2024-02-01' },
//   ]

//   const isLoading = false

//   const columns = useMemo<ColumnDef<User>[]>(
//     () => [
//       {
//         header: 'Full Name',
//         accessorKey: 'fullName',
//         cell: (info) => (
//           <div className='d-flex align-items-center'>
//             <div className='symbol symbol-40px me-3'>
//               <img
//                 src={`https://ui-avatars.com/api/?name=${info.getValue()}&background=random`}
//                 alt={info.getValue()}
//                 className='rounded-circle'
//               />
//             </div>
//             <div className='fw-bold text-gray-800'>{info.getValue() as string}</div>
//           </div>
//         ),
//       },
//       {
//         header: 'Role',
//         accessorKey: 'role',
//         cell: (info) => <span className='text-gray-600'>{info.getValue() as string}</span>,
//       },
//       {
//         header: 'Last Login',
//         accessorKey: 'lastLogin',
//         cell: (info) => <span className='text-gray-700'>{info.getValue() as string}</span>,
//       },
//       {
//         header: 'Joined Day',
//         accessorKey: 'joinedDay',
//         cell: (info) => <span className='text-gray-700'>{info.getValue() as string}</span>,
//       },
//       {
//         header: 'Actions',
//         id: 'actions',
//         cell: ({ row }) => (
//           <div className='text-end'>
//             <a
//               href='#'
//               className='btn btn-light btn-active-light-primary btn-sm'
//               data-kt-menu-trigger='click'
//               data-kt-menu-placement='bottom-end'
//             >
//               Actions
//               <i className='bi bi-three-dots-vertical ms-2'></i>
//             </a>

//             {/* ✅ Dropdown Menu */}
//             <div
//               className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold w-125px'
//               data-kt-menu='true'
//             >
//               <div className='menu-item px-3'>
//                 <a
//                   href='#'
//                   className='menu-link px-3'
//                   onClick={() => alert(`Edit: ${row.original.fullName}`)}
//                 >
//                   Edit
//                 </a>
//               </div>
//               <div className='menu-item px-3'>
//                 <a
//                   href='#'
//                   className='menu-link px-3 text-danger'
//                   onClick={() => alert(`Delete: ${row.original.fullName}`)}
//                 >
//                   Delete
//                 </a>
//               </div>
//             </div>
//           </div>
//         ),
//       },
//     ],
//     []
//   )

//   const data = useMemo(() => usersData, [])
//   const table = useReactTable({
//     data,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//   })

//   return (
//     <KTCardBody className='py-4'>
//       {/* ✅ Responsive Table */}
//       <div className='table-responsive'>
//         <table
//           id='kt_table_roles'
//           className='table align-middle table-row-dashed fs-6 gy-5 mb-0'
//         >
//           <thead>
//             {table.getHeaderGroups().map((headerGroup) => (
//               <tr
//                 key={headerGroup.id}
//                 className='text-start text-muted fw-bolder fs-7 text-uppercase gs-0'
//               >
//                 {headerGroup.headers.map((header) => (
//                   <th key={header.id} className='min-w-150px'>
//                     {header.isPlaceholder
//                       ? null
//                       : flexRender(header.column.columnDef.header, header.getContext())}
//                   </th>
//                 ))}
//               </tr>
//             ))}
//           </thead>

//           <tbody className='text-gray-600 fw-bold'>
//             {table.getRowModel().rows.length > 0 ? (
//               table.getRowModel().rows.map((row: Row<User>) => (
//                 <tr key={row.id}>
//                   {row.getVisibleCells().map((cell) => (
//                     <td key={cell.id}>
//                       {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                     </td>
//                   ))}
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={columns.length}>
//                   <div className='text-center fw-semibold text-gray-500 py-10'>
//                     No matching records found
//                   </div>
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* ✅ Pagination + Loading */}
//       <div className='mt-5'>
//         <RolesListPagination />
//       </div>

//       {isLoading && <RolesListLoading />}
//     </KTCardBody>
//   )
// }

// export { RolesTable }
