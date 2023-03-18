import { Container, Text } from "@chakra-ui/react";
import { CallToActionWithAnnotation } from "@lungvang/chakra-templates";
import Navbar from "../components/Navbar";
import { trpc } from "../utils/trpc";

export function Index() {


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
      <Container>
        <Text>{secretMessage}</Text>
      </Container>
    </>
  );
}

export default Index;
