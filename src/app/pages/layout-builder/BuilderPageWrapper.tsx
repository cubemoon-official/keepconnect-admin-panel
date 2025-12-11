import {FC} from 'react'
import {PageTitle} from '../../../_metronic/layout/core'
// import {BuilderPage} from './BuilderPage'
import PermissionsPage from './permissions-management/PermissionsPage'

const BuilderPageWrapper: FC = () => {
  return (
    <>
      <PageTitle breadcrumbs={[]}>Layout Builder</PageTitle>
      <PermissionsPage/>
    </>
  )
}

export default BuilderPageWrapper
