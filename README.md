## User Account Management App

This is a user account management solution built with Node.js runtime, Express framework, Postgres database, AWS S3 for storing user profile, verification documents images, Sequelize ORM to make the backend to talk to our database without writing SQL queries, and Next.js and Tailwind CSS on the frontend. The backend consists of three microservices: user, auth, and verification and one API gateway that helps in communicating with microservices. Each backend microservice service has its own separate database, server, and port to separate them. These microservices work together to provide a comprehensive user account management solution that ensures the security, scalability, and performance required for a large-scale application like Company Z's ZPlatform.

##### User Microservice

* Responsible for handling user-related operations.
* Provides functionality to create user accounts, update user information, and retrieve user data.
* Implements password strength enforcement and validation based on best practices.
* Handles user profile-related operations, such as managing profile photos, names, gender, age, date of birth, marital status, and nationality.

##### Auth Microservice

* Handles user authentication and authorization.
* Will support multi-factor authentication for enhanced security.
* Manages user authentication, including login and logout functionality.
* Provides functionality for user login, logout, and password reset.
* Implements secure authentication mechanisms, including token-based authentication or login link.
* Works in conjunction with the User Microservice to ensure secure access to user accounts and protected routes.
* Ensures the security of sensitive user data.

##### Verification Microservice

* Implement account verification functionality, including allowing users to provide additional information (e.g., National Identification Number or passport number) and uploading images of official documents.
* Manage the account verification process, including different states for accounts (UNVERIFIED, PENDING VERIFICATION, VERIFIED).
* Handle the storage and retrieval of user verification-related data, such as National Identification Numbers or passport numbers and uploaded document images.
* WillImplement the logic for verifying user accounts, which involves manual inspection of submitted documents (not real-time verification).
* Will update the account state based on the verification outcome (UNVERIFIED, PENDING VERIFICATION, VERIFIED).
* Will provide an endpoint for callback notifications once the verification outcome is complete.
* Will optionally send a notification to the user when the account is verified.

### Instructions to run and test the solution

**To run and test the solution, follow the steps below:**

* Clone this repository.
* Change directory into the cloned repository directory.
* Change directory into the api-gateway directory.

** Configure the environment variables and Postgres database:*

* Create a postgres database for each microservice, such as user, auth, and verification, and provide the database connection details in the .env file for each microservice as shown in attached images which can be found here: [<https://drive.google.com/drive/folders/1NT6DLA_QKjqT1JidV1gsCf8NVM-2JTPz?usp=share_link>](https://drive.google.com/drive/folders/1NT6DLA_QKjqT1JidV1gsCf8NVM-2JTPz?usp=share_link)

* Provide the necessary environment variables, i.e., the .env.local file for frontend and .env for backend and gateway as such examples: NEXT_PUBLIC_API_GATEWAY, DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DOMAIN, DB_PORT, USER_SERVICE, AUTH_SERVICE, CLIENT_SERVICE_PORT, JWT_SECRET_KEY, SMTP_HOST=smtp.gmail.com, SMTP_PORT=465, SMTP_USER, SMTP_PASSWORD, USER_PROFILE_PHOTOS, AWS_USER_ACCESS_KEY_ID, AWS_USER_SECRET_ACCESS_KEY, JWT_EXPIRES_IN=15m, to provide database connection details, AWS S3 credentials, and other configuration values as shown below or through the above link:

![Auth env](https://drive.google.com/file/d/11rrMOGD9drr21mrxOfmlwKQvgGcGtnLx/view?usp=share_link)

![User](https://drive.google.com/file/d/11H8C1qpBBEkkmIr9nXwmREVdaAkyfx8p/view?usp=share_link)

![Verification](https://drive.google.com/file/d/1QPEK6XpUCAcsORyIJBpRRQXDCymWm1Ks/view?usp=share_link)

![Gateway](https://drive.google.com/file/d/10qF5Z2UQdm_A-CjV0KS0MQOdkNj5Nznm/view?usp=share_link)

![frontend](https://drive.google.com/file/d/1W6MMMdLvHmw4b_cK6rQKVmG3K9wUFTuz/view?usp=share_link)

**Installing the dependencies:*
  
* Install dependencies using the following command to install for the API gateway, frontend, and backend microservices:
  
  > npm run install-dev

**Running the app:*
  
* Run the app using the following command to run the API gateway, frontend, and backend microservices:
  
  > npm run dev

**Alternatively:*

* You can install dependencies with the following command for each microservice, frontend and the gateway inside each respective directory:

> npm install

* Run the following command to start each microservice and gateway inside each respective directory:

> npm run server

* Run the following command to start the frontend in its directory:

> npm run dev

**Access the application:**

* Open your web browser and visit <http://localhost:3000> to access the user account management application.

Note: Make sure you have Node.js and Postgres, installed and configured on your system and AWS S3 service to store images and Gmail account configured to send emails and their credentials before running the solution.

If you have any questions or issues with environment variables, please contact me on <nidedrogba@gmail.com>.
