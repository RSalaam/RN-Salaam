const fs = require('fs')
const csv = require('csv-parse')

const restaurants = []
const cuisines = []

fs.createReadStream('data/restaurants.csv').pipe(csv({from_line: 2})).on('data', function(row) {
    const restaurantDetails = {
        name: row[0],
        customer_rating: row[1],
        distance: row[2],
        price: row[3],
        cuisine_type: row[4]
    }
    restaurants.push(restaurantDetails)
})

fs.createReadStream('data/cuisines.csv').pipe(csv({from_line: 2})).on('data', function(row) {
    const cuisineDetails = {
        id: row[0],
        name: row[1]
    }
    cuisines.push(cuisineDetails)
})

module.exports = { restaurants, cuisines }