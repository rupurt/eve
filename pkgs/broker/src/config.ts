import convict from 'convict';

convict.addFormat(require('convict-format-with-validator').ipaddress);

const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    // default: 'development',
    default: process.env.NODE_ENV || 'development',
    env: 'NODE_ENV',
  },
  ip: {
    doc: 'The IP address to bind.',
    format: 'ipaddress',
    default: '127.0.0.1',
    env: 'IP_ADDRESS',
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 8080,
    env: 'PORT',
    arg: 'port',
  },
  db: {
    host: {
      doc: 'Database host name/IP',
      format: '*',
      default: 'server1.dev.test',
    },
    name: {
      doc: 'Database name',
      format: String,
      default: 'users',
    },
  },
  admins: {
    doc: 'Users with write access, or null to grant full access without login.',
    format: Array,
    nullable: true,
    default: null,
  },
});

// // Load environment dependent configuration
// const env = config.get('env');
// config.loadFile('./config/' + env + '.json');

config.validate({ allowed: 'strict' });

export default config;
