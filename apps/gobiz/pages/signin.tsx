import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Divider, Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel, Heading, Input, Link, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { getCsrfToken, getProviders, signIn } from "next-auth/react";
import { z } from "zod";

import type { GetServerSideProps } from "next";

const formSchema = z.object({
  email: z.string().min(1, "The email is required.").email({ message: "The email is invalid" })
})

type FormValue = z.infer<typeof formSchema>

type Props = {
  providers: Awaited<ReturnType<typeof getProviders>>
  csrfToken: Awaited<ReturnType<typeof getCsrfToken>>
}

export default function Signin({ providers, csrfToken }: Props) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormValue>({
    resolver: zodResolver(formSchema)
  })


  const onSubmit = (data: FormValue) => {
    const { email } = formSchema.parse(data)
    signIn("email", { email: email, callbackUrl: `${window.location.origin}` })
  }

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Sign in to your account</Heading>
          <Text fontSize={'lg'} color={'gray.600'}>to enjoy all of our cool <Link color={'green.400'}>features</Link></Text>
        </Stack>
        <Box rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}
        >
          <Stack>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl isRequired isInvalid={Boolean(errors.email)}>
                <FormLabel htmlFor="email">Email address</FormLabel>
                <Input id="email" placeholder="email" type="email"
                  {...register('email')}
                />
                {errors?.email ? (
                  <FormErrorMessage>
                    {errors?.email?.message}
                  </FormErrorMessage>
                ) : (
                  <FormHelperText>We&apos;ll never share your email.</FormHelperText>
                )}
              </FormControl>
              <Stack spacing={10}>
                <Button
                  bg={'green.400'}
                  color={'white'}
                  _hover={{
                    bg: 'green.500',
                  }}
                  type='submit'
                >Sign in</Button>
              </Stack>
            </form>
            <Divider />
            <Stack spacing={10}>
              <Button onClick={() => signIn('github', {
                callbackUrl: `${window.location.origin}`,
              })}>
                Sign in with Github
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}

export const getServerSideProps: GetServerSideProps = async context => {
  const providers = await getProviders()
  const csrfToken = await getCsrfToken(context)
  return {
    props: { providers, csrfToken },
  };
};