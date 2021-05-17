import { Checkbox, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import React from 'react';
import { TaskTitle } from '../title/Title';
import style from './style.module.css';
import { changeDoneTask, deleteTask } from './action';

import { DeleteOutlined } from '@ant-design/icons';
import Tooltip from 'antd/lib/tooltip';
export const TaskItem = ({ id }) => {
    const task = useSelector((state) => {
        console.log(state.status.tasks);

        return state.status.tasks[id];
    });
    console.log(task);
    const dispatch = useDispatch();
    if (!task) {
        return null;
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
            <Tooltip title={'Remove task'} placement={'leftTop'}>
                <Button
                    type={'danger'}
                    shape={'circle'}
                    icon={<DeleteOutlined />}
                    onClick={(event) => {
                        dispatch(deleteTask({ id, listId: task.listId }));
                    }}
                />
            </Tooltip>
        </div>
    );
};
