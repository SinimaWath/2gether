import { getSession } from 'next-auth/client';
import { getListById } from '../storage';
import { listDocRegistry } from '../document';
import { applyChanges, load, save, init } from 'automerge';
import { jsonToUint8Array } from '../../parsing';

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
    const list = await getListById({ id });

    if (!list) {
        return {
            props: {
                notFound: true,
            },
        };
    }
    console.log(list.state);

    const state = load(jsonToUint8Array(list.state));

    return {
        props: {
            id: ctx.query.id,
            list: {
                id,
                owner: list.staticState.owner,
                title: state.title.toString(),
                collaborators: state.collaborators,
            },
        },
    };
};
