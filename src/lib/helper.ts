import { removedUsers, usersList } from "./constants";

export const getUsers = () => {
    return usersList.filter((user: string) => !removedUsers.includes(user));
}