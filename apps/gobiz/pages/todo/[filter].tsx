import { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { inferProcedureOutput } from "@trpc/server";
import { appRouter, AppRouter, CreateContextInner } from "@lungvang/api";
import superjson from "superjson";
import { trpc } from "../../utils/trpc";
import { useIsMutating } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Box, Button, Checkbox, Heading, HStack, Input, List, ListItem, Stack, useOutsideClick, Link, Flex, } from "@chakra-ui/react";
import NextLink from "next/link";
import { DeleteIcon } from "@chakra-ui/icons"

type Task = inferProcedureOutput<AppRouter['todo']['all']>[number]

function TaskItem({ task }: { task: Task }) {
  const [editing, setEditing] = useState(false);
  const wrapperRef = useRef(null);
  const inputRef = useRef<HTMLInputElement>(null)

  const utils = trpc.useContext();
  const [text, setText] = useState(task.text);
  useEffect(() => {
    setText(task.text);
  }, [task.text]);

  const editTask = trpc.todo.edit.useMutation({
    async onMutate({ id, data }) {
      await utils.todo.all.cancel();
      const allTasks = utils.todo.all.getData();
      if (!allTasks) {
        return
      }
      utils.todo.all.setData(
        undefined,
        allTasks.map((t) =>
          t.id === task.id
            ? {
              ...t,
              ...data,
            } : t,
        ),
      );
    },
  });
  const deleteTask = trpc.todo.delete.useMutation({
    async onMutate() {
      await utils.todo.all.cancel();
      const allTasks = utils.todo.all.getData();
      if (!allTasks) {
        return;
      }
      utils.todo.all.setData(
        undefined,
        allTasks.filter((t) => t.id != task.id),
      )
    }
  })

  useOutsideClick({
    ref: wrapperRef,
    enabled: editing,
    handler: () => {
      editTask.mutate({
        id: task.id,
        data: { text },
      });
      setEditing(false)
    }
  })

  return (
    <ListItem key={task.id} ref={wrapperRef}>
      <Checkbox
        isChecked={task.completed}
        onChange={(e) => {
          const checked = e.currentTarget.checked;
          editTask.mutate({
            id: task.id,
            data: { completed: checked },
          });
        }}
        autoFocus={editing}
      >
        <Input
          variant="unstyled"
          value={text}
          ref={inputRef}
          onDoubleClick={(e) => {
            setEditing(true);
            e.currentTarget.focus();
          }}
          onChange={(e) => {
            const newText = e.currentTarget.value;
            setText(newText);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              editTask.mutate({
                id: task.id,
                data: { text },
              });
              e.currentTarget.blur();
              setEditing(false);
            }
          }}
        />
      </Checkbox>
      <Button onClick={() => {
        deleteTask.mutate(task.id)
      }}><DeleteIcon /></Button>
    </ListItem>
  )
}

export default function TodosPage({ filter }: InferGetStaticPropsType<typeof getStaticProps>) {
  const allTasks = trpc.todo.all.useQuery(undefined, {
    staleTime: 3000,
  })
  const utils = trpc.useContext();
  const addTask = trpc.todo.add.useMutation({
    async onMutate({ text }) {
      await utils.todo.all.cancel();
      const tasks = allTasks.data ?? [];
      utils.todo.all.setData(undefined, [
        ...tasks,
        {
          id: `${Math.random()}`,
          completed: false,
          text,
          createAt: new Date(),
          updateAt: new Date(),
        }
      ])
    }
  })

  const clearCompleted = trpc.todo.clearCompleted.useMutation({
    async onMutate() {
      await utils.todo.all.cancel();
      const tasks = allTasks.data ?? [];
      utils.todo.all.setData(undefined, tasks.filter((t) => !t.completed))
    }
  })

  const number = useIsMutating();
  useEffect(() => {
    if (number === 0) {
      utils.todo.all.invalidate()
    }
  }, [number, utils])

  return (
    <Flex direction="column">
      <Box>
        <Heading>Todos</Heading>
        <Input
          placeholder="What needs to be done?"
          autoFocus
          onKeyDown={(e) => {
            const text = e.currentTarget.value.trim();
            if (e.key === 'Enter' && text) {
              addTask.mutate({ text });
              e.currentTarget.value = '';
            }
          }}
        />
      </Box>
      <List>
        {allTasks.data?.filter((task) => {
          if (filter === 'active') {
            return !task.completed;
          }
          if (filter === 'completed') {
            return task.completed
          }
          return true;
        }).map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </List>
      <Stack direction={'row'} spacing="auto" align="center">
        <Box>
          {allTasks.data?.reduce(
            (sum, task) => (!task.completed ? sum + 1 : sum),
            0,
          )}{' '} item left
        </Box>
        <HStack>
          <Link as={NextLink} href="/todo/all" >All</Link>
          <Link as={NextLink} href="/todo/active" >Active</Link>
          <Link as={NextLink} href="/todo/completed" >Completed</Link>
        </HStack>
        {allTasks.data?.some((task) => task.completed) && (
          <Button onClick={() => {
            clearCompleted.mutate();
          }}>
            Clear completed
          </Button>
        )}
      </Stack>
    </Flex>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: ['active', 'completed', 'all'].map((filter) => ({
      params: { filter },
    })),

    fallback: false,
  }
}

export const getStaticProps = async (context: GetStaticPropsContext<{ filter: string }>) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    transformer: superjson,
    ctx: await CreateContextInner(),
  });

  await ssg.todo.all.fetch();
  console.log('state', ssg.dehydrate())

  return {
    props: {
      trpcState: ssg.dehydrate(),
      filter: context.params?.filter ?? 'all',
    },
    revalidate: 1,
  }
}