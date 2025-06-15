import { ListItemButton, ListItemIcon, ListItemText, Stack, IconButton } from '@mui/material';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { useState } from 'react';
import DateDialog from './DateDialog';
import DueText from './DueText';

import { useMutation } from '@apollo/client';
import { DELETE_TODO } from '../graphql/mutations/DeleteTodo';
import { UPDATE_TODO } from '../graphql/mutations/UpdateTodo';

const Todo = ({ todo }) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const [deleteTodo] = useMutation(DELETE_TODO, {
        variables: { todoId: todo.id },
        update(cache, { data }) {
            console.log("Deleting Todo:", todo.id);
            console.log("Cache before deletion:", cache.extract());
            console.log("Mutation data:", data);
            if (!data.deleteTodo) return;

            cache.modify({
                id: cache.identify({ __typename: 'TodoList', id: todo.listId }),
                fields: {
                    todos(existingTodoRefs = [], { readField }) {
                        console.log("Existing Todos:", existingTodoRefs);
                        return existingTodoRefs.filter(
                            (todoRef) => readField('id', todoRef) !== todo.id
                        );
                    },
                },
            });
        },
    });

    const noPropagate = (ev, action) => {
        ev.stopPropagation();
        action && action();
    }

    const [updateTodo] = useMutation(UPDATE_TODO);

    const completeTodo = (ev, toggle) => {
        ev.stopPropagation();
        const isCompleted = toggle ? !todo.completed : true;
        if (todo.completed === isCompleted) return;

        updateTodo({
            variables: {
                todoId: todo.id,
                completed: isCompleted,
            },
            optimisticResponse: {
                updateTodo: {
                    __typename: 'Todo',
                    id: todo.id,
                    title: todo.title,
                    completed: isCompleted,
                    dueDate: todo.dueDate,
                    listId: todo.listId,
                },
            },
        });
    };

    const updateDueby = (date) => {
        if (todo.dueDate === date) return;

        updateTodo({
            variables: {
                todoId: todo.id,
                dueDate: date,
            },
            optimisticResponse: {
                updateTodo: {
                    __typename: 'Todo',
                    id: todo.id,
                    title: todo.title,
                    completed: todo.completed,
                    dueDate: date,
                    listId: todo.listId,
                },
            },
        });
        setDialogOpen(false);
    }

    return (
        <>
            <ListItemButton onClick={(ev) => completeTodo(ev, false)}>
                <ListItemIcon onClick={(ev) => completeTodo(ev, true)}>
                    {todo.completed ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
                </ListItemIcon>
                <ListItemText
                    primary={todo.title}
                    secondary={todo.dueDate && !todo.completed ? <DueText dueDate={todo.dueDate} />  : null}
                />
                <Stack direction="row" spacing={1}>
                    {
                        !todo.completed && <IconButton onClick={(ev) => noPropagate(ev, () => setDialogOpen(true))}>
                            <CalendarTodayIcon />
                        </IconButton> 
                    }
                    <IconButton onClick={deleteTodo}>
                        <DeleteIcon />
                    </IconButton>
                </Stack>
            </ListItemButton>
            <DateDialog 
                open={dialogOpen}
                inputValue={todo.dueDate}
                onClose={(ev) => setDialogOpen(false)}
                onSubmit={updateDueby} />
        </>
    );
};

export default Todo;