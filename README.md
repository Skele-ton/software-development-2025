# Human Benchmark Clone (Reaction Time Test)

A mini web app built with React and Node.js simulating the reaction time test from HumanBenchmark.com.

## Tech Stack

- React (Vite)
- Node.js + Express
- MongoDB
- Axios + CORS
- Tailwind CSS

## Setup Instructions

1. Clone the repo
2. Run MongoDB
3. In `server/`:
   - Add your Mongo URI to `.env`
   - Run `node server.js`
4. In `client/`:
   - Run `npm install`
   - Run `npm run dev`

## Features

- Click-based reaction test
- High score saved in `localStorage`
- Scores saved in MongoDB
- Compares your latest & best scores to database average
