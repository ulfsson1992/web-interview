import React, { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button
} from '@mui/material';

const AddDialog = ({ open, onClose, onSubmit, type = "Todo List" }) => {
    const [title, setTitle] = useState('');

    const handleSubmit = () => {
        onSubmit(title);
        setTitle('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add New {type}</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label={`${type} Title`}
                    fullWidth
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && title.trim()) {
                            handleSubmit?.(title);
                        }
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={() => {handleSubmit?.(title)}} disabled={!title.trim()}>Add</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddDialog;