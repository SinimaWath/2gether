import { getSession } from 'next-auth/client';
import { getStatus } from '../../../src/features/status/get-status';

export default async function handler(req, res) {
    const session = await getSession({ req });
    if (!session) {
        res.status = 401;
        res.end();
        return;
    }

    res.status(200).json(await getStatus(req, res, session));
}
