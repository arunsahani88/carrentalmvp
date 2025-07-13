# Car Rental App

A full-stack car rental application built with **React (TypeScript)** on the frontend and **Node.js + Express + Sequelize + PostgreSQL** on the backend. 
It supports season-based pricing, car availability by time slot, and user bookings with validation.

# Features
- View available cars based on date range
- Season-based pricing
- Book cars with date range and validation
- React frontend with form validation (React Hook Form + Yup)
- Sequelize ORM with PostgreSQL
  
# Frontend
- React (TypeScript)
- React Hook Form + Yup
- Axios
- React Router
  
# Backend
- Node.js + Express
- PostgreSQL
- Sequelize ORM
- TypeScript
- Jest + Supertest (for tests)
- dotenv (for env config)
  
# Prerequisites
Before you begin, make sure you have:

- Node.js (v18+)
- PostgreSQL installed and running locally
- `psql` CLI or pgAdmin for DB GUI
  
# Steps to run web this application :

1) Clone the repo using below command -
  git clone https://github.com/arunsahani88/carrentalmvp.git

2) To run server application, follow below steps from the root folder -
   - cd backend
   - npm install
   - Open the code in any editor and open the .env file
   - Replace your DB user and password.
   - npm run dev

3) To run the frontend app, run below command from the root folder -
    - cd frontend
    - npm install
    - npm run dev

4) This will open the application on http://localhost:5173 on browser.

5) That's it!

----

# More details on backend and frontend apps -

# Car Rental API (Server Application)

This is a backend application for retrieving available cars based on season price and rent/book car based on user choice. 

## Getting Started
1. Running the Application:
   - npm run dev
   -  
 The server will run on http://localhost:3000
  # API Endpoints
    
    GET /cars/availability?startDate=yyyy-mm-dd&endDate=yyyy-mm-dd 
    - Fetches a list of available cars.
    
    Response:
    
    - 200 - Returns an array of available cars
    - 400 - Missing startDate or endDate or invalid date range
    - 500 - Internal Server Error.
    
    POST /bookings
    - Insert booking data.
    
    Response:
    
    - 201 - Booking Object
    - 400 - Invalid or required information
    - 404 - Car not found
    - 500 - Internal Server Error.

2. Running Tests

   - npm test

---------------------


# Car Rental frontend Application 

This is a frontend application for Car rental. It shows a list of available cars based on season and their price. Also user can book/rent the car 
based on their choice.

## Getting Started
- Running the Application:
   - npm run dev

# App URL

http://localhost:5173


<img width="1291" height="692" alt="image" src="https://github.com/user-attachments/assets/6f765485-060e-4238-aa6e-a055acbe7d4b" />


<img width="1291" height="692" alt="image" src="https://github.com/user-attachments/assets/27163c02-baf3-41b6-9b56-98a3e49e29bd" />

## To explore and see other feature
 - On car availablity page, change the date filter and see different price of car based on season.
 - If you want to rent a car click on the button 'Rent a car', it will navaigate to the http://localhost:5173/book
 - Then fill the details, after submitting your request will be saved and you will navigate back to car availablity page.
   






