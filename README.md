# Design Verification Lab Website, NTUEE
## Run website
### Local
1. Modify "BackendPort": to "http://localhost:4000/api/"

2. A terminal (frontend)
```bash=
cd frontend
yarn start
```
3. Another terminal (backend)
```bash=
cd backend
yarn run server
```

### Deploy
1. Modify "BackendPort": to "api/"

2. In terminal
```bash=
docker-compose up -f tools/docker-compose.yml --build
```
## MongoDB
### Login by google account
* account: dvlabdvlab@gmail.com
* password: 
### .env url
```bash=
account=
password=
cluster=
database=

MONGO_URL=mongodb+srv://${account}:${password}@${cluster}.pqmbqsg.mongodb.net/${database}?retryWrites=true&w=majority

```
* **<font color="#f00">Make sure your IP is in the whitelist before connecting to DB</font>**

## Data
### Frontend
* Frontend data are in `frontend/src/config/frontend.json`.
### Backend Database
* Beckend data in MongoDB
* Collections
    * course
    * membio
    * newsAndAwards
    * publication
    * maintainer
* ``frontend.json`` would not store in database

## Structure

```
backend
├── .env
├── .env.default
├── server
│    ├── models
│    │   ├── course.js
│    │   ├── maintainer.js
│    │   ├── member.js
│    │   ├── newsAward.js
│    │   ├── maintainer.js
│    │   ├── publication.js
│    ├── routes
│    │   ├── index.js
│    │   ├── course.js
│    │   ├── maintainer.js
│    │   ├── member.js
│    │   ├── newsAward.js
│    │   ├── maintainer.js
│    │   ├── publication.js
│    └── server.js
├── package.json
└── yarn.lock

frontend
├── public/
├── src
│   ├── App.js
│   ├── App.scss
│   ├── components
│   │   ├── About
│   │   │   ├── Gallery
│   │   │   └── Slide
│   │   ├── AnimatedLetters
│   │   ├── Courses
│   │   │   └── Course
│   │   ├── Footer
│   │   ├── Home
│   │   │   ├── Logo
│   │   │   └── NewsAwards
│   │   │       └── Item
│   │   ├── HostProfile
│   │   ├── Members
│   │   │   ├── Group
│   │   │   ├── MemBio
│   │   │   └── Member
│   │   ├── NavBar
│   │   └── Publications
│   │       └── Pub
│   ├── config
│   │    └── frontend.json
│   ├── index.js
│   ├── index.scss
│   └── logo.png
├── package.json
└── yarn.lock

nginx
├── Dockerfile
└── nginx.conf

tools
├── docker-compose.yml
├── Dockerfile.backend
└── Dockerfile.frontend
```
