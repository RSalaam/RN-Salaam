# Fullstack Technical Assessment

Author: Rasheeda Salaam

## Assumptions

-I have decided not to create a database, and just read from the given CSV files. I assume such is okay based upon some feedback I received from Lauren Hallissey at your company.

-I have decided to implement this application using request query parameters. As such, the URL must be manipulated to simulate user input. A full sample link is provided at the bottom of this README file.

-Per the given criteria, the order of restaurant results is ONLY sorted if more than 5 restaurant matches are found. If more than 5 restaurant matches are found, the priority is distance (less than or equal to user query) > customer_rating (greater than or equal to user query) > price (less than or equal to user query)

-The given list of criteria mentions that, if less than 5 matches are found, return all matches, BUT I have set it such that if less than OR EQUAL TO 5 matches are found, all matches are returned.

-The instructions below are quite detailed to simulate a real application for the public (at various experience levels).

## Embellishments for user-friendliness (non-front-end)

-I have changed the "cuisine_id" restaurant key (and, thus, query parameter) to "cuisine-type" because this is more relevant since the value that the user inputs is a word or letters. As such, this makes it clearer from the user's perspective.

-The given list of criteria mentions that an empty list should be returned if no matches are found; however, I have implemeted an error condition such that a message is sent (and a 404 status code) rather than an empty list. If you remove this conditional (currently on lines 139-145 in app.js), then an empty list is, indeed, returned. I think this conditional yields a better user experience.

## Instructions to run application

1. Open/create a directory where you want to save this application
2. Copy the clone link provided from the green "code" dropdown above
3. In your terminal (in the local directory you created/opened), run "git clone [the clone link you copied]"
4. Open the application in your code editor of choice (I use VS Code)
5. If not already there, change directory to "fullstack-RNS"
6. Run "npm install"
7. Run "npm start" 
8. CMD+Click on the link in your terminal to open the landing page of this application
9. A full query is as follows (and you can modify to your liking in line with the given criteria): 

<http://localhost:3000/restaurants?name=aladdin&cuisine_type=african&customer_rating=1&distance=7&price=30>
