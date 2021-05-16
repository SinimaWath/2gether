import { useSelector } from 'react-redux';
import { TaskItem } from '../../task/task-item/TaskItem';
import React from 'react';

import style from './style.module.css';

const selectTasksByListId = (lists, tasks, listId) => {
    const tasksIds = lists[listId]?.taskIds || [];

    return tasksIds.map((taskId) => tasks[taskId]);
};

export const TasksList = ({ listId }) => {
    const tasks = useSelector((state) =>
        selectTasksByListId(state.status.lists, state.status.tasks || {}, listId)
    );

    return (
        <div className={style.root}>
            {tasks.map(({ id }) => (
                <TaskItem key={id} id={id} />
            ))}
        </div>
    );
};
