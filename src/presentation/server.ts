import express, { Router } from "express";
import path from "path";
import { color } from "./console/colors";

interface Options {
  port: number;
  public_path?: string;
}

export class Server {
  public readonly app = express();
  private serverListener?: any;
  private readonly port: number;
  private readonly publicPath: string;

  constructor(options: Options) {
    const { port, public_path = "public" } = options;
    this.port = port;
    this.publicPath = public_path;
    this.configure();
  }

  private configure() {
    //* Middlewares
    this.app.use(express.json()); // raw
    this.app.use(express.urlencoded({ extended: true })); // x-www-form-urlencoded

    //* Public Folder
    this.app.use(express.static(this.publicPath));

    //* Routes
    // this.app.use(this.routes);

    // //* SPA /^\/(?!api).*/  <== Únicamente si no empieza con la palabra api
    // working: express v4
    // this.app.get('*', (req, res) => {
    //   const indexPath = path.join( __dirname + `../../../${ this.publicPath }/index.html` );
    //   res.sendFile(indexPath);
    // });

    // SPA fallback with midleware, working v5
    this.app.use((req, res, next) => {
      if (!req.path.startsWith("/api")) {
        const indexPath = path.join(
          __dirname,
          `../../${this.publicPath}/index.html`,
        );
        return res.sendFile(indexPath);
      }
      next();
    });
  }

  public setRoutes(router: Router) {
    this.app.use(router);
  }

  async start() {
    this.serverListener = this.app.listen(this.port, () => {
      console.log(
        `${color.cyan("Server running on port:")} ${color.bgBlue(" " + this.port + " ")}`,
      );
    });
  }

  public close() {
    this.serverListener?.close();
  }
}
