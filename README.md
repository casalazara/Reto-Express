# Reto-Express
La API del proyecto es:

* `GET /chat/api/messages` -> JSON con todos los mensajes que se han enviado.

* `GET /chat/api/messages/{{ts}}` -> JSON del mensaje con timestamp (ts) dado.

* `POST /chat/api/messages` -> envía un JSON para enviar un mensaje al chat. El JSON debe tener el siguiente formato:

> { "message": "Mensaje a enviar", "author": "Autor del mensaje" }

* `PUT /chat/api/messages/` -> envía un JSON para actualizar el mensaje con timestamp (ts) dado. El JSON debe tener el siguiente formato:

> { "message": "Mensaje a enviar", "author": "Autor del mensaje", "ts":timestamp del mensaje a actualizar }

* `DELETE /chat/api/messages/{{ts}}` -> borra el mensaje con el timestamp (ts) dado.

Restricciones:

* Los campos (message, author) son requeridos
* El mensaje no puede tener menos de 5 caracteres
* El autor debe tener un nombre y un apellido separados por un espacio
