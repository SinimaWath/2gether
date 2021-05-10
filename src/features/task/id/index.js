import { getRandomId } from '../../id/random-id';

const PREFIX = 'task';

export const generateTaskId = () => {
    return `${PREFIX}:${getRandomId()}`;
};
