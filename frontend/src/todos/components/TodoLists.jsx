import { Fragment, useState } from 'react'
import { gql } from '@apollo/client'
import {
  Card,
  CardContent,
  List,
  Stack,
  Button,
  Typography,
} from '@mui/material'
import TodoList from './TodoList'
import AddDialog from './AddDialog'

import { useQuery, useMutation } from '@apollo/client'
import { GET_TODO_LISTS } from '../graphql/queries/GetTodoLists'
import { CREATE_TODO_LIST } from '../graphql/mutations/CreateTodoList'

export const TodoLists = ({ style }) => {
  // const [todoLists, setTodoLists] = useState({})
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data } = useQuery(GET_TODO_LISTS);

  // const sortedList = useMemo(() => {
  //   if (!data?.todoLists) return [];

  //   return [...data.todoLists].sort((a, b) => {
  //     const progressA = a.todos.length
  //       ? a.todos.filter((t) => t.completed).length / a.todos.length
  //       : 0;
  //     const progressB = b.todos.length
  //       ? b.todos.filter((t) => t.completed).length / b.todos.length
  //       : 0;

  //     // Sort by progress descending
  //     if (progressA !== progressB) return progressA - progressB;

  //     // Then by earliest due date ascending
  //     const dueA = a.todos
  //       .filter((t) => !t.completed && t.dueDate)
  //       .map((t) => new Date(t.dueDate))
  //       .sort((x, y) => x - y)[0] ?? new Date(8640000000000000);

  //     const dueB = b.todos
  //       .filter((t) => !t.completed && t.dueDate)
  //       .map((t) => new Date(t.dueDate))
  //       .sort((x, y) => x - y)[0] ?? new Date(8640000000000000);

  //     return dueA - dueB;
  //   });
  // }, [data?.todoLists]);

  const [createTodoList] = useMutation(CREATE_TODO_LIST, {

    update(cache, { data: { createTodoList } }) {
      const newListRef = cache.writeFragment({
        data: createTodoList,
        fragment: gql`
          fragment NewTodoList on TodoList {
            id
            title
            completed
            todos {
              id
              title
              completed
              dueDate
            }
          }
        `,
      });

      cache.modify({
        fields: {
          todoLists(existingListRefs = []) {
            return [...existingListRefs, newListRef];
          },
        },
      });
    },
  });

  const handleAddList = async (title) => {
    if (!title.trim()) return;

    try {
      await createTodoList({ variables: { title } });
      setDialogOpen(false);
    } catch (error) {
      console.error("Error creating todo list:", error);
    }
  }

  return (
    <Fragment>
      <Card style={style}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography component="h2" variant="h6">My Todo Lists</Typography>
            <Button variant="contained" onClick={() => setDialogOpen(true)}>
              Add List
            </Button>
          </Stack>
          <List>
            {data?.todoLists.map((todolist) => (
                <TodoList
                  key={todolist.id}
                  todolist={todolist} />
            ))}
          </List>
        </CardContent>
      </Card>
      <AddDialog
        open={dialogOpen}
        type="Todo List"
        onClose={() => setDialogOpen(false)}
        onSubmit={handleAddList} />
    </Fragment>
  )
}
