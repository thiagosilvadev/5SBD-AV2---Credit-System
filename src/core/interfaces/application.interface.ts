export type ApplicationRouter = {
  method: string
  path: string
  handler: string | symbol
}
export interface IApplication<TApplication, TRouter> {
  routes: ApplicationRouter[]
  instance: TApplication

  /**
   * Starts the application.
   *
   * @param {number|string} port
   * @param {string} [hostname]
   * @param {Function} [callback] Optional callback
   * @returns {Promise} A Promise that, when resolved, is a reference to the underlying HttpServer.
   */
  listen(port: number | string, callback?: () => void): Promise<any>
  listen(
    port: number | string,
    hostname: string,
    callback?: () => void,
  ): Promise<any>
}
