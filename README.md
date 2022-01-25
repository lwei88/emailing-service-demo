# emailing-service-demo

## Prerequisite Requirements

- Docker
- docker-compose
- Postman

## How to run the application

1. Make sure you have the Docker and docker-compose installed, please find the [guide](https://docs.docker.com/get-docker/)
2. Clone the repo via the command below:

```
git clone https://github.com/lwei88/emailing-service-demo.git
```

3. Change the configuration of the email server in [.env](https://github.com/lwei88/emailing-service-demo/blob/main/.env) file:

### Example:

```
SMTP_SERVER_HOST=smtp.gmail.com
SMTP_SERVER_USER=testing@gmail.com
SMTP_SERVER_PASS=testing123
```

4. Start the application by running the command below in Terminal:

```
docker-compose up -d --build
```

5. Send email by sending POST request to http://localhost:8080/email/send with json body

```
{
    "from": "testing@gmail.com",
    "to": "liang_wei88@hotmail.com",
    "subject": "testing",
    "html": "<html><head></head><body><h1>Testing Email</h1></body></html>"
}
```

### Example:

![sample](https://github.com/lwei88/emailing-service-demo/blob/main/api.jpg?raw=true)

## How to perform test

1. Make sure the RabbitMQ service is up and running, please follow [here](#how-to-run-the-application) on how to run the application(#how-to-run-the-application)
2. Change the configuration of the email server for test environment [.env.test](https://github.com/lwei88/emailing-service-demo/blob/main/.env.test) file::

### Example:

```
SMTP_SERVER_HOST=smtp.gmail.com
SMTP_SERVER_USER=testing@gmail.com
SMTP_SERVER_PASS=testing123
```

3. Run the test command

```
npm test
```

## Availablity

- scale up by launching more container

## Limitation

- environment config can be secured by implementing encryption
- secure api via jwt
