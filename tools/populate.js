// Script to populate database with test data

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function populateRoles() {
    const roleList = await prisma.roles.createMany({
        data: [
            { name: 'Basic', description: 'Basic user role'},
            { name: 'Admin', description: 'Admin user role'}
        ]
    })
}

populateRoles()
    .catch(e => {
        console.error(e);
    });