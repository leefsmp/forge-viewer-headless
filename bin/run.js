require('babel-core/register')({
  plugins: ['transform-decorators-legacy'],
  presets: ['env', 'stage-0']
})

require('../index')