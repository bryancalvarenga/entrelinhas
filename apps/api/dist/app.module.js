"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const database_module_1 = require("./database/database.module");
const auth_module_1 = require("./auth/auth.module");
const onboarding_module_1 = require("./onboarding/onboarding.module");
const profiles_module_1 = require("./profiles/profiles.module");
const posts_module_1 = require("./posts/posts.module");
const replies_module_1 = require("./replies/replies.module");
const touches_module_1 = require("./touches/touches.module");
const saved_posts_module_1 = require("./saved-posts/saved-posts.module");
const follows_module_1 = require("./follows/follows.module");
const feed_module_1 = require("./feed/feed.module");
const notifications_module_1 = require("./notifications/notifications.module");
const wellbeing_module_1 = require("./wellbeing/wellbeing.module");
const stats_module_1 = require("./stats/stats.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_module_1.DatabaseModule,
            auth_module_1.AuthModule,
            onboarding_module_1.OnboardingModule,
            profiles_module_1.ProfilesModule,
            posts_module_1.PostsModule,
            replies_module_1.RepliesModule,
            touches_module_1.TouchesModule,
            saved_posts_module_1.SavedPostsModule,
            follows_module_1.FollowsModule,
            feed_module_1.FeedModule,
            notifications_module_1.NotificationsModule,
            wellbeing_module_1.WellbeingModule,
            stats_module_1.StatsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map