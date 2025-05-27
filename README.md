# Face Recognition Attendance System

This project is a **Face Recognition Attendance System** designed to make classroom more efficient by using facial recognition technology. Teachers can create classess, take attendance, and view reports, while students can join classes and register their faces for attendance tracking.

### Features:

- **User Authentication:** Teachers and students can log in using email and password.
- **Face Registration:** Students can register their faces, which will be used for attendance tracking.
- **Attendance Management:** Teacher can create classes, take attendance, and view reports.
- **Role-based Access Control:** Admin can manage users, classrooms and face datas.
- **JWT Authentication:** Secure login with access and refresh tokens.
- **Real-time Face Recognition:** Attendance is automatically marked when the student's faces matches the registered profile.

## Tech Stack:

- **Frontend:** React.js with Vite
- **Backend:** Flask
- **Database:** MySQL
- **Authentication:** JWT (Access Token and Refresh Token)
- **Face Recognition:** OpenCV
- **Styling:** Tailwind CSS

## Installation

### Backend Setup (Flask)

1. Clone the repository:

   ```bash
   git clone https://github.com/adhikarikapil/smartAttend.git
   cd smartAttend/backend
   ```

2. Create a virtual environment:

   ```bash
   python -m venv myEnv
   ```

3. Activate the virtual environment:

   - **Windows:**
     ```bash
     myEnv\Scripts\activate
     ```
   - **Mac/Linux:**

     ```bash
     source myEnv/bin/activate
     ```

    - for fish shell

     ```fish (LINUX)
     source myEnv/bin/activate.fish
     ```

4. Install the dependencies:

   ```bash
   pip install -r requirements.txt
   ```

5. Set up the MySQL database:

   - Configure your database connection in `config.py`.
   - Run the migration commands to set up your database schema:
     ```bash
     flask db init
     flask db migrate
     flask db upgrade
     ```

6. Run the backend server:
   ```bash
   flask run
   ```

### Frontend Setup (React.js with Vite)

1. Go to the `frontend` directory:

   ```bash
   cd smartAttend/frontend
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

    ```bash
    npm run dev
    ```


## Usage

-**Login and Registration:** Students and teachers can log in or register. The backend generates access and refresh tokens for user authentication.
-**Classrooms:** Teachers can create and manage classrooms. Students can join a classroom using a code.
-**Face Registration:** Students can register their face for attendance tracking. The system uses OpenCV for face detection and recognition.
-**Attendance:** Teachers can take attendance by recognizing students' faces. The system will automatically mark attendance for matching faces.
-**Admin Panel:** Admin user can manage the users, classrooms, and attendance reports.


## Security Features
-**JWT Authentication:** JSON Web Tokens (JWT) are used for secure user authentication.
    -**Access Token:** Used for accessing protected routes.
    -**Refresh Token:** Used to generate a new access token whent the current one expires.

-**Face Recognition:** OpenCV is used to verify the faces of students and automatically mark attendance when their faces are detected in class.
