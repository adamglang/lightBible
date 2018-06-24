### lightBible
A bible webapp with the  following specs:

1. Intantly gives basic greek/hebrew translations for each word accessable by a single click (translations taken from strongs concordance)
2. Easy to read UI
3. Non-detectable load times over a 4g connection
4. Gives detailed translation and cultural context details on a second click (taken from strongs concordance and various commentaries)

#### Tech/stack
* Container Service: Docker
* Deployment: AWS Elastic Beanstock (but could be deployed to any docker capable cloud service)
* Scraper: Node.js
* Database: Mongodb
* RST API/Service layer: Express / Mongoose
* Client: React/Redux


