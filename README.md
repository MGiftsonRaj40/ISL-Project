# ISL-Project

### Indian Sign Language Translation Platform

**Developed by:** Mr. Nobody

---

## 📌 Project Overview

The **ISL Translation Platform** is a web-based system that converts **English text into Indian Sign Language (ISL)** using a **3D animated avatar**.
The platform helps improve communication between **hearing/speaking individuals and deaf or mute people** by visually translating text into sign language gestures.

The system processes the input sentence, converts it into ISL grammar format, and animates the corresponding **3D character gestures** in real time.

---

## 🎯 Objectives

* Convert **English text into Indian Sign Language**
* Provide **real-time sign language animation**
* Enable communication for **deaf and speech-impaired users**
* Create an **interactive 3D learning and translation tool**

---

## ⚙️ Technologies Used

### Frontend

* HTML5
* CSS3
* JavaScript (ES6)
* Three.js (3D rendering engine)

### Backend

* Python
* Flask (Web framework)

### NLP Processing

* NLTK (Natural Language Toolkit)

### 3D & Animation

* FBX 3D Character Model
* Mixamo Rigging
* Bone-based animation system

---

## 🧠 System Workflow

1. User enters a sentence in the text box.
2. The sentence is sent to the **Flask backend**.
3. NLP processing converts the sentence into **ISL grammar format**.
4. The processed words are returned to the frontend.
5. The **Three.js avatar animates gestures** using predefined JSON pose data.

---

## 📂 Project Structure

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

## 🚀 Features

* Convert **text to Indian Sign Language**
* **3D animated avatar**
* **Real-time gesture animation**
* **Bone control editor for gesture creation**
* **Gesture mirroring system**
* **Live animation sequence playback**
* **Camera and pose reset controls**
* **Custom JSON gesture export**

---

## 🎮 Controls

### Gesture Buttons

* ME
* GO
* SCHOOL
* HELLO
* SIGN
* LANGUAGE
* YES
* NO

### Editor Tools

* Bone rotation sliders
* Transform controls
* Mirror right hand to left hand
* Copy gesture pose JSON
* Reset pose
* Reset camera

---

## 📸 Demo Interface

Main components:

* Text input panel
* 3D avatar viewer
* Gesture control panel
* Bone editor panel

---

## 💡 Future Improvements

* Full **Indian Sign Language dictionary**
* **Speech-to-sign translation**
* **Mobile responsive interface**
* **Machine learning gesture generation**
* **Real-time speech recognition**
* Support for **regional sign language variations**

---

## 🎓 Academic Purpose

This project is developed as a **Final Year Project (FYP)** to explore the integration of:

* Natural Language Processing
* 3D Animation
* Human-Computer Interaction
* Accessibility Technology

---

## 🤝 Contribution

Contributions, suggestions, and improvements are welcome.

You can fork the repository and submit pull requests.

---

## 📜 License

This project is created for **educational and research purposes**.

---

## 👨‍💻 Author

**Mr. Nobody**
Final Year Student

GitHub:
https://github.com/MGiftsonRaj40
