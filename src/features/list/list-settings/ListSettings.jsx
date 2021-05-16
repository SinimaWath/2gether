import { Dropdown, Menu, Modal, Tag } from 'antd';
import {
    SettingOutlined,
    ExportOutlined,
    UsergroupAddOutlined,
    DeleteOutlined,
} from '@ant-design/icons';
import style from './style.module.css';
import React, { useState, useRef } from 'react';
import Search from 'antd/lib/input/Search';
import { useDispatch, useSelector } from 'react-redux';
import { invite, remove, exit } from '../invite/actions';
import Text from 'antd/lib/typography/Text';
import { useSession } from 'next-auth/client';

export const ListSettings = ({ listId }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const dispatch = useDispatch();
    const list = useSelector((state) => state.status.lists[listId]);
    const [session] = useSession();
    const searchRef = useRef();

    if (!list) {
        return null;
    }

    const isOwner = list.owner === session.user.email;

    const onAdd = (value) => {
        dispatch(invite({ email: value, id: listId }));
    };

    const onRemove = (value) => {
        dispatch(remove({ email: value, id: listId }));
    };

    const onExit = () => {
        dispatch(exit({ email: session.user.email, id: listId }));
    };

    const onHandleOpen = () => {
        setIsModalVisible(true);
        if (!searchRef.current) {
            return;
        }

        setTimeout(() => searchRef.current.focus(), 200);
    };

    const collaborators = list?.collaborators || [];

    const ListMenu = () => {
        return (
            <Menu>
                <Menu.Item
                    key={'Invite Collaborators'}
                    icon={<UsergroupAddOutlined style={{ fontSize: '16px' }} />}
                    onClick={onHandleOpen}
                    className={style.menuItem}
                >
                    Invite Collaborators
                </Menu.Item>
                <Menu.Item
                    key={'Delete'}
                    icon={<DeleteOutlined style={{ fontSize: '16px' }} />}
                    danger
                    className={style.menuItem}
                >
                    Delete
                </Menu.Item>
            </Menu>
        );
    };

    const ListMenuCalloborator = () => {
        return (
            <Menu>
                <Menu.Item
                    key={'Exit'}
                    icon={<ExportOutlined style={{ fontSize: '16px' }} />}
                    danger
                    onClick={onExit}
                    className={style.menuItem}
                >
                    Exit
                </Menu.Item>
            </Menu>
        );
    };

    return (
        <>
            <Dropdown overlay={isOwner ? ListMenu : ListMenuCalloborator}>
                <SettingOutlined className={style.settingsButton} />
            </Dropdown>
            <Modal
                title={'Invite Collaborators'}
                visible={isModalVisible}
                footer={null}
                onCancel={() => setIsModalVisible(false)}
            >
                <Search
                    ref={searchRef}
                    placeholder="Input collaborator email"
                    allowClear
                    enterButton="Invite"
                    size="large"
                    autoFocus
                    onSearch={onAdd}
                />
                {!!collaborators.length && (
                    <div className={style.invited}>
                        <Text strong>Invited</Text>
                        <div className={style.list}>
                            {collaborators.map((email) => (
                                <Tag
                                    key={email}
                                    style={{ fontSize: '16px' }}
                                    closable
                                    onClose={() => onRemove(email)}
                                >
                                    {email}
                                </Tag>
                            ))}
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
};
