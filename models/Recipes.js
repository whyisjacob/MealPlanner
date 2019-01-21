//TheHashbrown Admins (employees)
module.exports = function(sequelize, DataTypes) {
	var Recipes = sequelize.define("Recipes", {
	  id: {
		autoIncrement: true,
		primaryKey: true,
		type: DataTypes.INTEGER
	  },
	  RecipeName: {
		type: DataTypes.STRING,
		allowNull: false,
		validate: {
		  len: [1]
		}
	  },
	  RecipeLocation: {
		type: DataTypes.STRING,
		allowNull: false,
		len: [1]
	  },
	  MealType: {
		type: DataTypes.INTEGER,
		allowNull: false,
		len: [1]
	  }
	});
	return Recipes;
  }; 
  