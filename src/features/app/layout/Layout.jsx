import { CreateListButton } from '../../list/create-list/CreateListButton';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStatus } from '../../status/actions';
import { Layout, Menu, Breadcrumb, Button, Tooltip } from 'antd';
import { UnorderedListOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons';
import { signOut, useSession } from 'next-auth/client';
import { useEffect, useRef } from 'react';
import styles from './index.module.css';
import Link from 'next/link';
const statusSyncPeriodInterval = parseInt(process.env.STATUS_SYNC_INTERVAL, 10);

export const MainLayout = ({ children }) => {
    const dispatch = useDispatch();
    const [session] = useSession();
    const statusLoadTimeoutRef = useRef();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            dispatch(fetchStatus());

            if (!document.onvisibilitychange) {
                document.onvisibilitychange = () => {
                    dispatch(fetchStatus());
                };
            }

            if (!statusLoadTimeoutRef.current) {
                statusLoadTimeoutRef.current = setInterval(
                    () => dispatch(fetchStatus()),
                    statusSyncPeriodInterval
                );
            }
        }

        return () => {
            if (statusLoadTimeoutRef.current) {
                clearInterval(statusLoadTimeoutRef.current);
            }
        };
    }, []);

    const lists = useSelector(({ status }) => status.lists);

    const transformedLists = Object.values(lists || {});

    return (
        <Layout style={{ minHeight: '100vh' }} className={'ant-layout-has-sider'}>
            <Layout.Sider width={400} style={{ background: '#001529' }}>
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
                    {!!transformedLists.length && (
                        <Menu.SubMenu key="lists" icon={<UnorderedListOutlined />} title="Lists">
                            {transformedLists
                                .sort((first, second) => first.id.localeCompare(second.id))
                                .map(({ id, title, collaborators }) => {
                                    return (
                                        <Menu.Item key={id}>
                                            <Link href={`/list/${id}`}>
                                                <div className={styles.listlink}>
                                                    {title}
                                                    {!!collaborators?.length && (
                                                        <Tooltip title={'Collaborative list'}>
                                                            <TeamOutlined
                                                                style={{
                                                                    fontSize: '20px',
                                                                    lineHeight: '42px',
                                                                }}
                                                            />
                                                        </Tooltip>
                                                    )}
                                                </div>
                                            </Link>
                                        </Menu.Item>
                                    );
                                })}
                        </Menu.SubMenu>
                    )}
                    <Menu.Item className={styles.listButtonItem}>
                        <CreateListButton />
                    </Menu.Item>
                </Menu>
            </Layout.Sider>
            <Layout className={styles.layout}>
                <Layout.Header />
                <Layout.Content>{children}</Layout.Content>
            </Layout>
        </Layout>
    );
};
