import React, { PropsWithChildren } from 'react'
import SidebarWithHeader from '../components/Sidebar'

const AdminLayout = (props: PropsWithChildren) => {
  const { children } = props
  return (
    <SidebarWithHeader>
      {children}
    </SidebarWithHeader>
  )
}

export default AdminLayout