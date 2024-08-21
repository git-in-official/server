FROM node:20-alpine3.18 AS build
WORKDIR /app
COPY ./ /app/
RUN npm install
RUN npm run build
RUN npx tsc prisma/seed.ts

FROM node:20-alpine3.18
EXPOSE 3000
WORKDIR /app
COPY --from=build /app/dist /app/dist
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/package-lock.json /app/package-lock.json
COPY --from=build /app/prisma /app/prisma
RUN npm install --omit=dev
CMD ["npm", "run", "start:prod"]
