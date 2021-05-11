import { getSession } from 'next-auth/client';
import { getListsByUserEmail } from '../../../src/features/list/storage';

export default async function handler(req, res) {
    const session = await getSession({ req });
    console.log(session);
    if (!session) {
        res.status = 401;
        res.end();
        return;
    }

    const lists = getListsByUserEmail({ email: session.user.email });

    res.status(200).json({
        state: {
            lists,
        },
        user: {
            email: session.user.email,
            name: session.user.name,
            image: session.user.image,
        },
    });
}
