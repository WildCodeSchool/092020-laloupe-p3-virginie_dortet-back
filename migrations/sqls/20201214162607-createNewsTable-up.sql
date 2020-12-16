CREATE TABLE `News` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Title` varchar(80) NOT NULL,
  `Date` Date NOT NULL,
  `Description` TEXT(300),
  `Address` varchar(255),
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = latin1;