import { Button, Input, Modal } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createListModalOk } from './actions';
import { generateListId } from '../id';
import { PlusOutlined } from '@ant-design/icons';
import style from './style.module.css';

export const CreateListButton = () => {
    const dispatch = useDispatch();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [title, setTitle] = useState(undefined);
    const titleValueRef = useRef(undefined);

    useEffect(() => {
        const onKeyDown = (event) => {
            if (event.keyCode !== 13) {
                return;
            }

            handleOk();
        };

        document.addEventListener('keydown', onKeyDown);

        return () => {
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [title, isModalVisible]);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        dispatch(createListModalOk({ title: title, id: generateListId() }));
        setTitle(undefined);
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        titleValueRef.current = undefined;
        setTitle(undefined);
        setIsModalVisible(false);
    };

    const handleTittleChange = (event) => {
        setTitle(event.target.value);
    };

    return (
        <>
            <Button
                onClick={showModal}
                icon={<PlusOutlined />}
                type={'text'}
                className={style.text}
            >
                New List
            </Button>
            <Modal
                title={'Create New List'}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Input placeholder={'Title'} onChange={handleTittleChange} value={title} />
            </Modal>
        </>
    );
};
