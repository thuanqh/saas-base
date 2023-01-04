import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { AppRouter } from "@lungvang/api";
import { inferProcedureOutput } from "@trpc/server";
import { createBuilder } from "@trpc/server/dist/core/internals/procedureBuilder";
import { signIn, signOut } from "next-auth/react";
import { util } from "zod";
import { trpc } from "../utils/trpc";

type Post = inferProcedureOutput<AppRouter["post"]["all"]>[number];

function PostItem({ post }: { post: Post }) {
  const utils = trpc.useContext();


  const editPost = trpc.post.update.useMutation({
    async onMutate({ id, data }) {
      await utils.post.all.cancel();
      const allPosts = utils.post.all.getData();
      if (!allPosts) {
        return;
      }
      utils.post.all.setData(
        undefined,
        allPosts.map((t) => t.id === id ? {
          ...t,
          ...data,
        } : t,
        )
      )
    }
  })

  const deletePost = trpc.post.delete.useMutation({
    async onMutate() {
      await utils.post.all.cancel();
      const allPosts = utils.post.all.getData();
      if (!allPosts) {
        return;
      }
      utils.post.all.setData(
        undefined,
        allPosts.filter((t) => t.id != post.id),
      )
    }
  })

  return (
    <Box key={post.id}>
      <Heading>{post.title}</Heading>
      <Text>{post.content}</Text>
      <Button onClick={() => deletePost.mutate(post.id)}>Delete</Button>
    </Box>
  )
}

export function Index() {
  const utils = trpc.useContext();
  const allPosts = trpc.post.all.useQuery(undefined, { staleTime: 3000 });

  const addPost = trpc.post.create.useMutation({
    async onMutate({ title, content }) {
      await utils.post.all.cancel();
      const posts = allPosts.data ?? [];
      utils.post.all.setData(undefined, [
        ...posts,
        {
          id: `${Math.random()}`,
          title,
          content,
        }
      ])
    }
  });

  const { data: session } = trpc.auth.getSession.useQuery();
  const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery(
    undefined,
    {
      enabled: !!session?.user
    }
  )

  const greeting = trpc.auth.hello.useQuery({ text: "Jason" })

  return (
    <Box>
      <Heading>Welcome Gobiz</Heading>
      {greeting.data?.greeting && <Heading>{greeting.data.greeting}</Heading>}
      <Button onClick={() => addPost.mutate({ title: "Post A", content: "Post A Detail" })}>Create Post</Button>
      <Box>
        {allPosts.data ? (
          <Box>
            {allPosts.data?.map((post: Post) => (
              <PostItem key={post.id} post={post} />
            )
            )}
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
