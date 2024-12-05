import fastifyPlugin from 'fastify-plugin';
import mongoose from 'mongoose';

async function dbConnector(fastify: any) {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fastify');
    fastify.log.info('MongoDB connected');
  } catch (error) {
    fastify.log.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

export default fastifyPlugin(dbConnector);
