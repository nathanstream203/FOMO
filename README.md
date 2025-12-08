# FOMO

## Setting up local dev environment

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
Create a copy of file 'env.example' as '.env' and modify the variable with your MySQL Server local account

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

## Product Deployment

To create a new production build to deploy to physcial android devices:

Open a new Terminal in FOMO/client/

install eas 
```bash
npm install
```

log into expo
```bash
npx expo login
```
(Use Gabe's Expo account! The Project and Android Keystore are already set up there. <br> Credentials posted in teams)

run/rerun this cmd to build the product
```bash
npx eas build --profile production --platform android
```

When finished, the terminal will show a link where you can download the project

### Installing on mobile device

Enter/Paste the download link into browser, once loaded the file should automatically download

*IF THE DEVICE ASKS*<br>
Allow Samsung to access photos, media, and files? : Allow<br>
Download file? : Download<br>

Navigate to the device's download files (Files app > downloads )<br>
Look for the install file, the file will be named "download-***.apk"<br>

*IF THE DEVICE ASKS*<br>
For your security, your phone is not allows to install unknown apps from this source : Settings<br>
Allow from this source : Yes<br>

Go back to the install file, click install<br>

*IF THE DEVICE ASKS*<br>
App scan recommended : Install without Scanning<br>

Once installed, you can choose to open the app directly. Additionally, the FOMO app will now be seen as a mobile app on the device!
