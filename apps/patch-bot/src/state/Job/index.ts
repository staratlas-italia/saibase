import { CronJob } from 'cron';
import { logger } from '../../logger';

export class Job {
  private action: (_: string) => unknown;
  private name: string;
  private _isRunning = false;
  private worker: CronJob;

  get isRunning() {
    return this._isRunning;
  }

  constructor(
    name: string,
    duration: string,
    action: (_: string) => Promise<unknown>
  ) {
    this.name = name;
    this.action = action;
    this.worker = new CronJob(
      duration,
      this.onJobStart.bind(this),
      this.onJobComplete.bind(this),
      false,
      'Europe/Rome'
    );
  }

  private async onJobStart() {
    if (this._isRunning) {
      logger.info(`[${this.name}] - skipping`);
      return;
    }

    this._isRunning = true;

    logger.info(`[${this.name}] - running`);

    await this.action(this.name);

    logger.info(`[${this.name}] finishing`);
    this._isRunning = false;
  }

  private onJobComplete() {
    logger.info(`[${this.name}] completed`);
    this._isRunning = false;
  }

  start() {
    if (this._isRunning) {
      return false;
    }

    this.worker.start();

    return true;
  }

  stop() {
    if (!this._isRunning) {
      return false;
    }

    this._isRunning = false;

    this.worker.stop();

    return true;
  }
}
