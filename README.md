# TP 1 Web - Rest

---

## Part 1 — Project Setup & Data Modeling
- Generate the 3 resources: `cv`, `user`, `skill`
- Define all entity fields (CV, User, Skill)
- Set up TypeORM relations (many-to-many, many-to-one)
- Configure `TypeOrmModule` + verify DB sync
- Write create/update **DTOs** for all three entities

## Documentation
Structure:
- Modules : Cv, Skill and user modules
- Common : Generic crud service and controller
- Data/Factories : factory for each module to generate fake data using @ngneat/falso;
- Data/seeds : seeds via npm run seed:users/skills/cvs or seed for the whole database
- Data/datasource : typeorm datasource
- config/.env.example : template for .env
---

## Part 2 — CRUD & Seeding
- Complete full CRUD for `Cv` (5 endpoints, proper REST conventions)
- Create the **standalone seeder** using `@ngneat/falso`
- Add `seed:cvs` script in `package.json` and verify data
- Create `AuthModule` skeleton + update `User` entity: add `role`, unique `username`, unique `email`, hashed `password`
- Write **register** endpoint with its DTO

## Documentation
- Added seed scripts for CVs, Skills and Users and one for all three at once :
```
// Seeding everything
npm run seed

// Seeding each entity at once
npm run seed:skills
npm run seed:users
npm run seed:cvs
```
- Enabled eager loading for CVs, so when running GET on a CV, we can get all the related information.


---

## Part 3 — Auth Middleware & Login (branch: `authMiddleware`)
- Complete **login** endpoint: validate credentials, sign and return a JWT
- Verify token validity on `jwt.io`
- Create the NestJS **Middleware** on the `Cv` controller
- Decode `auth-user` header, extract `userId`, inject into `request`
- On **create**: attach connected user as CV owner
- On **update/delete**: enforce ownership, throw `401`/`403`

## Documentation
...

---

## Part 4 — Passport, Guards & Role-Based Access (branch: `auth` from `master`)
- Integrate **Passport** + `passport-jwt` strategy
- Protect write routes with `JwtAuthGuard`
- Build a custom `RolesGuard` + `@Roles()` decorator (future-proof, not hardcoded)
- `findAll` behavior: **admin** → all CVs, **user** → own CVs only
- End-to-end testing of all protected routes

## Documentation
...

---