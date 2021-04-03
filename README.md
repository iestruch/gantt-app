# Gantt Team Manager

Gantt Team Manager is a basic application to manage teams deliverables.

## Architecture

Developed on top of Strapi (https://strapi.io/) using Mongo as database and data is served using GraphQL. Frontend is done with Angular using Highcharts gantt chart and Material.

## Start
- Change ip in docker compose in API_URL
- Run docker-compose up.

- Access strapi in http://YOUR_IP:1337/admin.
- Create admin user.
- Create teams using Teams collection interface, it requires only a Team name.
- Create developers list using developers collection interface, requeries a name and a Team.
- Create proyects list using projects collection interface, requires a name
- Create at least one issue in issues collection
- Create users to access Gant Manager creating users in usuarios collection interface
- IMPORTANT! Go to Configurations and in configuration user and permissions plugin and add to authenticated role permission for all entities, otherwise frontend won't be able to get info

- Access Gant Manager in http://YOUR_IP:8080/


## Milestones
