const express = require('express'),
  app = express(),
  axios = require('axios'),
  mongoose = require('mongoose'),
  bodyParser = require('body-parser');


// Use connect method to connect to the server
mongoose.connect('mongodb://localhost:27017/exercise', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

//Body parser for incoming requests
app.use(bodyParser.json());

let countrySchema = mongoose.Schema({
  country: String,
  population: Number,
  continent: String,
  lifeExpectancy: Number,
  purchasingPower: Number
});

let Country = mongoose.model("country", countrySchema, 'countries')


db.once('open', function(){
  console.log("Connection successful");

  //Load data from URL and add it to the database.
  const url = "https://gist.githubusercontent.com/josejbocanegra/4c553e3b5f1aae1f05ea67068f058087/raw/9f1ec3f2b48cf59ed3c3c4b01d15d1a23b25f57c/countriesall.json";
  axios.get(url)
    .then(function (response) {
      // stringify JSON Object
      console.log(response.data)
      Country.collection.insertMany(response.data, function(err, r){
        if(err){
          return console.error(err)
        } else {
          console.log("Multiple documents inserted to Collection")
        }
      })
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
})


app.get('/', function (req, res) {
  res.send('Hello World');
});

app.get('/countries', function (req, res) {
  Country.find({}).then(function (countries) {
    res.send(countries)
  })
})

app.get('/countries/Albania', function (req, res) {
  Country.find({
    country: 'Albania'
  }).then(function (countries) {
    res.send(countries)
  })
})

app.post('/countries', function (req, res) {
  const country = new Country(req.body)
  country.save(function (err) {
    if (err) {
      console.error(err);
      res.send("Oops... something went wrong.")
    } else {
      res.send("Created the new country successfully");
    }
  })
});


app.put('/countries/Albania', function (req, res) {
  Country.findOneAndUpdate({
    country: 'Albania'
  }, req.body, {
    upsert: true
  }, function (err, doc) {
    if (err) return res.send(500, {
      error: err
    });
    return res.send("Succesfully saved");
  });
})

app.delete('/countries/Albania', function (req, res) {
  Country.deleteOne({country: 'Albania'}, function(err){
    if(err){
      res.send("Oops... something went wrong")
    } else {
      res.send("Country successfully deleted")
    }
  })
})

app.listen(8080);