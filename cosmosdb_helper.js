var docdb = require("documentdb");
var async = require("async");

var config = {
  host: "https://xxxx.documents.azure.com:443/",
  auth: {
    masterKey: "xxx"
  }
};

// Create the CosmosDB client
let client = new docdb.DocumentClient(config.host, config.auth);

// Creating the link
let documentsLink = docdb.UriFactory.createDocumentCollectionUri("xxxx", "xxxx");

// Retrive all documents
let selectAll = function(callback) {
    var spec = {
      query: "SELECT * FROM c",
      parameters: []
    };
  
    client.queryDocuments(documentsLink, spec).toArray((err, results) => {
      callback(err, results);
    });
  };

// Retrieve and delete all documents
let deleteAll = function() {
    selectAll((err, results) => {
    if (err) {
      console.log(err);
    } else {
      async.forEach(results, (message, next) => {
        client.deleteDocument(message._self, err => {
          if (err) {
            console.log(err);
            next(err);
          } else {
            next();
          }
        });
      });
    }
  });
};


let task = process.argv[2];
switch (task) {
  case "selectAll":
    selectAll((err, results) => {
      if (err) {
        console.error(err);
      } else {
        console.log(results);
      }
    });
    break;
  case "deleteAll":
    deleteAll();
    break;

  default:
    console.log("Commands:");
    console.log("selectAll deleteAll");
    break;
}


