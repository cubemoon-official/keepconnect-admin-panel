import {lazy, FC, Suspense} from 'react'
import {Route, Routes, Navigate} from 'react-router-dom'
import {MasterLayout} from '../../_metronic/layout/MasterLayout'
import TopBarProgress from 'react-topbar-progress-indicator'
import {DashboardWrapper} from '../pages/dashboard/DashboardWrapper'
import {getCSSVariableValue} from '../../_metronic/assets/ts/_utils'
import {WithChildren} from '../../_metronic/helpers'
import MessageLogsPage from '../modules/apps/Messagelogs-management/MesssageLogsPage'

const PrivateRoutes = () => {
  const ProfilePage = lazy(() => import('../modules/profile/ProfilePage'))
  const WizardsPage = lazy(() => import('../modules/wizards/WizardsPage'))
  const AccountPage = lazy(() => import('../modules/accounts/AccountPage'))
  const WidgetsPage = lazy(() => import('../modules/widgets/WidgetsPage'))
  const ChatPage = lazy(() => import('../modules/apps/chat/ChatPage'))
  const UsersPage = lazy(() => import('../modules/apps/user-management/UsersPage'))
  const RolesPage = lazy(() => import('../modules/apps/roles-management/RolesPage'))
  const PermissionsPage = lazy(() => import('../pages/layout-builder/permissions-management/PermissionsPage'))
  const TransactionsPage = lazy(() => import('../modules/apps/transactions-management/TransactionsPage'))
  const SubscriptionsPage = lazy(() => import('../modules/apps/subscriptions-management/SubscriptionsPage'))
  const DailyPostsPage = lazy(() => import('../modules/apps/dailyposts-management/DailyPostsPage'))
  const LogsPage = lazy(() => import('../modules/apps/Messagelogs-management/MesssageLogsPage'))
  return (
    <Routes>
      <Route element={<MasterLayout />}>
        {/* Redirect to Dashboard after success login/registartion */}
        <Route path='auth/*' element={<Navigate to='/dashboard' />} />
        {/* Pages */}
        <Route path='dashboard' element={<DashboardWrapper />} />
        {/* Lazy Modules */}
        <Route
          path='crafted/pages/profile/*'
          element={
            <SuspensedView>
              <ProfilePage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/pages/wizards/*'
          element={
            <SuspensedView>
              <WizardsPage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/widgets/*'
          element={
            <SuspensedView>
              <WidgetsPage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/account/*'
          element={
            <SuspensedView>
              <AccountPage />
            </SuspensedView>
          }
        />
        <Route
          path='apps/chat/*'
          element={
            <SuspensedView>
              <ChatPage />
            </SuspensedView>
          }
        />
        <Route
          path='apps/user-management/*'
          element={
            <SuspensedView>
              <UsersPage />
            </SuspensedView>
          }
        />
        <Route
          path='apps/roles-management/*'
          element={
            <SuspensedView>
              <RolesPage />
            </SuspensedView>
          }
        />
        <Route
          path='apps/permissions-management/*'
          element={
            <SuspensedView>
              <PermissionsPage />
            </SuspensedView>
          }
        />

        <Route
          path='apps/transactions-management/*'
          element={
            <SuspensedView>
              <TransactionsPage />
            </SuspensedView>
          }
        />

        <Route
          path='apps/subscriptions-management/*'
          element={
            <SuspensedView>
              <SubscriptionsPage />
            </SuspensedView>
          }
        />

        
        <Route
          path='apps/dailyposts-management/*'
          element={
            <SuspensedView>
                  <DailyPostsPage />
            </SuspensedView>
          }
        />

        <Route
          path='apps/Messagelogs-management/*'
          element={
            <SuspensedView>
                  <MessageLogsPage/>
            </SuspensedView>
          }
        />

        {/* Page Not Found */}
        <Route path='*' element={<Navigate to='/error/404' />} />
      </Route>

    </Routes>
  )
}

const SuspensedView: FC<WithChildren> = ({children}) => {
  const baseColor = getCSSVariableValue('--bs-primary')
  TopBarProgress.config({
    barColors: {
      '0': baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  })
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>
}

export {PrivateRoutes}
