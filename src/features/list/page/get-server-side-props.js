import { getSession } from 'next-auth/client';
import { getListById, isUserCanEditList } from '../storage';
import { listDocRegistry } from '../document';
import { applyChanges, load, save, init } from 'automerge';
import { jsonToUint8Array } from '../../parsing';
import { getTasksByListId } from '../../task/storage';
import task from '../../../../pages/api/push/task';

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

    const state = load(jsonToUint8Array(list.state));

    if (
        !isUserCanEditList({
            email: session.user.email,
            list: {
                ...list,
                state,
            },
        })
    ) {
        return {
            props: {
                notFound: true,
            },
        };
    }

    const tasks = await getTasksByListId({ email: session.user.email, listId: id });

    const trasnformed = {};
    Object.values(tasks).forEach(({ staticState, state }) => {
        const loadedState = load(jsonToUint8Array(state));

        trasnformed[staticState.id] = {
            ...staticState,
            done: loadedState.done,
            title: loadedState.title.toString(),
        };
    });

    return {
        props: {
            id: ctx.query.id,
            list: {
                id,
                owner: list.staticState.owner,
                title: state.title.toString(),
                collaborators: state.collaborators,
            },
            tasks: trasnformed,
        },
    };
};
