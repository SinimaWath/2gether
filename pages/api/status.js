import { getSession } from 'next-auth';

export default async function handler(req, res) {
    const session = await getSession({ req });
    if (!session) {
        res.status(401);
        res.end();
        return;
    }
}
