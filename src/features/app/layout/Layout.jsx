import { CreateListButton } from '../../list/create-list/CreateListButton';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStatus } from '../../status/actions';
import { Layout, Menu, Breadcrumb, Button } from 'antd';
import { UnorderedListOutlined, UserOutlined } from '@ant-design/icons';
import { signOut, useSession } from 'next-auth/client';
import { useEffect } from 'react';
import styles from './index.module.css';

export const MainLayout = ({ children }) => {
    const dispatch = useDispatch();
    const [session, loading] = useSession();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            dispatch(fetchStatus());
        }
    }, []);

    const lists = useSelector(({ status }) => status.lists);

    const transformedLists = Object.values(lists || {});

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Layout.Sider width={400}>
                <div className={styles.logo}>
                    <span className={styles.first}>2</span>GETHER
                </div>
                <Menu theme="dark" defaultOpenKeys={['lists']} mode="inline">
                    <Menu.SubMenu
                        key="account"
                        icon={<UserOutlined />}
                        title={session?.user?.email || 'Account'}
                    >
                        <Menu.Item>
                            <Button
                                danger
                                type={'text'}
                                onClick={() =>
                                    signOut({
                                        redirect: '/',
                                    })
                                }
                            >
                                Log Out
                            </Button>
                        </Menu.Item>
                    </Menu.SubMenu>
                    <Menu.SubMenu key="lists" icon={<UnorderedListOutlined />} title="Lists">
                        {transformedLists.map(({ id, title }) => {
                            return <Menu.Item key={id}>{title}</Menu.Item>;
                        })}
                        <Menu.Divider />
                    </Menu.SubMenu>
                    <Menu.Item className={styles.listButtonItem}>
                        <CreateListButton />
                    </Menu.Item>
                </Menu>
            </Layout.Sider>
            <Layout className="site-layout">
                <Layout.Header className="site-layout-background" style={{ padding: 0 }} />
                <Layout.Content style={{ margin: '0 16px' }}>{children}</Layout.Content>
            </Layout>
        </Layout>
    );
};
