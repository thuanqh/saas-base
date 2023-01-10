import { Box } from "@chakra-ui/react"
import SidebarWithHeader from "../components/Sidebar"
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import type { Session } from "next-auth";


const Dashboard = (session: Session) => {

  return (
    <SidebarWithHeader>
      <Box>Dashboard {session?.user?.email}</Box>
    </SidebarWithHeader>
  )


}

export default Dashboard

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)

  if (!session) {
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: false,
      }
    }
  }

  return {
    props: {
      session
    }
  }
}