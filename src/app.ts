import { createServer } from "http";
import { envs } from "./config/envs";
import { AppRoutes } from "./presentation/routes";
import { Server } from "./presentation/server";
import { WssService } from "./presentation/services";
import chalk from "chalk";

(async () => {
  main();
})();

function main() {
  const server = new Server({
    port: envs.PORT,
    routes: AppRoutes.routes,
  });

  const httpServer = createServer(server.app);
  WssService.initWss({ server: httpServer });

  httpServer.listen(envs.PORT, () => {
    console.log(
      `${chalk.cyan("Server running on port:")} ${chalk.bgBlue(" " + envs.PORT + " ")}`,
    );
  });
}
