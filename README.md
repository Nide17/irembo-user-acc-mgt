## User Account Management App
This is a user account management solution built with Node.js runtime, Express framework, Postgres database, AWS S3 for storing user profile, verification douments images, Sequelize ORM to make the backend to talk to our database without writing SQL queries, and Next.js and Tailwind CSS on the frontend. The backend consists of three microservices: user, auth, and verification. Each backend service has its own separate database, server, and port to separate them. These microservices work together to provide a comprehensive user account management solution that ensures the security, scalability, and performance required for a large-scale application like Company Z's ZPlatform.

##### User Microservice:

* Responsible for handling user-related operations.
* Provides functionality to create user accounts, update user information, and retrieve user data.
* Implements password strength enforcement and validation based on best practices.
* Handles user profile-related operations, such as managing profile photos, names, gender, age, date of birth, marital status, and nationality.

##### Auth Microservice:

* Handles user authentication and authorization. 
* Will support multi-factor authentication for enhanced security.
* Manages user authentication, including login and logout functionality.
* Provides functionality for user login, logout, and password reset. 
* Implements secure authentication mechanisms, including token-based authentication or login link. 
* Works in conjunction with the User Microservice to ensure secure access to user accounts and protected routes. 
* Ensures the security of sensitive user data. 

##### Verification Microservice:
* Will implement account verification functionality, including allowing users to provide additional information (e.g., National Identification Number or passport number) and uploading images of official documents.
* Will Manage the account verification process, including different states for accounts (UNVERIFIED, PENDING VERIFICATION, VERIFIED).
* Will Handle the storage and retrieval of user verification-related data, such as National Identification Numbers or passport numbers and uploaded document images. 
* Will implement the logic for verifying user accounts, which involves manual inspection of submitted documents (not real-time verification). 
* Will Update the account state based on the verification outcome (UNVERIFIED, PENDING VERIFICATION, VERIFIED).

* Will provide an endpoint for callback notifications once the verification outcome is complete.
* Will optionally send a notification to the user when the account is verified.

### Instructions to run and test the solution

**To run and test the solution, follow the steps below:**

* Clone this repository. 
* Install the required dependencies by running the following command inside each of the backend microservice directory.

> npm install

**Configure the environment variables:*

* Create a .env file in the root directory. 
* Provide the necessary environment variables, such as DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, APP_HOST, DOMAIN, DB_PORT, USER_SERVICE_PORT, AUTH_SERVICE_PORT, CLIENT_SERVICE_PORT, JWT_SECRET_KEY, SMTP_HOST=smtp.gmail.com, SMTP_PORT=465, SMTP_USER, SMTP_PASSWORD, USER_PROFILE_PHOTOS, AWS_USER_ACCESS_KEY_ID, AWS_USER_SECRET_ACCESS_KEY, JWT_EXPIRES_IN=15m, to provide database connection details, AWS S3 credentials, and other configuration values as shown below:

![Auth env](https://drive.google.com/file/d/1Okws5a5-Xqs1rB8VMeAChiTMLmzOVf5y/view?usp=share_link)

![user](https://drive.google.com/file/d/1CWOVBtjErjNOc8vIJDXU8vNWXifjXU6e/view?usp=share_link)

![verification](https://drive.google.com/file/d/1-qeBd7p0I4kf0loqs3PoyAS4uoJDBc0I/view?usp=share_link)


* Run the following command to start each microservice:
> npm run server

**Start the frontend by navigating to **
* Navigate inside the next-user-acc-mgt directory
* Create a .env.local file in that directory. 
* Provide the necessary environment variables, such a NEXT_PUBLIC_API_GATEWAY, NEXT_PUBLIC_API_GATEWAY, NEXT_PUBLIC_API_GATEWAY

![frontend](https://drive.google.com/file/d/1zpIqH1RXhW5YKikSEE60tFs-xxqqcu0f/view?usp=share_link)

* Run the following command to start the frontend: 
> npm run dev

**Access the application:**

* Open your web browser and visit http://localhost:3000 to access the user account management application. 

Note: Make sure you have Node.js and Postgres, installed and configured on your system and aws S3 service account and its credentials before running the solution.

If you have any questions or issues with environment variables, please contact me on nidedrogba@gmail.com.
