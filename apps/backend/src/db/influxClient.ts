import { InfluxDB, Point } from '@influxdata/influxdb-client';
import { config } from '../config/env.js';

class InfluxClient {
  private client: InfluxDB;
  public writeApi: any;
  public queryApi: any;

  constructor() {
    this.client = new InfluxDB({ url: config.INFLUXDB_URL, token: config.INFLUXDB_TOKEN });
    this.writeApi = this.client.getWriteApi(config.INFLUXDB_ORG, config.INFLUXDB_BUCKET, 'ns', {
      flushInterval: 5000,
      batchSize: 100
    });
    this.queryApi = this.client.getQueryApi(config.INFLUXDB_ORG);
  }

  public async flush() {
    await this.writeApi.flush();
  }
}

export const influxClient = new InfluxClient();
export { Point };
