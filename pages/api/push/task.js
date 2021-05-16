import { getSession } from 'next-auth/client';
import { jsonArrayToUint8Array } from '../../../src/features/parsing';
import { getTaskById, createTask, updateTaskStateById } from '../../../src/features/task/storage';
import { taskChangesQueue } from '../../../src/features/task/queue';

export default async function handler(req, res) {
    const session = await getSession({ req });
    if (!session) {
        res.status = 401;
        res.end();
        return;
    }

    const { id, listId, changes } = req.body;

    const task = await getTaskById({ id });
    console.log(id, listId, changes, task);

    if (!task) {
        await createTask({
            owner: session.user.email,
            changes: jsonArrayToUint8Array(changes),
            id,
            listId,
        });
        res.status(200).json({});
        return;
    }

    // const task = {
    //     id: taskId,
    //     changes,
    //     by: session.user.email,
    // };
    //
    // taskChangesQueue.push(task);

    // to backup and first load
    await updateTaskStateById({
        id,
        listId,
        changes: jsonArrayToUint8Array(changes),
        owner: session.user.email,
    });

    // const thereOtherChanges = taskChangesQueue.checkNotUserChanges(task);

    res.status(200).json();
}
