import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReportRepository } from './report.repository';
import { ReportDto } from './dto/reportDto';
import { Report } from './reporting.entity';

@Injectable()
export class ReportingService {
  constructor(
    @InjectRepository(ReportRepository)
    private reportRepository: ReportRepository,
  ) {}

  async createReport(reportDto: ReportDto): Promise<Report> {
    const report = await this.reportRepository.createReport(reportDto);
    return report;
  }
}
