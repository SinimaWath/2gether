import { getSession } from 'next-auth/client';

export const authorizedOnly = (getServerSidePropsNext) => async (ctx) => {
    const session = await getSession(ctx);

    if (!session) {
        return {
            redirect: {
                destination: '/signin',
                permanent: false,
            },
        };
    }

    const props = await getServerSidePropsNext(ctx);
    return props;
};
