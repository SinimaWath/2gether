import { MainAppPage } from '../src/features/app/main-page/Page';
import { getSession } from 'next-auth/client';

export default MainAppPage;

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

    return {
        props: {

        }
    }
};
