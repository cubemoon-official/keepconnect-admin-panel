import {useListView} from '../../core/ListViewProvider'
import {PermissionsListToolbar} from './PermissionListToolbar'
import {PermissionsListGrouping} from './PermissionsListGrouping'
import {PermissionsListSearchComponent } from './PermissionsListSearchComponent'

const PermissionsListHeader = () => {
  const {selected} = useListView()
  return (
    <div className='card-header border-0 pt-6'>
      <PermissionsListSearchComponent />
      {/* begin::Card toolbar */}
      <div className='card-toolbar'>
        {/* begin::Group actions */}
        {selected.length > 0 ? <PermissionsListGrouping /> : <PermissionsListToolbar />}
        {/* end::Group actions */}
      </div>
      {/* end::Card toolbar */}
    </div>
  )
}

export {PermissionsListHeader}
