# Design Verification Lab Website, NTUEE

## Run website

### Local

1. A terminal (frontend)

```bash=
cd frontend
yarn start
```

2. Another terminal (backend)

```bash=
cd backend
yarn run server
```

### Deploy

1. In terminal

```bash=
docker-compose up --build -d
```

## MongoDB

### Login by google account

- account: dvlabdvlab@gmail.com
- password:

### .env url

```bash=
account=
password=
cluster=
database=

MONGO_URL=mongodb+srv://${account}:${password}@${cluster}.pqmbqsg.mongodb.net/${database}?retryWrites=true&w=majority

```

- **<font color="#f00">Make sure your IP is in the whitelist before connecting to DB</font>**

## Data

### Frontend

- Frontend data are in `frontend/src/config/frontend.json`.

### Backend Database

- Backend data in MongoDB
- Collections
  - course
  - membio
  - newsAndAwards
  - publication
  - maintainer
- `frontend.json` would not store in database
