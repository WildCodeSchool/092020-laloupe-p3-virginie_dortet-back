CREATE TABLE `Book` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Title` varchar(80) NOT NULL,
  `Description` TEXT NOT NULL,
  `Price` INT NOT NULL,
  `Publication` date,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = latin1;


