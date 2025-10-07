# Infrastructure

This folder contains infrastructure-as-code for local development and deployment.

## Local Development with Docker

To run the app locally with Firebase emulator using Docker:

1. Ensure Docker and Docker Compose are installed.

2. From the project root, run:
   ```bash
   docker-compose -f infra/docker-compose.yml up --build
   ```

   Or build and run manually:
   ```bash
   docker build -f infra/Dockerfile -t hello:latest .
   docker run --rm hello:latest npm start
   ```

3. Access the app at http://localhost:3000

4. Access Firebase Emulator UI at http://localhost:4000

This sets up:
- Firebase Firestore emulator on port 8080
- React app on port 3000 with demo Firebase config
- Emulator UI on port 4000

Data is persisted in `./data` folder.

## CI/CD with Docker

The project includes a GitHub Actions workflow (`docker-ci.yml`) that:
- Builds the Docker image
- Runs tests, linting, and build inside the container
- Ensures the Docker setup is working correctly

Triggered on pushes and PRs to `main` branch.

## Deployment

For production deployment, use Firebase Hosting as described in the main README.