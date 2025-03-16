module.exports = {
    apps: [
      {
        name: 'SnapBoost',
        script: 'bot.js',
        watch: true,  // Si tu veux que PM2 redémarre quand un fichier change
        instances: 1,  // Utilise tous les cœurs de CPU disponibles
        autorestart: true,
        env: {
          NODE_ENV: 'production'
        },
        env_development: {
          NODE_ENV: 'development'
        }
      }
    ]
  };
  