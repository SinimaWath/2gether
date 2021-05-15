import { Button, Input, Modal } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createListModalOk } from './actions';
import { generateListId } from '../id';
import { PlusOutlined } from '@ant-design/icons';
import style from './style.module.css';

export const CreateListButton = ({ text = 'Create New List', type }) => {
    const dispatch = useDispatch();
    const inputRef = useRef();

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

        if (isModalVisible) {
            document.addEventListener('keydown', onKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [title, isModalVisible]);

    const showModal = () => {
        setIsModalVisible(true);

        setTimeout(() => {
            if (!inputRef.current) {
                return;
            }

            console.log(inputRef.current);
            inputRef.current.focus();
        }, 100);
    };

    const handleOk = () => {
        console.log('handleok');
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
                type={type === 'button' ? 'primary' : 'text'}
                className={type === 'button' ? '' : style.text}
            >
                {text}
            </Button>
            <Modal
                title={'Create New List'}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Input
                    ref={inputRef}
                    placeholder={'Title'}
                    onChange={handleTittleChange}
                    value={title}
                    autoFocus
                />
            </Modal>
        </>
    );
};
