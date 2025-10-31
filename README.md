# FOMO

## Setting up local dev invironment

This repository functions as a mono repo. The client and server directories function as two separate projects. You must run commands from the respective directory. 

[Expo documentation](https://docs.expo.dev/)

[Prisma Documentation](https://www.prisma.io/docs)
### Client Setup
Enter client directory

```bash
cd client/
```
Install dependencies
```bash
npm i
```
Start the app
```bash
npx expo start
```

## Server Setup

Download and install [MySQL Server](https://dev.mysql.com/downloads/mysql/8.0.html) 8.4.7 LTS and create a local user

(Optional) Download and Install [MySQL Workbench](https://dev.mysql.com/downloads/workbench/) for managing your local database

Enter server directory
```bash
cd server/
```
Install dependencies
```bash
npm i
```
Create a copy of file 'env.local' as '.env' and modify the variable with your MySQL Server local account

Update your local database with the latest schema
```bash
npx prisma migrate dev
```
```bash
npx prisma generate
```
Start the server
```bash
npm start
```
The server is accessible at http://localhost:5000/

## Database schema development

If changes are made to schema.prisma, run the following command

```bash
npx prisma migrate dev --name version-name-example
```

Fix migration errors
```bash
npx prisma migrate reset
```
