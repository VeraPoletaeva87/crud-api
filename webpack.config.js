const path = require('path');
// import { fileURLToPath } from 'url';
// import { dirname } from 'path'; 

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

module.exports = {
  entry: './src/server.ts',
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'), 
    filename: 'bundle.js' 
  },
  resolve: {
    extensions: ['.ts', '.js']
},
module: {
  rules: [
    {
      test: /\.ts$/,
      exclude: /node_modules/,
      use: 'ts-loader'
  }
]
},
mode: 'production'
};

