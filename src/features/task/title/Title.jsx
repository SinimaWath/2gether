import { Input, Tooltip } from 'antd';
import React, { useState, useRef, useMemo, useLayoutEffect } from 'react';
import style from './style.module.css';
import { changeTaskTitle } from './action';
import { connect, useDispatch, useSelector } from 'react-redux';
import Text from 'antd/lib/typography/Text';

class Title extends React.PureComponent {
    constructor(...args) {
        super(...args);

        this.handleInput = this.handleInput.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.startEditing = this.startEditing.bind(this);
        this.endEditing = this.endEditing.bind(this);

        this._rawStr = '';
        this._caretPosition = 0;

        this.state = {
            editing: false,
        };
    }

    componentDidUpdate({ title }) {
        if (this.props.title !== title && this.refs.input) {
            const str = this._rawStr.substr(0, this._caretPosition);
            const index = String(this.props.title).indexOf(str) + this._caretPosition;

            this.refs.input.setSelectionRange(this._caretPosition, this._caretPosition);
        }
    }

    handleInput(event) {
        this._rawStr = String(event.target.value);
        this._caretPosition = event.target.selectionEnd;

        if (event.nativeEvent.inputType === 'deleteContentBackward') {
            return;
        }

        this.props.changeTaskTitle({
            id: this.props.id,
            listId: this.props.listId,
            data: event.nativeEvent.data,
            type: event.nativeEvent.inputType,
            selectionStart: event.target.selectionStart,
        });
    }

    startEditing() {
        this.setState({ editing: true });
    }

    endEditing() {
        setTimeout(
            () =>
                this.props.changeTaskTitle({
                    id: this.props.id,
                    listId: this.props.listId,
                    force: true,
                }),
            1000
        );

        this.setState({ editing: false });
    }

    handleKeyDown(event) {
        if (event.keyCode !== 46 && event.keyCode !== 8) {
            return;
        }

        this._rawStr = String(event.target.value);
        const input = event.target;
        this._caretPosition = Number(event.target.selectionEnd);

        this.props.changeTaskTitle({
            id: this.props.id,
            listId: this.props.listId,
            type: 'deleteContentBackward',
            selectionStart: input.selectionStart,
            selectionEnd: input.selectionEnd,
        });
    }

    render() {
        const { title } = this.props;

        return this.state.editing ? (
            <Input
                value={title}
                className={style.editable}
                ref="input"
                onInput={this.handleInput}
                onKeyDown={this.handleKeyDown}
                onBlur={this.endEditing}
                onPressEnter={this.endEditing}
            />
        ) : (
            <Tooltip title={'Click to edit title'}>
                <Text className={style.title} onClick={this.startEditing}>
                    {title}
                </Text>
            </Tooltip>
        );
    }
}

const mapState = (state, { id }) => {
    return {
        title: state.status.tasks[id]?.title,
        listId: state.status.tasks[id]?.listId,
    };
};

const mapDispatch = {
    changeTaskTitle,
};

export const TaskTitle = connect(mapState, mapDispatch)(Title);
