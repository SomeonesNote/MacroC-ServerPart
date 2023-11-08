import { Module } from '@nestjs/common';
import { ReportingService } from './reporting.service';
import { ReportingController } from './reporting.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './reporting.entity';
import { ReportRepository } from './report.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Report])],
  controllers: [ReportingController],
  providers: [ReportingService, ReportRepository],
})
export class ReportingModule {}
