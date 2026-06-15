# Portfolio ADOMV

Architecture prevue pour faire cohabiter deux projets distincts sur le meme domaine:

- `adomv.com` -> portfolio React/Tailwind servi a la racine
- `adomv.com/api` -> API Node.js / MySQL du portfolio
- `adomv.com/uploads` -> fichiers medias du portfolio
- `adomv.com/undercover` -> projet existant separe, non fusionne

## Structure

- `frontend/` : application React publique + back-office `/admin`
- `backend/` : API REST Express + auth JWT + uploads + MySQL
- `docker-compose.yml` : stack Docker complete
- `deploy/nginx.portfolio_adomv.conf` : reverse proxy hote pour faire cohabiter le portfolio Dockerise avec `/undercover`

## Lancement Docker

1. Copier `.env.docker.example` vers `.env`
2. Renseigner au minimum `DB_PASSWORD`, `DB_ROOT_PASSWORD`, `JWT_SECRET`, `ADMIN_*`
3. Lancer:

```bash
docker compose up --build -d
```

Le stack demarre:

- `frontend` sur `http://localhost:8081`
- `backend` derriere le proxy du frontend
- `mysql` en conteneur avec volume persistant

Les migrations sont lancees automatiquement au demarrage du backend.
Le premier compte admin est cree automatiquement si `ADMIN_USERNAME`, `ADMIN_EMAIL` et `ADMIN_PASSWORD` sont definis.

## Commandes utiles

```bash
docker compose logs -f
docker compose ps
docker compose down
```

## Lancement hors Docker

Le mode manuel reste possible si besoin:

```bash
cd backend
npm install
npm run migrate
npm run create-admin -- admin admin@adomv.com your_secure_password
npm run dev
```

## Notes de deploiement

- Le portfolio reste un projet autonome.
- Le projet `undercover_weydu` reste autonome et est monte sous `/undercover`.
- Le reverse proxy Nginx du serveur hote arbitre uniquement les prefixes d'URL; il ne fusionne pas les builds.
- Dans cette version Docker, Nginx hote envoie `/` vers `127.0.0.1:8081` et `/undercover/` vers `127.0.0.1:8080`.
