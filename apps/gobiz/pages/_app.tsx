import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import type { Session } from 'next-auth';
import type { AppType } from 'next/app';
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { trpc } from "../utils/trpc";

const CustomApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <SessionProvider session={session}>
      <ChakraProvider>
        <Component {...pageProps} />
        <ReactQueryDevtools initialIsOpen={false} />
      </ChakraProvider>
    </SessionProvider>
  );
}

export default trpc.withTRPC(CustomApp);
