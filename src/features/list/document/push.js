export const pushListChanges = (id, changes) => {
    return fetch('/api/push/list', {
        method: 'POST',
        body: JSON.stringify({ listId: id, changes: JSON.stringify(changes) }),
        headers: {
            'Content-Type': 'application/json',
        },
    });
};
