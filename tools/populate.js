// Script to populate database with test data

import { PrismaClient } from '@prisma/client';
import readlineSync from 'readline-sync';
const prisma = new PrismaClient();

async function populateRoles() {
    const roleList = await prisma.roles.createMany({
        data: [
            { name: 'Basic', description: 'Basic user role'},
            { name: 'Admin', description: 'Admin user role'}
        ]
    })
}

async function populateBars() {
    const bars = await prisma.bar.createMany({
        data: [
            {name: 'Test Bar 1', address: '123 Main St', latitude: 44.876503, longitude: -91.926781},
            {name: 'Test Bar 2', address: '456 Main St', latitude: 44.876311, longitude: -91.929753}
        ]
    })
}

async function populateUsers() {
    const users = await prisma.users.createMany({
        data: [
            {firebase_id: '1', first_name: 'dummy', last_name: 'bob', birth_date: '2000-01-01T01:01:00Z', role_id: 1},
            {firebase_id: '2', first_name: 'dummy2', last_name: 'bob2', birth_date: '2001-01-01T01:01:00Z', role_id: 2}
        ]
    })
}

console.log("Welcome to the population tool");
console.log('\nPlease select an option below:');
console.log('1. Roles');
console.log('2. Users');
console.log('3. Bars');
console.log('4. Run all');
let choice = -1
while(true){
    choice = readlineSync.question('>');
    choice = Number(choice);
    if(!isNaN(choice) && choice <= 3 && choice > 0){
        break;
    }
    console.log('Invalid Choice');
}
if(choice == 1){
    populateRoles()
        .catch(e => {
            console.error(e);
        });
}else if(choice == 2){
    populateUsers()
        .catch(e => {
            console.error(e);
        });
}else if(choice == 3){
    populateBars()
        .catch(e => {
            console.error(e);
        });
}else if(choice == 4){
    populateRoles()
        .catch(e => {
            console.error(e);
        });
    populateUsers()
        .catch(e => {
            console.error(e);
        });
    populateBars()
        .catch(e => {
            console.error(e);
        });
}
