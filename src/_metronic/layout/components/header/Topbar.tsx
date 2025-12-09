
import { FC } from 'react'
import clsx from 'clsx'
import { KTIcon, toAbsoluteUrl } from '../../../helpers'
import {
  HeaderNotificationsMenu,
  HeaderUserMenu,
  QuickLinks,
  Search,
  ThemeModeSwitcher,
} from '../../../partials'
import { useAuth } from '../../../../app/modules/auth'

const toolbarButtonMarginClass = 'ms-1 ms-lg-3',
  toolbarButtonHeightClass = 'btn-active-light-primary btn-custom w-30px h-30px w-md-40px h-md-40p',
  toolbarUserAvatarHeightClass = 'symbol-30px symbol-md-40px',
  toolbarButtonIconSizeClass = 'fs-1'



const Topbar: FC = () => {

  const { currentUser } = useAuth() // <-- get current user here

  return (
    <div className='d-flex align-items-stretch flex-shrink-0'>
      <div className='topbar d-flex align-items-stretch flex-shrink-0'>

        {/* Activities */}
        <div className={clsx('d-flex align-items-center ', toolbarButtonMarginClass)}>
          {/* begin::Drawer toggle */}
          {/* <div
            className={clsx(
              'btn btn-icon btn-active-light-primary btn-custom',
              toolbarButtonHeightClass
            )}
            id='kt_activities_toggle'
          >
            <KTIcon iconName='chart-simple' className={toolbarButtonIconSizeClass} />
          </div> */}
          {/* end::Drawer toggle */}
        </div>

        {/* NOTIFICATIONS */}
        <div className={clsx('d-flex align-items-center', toolbarButtonMarginClass)}>
          {/* begin::Menu- wrapper */}
          {/* <div
            className={clsx(
              'btn btn-icon btn-active-light-primary btn-custom',
              toolbarButtonHeightClass
            )}
            data-kt-menu-trigger='click'
            data-kt-menu-attach='parent'
            data-kt-menu-placement='bottom-end'
            data-kt-menu-flip='bottom'
          >
            <KTIcon iconName='element-plus' className={toolbarButtonIconSizeClass} />
          </div> */}
          {/* <HeaderNotificationsMenu /> */}
          {/* end::Menu wrapper */}
        </div>

        {/* CHAT */}
        <div className={clsx('d-flex align-items-center', toolbarButtonMarginClass)}>
          {/* begin::Menu wrapper */}
          {/* <div
            className={clsx(
              'btn btn-icon btn-active-light-primary btn-custom position-relative',
              toolbarButtonHeightClass
            )}
            id='kt_drawer_chat_toggle'
          >
            <KTIcon iconName='message-text-2' className={toolbarButtonIconSizeClass} />

            <span className='bullet bullet-dot bg-success h-6px w-6px position-absolute translate-middle top-0 start-50 animation-blink'></span>
          </div> */}
          {/* end::Menu wrapper */}
        </div>

        {/* Quick links */}
        <div className={clsx('d-flex align-items-center', toolbarButtonMarginClass)}>
          {/* begin::Menu wrapper */}
          {/* <div
            className={clsx(
              'btn btn-icon btn-active-light-primary btn-custom',
              toolbarButtonHeightClass
            )}
            data-kt-menu-trigger='click'
            data-kt-menu-attach='parent'
            data-kt-menu-placement='bottom-end'
            data-kt-menu-flip='bottom'
          >
            <KTIcon iconName='element-11' className={toolbarButtonIconSizeClass} />
          </div> */}
          {/* <QuickLinks /> */}
          {/* end::Menu wrapper */}
        </div>


        {/* Search */}
        {/* <div className={clsx('d-flex align-items-stretch', toolbarButtonMarginClass)}>
          <Search />
        </div> */}


        {/* begin::User */}
        <div className={clsx('d-flex align-items-center', toolbarButtonMarginClass)} id='kt_header_user_menu_toggle'>
          {/* begin::Toggle */}
          <div
            className={clsx('cursor-pointer symbol rounded-full d-flex align-items-center', toolbarUserAvatarHeightClass)}
            data-kt-menu-trigger='click'
            data-kt-menu-attach='parent'
            data-kt-menu-placement='bottom-end'
            data-kt-menu-flip='bottom'
          >

            {/* Welcome message next to avatar */}
            <div className='ms-3 d-none d-lg-flex flex-column'>
              <span className='text-gray-100 fw-bold fs-6  px-3'>Welcome, {currentUser?.first_name}</span>
              {/* <span className='text-gray-100 fs-7'>{currentUser?.email}</span> */}
            </div>

            <img
              className='h-55px w-55px rounded-circle object-cover'
              src={toAbsoluteUrl('media/avatars/300-2.jpg')}
              alt='metronic'
            />

          </div>

           {/* begin::Theme mode */}
            <div className={clsx('d-flex align-items-center ', toolbarButtonMarginClass)}>
              <ThemeModeSwitcher toggleBtnClass={toolbarButtonHeightClass} />
            </div>
            {/* end::Theme mode */}


          <HeaderUserMenu />
          {/* end::Toggle */}
        </div>
        {/* end::User */}
      </div>
    </div>
  )
}

export { Topbar }
