import { getSession } from 'next-auth/client';
import { listChangesQueue } from '../../../src/features/list/queue';
import { getTaskIdsByListId } from '../../../src/features/task/storage';
import { taskChangesQueue } from '../../../src/features/task/queue';

export default async function handler(req, res) {
    const session = await getSession({ req });
    if (!session) {
        res.status = 401;
        res.end();
    }

    const { listId } = req.query;
    const email = session.user.email;

    const taskIds = await getTaskIdsByListId({ listId });

    const [listChanges, ...taskChanges] = await Promise.all([
        listChangesQueue.pull({ id: listId, by: email }),
        ...taskIds.map(async (id) => {
            const changes = await taskChangesQueue.pull({ id, by: email });
            return {
                id,
                changes,
            };
        }),
    ]);

    return res.status(200).json({ changes: listChanges, taskChanges });
}
