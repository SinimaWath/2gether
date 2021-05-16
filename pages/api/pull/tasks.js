import { getSession } from 'next-auth/client';
import { listChangesQueue } from '../../../src/features/list/queue';
import { taskChangesQueue } from '../../../src/features/task/queue';

export default async function handler(req, res) {
    const session = await getSession({ req });
    if (!session) {
        res.status = 401;
        res.end();
    }

    const { id } = req.query;
    const email = session.user.email;
    const changes = await taskChangesQueue.pull({ id: id, by: email });

    return res.status(200).json({ changes });
}
