import { getSession } from 'next-auth/client';
import { createList, getListById, updateListStateById } from '../../../src/features/list/storage';
import { jsonArrayToUint8Array, jsonToUint8Array } from '../../../src/features/parsing';
import { listChangesQueue } from '../../../src/features/list/queue';
import { load } from 'automerge';

export default async function handler(req, res) {
    const session = await getSession({ req });
    if (!session) {
        res.status = 401;
        res.end();
        return;
    }

    const { listId, changes } = req.body;

    const list = await getListById({ id: listId });

    // Если нет списка, то пушить некуда и просто создаем его
    if (!list) {
        await createList({
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

    await Promise.all([
        listChangesQueue.push(task),
        updateListStateById({
            id: listId,
            changes: jsonArrayToUint8Array(changes),
            owner: session.user.email,
        }),
    ]);

    res.status(200).json({ needPull: false });
}
