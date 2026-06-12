 
# <div align="center">🧙 The Grand Sorting Hat

<div align="center">

![Magic](https://img.shields.io/badge/Magic-Sorting%20Hat-orange)
![Three.js](https://img.shields.io/badge/Three.js-3D-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow)
![License](https://img.shields.io/badge/License-MIT-green)

**Discover your true magical destiny**

</div>

## 📖 About The Project

The Grand Sorting Hat is an interactive personality quiz that determines your complete wizarding profile. Answer 20 carefully crafted questions and discover:

- 🦁 Your **Hogwarts House** (Gryffindor, Hufflepuff, Ravenclaw, or Slytherin)
- 🏛️ Your **Ilvermorny House** (Thunderbird, Wampus, Horned Serpent, or Pukwudgie)
- 🪄 Your **Custom Wand** (wood type, core, and length)
- 🦌 Your **Patronus** spirit animal

The experience features a beautifully designed magical interface with 3D animations, particle effects, and shareable results.


## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎭 15 Personality Questions | Psychologically weighted questions for accurate sorting |
| 🎨 3D Animated Hat | Rotating 3D Sorting Hat built with Three.js |
| 🎉 House-Colored Confetti | Celebration burst in your house colors |
| ✨ Floating Particles | Magical particle background animation |
| 📸 Save Results | Download your sorting ceremony as a PNG image |
| 💾 Local Storage | Past results saved automatically |
| 📱 Responsive Design | Works perfectly on mobile and desktop |
| 🏆 House Percentages | See your percentage breakdown across all houses |


## 🎮 How It Works

**Step 1: Take the Quiz** - Answer 15 questions about your personality and preferences.

**Step 2: Scoring Algorithm** - Each answer adds points to different houses.

**Step 3: Calculate Results** - Your primary and secondary houses are determined.

**Step 4: Generate Details** - Wand and Patronus are matched to your dominant house.

**Step 5: Save & Share** - Download your results as an image.


## 🛠️ Built With

| Technology | Purpose |
|------------|---------|
| HTML5 | Structure and layout |
| CSS3 | Styling, animations, and responsive design |
| JavaScript (ES6) | Game logic and interactivity |
| Three.js | 3D rotating Sorting Hat graphics |
| GSAP | Smooth cinematic animations |
| Canvas API | Particle effects and confetti bursts |
| Local Storage | Saving past results and history |


## 🚀 Getting Started

### Prerequisites

- Any modern web browser (Chrome, Firefox, Safari, Edge)
- Local server (optional - can run directly by double-clicking index.html)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/krithika-va/sorting-hat.git
cd sorting-hat
```

**2. Open the project**

```bash
# Option 1: Open index.html directly in your browser
open index.html

# Option 2: Run a local server (recommended)
python -m http.server 5500
# Then visit http://localhost:5500
```

**3. Start the ceremony**

- Click "Begin the Ceremony"
- Answer all 20 questions honestly
- Click "Reveal My Destiny" on the final question
- Save or share your results


## 📁 Project Structure

```
sorting-hat/
│
├── index.html          # Main HTML file with structure
├── style.css           # Styling, animations, and responsive design
├── script.js           # Game logic and Three.js implementation
└── README.md           # Project documentation
```

## 🎯 Scoring Algorithm

The sorting algorithm uses a weighted point system across 8 categories.

### Hogwarts Houses

| House | Traits |
|-------|--------|
| 🦁 Gryffindor | Courage, Bravery, Chivalry, Daring |
| 🦡 Hufflepuff | Loyalty, Patience, Hard Work, Fairness |
| 🦅 Ravenclaw | Wisdom, Creativity, Intelligence, Wit |
| 🐍 Slytherin | Ambition, Cunning, Determination, Resourcefulness |

### Ilvermorny Houses

| House | Traits |
|-------|--------|
| ⚡ Thunderbird | Adventure, Change, Journey, Transformation |
| 🐆 Wampus | Strength, Strategy, Physical Prowess |
| 🐍 Horned Serpent | Intellect, Wisdom, Hidden Knowledge |
| 🫀 Pukwudgie | Compassion, Care, Healing, Nurturing |

Each answer contributes points to both Hogwarts and Ilvermorny houses simultaneously, creating a unique magical profile that combines both American and British wizarding traditions.


## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<div align="center">

*"The Sorting Hat takes your choice into account... but it also sees what lies within."*

</div>
```

---

This is a **complete, properly formatted README** that you can copy and paste directly into your GitHub repository. Just replace `YOUR_USERNAME` and `your.email@example.com` with your actual information! 🧙✨
