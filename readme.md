
# JobFinder - Online Job Recommender (API)

JobFinder is a web app which allows Employers to post jobs and Job seekers to search and apply to those jobs.

## Run Locally with Docker

Clone the project

```bash
  git clone https://github.com/binoy638/job-recommender-api
```

Go to the project directory

```bash
  cd job-recommender-api
```

Run the project using docker-compose

```bash
  docker-compose -f docker-compose.dev.yml up --build
```

## Run Locally without Docker

Make sure you have ffmpeg, rabbitMQ and mongoDB installed locally before following the below steps.

Clone the project

```bash
  git clone https://github.com/binoy638/job-recommender-api
```

Go to the project directory

```bash
  cd job-recommender-api
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env.local file

`MONGO_URI`

`JWT_SECRET`

`COOKIE_SECRET`

`ADMIN_USER`

`ADMIN_PASSWORD`

`ORIGIN_URL`

## Related

Here is the client [repo](https://github.com/binoy638/job-recommender-client).

## License

[MIT](https://choosealicense.com/licenses/mit/)
