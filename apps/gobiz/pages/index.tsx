import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { AppRouter } from "@lungvang/api";
import { inferProcedureOutput } from "@trpc/server";
import { signIn, signOut } from "next-auth/react";
import { trpc } from "../utils/trpc";

export function Index() {
  const postQuery = trpc.post.all.useQuery();
  const { data: session } = trpc.auth.getSession.useQuery();
  const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery(
    undefined,
    {
      enabled: !!session?.user
    }
  )

  return (
    <Box>
      <Heading>Welcome Gobiz</Heading>
      <Box>
        {postQuery.data ? (
          <Box>
            {postQuery.data?.map((post: inferProcedureOutput<AppRouter["post"]["all"]>[number]) => {
              return (
                <Box key={post.id}>
                  <Heading>{post.title}</Heading>
                  <Text>{post.content}</Text>
                </Box>
              )
            })}
          </Box>
        ) : (
          <Text>Loading...</Text>
        )}
      </Box>
      <Box>
        {session?.user && (
          <Text>
            {session && <span>Logged in as {session?.user?.name}</span>}
            {secretMessage && <span> - {secretMessage}</span>}
          </Text>
        )}
        <Button onClick={session ? () => signOut() : () => signIn()}>{session ? "Sign out" : "Sign in"}</Button>
      </Box>
    </Box >
  );
}

export default Index;
