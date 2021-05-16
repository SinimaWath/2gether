import { getSession } from 'next-auth/client';
import { listChangesQueue } from '../../../src/features/list/queue';

export default async function handler(req, res) {
    const session = await getSession({ req });
    if (!session) {
        res.status = 401;
        res.end();
    }

    const { listId } = req.query;
    const email = session.user.email;
    const changes = listChangesQueue.pull({ id: listId, by: email });

    return res.status(200).json({ changes });
}
