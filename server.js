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
app.get('/ViewRecipies', function (req, res) {
	res.sendFile(path.join(__dirname, "viewRecipes.html"));
})

app.post('/api/AddRecipe', function (request, response) {
	var rd = request.body;
  

	RecipeName = rd['recipeData[RecipeName]'],
	RecipeLocation = rd['recipeData[RecipeLocation]'],
	MealType = rd['recipeData[MealType]']

	if (RecipeName == '') {
		error = {
			errorCode: "REC001",
			error: "please send a value for RecipeName",
			received: RecipeName,
			accepted_value: 'string'
		}
		response.status(400).json(error);
		throw new Error("CODE: "+error.errorCode + ' ' + error.error)

	} 
	if (RecipeLocation == '') {
		error = {
			errorCode: "REC002",
			error: "please send a value for RecipeLocation",
			received: RecipeLocation,
			accepted_value: 'string'
		}
		response.status(400).json(error);
		throw new Error("CODE: " + error.errorCode + ' ' + error.error)
	} 
	switch(MealType){
		case '1': //breakfast
		case '2': //lunch
		case '3': //dinner
			console.log('success')
			break;
		default:
			error = {
				errorCode: "REC003",
				error: "please send an int for MealType",
				received: MealType,
				accepted_value: '1, 2, 3,'
			}
			response.status(400).json(error);
			throw new Error("CODE: " + error.errorCode + ' ' + error.error)
	}

	response.sendStatus(200);

	var recipeSendData = {
		RecipeName: rd['recipeData[RecipeName]'],
		RecipeLocation: rd['recipeData[RecipeLocation]'],
		MealType: rd['recipeData[MealType]']
	}

	console.log(recipeSendData)

	//Add it to the DB
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
			console.log('grabbed getFoodList data')
			var data = result



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
			response.json(data)
		}
	});

})
/**
 * Get recipes by ID
 */
app.get('/api/getRecipes:id', function (request, response) {
	console.log(request.params.id)
	var recipeId = request.params.id
	connection.query('SELECT * FROM Recipes WHERE id = ?', recipeId, function (error, results, fields) {
		if (error) {
			// If an error occurred, send a generic server failure
			console.log(' not successful')
			// return res.status(500).end();
		} else {
			console.log('grabbed data')
			response.json(results)
		}
	});
})
/**
 * Get All breakfast recipes
 */
app.get('/api/getBreakfast', function (request, response) {
	var recipeId = request.params.id
	connection.query('SELECT * FROM Recipes WHERE MealType = 1', recipeId, function (error, results, fields) {
		if (error) {
			// If an error occurred, send a generic server failure
			console.log('getBreakfast not successful')
			// return res.status(500).end();
		} else {
			response.json(results)
		}
	});
})
/**
 * Get All lunch recipes
 */
app.get('/api/getLunch', function (request, response) {
	var recipeId = request.params.id
	connection.query('SELECT * FROM Recipes WHERE MealType = 2', recipeId, function (error, results, fields) {
		if (error) {
			// If an error occurred, send a generic server failure
			console.log('getLunch not successful')
			// return res.status(500).end();
		} else {
			response.json(results)
		}
	});
})
/**
 * Get All dinner recipes
 */
app.get('/api/getDinner', function (request, response) {
	var recipeId = request.params.id
	connection.query('SELECT * FROM Recipes WHERE MealType = 3', recipeId, function (error, results, fields) {
		if (error) {
			// If an error occurred, send a generic server failure
			console.log('getDinner not successful')
			// return res.status(500).end();
		} else {
			response.json(results)
		}
	});
})

app.post('/updatefood', function (request, response) {
	var updateFoodId = request.body;

	var foodId = updateFoodId.foodid;
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