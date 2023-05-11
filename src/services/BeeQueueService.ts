import * as Queue from 'bee-queue';

class BeeQueueService {
  _queue: Queue;

  constructor(queueName: string) {
    this._queue = new Queue(queueName, {
      prefix: 'bq',
      stallInterval: 5000,
      nearTermWindow: 1200000,
      delayedDebounce: 1000,
      redis: {
        host: '13.229.201.66',
        port: 6379,
        db: 0,
        options: {},
      },
      isWorker: true,
      getEvents: true,
      sendEvents: true,
      storeJobs: true,
      ensureScripts: true,
      activateDelayedJobs: false,
      removeOnSuccess: false,
      removeOnFailure: false,
      redisScanCount: 100,
    });
  }

}
