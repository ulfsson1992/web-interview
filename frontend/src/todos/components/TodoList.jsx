import { useState } from 'react';
import { gql } from '@apollo/client';
import {
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    IconButton,
    Collapse,
    Stack,
    Box,
    LinearProgress
} from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import dayjs from 'dayjs';

import AddDialog from './AddDialog';

import Todo from './Todo';
import { useMutation } from '@apollo/client';
import { DELETE_TODO_LIST } from '../graphql/mutations/DeleteTodoList';
import { CREATE_TODO } from '../graphql/mutations/CreateTodo';
import DueText from './DueText';

const TodoList = ({ todolist }) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const [expanded, setExpanded] = useState(false);
    const handleToggle = (ev) => {
        ev.stopPropagation();
        setExpanded(!expanded);
    };

    const [deleteTodoList] = useMutation(DELETE_TODO_LIST, {
        variables: { id: todolist.id },
        update(cache, { data }) {
            if (!data.deleteTodoList) return;

            cache.modify({
                fields: {
                    todoLists(existingListRefs = [], { readField }) {
                        return existingListRefs.filter(
                            (listRef) => readField('id', listRef) !== todolist.id
                        );
                    },
                },
            });
        },
    });

    const completedCount = todolist.todos.filter((t) => t.completed).length;
    const totalCount = todolist.todos.length;
    const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    const earliestUncompletedDueDate = todolist.todos
        .filter((t) => !t.completed && t.dueDate)
        .reduce((earliest, todo) => {
            const dueDate = new Date(todo.dueDate);
            return !earliest || dueDate < earliest ? dueDate : earliest;
        }, null);

    const missedDueDate = earliestUncompletedDueDate &&
        dayjs(earliestUncompletedDueDate).isBefore(dayjs(), 'day');

    const summaryText = !totalCount
        ? 'No todos yet'
        : completedCount < totalCount
            ? `Progress: ${completedCount} of ${totalCount} todos completed`
            : 'Completed';

    // const sortedTodos = useMemo(() => {
    //     return todolist.todos.slice().sort((a, b) => {
    //         if (a.completed !== b.completed) {
    //             return a.completed ? 1 : -1; // Completed todos go to the end
    //         }
    //         if (a.dueDate && !b.dueDate) {
    //             return -1; // Todos with due dates come first
    //         }
    //         if (a.dueDate && b.dueDate) {
    //             return new Date(a.dueDate) - new Date(b.dueDate); // Sort by due date
    //         }
    //         return a.title.localeCompare(b.title); // Fallback to title sorting
    //     });
    // }, [todolist.todos]);


    const [addTodo] = useMutation(CREATE_TODO, {
        update(cache, { data: { addTodo } }, { variables }) {
            const newTodoRef = cache.writeFragment({
                data: addTodo,
                fragment: gql`
                        fragment NewTodo on Todo {
                            id
                            title
                            completed
                            dueDate
                        }
                    `,
            });
            cache.modify({
                id: cache.identify({ __typename: 'TodoList', id: variables.listId }),
                fields: {
                    todos(existingTodos = []) {
                        return [...existingTodos, newTodoRef];
                    },
                },
            });
        },
    });

    const handleAddTodo = async (title) => {
        if (!title.trim()) return;

        try {
            await addTodo({ variables: { title, listId: todolist.id } });
            setDialogOpen(false);
        } catch (error) {
            console.error("Error creating todo list:", error);
        }
    }

    const noPropagate = (ev, action) => {
        ev.stopPropagation();
        action();
    }

    return (
        <>
            <ListItemButton onClick={handleToggle}>
                <ListItemIcon>
                    <ReceiptIcon />
                </ListItemIcon>
                <ListItemText
                    primary={todolist.title}
                    secondary={(
                        <>
                            {summaryText}
                            {earliestUncompletedDueDate && (
                                <>
                                    {' – '}
                                    <DueText dueDate={earliestUncompletedDueDate} />
                                </>
                            )}
                        </>
                    )}
                />
                <Stack direction="row" spacing={1}>
                    <IconButton onClick={handleToggle}>
                        {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                    <IconButton onClick={(e) => noPropagate(e, setDialogOpen(true))}>
                        <AddIcon />
                    </IconButton>
                    <IconButton onClick={(e) => noPropagate(e, deleteTodoList)}>
                        <DeleteIcon />
                    </IconButton>
                </Stack>
            </ListItemButton>
            { todolist.todos.length > 0 && (
                <Box px={2} mt={-1} mb={1}>
                    <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{ 
                        height: 6, 
                        borderRadius: 4,
                        backgroundColor: (missedDueDate ? 'error.main' : 'rgba(0, 0, 0, 0.1)'),
                        '& .MuiLinearProgress-bar': {
                            backgroundColor: progress === 100 ? 'success.main' : 'primary.main',
                        },
                    }}
                    />
                </Box>
            )}

            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <List sx={{ paddingLeft: 4 }}>
                    {todolist.todos.map((todo) => (
                        <Todo key={todo.id} todo={todo} />
                    ))}
                </List>
            </Collapse>
            <AddDialog
                open={dialogOpen}
                type="Todo"
                onClose={() => setDialogOpen(false)}
                onSubmit={handleAddTodo} />
        </>
    );
};

export default TodoList;