import { ExpressApplication } from "../application"
import { IApplication } from "../interfaces/application.interface"

export class ApplicationFactory {
  static create(module: new () => any): IApplication<any, any> {
    const applicationModule = new module()
    const application = new ExpressApplication(applicationModule)
    return application
  }
}
