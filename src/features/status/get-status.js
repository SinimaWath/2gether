import { getListsByUserEmail } from '../list/storage';
import { getTasksByEmail } from '../task/storage';

export const getStatus = async (req, res, session) => {
    const lists = await getListsByUserEmail({ email: session.user.email });
    const tasks = await getTasksByEmail({ email: session.user.email });
    return {
        state: {
            lists,
            tasks,
        },
        user: {
            email: session.user.email,
            name: session.user.name,
            image: session.user.image,
        },
    };
};
