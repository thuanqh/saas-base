import {ApiLoopbackApplication} from './application';
import {ApplicationConfig} from '@loopback/core';

export {ApiLoopbackApplication};

export async function main(options: ApplicationConfig = {}) {
  const app = new ApiLoopbackApplication(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return app;
}
