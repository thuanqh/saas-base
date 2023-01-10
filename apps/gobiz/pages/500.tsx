import { Box, Heading, Text, Button } from '@chakra-ui/react';

export default function Custom500() {
  return (
    <Box textAlign="center" py={10} px={6}>
      <Heading
        display="inline-block"
        as="h2"
        size="2xl"
        bgGradient="linear(to-r, teal.400, teal.600)"
        backgroundClip="text">
        500
      </Heading>
      <Text fontSize="18px" mt={3} mb={2}>
        Server side error orccurred
      </Text>
      <Text color={'gray.500'} mb={6}>
        There are some error in server side.
      </Text>

      <Button
        colorScheme="teal"
        bgGradient="linear(to-r, teal.400, teal.500, teal.600)"
        color="white"
        variant="solid">
        Go to Home
      </Button>
    </Box>
  );
}