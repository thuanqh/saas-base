import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';

export type ErrorType =
  | "default"
  | "configuration"
  | "accessdenied"
  | "verification"

export interface ErrorProps {
  url?: URL
  error?: ErrorType
}

interface ErrorView {
  status: number
  heading: string
  message: JSX.Element
  signin?: JSX.Element
}

export default function Error(props: ErrorProps) {
  const { url, error = "default" } = props
  const signinPageUrl = `${url}/signin`

  const errors: Record<ErrorType, ErrorView> = {
    default: {
      status: 200,
      heading: "Error",
      message: (
        <Text>
          The token has expired or has already been used.
        </Text>
      ),
    },
    configuration: {
      status: 500,
      heading: "Server Error",
      message: (
        <Box>
          <Text>There is a problem with the server configuration.</Text>
          <Text>Check the server logs for more information.</Text>
        </Box>
      ),
    },
    accessdenied: {
      status: 403,
      heading: "Access Denied",
      message: (
        <Box>
          <Text>You do not have permistion to sign in.</Text>
          <Text>
            <a href={signinPageUrl}>Sign in</a>
          </Text>
        </Box>
      ),
    },
    verification: {
      status: 403,
      heading: "Unable to sign in",
      message: (
        <Box>
          <Text>The sign in link is no longer valid.</Text>
          <Text>It may have been used already or it may have expried.</Text>
        </Box>
      ),
      signin: (
        <Text>
          <a href={signinPageUrl}>Sign in</a>
        </Text>
      ),
    },
  }

  const { status, heading, message, signin } = errors[error] ?? errors.default

  return (
    <Box textAlign="center" py={10} px={6}>
      <Box display="inline-block">
        <Flex
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          bg={'red.500'}
          rounded={'50px'}
          w={'55px'}
          h={'55px'}
          textAlign="center">
          <CloseIcon boxSize={'20px'} color={'white'} />
        </Flex>
      </Box>
      <Heading as="h2" size="xl" mt={6} mb={2}>
        {status} | {heading}
      </Heading>
      <Text color={'gray.500'}>
        {message}
      </Text>
      {signin}
    </Box>
  );
}