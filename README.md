# Togedr
> Do more, Togedr.

Togedr is a full-stack MERN web application designed for students and urban dwellers to find people for spontaneous, short-term activities—be it co-working, sports, campus events, or casual outings [cite: 33-34]. [cite_start]It fills the gap for a lightweight, consent-first platform that helps users find someone to do something with—now[cite: 36].

Its unique feature is the **"Togedr Moment,"** a post-activity, Tinder-style swipe interface that allows participants to connect in a low-pressure way after sharing a real-world experience[cite: 38, 74].

## ✨ Features

* **Full User Authentication:** Secure JWT-based registration and login system.
* **Geospatial Activity Discovery:** Find upcoming activities on an interactive Leaflet.js map based on your location.
* **Real-Time Group Chat:** Every activity automatically creates a real-time group chat using Socket.IO for participants to coordinate.
* [cite_start]**Post-Activity "Togedr Moment":** A unique Tinder-style swiping UI for participants after an activity is marked 'complete'[cite: 183].
* **1-on-1 Matching:** Mutual right-swipes create a private, temporary chat room for matched users.
* [cite_start]**Profile Management:** Users can edit their bio, manage a dynamic list of interests, and upload a new profile picture to Cloudinary[cite: 185].
* **Private Activities:** Post 'invite-only' activities, search for users by name/email, and manage an invite list.
* **Smart Prompts:** The "Togedr Moment" prompt is automatically hidden after a user has completed swiping for an activity.

## 🛠️ Technology Stack

| Layer | Stack |
| :--- | :--- |
| **Frontend** | React.js (Vite), TailwindCSS, React Router |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (with Mongoose) |
| **Authentication** | JSON Web Tokens (JWT) & Custom Middleware |
| **Real-Time** | Socket.IO |
| **Maps** | Leaflet.js & OpenStreetMap |
| **Image Hosting** | Cloudinary |

## 🚀 Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites

You will need the following installed on your machine:
* [Node.js](https://nodejs.org/) (v18+ recommended)
* [Git](https://git-scm.com/)

You will also need accounts for:
* **MongoDB Atlas** (for the database)
* **Cloudinary** (for image hosting)

### 1. Clone the Repository

```bash
git clone [https://github.com/prachiipahwa/Togedr.git](https://github.com/prachiipahwa/Togedr.git)
cd Togedr
```

### 2. Backend Setup (`server`)

1.  Navigate to the backend folder:
    ```bash
    cd server
    ```
2.  Install npm packages:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `server` directory and add the following variables:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    ```
    
### 3. Frontend Setup (`togedr-ui`)

1.  Navigate to the frontend folder (from the root):
    ```bash
    cd ../togedr-ui 
    ```
2.  Install npm packages:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `togedr-ui` directory and add your Cloudinary credentials:
    ```env
    VITE_API_BASE_URL=http://localhost:5000/api
    VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    VITE_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_upload_preset
    ```

### 4. Run the Project

1.  **Run the Backend:** Open a terminal in the `server` folder and run:
    ```bash
    npm run dev
    ```
2.  **Run the Frontend:** Open a *second* terminal in the `togedr-ui` folder and run:
    ```bash
    npm run dev
    ```

Your application should now be running locally at `http://localhost:5173`.
