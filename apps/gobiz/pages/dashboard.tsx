import { Box, Center, Heading } from "@chakra-ui/react"
import { trpc } from "../utils/trpc";
import AdminLayout from "../layouts/AdminLayout"

const Dashboard = () => {
  const { data: session } = trpc.auth.getSession.useQuery();

  if (!session) {
    return (
      <Center height='100vh'>
        <Heading>Please Signin</Heading>
      </Center>
    )
  }

  return (
    <AdminLayout>
      <Box>Dashboard {session?.user.name}</Box>
    </AdminLayout>
  )
}

export default Dashboard
