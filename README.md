# Top Viewer Games - Twitch Data Visualization

A real-time visualization of the top 10 games by viewership on Twitch.tv, built with Node.js, Express, and D3.js.

## Features

- **Real-time Twitch Data**: Fetches live data from Twitch API
- **Interactive Visualization**: Beautiful D3.js horizontal bar chart
- **Smart Caching**: Automatic data updates every 10 minutes
- **Modern UI/UX**: Responsive design with loading states and error handling
- **Sorting Options**: Sort games by viewers, name (A-Z), or name (Z-A)
- **Error Handling**: Graceful error handling with retry functionality
- **Live Updates**: Real-time viewer count aggregation
- **Mobile Responsive**: Works great on all devices

## Prerequisites

- Node.js (v16.19.0 or higher)
- npm (v8.11.0 or higher)
- Twitch Developer Account

## Quick Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd top_viewer_games
   ```

2. **Run the setup script**
   ```bash
   npm run setup
   ```

3. **Get Twitch API Credentials**
   - Go to [Twitch Developer Console](https://dev.twitch.tv/console)
   - Create a new application
   - Note your Client ID and Client Secret

4. **Configure Environment Variables**
   Edit the `.env` file and add your Twitch credentials:
   ```
   CLIENT_ID=your_twitch_client_id_here
   SECRET=your_twitch_client_secret_here
   PORT=3000
   ```

5. **Install dependencies and build**
   ```bash
   npm run install:all
   npm run build
   ```

6. **Start the server**
   ```bash
   npm start
   # or for development with auto-restart:
   npm run dev
   ```

7. **Open your browser**
   Navigate to `http://localhost:3000`

## Manual Setup

If you prefer to set up manually:

1. **Install dependencies**
   ```bash
   npm run install:all
   ```

2. **Create environment file**
   ```bash
   cp env.example .env
   ```

3. **Build frontend**
   ```bash
   npm run build
   ```

4. **Start server**
   ```bash
   npm start
   ```

## Project Structure

```
top_viewer_games/
├── app.js              # Express server with Twitch API integration
├── frontend/
│   ├── src/
│   │   ├── index.js    # D3.js visualization logic
│   │   └── style.css   # Styling
│   ├── index.html      # Main HTML file
│   └── webpack.config.js
├── package.json
└── README.md
```

## API Endpoints

- `GET /games` - Returns cached game data with viewer counts
- `GET /setCache` - Manually trigger cache refresh

## Technologies Used

- **Backend**: Node.js, Express, Axios
- **Frontend**: Vanilla JavaScript, D3.js
- **Build Tool**: Webpack
- **API**: Twitch Helix API

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC License 