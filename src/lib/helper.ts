import { parkingConfig, usersList } from "./config";

export const getUsers = () => {
    return usersList.filter((user) => parkingConfig.users[user].showInFilter);
}