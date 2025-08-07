# Twitch Top Games Dashboard

A modern, real-time dashboard for visualizing the most popular games on Twitch with live viewer counts and professional D3.js charts.

![Twitch Dashboard](https://img.shields.io/badge/Twitch-API-9146FF?style=for-the-badge&logo=twitch)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)
![D3.js](https://img.shields.io/badge/D3.js-7.8-orange?style=for-the-badge&logo=d3.js)

## ✨ Features

- **Real-time Data**: Fetches live Twitch viewer counts every 10 minutes
- **Interactive Charts**: Professional D3.js bar charts with animations
- **Game Details**: Beautiful cards showing game artwork and viewer statistics
- **Responsive Design**: Bootstrap 5 with mobile-first approach
- **Error Handling**: Robust loading states and error messages
- **Modern UI**: Twitch-inspired gradient design with glassmorphism

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- NPM 9+
- Twitch API credentials ([Get them here](https://dev.twitch.tv/console/apps))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/costasford/top_viewer_games.git
   cd top_viewer_games
   ```

2. **Install dependencies**
   ```bash
   # Backend
   npm install
   
   # Frontend
   cd frontend && npm install && cd ..
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file in project root
   CLIENT_ID=your_twitch_client_id
   SECRET=your_twitch_client_secret
   ```

4. **Build the frontend**
   ```bash
   npm run build
   ```

5. **Start the server**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🛠️ Development

### Backend Development
```bash
npm run dev  # Starts nodemon for auto-restart
```

### Frontend Development
```bash
npm run frontend:dev  # Watches for changes and rebuilds
```

### Project Structure
```
top_viewer_games/
├── app.js              # Express server & Twitch API integration
├── frontend/           # Frontend application
│   ├── src/
│   │   ├── index.js   # Main JavaScript with D3.js charts
│   │   └── style.css  # Modern CSS styling
│   ├── index.html     # HTML with Bootstrap 5
│   └── dist/          # Built bundle
├── package.json       # Backend dependencies
└── README.md
```

## 🔧 API Endpoints

- `GET /games` - Returns top 10 games with viewer counts
- `GET /setCache` - Manually refresh the cache

## 🎨 Design Features

- **Twitch Brand Colors**: Purple gradient hero section
- **Bootstrap 5**: Modern component library
- **Font Awesome Icons**: Professional iconography
- **D3.js Visualizations**: Interactive bar charts
- **Responsive Cards**: Game details with artwork
- **Loading States**: Spinners and skeleton screens

## 🔄 Data Flow

1. **Server**: Fetches Twitch OAuth token every 90 minutes
2. **Cache**: Updates game data every 10 minutes automatically
3. **API**: Serves cached data to frontend for fast responses
4. **Frontend**: Renders charts and updates UI dynamically

## 🚫 Important Notes

**This is NOT a static GitHub Pages site** - it requires:
- Node.js server for Twitch API calls
- Environment variables for API credentials
- Backend caching system for rate limiting

To deploy, use platforms like:
- Heroku
- Vercel
- Railway
- DigitalOcean App Platform

## 📊 What's New (v2.0)

✅ **Fixed Issues**:
- Broken D3.js xScale definition
- Outdated dependencies causing Node.js errors
- Basic placeholder UI

✅ **New Features**:
- Professional Twitch-inspired design
- Error handling and loading states
- Game artwork and detailed cards
- Responsive mobile layout
- Real-time total viewer counter
- Manual refresh button

## 🤝 Contributing

Feel free to open issues and submit pull requests!

## 📄 License

ISC License - see package.json

---

**Made with ❤️ by Nate Gallagher & Costa Ford**