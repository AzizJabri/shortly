Shortly - Link Shortener
Overview
Shortly is a link shortening service accessible at shortly.azizjb.tn. It allows users to create short, shareable links and track their performance metrics. The service offers different features based on user account types, making it suitable for both casual and premium users.
Features

Link Creation Limits:
Anonymous Users: Create 1 short link every 24 hours.
Logged-in Free Users: Create up to 5 short links per day.
Premium Users: Create unlimited short links.


Metrics Tracking: Premium users can access detailed analytics for their links, including click counts and other metrics.
User-Friendly Interface: Intuitive design for seamless link creation and management.

Tech Stack

Backend: Node.js with Express.js for handling API requests and server-side logic.
Database: MongoDB for storing link and user data.
Frontend: Angular for a dynamic and responsive user interface.
UI Framework: DaisyUI for streamlined and modern UI components.

Database Schemas
The project uses the following MongoDB schemas:

AnonymousLink: Stores data for links created by anonymous users.
Link: Stores data for links created by registered users.
Click: Tracks click metrics for each link, including timestamps and other relevant data.
User: Manages user account information, including subscription status.
Token: Handles authentication tokens for secure user sessions.

Getting Started
Prerequisites

Node.js (v16 or higher)
MongoDB
Angular CLI
npm or yarn

Installation

Clone the repository:git clone https://github.com/your-username/shortly.git


Navigate to the project directory:cd shortly


Install backend dependencies:cd backend
npm install


Install frontend dependencies:cd ../frontend
npm install


Set up environment variables:
Create a .env file in the backend directory with the following:MONGODB_URI=your_mongodb_connection_string
PORT=3000
JWT_SECRET=your_jwt_secret




Start the backend server:cd backend
npm start


Start the frontend development server:cd frontend
ng serve



Usage

Access the application at http://localhost:4200 (or the deployed URL: shortly.azizjb.tn).
Anonymous users can create links directly from the homepage.
Register or log in to access additional link creation and tracking features.
Premium users can view detailed metrics for their links in the dashboard.

Contributing
Contributions are welcome! Please follow these steps:

Fork the repository.
Create a new branch (git checkout -b feature/your-feature).
Commit your changes (git commit -m 'Add your feature').
Push to the branch (git push origin feature/your-feature).
Open a pull request.

License
This project is licensed under the MIT License. See the LICENSE file for details.
Contact
For questions or feedback, reach out via your-email@example.com or open an issue on the repository.
