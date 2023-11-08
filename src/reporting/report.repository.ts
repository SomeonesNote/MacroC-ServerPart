import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ReportDto } from './dto/reportDto';
import { Report } from './reporting.entity';

@Injectable()
export class ReportRepository extends Repository<Report> {
  constructor(dataSource: DataSource) {
    super(Report, dataSource.createEntityManager());
  }

  async createReport(reportDto: ReportDto): Promise<Report> {
    const { userId, artistId, reporting } = reportDto;

    const report = this.create({
      userId,
      artistId,
      reporting,
    });

    try {
      await this.save(report);
    } catch (error) {
      throw new InternalServerErrorException();
    }
    return report;
  }
}
