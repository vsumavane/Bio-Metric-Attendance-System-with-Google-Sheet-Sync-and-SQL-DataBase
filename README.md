# Bio-Metric Attendance System – Modern Admin Panel UI

This is a redesigned and modernized version of the original [Biometric Attendance System with Google Sheet Sync and SQL Database](https://circuitdigest.com/microcontroller-projects/biometric-attendance-system-with-google-sheets), focused on a fully responsive and interactive web-based **Admin Panel UI**.

The redesigned panel improves the user experience with a clean UI in both **light** and **dark** themes for the following key routes:

- `/login`
- `/dashboard`
- `/enroll`
- `/settings`

---

## 🔐 Login Page

| Light Mode | Dark Mode |
|------------|-----------|
| ![Login Light](https://github.com/user-attachments/assets/610ef9a8-806e-4f77-be88-c4d22011fc45) | ![Login Dark](https://github.com/user-attachments/assets/357c772f-c589-4598-a87b-2d139eba42b5) |

---

## 📊 Dashboard

| Light Mode | Dark Mode |
|------------|-----------|
| ![Dashboard Light](https://github.com/user-attachments/assets/237be095-11de-496b-b3f2-ef4deafb59d6) | ![Dashboard Dark](https://github.com/user-attachments/assets/6ff8f364-d95d-4257-a671-42f5d230ca26) |

---

## ✍️ Enroll Fingerprint

| Light Mode | Dark Mode |
|------------|-----------|
| ![Enroll Light](https://github.com/user-attachments/assets/2b7f8d05-c80e-402f-b61c-059037993fec) | ![Enroll Dark](https://github.com/user-attachments/assets/307cb3ff-75a5-4096-9cef-ec5dfe879140) |

---

## ⚙️ Settings

| Light Mode | Dark Mode |
|------------|-----------|
| ![Settings Light](https://github.com/user-attachments/assets/71bf77d8-36a3-477c-b179-a0677cefb899) | ![Settings Dark](https://github.com/user-attachments/assets/4a07861e-5e08-4186-be25-15c2504e6059) |

---

## 📁 About the Project

This modern UI is intended for seamless integration with the original biometric system that synchronizes data with Google Sheets and SQL databases. It serves as a frontend SPA (Single Page Application) to manage and view biometric attendance records with ease.

Key Features:
- Mobile-friendly responsive design
- Theme toggling: Light/Dark
- Clean, minimalist layout with Tailwind CSS
- Modular and extensible architecture

---

## 📚 Original Project Reference

You can find the hardware setup, Arduino code, and integration steps on the original Circuit Digest post:

🔗 [Biometric Attendance System with Google Sheets](https://circuitdigest.com/microcontroller-projects/biometric-attendance-system-with-google-sheets)

---

## 📷 Hardware Demo Preview

![Hardware Setup](https://github.com/Circuit-Digest/Bio-Metric-Attendance-System-with-Google-Sheet-Sync-and-SQL-DataBase/blob/7940bc4c20d620820964599a899269f038739517/images/Biometric-Attendance-System-with-Google-Sheet.jpg)

---

## 🛠️ Tech Stack

- **Frontend**: Vanilla JS + Vite + Tailwind CSS
- **Theme Toggle**: Dark/Light mode
- **Backend Integration**: Placeholder for future API endpoints to interface with biometric device and database

---

## ⚙️ Setup & Development

The project is organized into multiple components, including the Admin Panel (frontend UI), Arduino-based biometric firmware, Google Apps Script for Sheets integration, and optional 3D-printable casing parts.

### 📁 Folder Structure Overview

```
├── 3D files/                  → 3D-printable faceplate and backplate for fingerprint sensor module
├── Admin Panel/              → Vanilla JS + Vite based frontend SPA
├── Biometric_Attendance_System/ → Arduino firmware & static HTML for ESP32
├── Google Script/            → Google Apps Script for syncing with Google Sheets
├── images/                   → Media assets used in the documentation and website
├── Schematics/              → Circuit diagram and electronics schematics
├── README.md                → Project documentation (you're reading this)
```

---

### 🖥️ 1. Admin Panel – Frontend UI

**Tech Stack**: Vite + Vanilla JS + Tailwind CSS
**Path**: `Admin Panel/`

#### 📦 Dependencies

Make sure you have **Node.js ≥ 16** and **npm** installed.

```bash
# Go to the Admin Panel folder
cd "Admin Panel"

# Install dependencies
npm install
```

#### ▶️ Development Server

To start the frontend locally:

```bash
npm run dev
```

This will launch the app at `http://localhost:5173`.

#### ⚙️ Production Build

To build the project and generate compressed files (including Gzip for ESP32 deployment):

```bash
npm run build
```

This will output static files in `Admin Panel/dist/`.

---

### 📟 2. Arduino Code – ESP32 + Biometric Integration

**Board**: ESP32
**Path**: `Biometric_Attendance_System/`

#### 🔧 Required Libraries

Install the following libraries in the Arduino IDE:

* Adafruit Fingerprint Sensor Library
* Adafruit SSD1306
* [ESP32 Arduino SQLite3 library](https://github.com/siara-cc/esp32_arduino_sqlite3_lib)

#### 📂 Key Files

* `Biometric_Attendance_System.ino`: Main firmware sketch
* `config/`: Configuration headers (secrets, fonts, icons)
* `data/`: Static HTML pages served from ESP32 (deprecated after SPA integration)
* `src/`: External libraries (you can also install via Library Manager)

To upload HTML/JS to ESP32 SPIFFS, use the Arduino ESP32 filesystem uploader.

---

### 📊 3. Google Sheets Sync

**Path**: `Google Script/Code.gs`
This script runs on Google Apps Script linked with your Google Sheet to automatically log attendance data pushed from ESP32.

To set up:

1. Create a new Google Apps Script project.
2. Paste the contents of `Code.gs`.
3. Deploy as a web app and allow permissions.
4. Link the URL in your firmware or webhook logic.

---

### 🖨️ 4. 3D Printable Casing

**Path**: `3D files/`
Includes `.stl` files for:

* `Fingerprint Faceplate v3.stl`
* `Fingerprint Backplate v1.stl`

These can be printed using standard FDM printers with PLA/ABS for mounting the fingerprint module cleanly on an enclosure.

---

### 🧠 Notes

* Ensure Wi-Fi credentials and Google Script endpoint are correctly placed in `secrets.h`.
* If using the new SPA (`Admin Panel/`), embed the compressed `index.html.gz` into ESP32's SPIFFS and configure it to serve at the root route.
