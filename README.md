## How to launch the app locally

- install docker.io & docker-compose
```
$ sudo apt-get install docker.io docker-compose
```
- make a swarm to use docker-compose (useful when backend is over multiple hosts)
```
$ docker swarm init
```
- clone the repo
```
$ git clone https://github.com/destmaxi/escaux-test.git app
```
- launch the backend
```
$ cd app/backend
$ docker-compose up -d
```
- launch the frontend
```
$ cd ../frontend
$ docker build -t frontend .
$ docker run --name front -d --rm -p 80:80 frontend
```

The application is now available at localhost; the databases are available at the following ports:

- users: 3000
- feedbacks: 3001

login/password: admin/admin 


## TODO:

- [ ] check if token hasn't expire
- [ ] view for managing the feedbacks
