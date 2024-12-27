import { sendEmail } from './handlers';
import { redisClient } from '@/common/config';
import { EmailJobData } from '@/common/interfaces';
import { logger } from '@/common/utils';
import { Job, Queue, QueueEvents, Worker, WorkerOptions } from 'bullmq';

export const startEmailQueue = async () => {
	const emailQueue = new Queue<EmailJobData>('emailQueue', {
		connection: redisClient,
		defaultJobOptions: {
			attempts: 3,
			backoff: {
				type: 'exponential',
				delay: 1000,
			},
		},
	});

	// Function to add emails to queue
	const addEmailToQueue = async (opts: EmailJobData) => {
		const { type, data } = opts;
		try {
			await emailQueue.add(type, opts, {
				...(data.priority !== 'high' && { priority: 2 }),
			});
		} catch (error) {
			console.error('Error enqueueing email job:', error);
			logger.error('Error enqueueing email job:', error);
			throw error;
		}
	};

	// define worker options
	interface EmailWorkerOptions extends WorkerOptions {}

	const workerOptions: EmailWorkerOptions = {
		connection: redisClient,
		limiter: { max: 1, duration: 1000 }, // Process 1 email every second
		lockDuration: 5000, // 5 seconds to process the job before it can be picked up by another worker
		removeOnComplete: {
			age: 3600, // Keep jobs for 1 hour
			count: 1000, // keep up to 1000 jobs
		},
		removeOnFail: {
			age: 24 * 3600, // Keep failed jobs for 24 hours
		},
		concurrency: 5,
		stalledInterval: 10000,
	};

	// Create a worker to process jobs from the email queue
	const emailWorker = new Worker<EmailJobData>(
		'emailQueue',
		async (job: Job) => await sendEmail(job.data),
		workerOptions
	);

	// Create event listeners for the queue
	const emailQueueEvent = new QueueEvents('emailQueue', { connection: redisClient });

	emailQueueEvent.on('failed', ({ jobId, failedReason }) => {
		console.log(`Job ${jobId} failed with error: ${failedReason}`);
		logger.error(`Job ${jobId} failed with error: ${failedReason}`);
	});

	emailQueueEvent.on('completed', ({ jobId, returnvalue }) => {
		console.log(`Job ${jobId} completed with return value: ${returnvalue}`);
		logger.info(`Job ${jobId} completed with return value: ${returnvalue}`);
	});

	// Close the queue and worker when needed
	const stopQueue = async () => {
		await emailWorker.close();
		await emailQueue.close();
		console.info('Email queue closed!');
	};

	// Export the queue, worker, and add function
	return {
		addEmailToQueue,
		emailQueue,
		emailWorker,
		emailQueueEvent,
		stopQueue,
	};
};
