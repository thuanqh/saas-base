import { Box, Button, Container, Heading, Stack, Text } from "@chakra-ui/react";
import { AppRouter } from "@lungvang/api";
import { inferProcedureOutput } from "@trpc/server";
import { CallToActionWithAnnotation, CallToActionWithIllustration } from "@lungvang/chakra-templates";
import Navbar from "../components/Navbar";
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
    },
    onSettled() {
      utils.post.all.invalidate()
    }
  });

  const { data: session } = trpc.auth.getSession.useQuery();
  const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery(
    undefined,
    {
      enabled: !!session?.user
    }
  )

  return (
    <>
      <Navbar />
      <CallToActionWithAnnotation />
      <CallToActionWithIllustration />
      <Container maxW={'3xl'}>
        <Stack
          as={Box}
          textAlign={'center'}
          spacing={{ base: 8, md: 14 }}
          py={{ base: 20, md: 36 }}
        >
          {addPost.isLoading ? (
            'Adding post...'
          ) : (
            <>
              {addPost.isError ? (
                <Text>An error occurred: {addPost.error?.message}</Text>
              ) : null}

              {addPost.isSuccess ? <Text>Post added!</Text> : null}
              <Button onClick={() => addPost.mutate({ title: "Post A", content: "Post A Detail" })}>Create Post</Button>
            </>
          )}
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
          </Box>
        </Stack>
      </Container>
    </ >
  );
}

export default Index;
