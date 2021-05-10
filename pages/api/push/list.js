import { getSession } from 'next-auth/client';
import { createList, getListById, updateListStateById } from '../../../src/features/list/storage';
import { jsonArrayToUint8Array, jsonToUint8Array } from '../../../src/features/parsing';
import { listChangesQueue } from '../../../src/features/list/queue';

export default async function handler(req, res) {
    const session = await getSession({ req });
    if (!session) {
        res.status = 401;
        res.end();
        return;
    }

    const { listId, changes } = req.body;

    console.log(getListById({ id: listId }));

    // Если нет списка, то пушить некуда и просто создаем его
    if (!getListById({ id: listId })) {
        createList({
            owner: session.user.email,
            changes: jsonArrayToUint8Array(changes),
            id: listId,
        });
        res.status(200).json({});
        return;
    }

    const task = {
        id: listId,
        changes,
        by: session.user.email,
    };

    listChangesQueue.push(task);

    // to backup and first load
    updateListStateById({
        id: listId,
        changes: jsonArrayToUint8Array(changes),
        owner: session.user.email,
    });

    const thereOtherChanges = listChangesQueue.checkNotUserChanges(task);

    res.status(200).json({ needPull: thereOtherChanges });
}
