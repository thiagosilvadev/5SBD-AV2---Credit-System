import "reflect-metadata"
import { AppModule } from "./core/app.module"
import { ApplicationFactory } from "./core/factories/application.factory"
import { SwaggerFactory } from "./core/factories/swagger.factory"
import { prisma } from "./core/infra/prisma"

async function bootstrap() {
  const application = ApplicationFactory.create(AppModule)
  const swagger = SwaggerFactory.create()
  application.instance.use(swagger.path, swagger.middleware, swagger.handler)
  application.instance.listen(3333, () => {
    console.log(`Server is running on 3333`)
  })
}

bootstrap()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
