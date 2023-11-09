import {
  Body,
  Controller,
  Post,
  // UseGuards
} from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
import { ReportingService } from './reporting.service';
import { ReportDto } from './dto/reportDto';
import { Report } from './reporting.entity';

@Controller('reporting')
// @UseGuards(AuthGuard())
export class ReportingController {
  constructor(private reportingService: ReportingService) {}

  @Post('send')
  createReport(@Body() reportDto: ReportDto): Promise<Report> {
    return this.reportingService.createReport(reportDto);
  }
}
