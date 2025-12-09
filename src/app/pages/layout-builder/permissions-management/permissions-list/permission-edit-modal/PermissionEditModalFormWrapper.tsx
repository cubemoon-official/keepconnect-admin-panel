import {useQuery} from '@tanstack/react-query'
import {PermissionEditModalForm} from './PermissionEditModalForm'
import {isNotEmpty, QUERIES} from '../../../../../../_metronic/helpers'
import {useListView} from '../core/ListViewProvider'
import {getUserById} from '../core/_requests'

const PermissionEditModalFormWrapper = () => {
  const {itemIdForUpdate} = useListView()
  const enabledQuery: boolean = isNotEmpty(itemIdForUpdate)
  const {
    isLoading,
    data: user,
    error,
  } = useQuery({
    queryKey: [`${QUERIES.USERS_LIST}-user-${itemIdForUpdate}`],
    queryFn: () => getUserById(itemIdForUpdate),
    enabled: enabledQuery,
  }
  )

  if (!itemIdForUpdate) {
    // return <PermissionEditModalForm isUserLoading={isLoading} user={{id: undefined}} />
  }

  if (!isLoading && !error && user) {
    // return <PermissionEditModalForm isUserLoading={isLoading} user={user} />
  }

  return null
}

export {PermissionEditModalFormWrapper}
