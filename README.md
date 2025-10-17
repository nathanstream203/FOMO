# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.


## Set up Prisma

Create a MySQL database on your local machine. Remember the username and password to your database.

Copy the contents of .env.local into your .env file. Create a .env if needed.
Change the user and password to your local db instance.

Run the following prisma commands to push the schema to the database.

```bash
npx prisma migrate dev
```

```bash
npx prisma generate
```

FOR DEVELOPING SCHEMA CMD

```bash
npx prisma migrate dev --name version-name-example
```

Fill database with test data
```bash
npm run populate
```

## Start local server
node ./server/server.js

NOTE : when running local servers, I have found it works best to run expo server first then database server - Gabe.