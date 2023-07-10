import { IApplication } from "../interfaces/application.interface";
import swaggerUi from "swagger-ui-express";

export class SwaggerFactory {
  static create() {
    return {
      path: "/docs",
      middleware: swaggerUi.serve,
      handler: async (_req: Request, res: Response) => {
        // @ts-ignore
        return res.send(
          swaggerUi.generateHTML(await import("../../../build/swagger.json"))
        );
      },
    };
  }
}
