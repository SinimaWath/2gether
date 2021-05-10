import { getSession } from 'next-auth/client';
import { pullChanges, pushListChanges } from '../../../src/features/list/queue/push';
import { getListById, updateListStateById } from '../../../src/features/list/storage';

export default async function handler(req, res) {
    const session = await getSession({ req });
    if (!session) {
        res.status = 401;
        res.end();
        return;
    }

    const { listId } = req.query;

    // Если нет списка, то пуллить нечего
    if (!getListById({ id: listId })) {
        res.status(404).json({});
        return;
    }

    const changes = pullChanges({ listId });

    console.log(changes);
    res.status(200).json(changes);
}
