# Cool People

## Tech Stack

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

For this project, I decided to use some technologies that I am not familiar with, such as tRPC, NextAuth, NextJS. I made this decision to learn more about these technologies. To keep things simple, I used SQLite.

However, I faced some challenges while uploading images using tRPC, as they do not support FormData yet (it is an experimental feature). To overcome this, I converted the image into a base64 string and saved it in the database. Although it is not the best solution, for now, it works. In the future, it would be better to save the image in a cloud service like an S3 bucket with pre-signed URLs.

Similarly, I am storing the generated PDF files on disk for simplicity. However, this approach limits the ability to choose a unique name for the file. While I acknowledge that this is not the best solution, it works well enough for this demo project.

## Getting Started

1. Clone this repository

- `git clone [repository-url]

2. Install dependencies

- `npm install`

3. Setup the .env file

- `add a DATABASE_URL for sqlite database (file:./db.sqlite))`
- `add a NEXTAUTH_SECRET for next-auth`
- `add NEXTAUTH_URL="http://localhost:3000/auth/login"
`

4. Prepare the prisma ORM

- `npm run db:migrate`
- `npm run db:generate`
- `npm run db:push`

5. Run the development server

- `npm run dev`
