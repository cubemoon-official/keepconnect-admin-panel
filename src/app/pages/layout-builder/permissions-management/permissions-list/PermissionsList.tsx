import {ListViewProvider, useListView} from './core/ListViewProvider'
import {QueryRequestProvider} from './core/QueryRequestProvider'
import {QueryResponseProvider} from './core/QueryResponseProvider'
import {PermissionsListHeader} from './components/header/PermissionsListHeader'
import {PermissionsTable} from './table/PermissionsTable'
import {PermissionEditModal} from './permission-edit-modal/PermissionEditModal'
import {KTCard} from '../../../../../_metronic/helpers'
import { Toolbar } from '../../../../../_metronic/layout/components/toolbar/Toolbar'
import { Content } from '../../../../../_metronic/layout/components/Content'

const PermissionsList = () => {
  const {itemIdForUpdate} = useListView()
  return (
    <>
      <KTCard>
        <PermissionsListHeader />
        <PermissionsTable />
      </KTCard>
      {itemIdForUpdate !== undefined && <PermissionEditModal />}
    </>
  )
}

const PermissionsListWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <Toolbar />
        <Content>
          <PermissionsList />
        </Content>
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
)

export {PermissionsListWrapper}
