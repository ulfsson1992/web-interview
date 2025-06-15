import { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

const DateDialog = ({ open, onClose, onSubmit, inputValue }) => {
    const [value, setValue] = useState(inputValue);

    const handleSubmit = () => {
        onSubmit(value);
        setValue('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Set Dueby</DialogTitle>
            <DialogContent
                sx={{ padding: '1rem', overflowY: 'visible' }}>
                <DatePicker
                    label="Due Date"
                    value={value ? dayjs(value) : null}
                    onChange={(newValue) => setValue(newValue ? newValue.toISOString() : null)}
                    renderInput={(params) => <TextField {...params} />}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} disabled={!value}>Add</Button>
            </DialogActions>
        </Dialog>
    );
};

export default DateDialog;