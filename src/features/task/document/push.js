export const pushTaskChanges = (id, listId, changes) => {
    return fetch('/api/push/task', {
        method: 'POST',
        body: JSON.stringify({ id, listId, changes: JSON.stringify(changes) }),
        headers: {
            'Content-Type': 'application/json',
        },
    });
};
