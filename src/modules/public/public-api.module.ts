import { Module } from '@nestjs/common';
import { ProjectApiKeyModule } from '@src/modules/projectApiKeys/projectApiKeys.module';
import { ChannelModule } from '@src/modules/channel/channel.module';
import { ChannelPerformanceModule } from '@src/modules/channelPerformance/channelPerformance.module';
import { ChannelSourceModule } from '@src/modules/channelSource/channelSource.module';
import { StrategyModule } from '@src/modules/strategy/strategy.module';
import { ReportModule } from '@src/modules/report/report.module';
import { PublicChannelController } from './controllers/public-channel.controller';
import { PublicMetricsChannelController } from './controllers/public-metrics-channel.controller';
import { PublicUfChannelsController } from './controllers/public-uf-channels.controller';
import { PublicChannelPerformanceController } from './controllers/public-channel-performance.controller';
import { PublicChannelPerformancePropertyController } from './controllers/public-channel-performance-property.controller';
import { PublicChannelSourceController } from './controllers/public-channel-source.controller';
import { PublicStrategyController } from './controllers/public-strategy.controller';
import { PublicReportController } from './controllers/public-report.controller';
import { PublicProjectController } from './controllers/public-project.controller';

@Module({
  imports: [
    ProjectApiKeyModule,
    ChannelModule,
    ChannelPerformanceModule,
    ChannelSourceModule,
    StrategyModule,
    ReportModule,
  ],
  controllers: [
    PublicChannelController,
    PublicMetricsChannelController,
    PublicUfChannelsController,
    PublicChannelPerformanceController,
    PublicChannelPerformancePropertyController,
    PublicChannelSourceController,
    PublicStrategyController,
    PublicReportController,
    PublicProjectController,
  ],
})
export class PublicApiModule {}
