import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { OnboardingModule } from './onboarding/onboarding.module';
import { ProfilesModule } from './profiles/profiles.module';
import { PostsModule } from './posts/posts.module';
import { RepliesModule } from './replies/replies.module';
import { TouchesModule } from './touches/touches.module';
import { SavedPostsModule } from './saved-posts/saved-posts.module';
import { FollowsModule } from './follows/follows.module';
import { FeedModule } from './feed/feed.module';
import { NotificationsModule } from './notifications/notifications.module';
import { WellbeingModule } from './wellbeing/wellbeing.module';
import { StatsModule } from './stats/stats.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    OnboardingModule,
    ProfilesModule,
    PostsModule,
    RepliesModule,
    TouchesModule,
    SavedPostsModule,
    FollowsModule,
    FeedModule,
    NotificationsModule,
    WellbeingModule,
    StatsModule,
    MessagesModule,
  ],
})
export class AppModule {}
