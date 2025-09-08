Run:
- npx prisma generate
- docker-compose up postgresql -d 
- docker-compose up -d mongo
- npx prisma migrate deploy
- export NODE_ENV=test;npx prisma db seed

Generate migration:
- npx prisma migrate dev --name <migration_name>

Can be useful:
- docker-compose stop postgresql
- npx prisma studio
