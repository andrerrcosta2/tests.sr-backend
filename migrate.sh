#!/bin/bash

echo "Running migrations..."

# Assuming you have a Sequelize CLI installed locally or in a container.
npx sequelize-cli db:migrate

echo "Migrations completed."