import { createServer } from "http";
import { envs } from "./config/envs";
import { AppRoutes } from "./presentation/routes";
import { Server } from "./presentation/server";
import { WssService } from "./presentation/services";
import { color } from "./presentation/console/colors";

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
      `${color.cyan("Server running on port:")} ${color.bgBlue(" " + envs.PORT + " ")}`,
    );
  });
}
