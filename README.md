This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Deploy on VPS

This repository also includes a GitHub Actions workflow that deploys to a VPS on every push to `main`.

Required repository secrets:

- `VPS_HOST`
- `VPS_USER`
- `VPS_PASSWORD`
- `VPS_PORT`
- `VPS_PATH`

Server requirements:

- Node.js installed
- Git installed
- `npm` available
- `pm2` recommended for process restarts
- SSH password login enabled for the deployment user

Environment variables:

- `DATABASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_TWENTY_URL` or `TWENTY_FRONTEND_URL`
- `TWENTY_GRAPHQL_URL` if the GraphQL endpoint is not `${TWENTY_FRONTEND_URL}/graphql`
- `TWENTY_BRIDGE_SECRET`
- `APP_DIR` if the app directory differs from `/var/www/joao-sistema`
- `PORT` if the process should listen on a different port

Production template:

- [docs/production-env.example](/var/www/joao-sistema/docs/production-env.example)
