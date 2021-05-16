import { Input, Tooltip } from 'antd';
import React, { useState, useRef, useMemo, useLayoutEffect } from 'react';
import style from './style.module.css';
import { changeTitle } from './action';
import { connect, useDispatch, useSelector } from 'react-redux';

class Title2 extends React.PureComponent {
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

            console.log(index);

            this.refs.input.setSelectionRange(index, index);
        }
    }

    handleInput(event) {
        this._rawStr = String(event.target.value);
        this._caretPosition = event.target.selectionEnd;

        if (event.nativeEvent.inputType === 'deleteContentBackward') {
            return;
        }

        this.props.changeTitle({
            id: this.props.listId,
            data: event.nativeEvent.data,
            type: event.nativeEvent.inputType,
            selectionStart: event.target.selectionStart,
        });
    }

    startEditing() {
        this.setState({ editing: true });
    }

    endEditing() {
        this.setState({ editing: false });
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     if (this.state.editing !== nextState.editing) {
    //         return true;
    //     }
    //
    //     if (this.props.title === nextProps.title) {
    //         return false;
    //     }
    //
    //     if (this.props.listId === nextProps.listId) {
    //         return false;
    //     }
    //
    //     return true;
    // }

    handleKeyDown(event) {
        if (event.keyCode !== 46 && event.keyCode !== 8) {
            return;
        }

        this._rawStr = String(event.target.value);
        const input = event.target;
        this._caretPosition = Number(event.target.selectionEnd);

        this.props.changeTitle({
            id: this.props.listId,
            type: 'deleteContentBackward',
            selectionStart: input.selectionStart,
            selectionEnd: input.selectionEnd,
        });
    }

    render() {
        const { title } = this.props;
        console.log('render');
        return this.state.editing ? (
            <Input
                value={title}
                className={style.editable}
                ref="input"
                onInput={this.handleInput}
                onKeyDown={this.handleKeyDown}
                onBlur={this.endEditing}
            />
        ) : (
            <Tooltip title={'Click to edit'}>
                <h2 className={style.title} onClick={this.startEditing}>
                    {title}
                </h2>
            </Tooltip>
        );
    }
}

const mapState = (state, { listId }) => {
    return {
        title: state.status.lists[listId]?.title,
    };
};

const mapDispatch = {
    changeTitle,
};

export const Title = connect(mapState, mapDispatch)(Title2);
