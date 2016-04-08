# NEAT Template

This is a template for a NodeJS-Express-AngularJS-TingoDB (NEAT) stack based website. It uses a Single Page Application (SPA) based on AngularJS and node hosted REST APIs. The Express node module sets up the web framework while TingoDB hosts the DB.

Similar to MEAN stack based website, this template uses Tingodb. TingoDB is an embedded Javascript based DB that is a drop-in replacement to MongoDB. This is useful for development purposes where TingoDB can be easily replaced by MongoDB for production environment.

To copy this template to your project, go to your project directory then run the following:

```shell
git archive --remote git@bsggitlab:530594/neat.git --prefix=mynewrepo/ --format=tar HEAD | tar xf -
```