import { authorizedOnly } from '../auth/session/authorized-only';

const getServerSideProps = async () => {
    return {
        redirect: {
            destination: '/app',
        },
    };
};

export const GetServerSideProps = authorizedOnly(getServerSideProps);
