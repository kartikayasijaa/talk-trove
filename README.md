# Chat-App

It is a Full Stack Chatting App.
Uses Socket.io for real-time communication and stores user details in encrypted format in Mongo DB Database.

## Demo:-

https://github.com/kartikayasija/chat-app/assets/115306535/7aae21fb-a523-4393-a417-d3868f213c8c

## Tech Stack:-

![React](https://img.shields.io/badge/Client-React%20JS-61DAFB?style=for-the-badge&logo=react&logoColor=white)

![Node.js](https://img.shields.io/badge/Server-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)

![Express](https://img.shields.io/badge/Server-Express.js-000000?style=for-the-badge&logo=express&logoColor=white)

![Socket.io](https://img.shields.io/badge/Server-Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)

![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

## What I learned through this Project?

- Web Sockets and Socket.IO: Throughout this project, I learned about Web Sockets and their implementation using Socket.io. Including broadcasting messages to multiple clients, handling different events, implementing acknowledgments, and handling disconnect and error events.
- Context API: I also learned about the Context API as part of this project. I gained an understanding of how to use it in React to manage global state and share data between components without the need for prop drilling
- UI with Chakra UI: I learned to build a user-friendly UI design using Chakra UI.

## Read Contributing.md to follow open-source guidelines 

## Project initialization locally:-

1. Clone the project

```bash
  git clone https://github.com/kartikayasija/chat-app
```

2. run yarn command

```bash
  yarn
```

### Start the server:
```bash
  cd backend
```

1. Make a .env file and add this

```bash
  JWT_SECRET="" #anything
  MONGO_URL="mongodb://127.0.0.1:27017/talk-trove" # default
  PORT=4444 #default
  NODE_ENV="" #findit
```

2. run yarn command

```bash
  yarn
```

3. run yarn command

```bash
  yarn run dev
```
4. Open new tab in browser and navigate to:
```bash
  https//localhost:4444
```

### Start the Client :
```bash
  cd frontend
```

1. Make .env and add this:
```bash
  REACT_APP_API_URL='http://localhost:3000'
```
2. run yarn command

```bash
  yarn
```
3. run yarn command

```bash
  yarn start
```

### Made with love 💖
