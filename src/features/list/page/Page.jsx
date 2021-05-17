import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useRef } from 'react';
import { MainLayout } from '../../app/layout/Layout';
import { Empty } from 'antd';
import style from './style.module.css';
import { CreateListButton } from '../create-list/CreateListButton';
import { ListSettings } from '../list-settings/ListSettings';
import Text from 'antd/lib/typography/Text';
import { useSession } from 'next-auth/client';
import { addList, addTasks, pullList } from '../../status/actions';
import { Title } from '../title/Title';
import Spin from 'antd/lib/spin';
import getConfig from 'next/config';
import { CreateTaskInput } from '../../task/create-task/CreateTaskButton';
import { TasksList } from '../tasks-list/TasksList';

const { publicRuntimeConfig } = getConfig();

console.log(publicRuntimeConfig);
export const ListPage = ({ id, notFound, list, tasks }) => {
    const listOwner = useSelector((state) => state.status.lists[id]?.owner);
    const listCollabs = useSelector((state) => state.status.lists[id]?.collaborators);

    const dispatch = useDispatch();
    const [session, loading] = useSession();
    const intervalRef = useRef();

    useEffect(() => {
        if (!intervalRef.current && id) {
            intervalRef.current = setInterval(
                () => dispatch(pullList({ listId: id })),
                publicRuntimeConfig.listSyncInterval
            );
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [id, notFound, list]);

    useEffect(() => {
        if (!list) {
            return;
        }

        dispatch(addTasks({ tasks }));
        dispatch(addList(list));
    }, []);

    if (loading) {
        return (
            <MainLayout>
                <div className={style.emptyListWrapper}>
                    <Spin size={'large'} />
                </div>
            </MainLayout>
        );
    }

    if (notFound || !listOwner || !listCollabs) {
        return (
            <MainLayout>
                <div className={style.emptyListWrapper}>
                    <Empty
                        description={`Sorry.\nList Not Found`}
                        imageStyle={{ height: '200px' }}
                    />
                    <CreateListButton text={'Create New One'} type={'button'} />
                </div>
            </MainLayout>
        );
    }

    const isOwner = listOwner === session.user.email;
    const isCollabarative = !!listCollabs.length;

    return (
        <MainLayout>
            <div className={style.listWrapper}>
                {isCollabarative && (
                    <Text type={'secondary'}>
                        {isOwner ? `You're owner` : `Owner: ${listOwner}`}
                    </Text>
                )}
                <div className={style.listHead}>
                    <Title listId={id} />
                    <div className={style.listHeadSettings}>
                        <ListSettings listId={id} />
                    </div>
                </div>
                <div>
                    <div>
                        <CreateTaskInput listId={id} />
                    </div>
                    <TasksList listId={id} />
                </div>
            </div>
        </MainLayout>
    );
};
