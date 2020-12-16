CREATE TABLE `Funding` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `Name` varchar(80) NOT NULL,
  `Description` TEXT(300) NOT NULL,
  `Link` varchar(255),
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = latin1;