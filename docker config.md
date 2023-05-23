1. Create Docker Network: docker network create uacm

2. Start PostgreSQL Containers: docker run --network uacm --name auth-db-container -e POSTGRES_DB=auth_db -e POSTGRES_USER=parmenide -e POSTGRES_PASSWORD=jesus123 -d postgres

3. Repear for each of the dbs:
docker run --network uacm --name verification_db-container -e POSTGRES_DB=verification_db -e POSTGRES_USER=parmenide -e POSTGRES_PASSWORD=jesus123 -d postgres

docker run --network uacm --name user-db-container -e POSTGRES_DB=users_db -e POSTGRES_USER=parmenide -e POSTGRES_PASSWORD=jesus123 -d postgres

docker run --network uacm --name auth-db-container -e POSTGRES_DB=auth_db -e POSTGRES_USER=parmenide -e POSTGRES_PASSWORD=jesus123 -d postgres

4. Start Backend Service Containers:
