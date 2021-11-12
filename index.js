const mongoose = require("mongoose");

// Import of the model Recipe from './models/Recipe.model.js'
const Recipe = require("./models/Recipe.model");
// Import of the data from './data.json'
const data = require("./data");

const MONGODB_URI = "mongodb://localhost:27017/recipe-app";

// Connection to the database "recipe-app"
mongoose
  .connect(MONGODB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((self) => {
    console.log(`Connected to the database: "${self.connection.name}"`);
    // Before adding any recipes to the database, let's remove all existing ones
    return Recipe.deleteMany();
  })
  .then(() => {
    // Run your code here, after you have insured that the connection was made
    updateDatabase();
  })
  .catch((error) => {
    console.error("Error connecting to the database", error);
  });

async function updateDatabase() {
  try {
    const createdRecipe = await Recipe.create({
      title: "first recipe",
      cuisine: "first recipe",
    });
    console.log(createdRecipe.title);

    await Recipe.insertMany(data, () => {
      data.map((recipe) => {
        console.log(recipe.title);
      });
    });

    await Recipe.deleteOne({ title: "Carrot Cake" });
    console.log("deleted");
    await Recipe.findOneAndUpdate(
      { title: "Rigatoni alla Genovese" },
      { duration: 100 }
    );
    console.log("changed");
    await Recipe.deleteOne({ title: "Carrot Cake" });
    console.log("deleted");
  } catch (e) {
    console.log(e, "an error occurred");
  } finally {
    mongoose.connection.close();
    console.log("Connection Closed!");
  }
}
