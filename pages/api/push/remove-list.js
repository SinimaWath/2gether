import { getSession } from 'next-auth/client';
import { removeListById } from '../../../src/features/list/storage';

export default async function handler(req, res) {
    const session = await getSession({ req });
    if (!session) {
        res.status = 401;
        res.end();
        return;
    }

    const { listId } = req.query;

    await removeListById({ id: listId, owner: session.user.email });
    res.status(200).json();
}
