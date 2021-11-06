const express = require("express");
const app = express();
const port = 3000;
const { restaurants, cuisines } = require("./database");

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}/restaurants. Take a look!`);
});

app.get("/restaurants", async (req, res, next) => {
  const filters = req.query;
  try {
    const filteredRestaurants = await restaurants.filter((restaurant) => {
      let isValid = true;
      for (key in filters) {
        //According to the "partial match" criteria, we only care about the first 3 characters of the "name" input, AT MOST; so we can cut down any name input longer than 3 characters.
        if (key === "name") {
          const abbreviatedUserQuery = filters[key].slice(0, 3).toLowerCase();
          const abbreviatedRestaurantName = restaurant[key]
            //abbreviatedUserQuery.length is the second argument below in case the user inputs a name query < 3 characters. This seems the most seamless way to guard against that.
            .slice(0, abbreviatedUserQuery.length)
            .toLowerCase();

          isValid =
            isValid && abbreviatedRestaurantName === abbreviatedUserQuery;
        }

        if (key === "customer_rating") {
          //Converting the string number to an integer is not necessary, but I think it's good practice to do this for unforeseen use cases.
          isValid =
            isValid && parseInt(restaurant[key]) >= parseInt(filters[key]);
        }

        if (key === "distance") {
          isValid =
            isValid && parseInt(restaurant[key]) <= parseInt(filters[key]);
        }

        if (key === "price") {
          isValid =
            isValid && parseInt(restaurant[key]) <= parseInt(filters[key]);
        }

        if (key === "cuisine_type") {
          const abbreviatedUserQuery = filters[key].slice(0, 3).toLowerCase();
          let cuisineIDArray = [];
          cuisines.forEach((cuisine) => {
            const abbreviatedCuisineName = cuisine.name
              .slice(0, abbreviatedUserQuery.length)
              .toLowerCase();
            if (abbreviatedUserQuery === abbreviatedCuisineName) {
              cuisineIDArray.push(cuisine.id);
            }
          });
          isValid = isValid && cuisineIDArray.includes(restaurant[key]);
        }
      }
      return isValid;
    });

    //If the array of results is longer than 5, then we want to sort it based on the following priorities: distance > customer_rating > price
    if (filteredRestaurants.length > 5) {
      filteredRestaurants.sort((restA, restB) => {
        return (
          parseInt(restA.distance) - parseInt(restB.distance) ||
          parseInt(restB.customer_rating) - parseInt(restA.customer_rating) ||
          parseInt(restA.price) - parseInt(restB.price)
        );
      });
    }

    //__________Now, we will handle bad requests or requests that yield no results_________

    //The regex below means all numbers and special characters. So, if there is any number or special character in the query name, then it's invalid. There are no restaurants with special characters or numbers in their names.

    if (
      (filters.name &&
        filters.name.match(/[0-9!@#$ %^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)) ||
      filters.name === ""
    ) {
      return res
        .status(400)
        .send(
          'The "name" query must be a string value without special characters or numbers. Feel free to enter just the first 1-3 letters of the restaurant name.'
        );
    }

    //For customer_rating, if user enters a string, or enters a number that does NOT fall between 1 and 5, send an error.
    if (
      (filters.customer_rating && isNaN(filters.customer_rating)) ||
      filters.customer_rating < 1 ||
      filters.customer_rating > 5
    ) {
      return res
        .status(400)
        .send('The "customer_rating" query must be a number between 1 and 5.');
    }

    //For distance, if user enters a string, or enters a number that does NOT fall between 1 and 10, send an error.
    if (
      (filters.distance && isNaN(filters.distance)) ||
      filters.distance < 1 ||
      filters.distance > 10
    ) {
      return res
        .status(400)
        .send('The "distance" query must be a number between 1 and 10.');
    }

    //For price, if user enters a string, or enters a number that does NOT fall between 10 and 50, send en error.
    if (
      (filters.price && isNaN(filters.price)) ||
      filters.price < 10 ||
      filters.price > 50
    ) {
      return res
        .status(400)
        .send(
          'The "price" query must be a number between 10 and 50. Do NOT type in a dollar sign.'
        );
    }

    //Cuisine_type value should be a string, just like the restaurant name value above
    if (
      (filters.cuisine_type &&
        filters.cuisine_type.match(
          /[0-9!@#$ %^&*()_+\-=\[\]{};':"\\|,.<>\/?]/
        )) ||
      filters.cuisine_type === ""
    ) {
      return res
        .status(400)
        .send(
          'The "cuisine_type" query must be a string value without special characters or numbers. Feel free to enter just the first 1-3 letters of the cuisine name.'
        );
    }

    //If no results are found based on query arguments, then send an error
    if (filteredRestaurants && filteredRestaurants.length === 0) {
      return res
        .status(404)
        .send(
          "No restaurants match your search criteria. Please modify your queries."
        );
    }

    //Lastly, if an unknown or misspelled parameter is included in the URL via direct manipulation by user, then I would want to send an error message or redirect, but I can't seem to find such info on how to do so. Right now, if this occurs, the user gets the ultimate best matches (i.e., matched by query (if any), and prioritized as distance > rating > price). I was testing this issue with established websites, and it seems that the behavior varies when parameter manipulation occurs, and returning the ultimate best matches as so is NOT awkward.

    //__________End of handling bad requests or requests that yield no results________

    res.status(200).send(filteredRestaurants.slice(0, 5));
  } catch (error) {
    console.error(error);
    next(error);
  }
});
