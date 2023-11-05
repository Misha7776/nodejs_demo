// custom middleware
const whitelist = [
  'https://www.google.com.ua',
  'https://127.0.0.1:5500',
  'http://localhost:3500'
]

const corsOptions = { 
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      const message = `${origin} is not allowed by CORS`;
      const logName = 'reqLog.log';
      logEvents(message, logName);
      callback(new Error(message));
    }
  },
  optionsSuccessStatus: 200
}

module.exports = corsOptions;