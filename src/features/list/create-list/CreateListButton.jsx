import { Button, Input, Modal } from 'antd';
import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createListModalOk } from './actions';
import { generateListId } from '../id';

export const CreateListButton = () => {
    const dispatch = useDispatch();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [title, setTitle] = useState(undefined);
    const titleValueRef = useRef(undefined);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        dispatch(createListModalOk({ title: titleValueRef.current, id: generateListId() }));
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
            <Button onClick={showModal}>New List</Button>
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
