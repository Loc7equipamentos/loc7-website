CREATE TABLE `registrations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` enum('pessoa_fisica','pessoa_juridica') NOT NULL,
	`fullName` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`question` text,
	`cpf` varchar(14),
	`rg` varchar(20),
	`birthDate` varchar(10),
	`motherName` varchar(255),
	`cnpj` varchar(18),
	`companyName` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `registrations_id` PRIMARY KEY(`id`)
);
