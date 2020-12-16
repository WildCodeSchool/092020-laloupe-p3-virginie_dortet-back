CREATE TABLE `Image` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Name` varchar(80) NOT NULL,
  `Alt` varchar(20) NOT NULL,
  `Atelier` BOOL DEFAULT false,
  `Description` TEXT NOT NULL,
  `Device` varchar(80),
   PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = latin1;