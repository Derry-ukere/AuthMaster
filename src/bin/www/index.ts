/* istanbul ignore file */
import 'module-alias/register';
import dotenv from 'dotenv';
import errorHandler from 'errorhandler';
import { createConnection } from 'typeorm';
import dbConnection from '../../typeorm';
import { Logger } from '../../helpers/Logger';
import { autoCreateDb } from '../../mysql';
import { initCronJobs } from '../../jobs';
import app from '../../app';

dotenv.config();

app.use(errorHandler());

(async () => {
  await autoCreateDb();
  await createConnection(dbConnection)
    .then(() => {
      // Initialize server
      const port = process.env.PORT || (process.env.APP_PORT as any) || 8000;
      const server = app.listen(port, () => {
        initCronJobs();

        Logger.Info(`Service Started at http://localhost:${port}`);
        Logger.Info('Press CTRL+C to stop\n');
      });

      // Nodemon dev hack
      process.once('SIGUSR2', function() {
        server.close(function() {
          process.kill(process.pid, 'SIGUSR2');
        });
      });
    })
    .catch(error => {
      Logger.Error('(TypeORM) Database connection error: ', error);
    });
})();
