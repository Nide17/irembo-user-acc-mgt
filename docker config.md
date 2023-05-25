1. Create Docker Network: docker network create uacm

2. Start PostgreSQL Containers: docker run --network uacm --name auth-db-container -e POSTGRES_DB=auth_db -e POSTGRES_USER=parmenide -e POSTGRES_PASSWORD=jesus123 -d postgres

3. Repear for each of the dbs:
docker run --network uacm --name verification_db-container -e POSTGRES_DB=verification_db -e POSTGRES_USER=parmenide -e POSTGRES_PASSWORD=jesus123 -d postgres

docker run --network uacm --name user-db-container -e POSTGRES_DB=users_db -e POSTGRES_USER=parmenide -e POSTGRES_PASSWORD=jesus123 -d postgres

docker run --network uacm --name auth-db-container -e POSTGRES_DB=auth_db -e POSTGRES_USER=parmenide -e POSTGRES_PASSWORD=jesus123 -d postgres

4. Create Backend Service images:
- create dockerfile
- docker build -t auth-service:latest .
- docker build -t user-service:latest .
- docker build -t verification-service:latest .
- docker build -t api-gateway:latest .

5. Create Backend Service containers:
- docker run --network uacm auth-service
- docker run --network uacm user-service
- docker run --network uacm verification-service
- docker run --network uacm api-gateway




API GATEWAY
===========
- nidehazard10/irembo-user-acc-mgt: https://irembo-user-acc-mgt.onrender.com


DATABASE
========
Hostname: dpg-chmf1eik728oa7ap5ft0-a
Port: 5432
Database: auth_db_l8tj
Password: hPLhMygBBVLiTP9nA3OGc1geYY2Cs1lm
Internal Database URL: postgres://parmenide:hPLhMygBBVLiTP9nA3OGc1geYY2Cs1lm@dpg-chmf1eik728oa7ap5ft0-a/auth_db_l8tj
External Database URL: postgres://parmenide:hPLhMygBBVLiTP9nA3OGc1geYY2Cs1lm@dpg-chmf1eik728oa7ap5ft0-a.oregon-postgres.render.com/auth_db_l8tj
PSQL Command: PGPASSWORD=hPLhMygBBVLiTP9nA3OGc1geYY2Cs1lm psql -h dpg-chmf1eik728oa7ap5ft0-a.oregon-postgres.render.com -U parmenide auth_db_l8tj
Hosted by: nidehazard10@gmail.com


RAILWAY DB
PSQL: railway connect Postgres
RAW PSQL: PGPASSWORD=WuLbakji4Y77BfLThyov psql -h containers-us-west-99.railway.app -U postgres -p 7118 -d railway
DATABASE_URL: postgresql://postgres:WuLbakji4Y77BfLThyov@containers-us-west-99.railway.app:7118/railway
PGDATABASE: railway
PGHOST: containers-us-west-99.railway.app
PGPASSWORD: WuLbakji4Y77BfLThyov
PGPORT: 7118
PGUSER: postgres