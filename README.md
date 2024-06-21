POST  http://localhost:3000/auth/register

{
  "email": "user3@example.com",
  "password": "password123"
}

=====================================================================================================================================

POST http://localhost:3000/chat/conversation    (pour l'instant il faut créer une conversation avec les ID des 2 utilisateurs)

{
  "userIds": [1, 2]
}


=====================================================================================================================================

POST  http://localhost:3000/chat/send

{
  "content": "Hello, how are you?",
  "senderId": 1,
  "recipientId": 2,
  "conversationId": 5
}

=====================================================================================================================================

GET   http://localhost:3000/chat/messages/:userID