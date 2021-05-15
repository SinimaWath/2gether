import { getSession } from 'next-auth/client';
import { getListById } from '../storage';
import { listDocRegistry } from '../document';

export const getServerSideProps = async (ctx) => {
    const session = await getSession(ctx);
    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    const id = ctx.query.id;
    const list = getListById({ id });

    if (!list) {
        return {
            props: {
                notFound: true,
            },
        };
    }

    return {
        props: {
            id: ctx.query.id,
            list: {
                id,
                owner: list.staticState.owner,
                title: list.state.title.toString(),
                collaborators: list.state.collaborators,
            },
        },
    };
};
