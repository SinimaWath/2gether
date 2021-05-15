import { useSelector } from 'react-redux';
import React from 'react';

export const ListPage = ({ id }) => {
    const list = useSelector((state) => state.status[id]);

    return (
        <div>
            <h1>{list.title}</h1>
        </div>
    );
};
