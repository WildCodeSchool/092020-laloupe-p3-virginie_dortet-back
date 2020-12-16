CREATE TABLE `Book` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `Title` varchar(80) NOT NULL,
  `Description` TEXT NOT NULL,
  `Price` INT NOT NULL,
  `Publication` date,
  `Funding_id` INT,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = latin1;


