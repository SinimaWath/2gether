import { getRandomId } from '../../id/random-id';

const PREFIX = 'list';

export const generateListId = () => {
    return `${PREFIX}:${getRandomId()}`;
};
