import { BusinessModule } from "@/modules/business/business.module";
import { Module } from "./decorators/module.decorator";

@Module({
  imports: [BusinessModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
