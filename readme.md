# Snake & Ladder Jungle

A jungle-themed Snake & Ladder game with an AI opponent.

## Features

- 10x10 board with snakes and ladders
- Jungle theme with vines and wooden tiles
- White stone for player, black stone for AI
- Dice roll animation
- Smooth move animations for tokens
- Snakes pull down, ladders take up
- AI opponent with strategic behavior and witty messages
- Chat bubble above AI token

## Setup

### Frontend

The frontend is static HTML/CSS/JS and can be hosted on GitHub Pages.

1. Upload the files to a GitHub repository.
2. Enable GitHub Pages in the repository settings.

### Backend

The backend is a Python Flask API.

1. Install dependencies:
   ```
   pip install flask flask-cors
   ```

2. Run the backend:
   ```
   python backend/app.py
   ```

3. For deployment on Replit/Render/Railway:
   - Upload the backend folder.
   - Set the start command to `python app.py`.
   - Note the API URL (e.g., https://your-app.replit.dev).

### Connecting Frontend to Backend

In `script.js`, change the fetch URL from `http://localhost:5000` to your deployed API URL.

For local development, keep it as is.

## Files

- `index.html`: Main HTML file
- `style.css`: Stylesheet
- `script.js`: Game logic
- `assets/`: SVG assets for snakes, ladders, background
- `backend/app.py`: Flask API for AI
- `readme.md`: This file

## Game Rules

- Players take turns rolling a dice and moving.
- Landing on a ladder takes you up.
- Landing on a snake takes you down.
- First to reach 100 wins.

## AI Behavior

The AI chooses the best roll to maximize position, with bonuses for ladders and penalties for snakes, plus some randomness. It generates cocky messages.
