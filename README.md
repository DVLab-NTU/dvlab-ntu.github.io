# Design Verification Lab Website
## Run website
A terminal (frontend)
```bash=
npm start
```
Another terminal (backend)
```bash=
npm run server
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
* Frontend data are in `src/config/frontend.json`.
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
src
├── App.js
├── App.scss
├── components
│   ├── About
│   │   ├── Gallery
│   │   ├── Slide
│   ├── AnimatedLetters
│   ├── Courses
│   │   ├── Course
│   ├── Footer
│   ├── Home
│   │   ├── Logo
│   │   ├── NewsAwards
│   │   │   ├── Item
│   ├── HostProfile
│   ├── Members
│   │   ├── Group
│   │   ├── MemBio
│   │   ├── Member
│   ├── NavBar
│   └── Publications
│       ├── Pub
├── config.json
├── index.js
├── index.scss
└── logo.png
server
├── models
│   ├── course.js
│   ├── maintainer.js
│   ├── member.js
│   ├── newsAward.js
│   ├── maintainer.js
│   ├── publication.js
├── routes
│   ├── index.js
│   ├── course.js
│   ├── maintainer.js
│   ├── member.js
│   ├── newsAward.js
│   ├── maintainer.js
│   ├── publication.js
└── server.js
```
