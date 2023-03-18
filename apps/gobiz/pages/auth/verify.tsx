import { Box, Heading, Text } from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';

interface VerifyPageProps {
  url: URL
}

export default function Verify(props: VerifyPageProps) {

  return (
    <Box textAlign="center" py={10} px={6}>
      <InfoIcon boxSize={'50px'} color={'blue.500'} />
      <Heading as="h2" size="xl" mt={6} mb={2}>
        Check your email
      </Heading>
      <Text color={'gray.500'}>
        A sign in link has been sent to your email address.
      </Text>
    </Box>
  );
}