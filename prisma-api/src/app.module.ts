import { ConfigModule } from "@nestjs/config";
import { Module } from "@nestjs/common";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { PostsModule } from "./posts/posts.module";

@Module({
  imports: [ConfigModule.forRoot(), UsersModule, PostsModule],
  providers: [AppService],
})
export class AppModule {}
