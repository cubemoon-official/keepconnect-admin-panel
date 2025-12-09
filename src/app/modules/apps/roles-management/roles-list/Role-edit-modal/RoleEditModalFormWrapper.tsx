// import {useQuery} from '@tanstack/react-query'
// import {RoleEditModalForm} from './RoleEditModalForm'
// import {isNotEmpty, QUERIES} from '../../../../../../_metronic/helpers'
// import {useListView} from '../core/ListViewProvider'
// import {getUserById} from '../core/_requests'

// const RoleEditModalFormWrapper = () => {
//   const {itemIdForUpdate} = useListView()
//   const enabledQuery: boolean = isNotEmpty(itemIdForUpdate)
//   const {
//     isLoading,
//     data: user,
//     error,
//   } = useQuery({
//     queryKey: [`${QUERIES.USERS_LIST}-user-${itemIdForUpdate}`],
//     queryFn: () => getUserById(itemIdForUpdate),
//     enabled: enabledQuery,
//   }
//   )

//   if (!itemIdForUpdate) {
//     return <RoleEditModalForm isUserLoading={isLoading} user={{id: undefined}} />
//   }

//   if (!isLoading && !error && user) {
//     return <RoleEditModalForm isUserLoading={isLoading} user={user} />
//   }

//   return null
// }

// export {RoleEditModalFormWrapper}
