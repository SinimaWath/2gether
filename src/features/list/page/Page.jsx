import { useSelector } from 'react-redux';
import React from 'react';
import { MainLayout } from '../../app/layout/Layout';
import { Empty } from 'antd';
import style from './style.module.css';
import { CreateListButton } from '../create-list/CreateListButton';
import { ListSettings } from '../list-settings/ListSettings';
import { useRouter } from 'next/router';

export const ListPage = ({ id, notFound, list }) => {
    const listFromState = useSelector((state) => state.status.lists[id]);
    const router = useRouter();
    if (notFound) {
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

    let listToUse = listFromState || list;
    if (!listToUse) {
        router.replace('/app');
    }

    return (
        <MainLayout>
            <div className={style.listWrapper}>
                <div className={style.listHead}>
                    <h2 className={style.title}>{listToUse.title}</h2>
                    <div className={style.listHeadSettings}>
                        <ListSettings listId={id} />
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};
