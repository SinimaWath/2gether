import { getListsByUserEmail } from '../list/storage';

export const getStatus = async (req, res, session) => {
    const lists = await getListsByUserEmail({ email: session.user.email });
    return {
        state: {
            lists,
        },
        user: {
            email: session.user.email,
            name: session.user.name,
            image: session.user.image,
        },
    };
};
