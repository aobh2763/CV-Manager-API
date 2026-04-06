# TP 1 Web - Rest

---

## Part 1 — Project Setup & Data Modeling
- Generate the 3 resources: `cv`, `user`, `skill`
- Define all entity fields (CV, User, Skill)
- Set up TypeORM relations (many-to-many, many-to-one)
- Configure `TypeOrmModule` + verify DB sync
- Write create/update **DTOs** for all three entities

## Documentation
...

---

## Part 2 — CRUD & Seeding
- Complete full CRUD for `Cv` (5 endpoints, proper REST conventions)
- Create the **standalone seeder** using `@ngneat/falso`
- Add `seed:cvs` script in `package.json` and verify data
- Create `AuthModule` skeleton + update `User` entity: add `role`, unique `username`, unique `email`, hashed `password`
- Write **register** endpoint with its DTO

## Documentation
...

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