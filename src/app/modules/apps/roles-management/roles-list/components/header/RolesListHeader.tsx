import {useListView} from '../../core/ListViewProvider'
import { RolesListToolbar } from './RoleListToolbar'
import {RolesListGrouping} from './RolesListGrouping'
import {RolesListSearchComponent} from './RolesListSearchComponent'

const RolesListHeader = () => {
  const {selected} = useListView()
  return (
    <div className='card-header border-0 pt-6'>
      <RolesListSearchComponent />
      {/* begin::Card toolbar */}
      <div className='card-toolbar'>
        {/* begin::Group actions */}
        {selected.length > 0 ? <RolesListGrouping /> : <RolesListToolbar />}
        {/* end::Group actions */}
      </div>
      {/* end::Card toolbar */}
    </div>
  )
}

export {RolesListHeader}
