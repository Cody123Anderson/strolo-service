#!/usr/bin/env bash

# Exit the script as soon as something fails.
set -e

# What is the application's path?
APPLICATION_PATH="$HOME/dev/serenade-api"

# How is the application defined in your docker-compose.yml file?
APPLICATION_NAME="serenade-api"

# What is your Docker registry's URL?
REGISTRY="011323353560.dkr.ecr.us-west-1.amazonaws.com"

# What is the repository's name?
REPO_APP="serenade-api/serenade-api"
REPO_NGINX="serenade-api/nginx"

# Which build are you pushing?
BUILD="latest"

# Which cluster are you acting on?
CLUSTER="serenade-api"

# What's your application's version number?
VERSION="1.0.0"

function push_to_registry () {
  # Move into the application's path and build/tag the App's Docker image.
  cd "${APPLICATION_PATH}"

  docker build -t "${REPO_APP}:${BUILD}" -t "${REGISTRY}/${REPO_APP}:${BUILD}" -t "${REGISTRY}/${REPO_APP}:${VERSION}" .

  # Automatically refresh the authentication token with ECR.
  eval "$(aws ecr get-login --no-include-email --region us-west-1)"

  # Push the App's Docker image to its repository.
  docker push "${REGISTRY}/${REPO_APP}"

  # Move into the nginx folder and build/tag the Nginx Docker image.
  cd "${APPLICATION_PATH}/nginx"

  docker build -t "${REPO_NGINX}:${BUILD}" -t "${REGISTRY}/${REPO_NGINX}:${BUILD}" -t "${REGISTRY}/${REPO_NGINX}:${VERSION}" .

  # Push the Ngninx Docker image to its repository.
  docker push "${REGISTRY}/${REPO_NGINX}"
}

function update_service () {
  # Move into the deploy directory
  cd "${APPLICATION_PATH}/deploy"

  # Register a new task definition revision
  aws ecs register-task-definition \
    --cli-input-json file://serenade-api-task-definition.json

  # Update the ECS service to use the new task definition
  aws ecs update-service --cluster "${CLUSTER}" --service serenade-api-service \
    --task-definition serenade-api-task-definition --desired-count 2
}

function all_but_migrate () {
  push_to_registry
  update_service
}

function help_menu () {
cat << EOF
Usage: ${0} (-h | -p | -s | -d)

OPTIONS:
   -h|--help             Show this message
   -p|--push-to-registry Push the web application to your private registry
   -s|--update-service   Update the serenade-api-service
   -d|--deploy           Run a complete deployment

EXAMPLES:
   Push the web application to your private registry:
        $ ./deploy.sh -p

   Update the service:
        $ ./deploy.sh -s

   Do everything except run a database migration:
        $ ./deploy.sh -d

EOF
}

# Deal with command line flags.
while [[ $# > 0 ]]
do
case "${1}" in
  -p|--push-to-registry)
  push_to_registry
  shift
  ;;
  -s|--update-service)
  update_service
  shift
  ;;
  -d|--deploy)
  all_but_migrate
  shift
  ;;
  -h|--help)
  help_menu
  shift
  ;;
  *)
  echo "${1} is not a valid flag, try running: ${0} --help"
  ;;
esac
shift
done
