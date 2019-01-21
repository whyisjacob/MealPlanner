var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var mysql = require('mysql')
var request = require('request');


// Sets up the Express App
// =============================================================
var app = express();
var PORT = 3000;

//jawsdb
var connection = mysql.createConnection({
	host: "ocvwlym0zv3tcn68.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
	user: "abfpiw84eroolx5f",
	password: "aox2ykc9u0nlqf7u",
	database: "ffvtmenlwtnk90iu",
	port: 3306

});

connection.connect(function (err) {
	if (err) {
		console.error("error connecting: " + err.stack);
		console.log('Connection Failed')
		return;
	} else {
		console.log('Connection Successful')

	}
	console.log("connected as id " + connection.threadId);
});



// Sets up the Express app to handle data parsing
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());
app.use('/assets', express.static('assets'))


app.get("/index.html", function (req, res) {
	res.sendFile(path.join(__dirname, "index.html"));
});
app.get("/", function (req, res) {
	res.sendFile(path.join(__dirname, "index.html"));
});

app.get('/NewRecipe', function (req, res) {
	res.sendFile(path.join(__dirname, "newrecipe.html"));
})

app.post('/AddRecipe', function (request, response) {
	var recipeData = request.body;
	console.log(recipeData)

	// var questionSumNum = questionData.questionsSum;
	// questionSumNum = parseInt(questionSumNum)

	var recipeSendData = {
		RecipeName: recipeData.RecipeName,
		RecipeLocation: recipeData.RecipeLocation,
		MealType: recipeData.MealType
	}
	console.log("===========")
	console.log(recipeSendData)

	connection.query("INSERT INTO Recipes SET ?", recipeSendData, function (err, result) {
		if (err) {
			// If an error occurred, send a generic server failure
			console.log(' not successful')
			response.sendFile(path.join(__dirname, './', "index.html"));

			//return response.status(500).end();
		} else {
			console.log('data changed successfully')
			response.sendFile(path.join(__dirname, './', "index.html"));

			//response.status(200).end();
		}
	});
})


app.get('/api/getFoodList', function (request, response) {
	connection.query("SELECT * FROM Recipes ORDER BY id desc", function (err, result, fields) {
		if (err) {
			// If an error occurred, send a generic server failure
			console.log(' not successful')
			// return res.status(500).end();
		} else {
			console.log('grabbed data')
			var data = result

			console.log(data)


			response.json(data)
		}
	});

})
app.get('/api/getRecipeCount', function (request, response) {
	connection.query("SELECT COUNT(id) FROM Recipes", function (err, result, fields) {
		if (err) {
			// If an error occurred, send a generic server failure
			console.log(' not successful')
			// return res.status(500).end();
		} else {
			console.log('grabbed data')
			var data = result

			console.log(data)


			response.json(data)
		}
	});

})

app.get('/api/getRecipes:id', function (request, response){
	console.log(request.params.id)
	var recipeId = request.params.id
	connection.query('SELECT * FROM Recipes WHERE id = ?', recipeId, function (error, results, fields) {
		if (error) {
			// If an error occurred, send a generic server failure
			console.log(' not successful')
			// return res.status(500).end();
		} else {
			console.log('grabbed data')

			console.log(results)


			response.json(results)
		}
	});
})

app.post('/updatefood', function (request, response) {
	var updateFoodId = request.body;
	console.log(updateFoodId)

	var foodId = updateFoodId.foodid;
	console.log(foodId)
	var updateFoodToSend = {
		foodName: updateFoodId.foodid,
		eaten: 'true'
	}


	// connection.query("INSERT INTO foodToEat SET ?", foodToSend, function (err, result) {
	connection.query('UPDATE foodToEat SET eaten = "true" WHERE prm_key = ?', updateFoodId.foodid, function (error, results, fields) {

		if (error) {
			// If an error occurred, send a generic server failure
			console.log(' not successful')
			return response.status(500).end();
		} else {
			console.log('data changed successfully')
			response.status(200).end();
		}
	});


})


app.listen(process.env.PORT || 3000, function () {
	console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});