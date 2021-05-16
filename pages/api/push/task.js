import { getSession } from 'next-auth/client';
import { jsonArrayToUint8Array, jsonToUint8Array } from '../../../src/features/parsing';
import { getById, updateStateById, create } from '../../../src/features/task/storage';
import { taskChangesQueue } from '../../../src/features/task/queue';

export default async function handler(req, res) {
    const session = await getSession({ req });
    if (!session) {
        res.status = 401;
        res.end();
        return;
    }

    const { taskId, changes } = req.body;


    // Если нет задачи, то пушить некуда и просто создаем его
    if (!getById({ id: taskId })) {
        create({
            owner: session.user.email,
            changes: jsonArrayToUint8Array(changes),
            id: taskId,
        });
        res.status(200).json({});
        return;
    }

    const task = {
        id: taskId,
        changes,
        by: session.user.email,
    };

    taskChangesQueue.push(task);

    // to backup and first load
    updateStateById({
        id: taskId,
        changes: jsonArrayToUint8Array(changes),
        owner: session.user.email,
    });

    const thereOtherChanges = taskChangesQueue.checkNotUserChanges(task);

    res.status(200).json({ needPull: thereOtherChanges });
}
