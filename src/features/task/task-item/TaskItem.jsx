import { Checkbox } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import React from 'react';
import { TaskTitle } from '../title/Title';
import style from './style.module.css';
import { changeDoneTask } from './action';

export const TaskItem = ({ id }) => {
    const task = useSelector((state) => state.status.tasks[id]);
    const dispatch = useDispatch();
    if (!task) {
        return;
    }

    return (
        <div className={style.root}>
            <Checkbox
                checked={task.done}
                className={style.checkbox}
                onChange={(event) => {
                    dispatch(
                        changeDoneTask({ id, listId: task.listId, done: event.target.checked })
                    );
                }}
            />
            <TaskTitle id={id} />
        </div>
    );
};
