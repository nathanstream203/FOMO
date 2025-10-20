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

console.log("Welcome to the population tool");
console.log('\nPlease select an option below:');
console.log('1. Roles');
console.log('2. Bars');
console.log('3. Run all');
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
    ppopulateRoles()
        .catch(e => {
            console.error(e);
        });
}else if(choice == 2){
    populateBars()
        .catch(e => {
            console.error(e);
        });
}else if(choice == 3){
    ppopulateRoles()
        .catch(e => {
            console.error(e);
        });
    populateBars()
        .catch(e => {
            console.error(e);
        });
}
