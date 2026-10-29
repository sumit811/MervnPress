# MervnPress

MervnPress is a small headless blogging project. The current implementation is an Express API backed by MongoDB and Mongoose. The `admin/` and `blog/` directories are reserved for the admin dashboard and public blog frontends; their application source is not present yet.

## Requirements

- Node.js LTS and npm. Installing Node.js with [nvm](https://github.com/nvm-sh/nvm) is recommended because it makes upgrading Node straightforward. After installing nvm, install and activate the current LTS release:

	```sh
	nvm install --lts
	nvm use --lts
	node --version
	npm --version
	```

- MongoDB Community Server running locally, or a MongoDB Atlas connection string.

## Install MongoDB on macOS

With [Homebrew](https://brew.sh/) installed, run:

```sh
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
brew services list
```

The service should show as started. To stop the local service later, run `brew services stop mongodb-community`.

For another operating system, follow MongoDB's [Community Edition installation guide](https://www.mongodb.com/docs/manual/administration/install-community/). Atlas can be used instead of a local MongoDB service; create a database user, allow your machine's IP address in Network Access, and copy the application's connection string.

## Project Structure

```text
MervnPress/
├── admin/                    # Admin frontend (source not added yet)
│   ├── package.json
│   └── package-lock.json
├── backend/                  # Express and Mongoose API
│   ├── models/
│   │   └── Post.js            # Blog post schema
│   ├── routes/
│   │   ├── blogRoutes.js      # Post and page API routes
│   │   └── categoryRoutes.js  # Category rename route
│   ├── server.js              # Loads config, connects MongoDB, starts API
│   ├── package.json
│   ├── package-lock.json
│   └── .env                   # Local configuration (do not commit secrets)
├── blog/                     # Public blog frontend (source not added yet)
└── readme.md
```

## Configure and Run the Backend

Open a terminal in the repository root, then install the backend's locked dependencies:

```sh
cd backend
npm ci
```

Create or edit `backend/.env` with a MongoDB connection string. For the default local MongoDB service, use:

```dotenv
MONGO_URI=mongodb://127.0.0.1:27017/mervnpress
PORT=5000
```

`PORT` is optional; the API defaults to port `5000`. Keep `.env` local and never put database credentials in source control. Start the API from the `backend/` directory:

```sh
npm start
```

The server logs that it is listening on the selected port and reports whether MongoDB connected. The API base URL is `http://localhost:5000` when using the default port.

## API

All current routes are mounted under `/api`:

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/posts` | List published posts and pages, newest first |
| `GET` | `/api/admin/posts` | List all posts and pages, including drafts and trash |
| `POST` | `/api/admin/posts` | Create a post or page from a JSON request body |
| `PUT`, `PATCH` | `/api/admin/posts/:id` | Update a post or page by its MongoDB ID |
| `DELETE` | `/api/admin/posts/:id` | Move an item to trash; add `?force=true` to permanently delete it |
| `PATCH` | `/api/categories` | Rename a category on matching items |

The post and page list endpoints accept an optional `type` query parameter: `post` or `page`. For example, `/api/posts?type=page` lists published pages. Any other supplied value returns `400`.

Creating a post or page requires `title`, `slug`, and `content`. `slug` must be unique. `type` can be `post` or `page` and defaults to `post`; `category` defaults to `Uncategorized`; and `status` can be `publish`, `draft`, or `trash` and defaults to `draft`. `meta` is an optional array of `{ "key": "...", "value": "..." }` objects. MongoDB timestamps provide `createdAt` and `updatedAt`.

Example create request:

```sh
curl -X POST http://localhost:5000/api/admin/posts \
	-H 'Content-Type: application/json' \
	-d '{"title":"Hello world","slug":"hello-world","content":"First post","category":"News","status":"publish"}'
```

Set `"type":"page"` when creating a static page. To update fields, send them in a JSON body to either `PUT` or `PATCH /api/admin/posts/:id`; updates run schema validation and return `404` when the ID is not found. Deleting without `force=true` sets the item's status to `trash`, so it remains in the admin list. Permanent deletion removes it from the database.

Rename a category by sending both names to `PATCH /api/categories`:

```sh
curl -X PATCH http://localhost:5000/api/categories \
	-H 'Content-Type: application/json' \
	-d '{"oldName":"News","newName":"Updates"}'
```

The rename updates the category on all matching items and returns `updatedCount`. It returns `404` if no items currently use `oldName`, and `400` if either name is missing or both names are the same.

## Admin and Blog Frontends

The Vue admin app provides a WordPress-style posts list with search, status filters, bulk actions, post creation and editing, status changes, and trash. Start the backend as described above, then install and run the admin app:

```sh
cd admin
npm ci
npm run dev
```

Vite proxies `/api` requests to `http://localhost:5000` by default. Set `VITE_API_PROXY_TARGET` when the backend runs elsewhere, or set `VITE_API_URL` to use a direct API base URL. The `blog/` directory is currently empty.

## Troubleshooting

- **MongoDB connection error:** confirm MongoDB is running with `brew services list`, and verify `MONGO_URI` in `backend/.env`.
- **Address already in use:** set `PORT` in `backend/.env` to another available port and use that port in API requests.
- **`npm ci` fails:** confirm you are in the appropriate project directory (`backend/`) and that Node.js and npm are installed.