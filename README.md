# ISL-Project

### Indian Sign Language Translation Platform

**Developed by:** Mr. Nobody

---

# 📌 Project Overview

The **ISL Translation Platform** is a web-based system that converts **English text into Indian Sign Language (ISL)** using a **3D animated avatar**.

This platform helps improve communication between **hearing/speaking individuals and deaf or mute people** by visually translating text into sign language gestures.

---

# 📸 Project Screenshots

## Main Interface

![Main Interface](images/interface.png)

## 3D Avatar Animation

![Avatar Animation](images/animation.png)

## Bone Control Editor

![Bone Editor](images/bone-editor.png)

---

# 🎯 Objectives

* Convert **English text into Indian Sign Language**
* Provide **real-time sign language animation**
* Help communication for **deaf and speech-impaired users**
* Create an **interactive 3D learning tool**

---

# ⚙️ Technologies Used

### Frontend

* HTML
* CSS
* JavaScript
* Three.js

### Backend

* Python
* Flask

### NLP Processing

* NLTK

### 3D Animation

* FBX Model
* Mixamo Rig
* Bone-based Animation System

---

# 🧠 System Workflow

1. User enters text.
2. Text is sent to **Flask backend**.
3. NLP converts the sentence into **ISL format**.
4. Words are returned to the frontend.
5. The **3D avatar performs gestures**.

---

# 📂 Project Structure

```
ISL-Project
│
├── app.py
├── utils
│   └── isl_processor.py
│
├── static
│   ├── css
│   │   └── style.css
│   ├── js
│   │   └── index.js
│   ├── models
│   │   └── character.fbx
│   ├── images
│   └── isl_data.json
│
├── templates
│   └── index.html
│
└── README.md
```

---

# 🚀 Features

* Text → ISL translation
* 3D animated avatar
* Real-time gesture animation
* Gesture editor
* Bone transform controls
* Pose export to JSON
* Live mirroring of gestures
* Camera & pose reset

---

# 💡 Future Improvements

* Speech to Sign Language
* AI-based gesture generation
* Mobile support
* Larger ISL vocabulary
* Real-time video translation

---

# 🎓 Academic Purpose

This project is developed as a **Final Year Project (FYP)** focusing on:

* Natural Language Processing
* Accessibility Technology
* 3D Animation Systems
* Human Computer Interaction

---

# 👨‍💻 Author

**Mr. Nobody**

GitHub
https://github.com/MGiftsonRaj40
