const express = require("express");
const {graphqlHTTP} = require('express-graphql');
const cors = require("cors");
const schema = require("./schema");
const app = express();

app.use(cors());


app.use(
    '/graphql',
    graphqlHTTP({
      schema,
      graphiql: true
    })
  );

const PORT = process.env.PORT || 5000;

app.get('/',(req,res)=>{
    res.send("hello")
})

app.listen(PORT , ()=>console.log(`Graphql demo is running on port number ${PORT}`))