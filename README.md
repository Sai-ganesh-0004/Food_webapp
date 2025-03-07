```markdown
# Zomato Restaurant Listing & Searching Web App

Hey everyone! This is my project on restaurant listing and searching, inspired by Zomato. The idea is to create a complete web application where users can find restaurants, check their details, and even search for places based on location or food images!

## Live Demo & Deployment
You can check out the live version of the app here:
- **Live App**: [Food WebApp](https://food-webapp-frontend.onrender.com)
- **Demo Video**: [Project Walkthrough](https://www.youtube.com/watch?v=1wEC44yPAWs)

## What This Project Does

### 1. Data Loading
First, I created a script to load restaurant data from [this Kaggle dataset](https://www.kaggle.com/datasets/shrutimehta/zomato-restaurants-data) into a database. This ensures that the application has real restaurant data to work with.

### 2. Web API Service
I built a RESTful web API to provide restaurant information. It supports the following endpoints:
- **Get Restaurant by ID**: Fetches details of a restaurant based on its unique ID.
- **Get List of Restaurants**: Returns a paginated list of restaurants.

### 3. User Interface
The frontend of the application interacts with the API to display restaurant information through different pages:
- **Restaurant List Page**: Shows a list of restaurants, allowing users to click and view more details.
- **Restaurant Detail Page**: Displays detailed information about a selected restaurant.
- **Location Search**: Users can find restaurants near a specific location by entering latitude and longitude (e.g., restaurants within 3 km of a given point).
- **Image Search**: This cool feature allows users to upload a food image (like ice cream or pasta), and the app suggests restaurants serving that cuisine.

### 4. Additional Features (If Time Permits)
I planned to add a few more features to enhance the search and filtering experience:
- **Filtering Options**:
  - By Country
  - By Average Spend for Two People
  - By Cuisine Type
- **Search Functionality**: Users can search for restaurants by name or description.

## Final Thoughts
This project was a great learning experience, covering data processing, API development, and frontend integration. The goal was to build a functional and user-friendly restaurant search platform that could be easily extended with more features in the future.

Try it out and let me know what you think!

[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/UOcNv8Zs)
```

