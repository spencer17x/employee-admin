# server

## Requirements

- Go 1.21.13
- PostgreSQL 17.0

## Usage

1. Create a `config.yaml` file in the root of the project with the following content:
   ```yaml
   database:
      user: "postgres"
      password: "123456"
      name: "employee-admin"
      addr: ":5432"
   ```
2. Run the following command to start the server:
   ```shell
   $ go run .
   ```
   
