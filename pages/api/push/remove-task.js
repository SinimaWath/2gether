import { getSession } from 'next-auth/client';
import { removeTaskById } from '../../../src/features/task/storage';

export default async function handler(req, res) {
    const session = await getSession({ req });
    if (!session) {
        res.status = 401;
        res.end();
        return;
    }

    const { taskId } = req.query;

    await removeTaskById({ id: taskId, owner: session.user.email });

    res.status(200).json();
}
