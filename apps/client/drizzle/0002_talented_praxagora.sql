CREATE TABLE `chat` (
	`id` varchar(36) NOT NULL,
	`userId` varchar(36) NOT NULL,
	`title` varchar(255) NOT NULL DEFAULT 'New Chat',
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`visibility` varchar(10) NOT NULL DEFAULT 'private',
	CONSTRAINT `chat_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `message` (
	`id` varchar(36) NOT NULL,
	`chat_id` varchar(36) NOT NULL,
	`role` varchar(50) NOT NULL,
	`parts` json NOT NULL,
	`attachments` json NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`model` varchar(100),
	`input_tokens` int,
	`output_tokens` int,
	`total_tokens` int,
	`completion_time` int,
	CONSTRAINT `message_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `event` (
	`id` varchar(36) NOT NULL,
	`userId` varchar(36) NOT NULL,
	`title` varchar(255) NOT NULL DEFAULT 'New Event',
	`description` text NOT NULL DEFAULT ('Event Description'),
	`start_time` timestamp NOT NULL,
	`end_time` timestamp NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`visibility` varchar(10) NOT NULL DEFAULT 'private',
	`location` varchar(255) NOT NULL DEFAULT '',
	`color` varchar(20) NOT NULL DEFAULT 'blue',
	CONSTRAINT `event_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `chat` ADD CONSTRAINT `chat_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `message` ADD CONSTRAINT `message_chat_id_chat_id_fk` FOREIGN KEY (`chat_id`) REFERENCES `chat`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `event` ADD CONSTRAINT `event_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;