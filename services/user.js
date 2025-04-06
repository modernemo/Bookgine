import fs from 'fs';

export const getUserById = (id) => {
    let data = JSON.parse(fs.readFileSync('./db.json', 'utf-8'));
    const users = data.users
    try {
        return users.find(x => x.id === id);
    } catch {
        return null;
    }
}