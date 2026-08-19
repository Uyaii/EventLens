# RoadMap

## Phase 1

- [x] Build app skeleton
- [x] Create tenants table and api keys table
- [x] post(register route) to create tenants and issue them api keys. Login route also
- [ ]

### Phase 1 Breakdown

**Tenants Table**: id, org-name, email, API-key (id in API keys table), created-at

**API Keys**: id, tenant-id,tenant-key, is-active, created-at

interface Tenant {
id: uuid,
org-name: string,
email: string,
api-key: string
created-at: timestamp
}


interface API-Keys{
id: uuid
tenant-id: uuid
tenant-key: string
is-active:boolean
created-at: timestamp
}











# Learnings
1. `tsx` is the one to install not `ts-node`  because ts-node is incompatible with your current TypeScript version and ESM setup ("module": "nodenext").
2. i had an issue with the tables, i wanted to store the tenant's api keys in the main tenants table which wouldnt make sense because a tenant could have more than 1 key and to store than in the tenant table is weird, instead its better to store them in the api-keys table and just used the `tenant-id`  to show who owns each key.
3. `await` fixed a type problem in bcrypt:
What Happened Without await (Image 1)

    bcrypt.hash(password, saltRounds) returned a pending `Promise<string>`.

    You assigned that Promise directly to hashedPassword.

    You then passed hashedPassword into newTenant under the password property.

    Your Tenants interface expects password: string.

    TypeScript threw an error because a `Promise<string>` (a pending JavaScript object) is not the actual hashed string itself.

Why await Fixed It (Image 2)

Adding await tells JavaScript to pause execution at that line until the hashing process finishes, unwrap the Promise, and extract the resolved value.

    Without await: hashedPassword = Promise { <pending> } (Type: Promise<string>)

    With await: hashedPassword = "$2b$10$e8..." (Type: string)

Because hashedPassword became a pure string, it matched the password: string property in your Tenants interface perfectly.