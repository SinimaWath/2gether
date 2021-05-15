import { ListPage } from '../../src/features/list/page/Page';
import { getServerSideProps as getListServerSideProps } from '../../src/features/list/page/get-server-side-props';

export default ListPage;

export const getServerSideProps = getListServerSideProps;
