interface User {
    id: number;
    name: string;
    email?: string;
    isActive: boolean 

}

function createUser(userId: number, userName: string, userEmail?: string,userIsActive: boolean = true): User{

    return {id: userId, name: userName, email: userEmail, isActive: userIsActive}
}

const user1 = createUser(44, "Ravil");
const user2 = createUser(13, "Zus", "zuss@gmail.com", false);
console.log("программа работает");
console.log(user1);
console.log(user2);