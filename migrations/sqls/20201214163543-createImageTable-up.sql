CREATE TABLE `Image` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `Name` varchar(80) NOT NULL,
  `Alt` varchar(20) NOT NULL,
  `Atelier` BOOL DEFAULT false,
  `Description` TEXT NOT NULL,
  `Device` varchar(80),
  `Book_id` INT,
  `News_id` INT,
  `Funding_id` INT,
   PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = latin1;