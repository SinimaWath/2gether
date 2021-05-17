import React from 'react';
import { useDispatch } from 'react-redux';
import { createTask } from './actions';
import { generateTaskId } from '../id';
import Search from 'antd/lib/input/Search';

export const CreateTaskInput = ({ listId }) => {
    const dispatch = useDispatch();

    const handleCreate = (value) => {
        if (!value) {
            return;
        }
        dispatch(createTask({ title: value, id: generateTaskId(), listId }));
    };

    const handleEnter = (event) => {
        handleCreate(event.target.value, event);
    };

    return (
        <Search
            placeholder="Type new task name"
            allowClear
            enterButton="Create"
            size="large"
            autoFocus
            onSearch={handleCreate}
            onPressEnter={handleEnter}
        />
    );
};
