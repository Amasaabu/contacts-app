
# Contacts App

This application was built using the express JS framework. It serves  html, css and javascript file for the frontend and serves an API.

## Data Store for Contacts
The application saves contacts in a json file (contacts.json). If this file does not exist it is created by default.

## The backend
The backend is an API that sends and receives JSON. The route created are
1. Create contact end point (POST-/api/contacts)
2. Get all contacts (GET-/api/contacts)
3. Search by First Name (GET-/api/contacts/firstname/${firstname})
4. Search by Last Name (GET- /api/contacts/lastname/${lastname})
5. Search by Id (GET- - /api/contacts/id/${id})
6. Delete Contact (DELETE- /api/contacts/${id})
7. Edit Contact (PATCH - /api/contacts/${id})

examplt payload when making a post or PATCH
```bash
{
    "email": "test@gmail.com",
    "phone": "08091121109",
    "firstName": "John",
    "lastName": "Doe"
}

```

## The Frontend
The express application serves the public folder which serves a HTML, CSS, and javascript file.
Upon loading the app, saved contacts are loaded. Users can create a new contact, edit a contact and delete a contact.

## Run Locally

Clone the project

```bash
  git clone https://github.com/Amasaabu/contacts-app
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

This will run the application on port 3000 by default
## Deployment Guide

Since this is a single and simple application, I suggest running the application in an AWS EC2 instance. Also setting up a deployment pipeline using github ations to automate the deployment of the application to the EC2 instance (t2.micro running Ubuntu)

Ensure You are **Signed into** the AWS console and have proper **IAM permissions** setup on your

## Steps to deploy
## First time setup
#### Step 1: Create an EC2 instance from the AWS console
#### step 2: Setup security group to allow traffic into the application on the port (default is 3000) and allow access on the ssh port (22)
#### Step 3: ssh into the instance update the list of available packages and then install node and npm
```bash
sudo apt update
sudo apt install nodejs
sudo apt install npm
```
#### Step 4: Clone the application in the instance
```bash
git clone https://github.com/Amasaabu/contacts-app
```
#### step 5: cd into the cloned repository and install the application dependencies.
```bash
npm install
```

#### Step 6: Install pm2 globally, a tool that allows a node js application to be restarted incase of failures and useful to run the node js application as a background process, so that closing the terminal session does not stop running the application
```bash
sudo npm install pm2 -g
```
#### Step 7: Finally the application can now be started 
```bash
pm2 start index.js
```
The application should now be accessible at the EC2 instance IP on port 3000.

## Setting up the automated deployment pipeline using github actions
 ##### Inside the application folder create a workflow/.action.yaml file. 
## Setting up the pipeline to automate application deployment

To run the pipeline the approach I am going with is to use github actions as it is easy to use, cheaper as it is only run whenever there is a code change, and we don't have to manage any servers as is the case with jenkins.

1. When ever there is a code change on the main branch the github workflow should run
2. The job is recomended to run in a ubuntu-container 
3. The ssh private_key for the EC2 instance should be stored as a github action secret alongside other values such as the application PORT
4. Using SCP, transfer the code from the github actions container to the EC2 instance.
5. The workflow container should ssh into the instance and create .env file to store environmental secretes such as the port number the application should be running on. This can be done with the below
```bash
 ssh -o StrictHostKeyChecking=no -i private_key ${{ secrets.USERNAME }}@${{ secrets.HOST }} << EOF
            echo "PORT=${{ secrets.PORT }}" > /home/ubuntu/contacts-app/.env
          EOF
```
6. Start a ssh session into the instance to install dependencies and restart the application using pm2, while also specifying the environmental variable file.

Below is a sample github workflow file that does the automated deployment to the EC2 instance whenever there is a code change.

```bash
name:  actions
on:
  push:
    branches:
      - main
env:
  PRIVATE_KEY: ${{ secrets.PRIVATE_KEY }}
  USERNAME: ${{ secrets.USERNAME }}
  HOST: ${{ secrets.HOST }}
jobs:
  TRIGGER_UPDATE:
    runs-on: ubuntu-latest
    steps:
      - name: checkout code
        uses: actions/checkout@v4

      - name: Transfer and deploy code
        run: |
          echo "Setting up the environment"
          echo "${{ env.PRIVATE_KEY }}" > private_key 
          chmod 600 private_key
          scp -o StrictHostKeyChecking=no -i private_key -r ./* ${{ env.USERNAME }}@${{ env.HOST }}:/home/ubuntu/api
          echo "Code transferred successfully"
          echo "Creating .env file with secrets"
          ssh -o StrictHostKeyChecking=no -i private_key ${{ secrets.USERNAME }}@${{ secrets.HOST }} << EOF
            echo "PORT=${{ secrets.PORT }}" > /home/ubuntu/app/.env
          EOF

          echo "Starting SSH session to deploy"
          ssh -o StrictHostKeyChecking=no -i private_key ${{ secrets.USERNAME }}@${{ secrets.HOST }} << EOF
            cd /home/ubuntu/app/
            sudo npm install
            pm2 stop index.js
            pm2 start index.js --node-args="--env-file .env"
            echo "Deployment complete"
          EOF
```

