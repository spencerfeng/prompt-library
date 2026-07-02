CREATE TABLE `internal_prompt_versions` (
	`id` text PRIMARY KEY,
	`internal_prompt_id` text NOT NULL,
	`version` integer NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`template` text NOT NULL,
	`tags` text NOT NULL,
	`published_at` integer NOT NULL,
	CONSTRAINT `fk_internal_prompt_versions_internal_prompt_id_internal_prompts_id_fk` FOREIGN KEY (`internal_prompt_id`) REFERENCES `internal_prompts`(`id`)
);
--> statement-breakpoint
CREATE TABLE `internal_prompts` (
	`id` text PRIMARY KEY,
	`current_version` integer DEFAULT 1 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `prompts` (
	`id` text PRIMARY KEY,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`template` text NOT NULL,
	`tags` text NOT NULL,
	`render_count` integer DEFAULT 0 NOT NULL,
	`last_used_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`source` text DEFAULT 'user' NOT NULL,
	`internal_prompt_id` text,
	`base_version` integer,
	CONSTRAINT `fk_prompts_internal_prompt_id_internal_prompts_id_fk` FOREIGN KEY (`internal_prompt_id`) REFERENCES `internal_prompts`(`id`)
);
