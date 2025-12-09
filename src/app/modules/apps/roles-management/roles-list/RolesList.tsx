import {ListViewProvider, useListView} from './core/ListViewProvider'
import {QueryRequestProvider} from './core/QueryRequestProvider'
import {QueryResponseProvider} from './core/QueryResponseProvider'
import {RolesListHeader} from './components/header/RolesListHeader'
// import {RolesTable} from './table/RolesTable'
// import {RoleEditModal} from './Role-edit-modal/RoleEditModal'
import {KTCard} from '../../../../../_metronic/helpers'
import { Toolbar } from '../../../../../_metronic/layout/components/toolbar/Toolbar'
import { Content } from '../../../../../_metronic/layout/components/Content'

const RolesList = () => {
  const {itemIdForUpdate} = useListView()
  return (
    <>
      <KTCard>
        <RolesListHeader />
        {/* <RolesTable /> */}
      </KTCard>
      {/* {itemIdForUpdate !== undefined && <RoleEditModal />} */}
    </>
  )
}

const RolesListWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <Toolbar />
        <Content>
          <RolesList />
        </Content>
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
)

export {RolesListWrapper}
