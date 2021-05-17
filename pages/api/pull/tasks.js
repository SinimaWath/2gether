import { getSession } from 'next-auth/client';
import { getTasksByListId } from '../../../src/features/task/storage';

export default async function handler(req, res) {
    const session = await getSession({ req });
    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    const id = req.query.id;
    const tasks = await getTasksByListId({ email: session.user.email, listId: id });

    return res.status(200).json({ tasks });
}
