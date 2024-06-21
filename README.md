POST  http://localhost:3000/auth/register

{
  "email": "user1@example.com",
  "password": "password123"
}

=====================================================================================================================================

POST  http://localhost:3000/chat/send   (Créer 2 utilisateurs au minimum et adapter les ids)

{
  "content": "Hello, how are you?",
  "senderId": "id sender",
  "recipientId": "id recepient",
}

=====================================================================================================================================

GET   http://localhost:3000/chat/messages/:userID