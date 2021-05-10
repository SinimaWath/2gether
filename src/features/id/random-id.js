import { nanoid } from 'nanoid';

export const getRandomId = () => {
    return nanoid(32);
};
