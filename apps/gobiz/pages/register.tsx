import { Box, Flex, FormControl, FormLabel, Heading, Text, Select, Stack, Input, Button, useColorModeValue } from "@chakra-ui/react";
import type { NextPage } from "next";
import Link from "next/link";

const Register: NextPage = () => {
  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Stack>
        <Stack>
          <Heading>WELCOME TO</Heading>
          <Text>Redefine The Future Of Supply Chain Finance</Text>
        </Stack>
        <Box>
          <Stack>
            <form>
              <FormControl isRequired>
                <FormLabel>Company Tax ID</FormLabel>
                <Input placeholder='ex: 123213123' />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Company Name</FormLabel>
                <Input />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input type="email" />
              </FormControl>
              <FormControl>
                <FormLabel>Contact Phone Number (Optional)</FormLabel>
                <Input />
              </FormControl>
              <FormControl>
                <FormLabel>Countries and Regions</FormLabel>
                <Select placeholder="Select a Countries and Regions">
                  <option value='Ha Noi'>Ha Noi</option>
                  <option value='Da Nang'>Da Nang</option>
                  <option value='Ho Chi Minh'>Ho Chi Minh</option>
                </Select>
              </FormControl>
              <Button>Verify Email</Button>
            </form>
            <Stack>
              <Link href="/auth/signin">Log In</Link>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}

export default Register;