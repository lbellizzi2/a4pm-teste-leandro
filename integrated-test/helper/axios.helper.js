const axios = require('axios');

const apiClient = axios.create({
  baseURL: 'http://localhost:3016/api',
  timeout: 5000,
});

module.exports = apiClient;