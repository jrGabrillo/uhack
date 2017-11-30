-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Nov 30, 2017 at 10:43 PM
-- Server version: 5.7.19
-- PHP Version: 7.0.23

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_uhack`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbl_account`
--

DROP TABLE IF EXISTS `tbl_account`;
CREATE TABLE IF NOT EXISTS `tbl_account` (
  `id` varchar(60) NOT NULL,
  `email` varchar(300) NOT NULL,
  `password` varchar(70) NOT NULL,
  `account_id` varchar(60) NOT NULL,
  `category` varchar(1) NOT NULL COMMENT '1=head, 2=rd, 3=rm',
  `status` varchar(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_account`
--

INSERT INTO `tbl_account` (`id`, `email`, `password`, `account_id`, `category`, `status`) VALUES
('da4b9237bacccdf19c0760cab7aec4a8359010b0', 'rufo.gabrillo@rnrdigitalconsultancy.com', '$2y$11$CVN2EaZzSHnBbSfcYKsfDejhE64QqiiqRci5/4qUUX2Xz5jkBuXxm', '1', '1', '1'),
('356a192b7913b04c54574d18c28d46e6395428ab', 'rufo.gabrillo@gmail.com', '$2y$11$u7fkBJXtcAAbY1TcWnkYkOl4/IxO8iISYkpGLyj/5HRhMuyrylK5m', '356a192b7913b04c54574d18c28d46e6395428ab', '3', '1'),
('b6589fc6ab0dc82cf12099d1c2d40ab994e8410c', 'rufo.gabrillo@gmail.co', '$2y$11$qW7oUdwFMGkJvRCLKvegauJYq4o9hFpq64Qcq3jVodt2uPCUb4hRq', 'b6589fc6ab0dc82cf12099d1c2d40ab994e8410c', '3', '1'),
('77de68daecd823babbb58edb1c8e14d7106e83bb', 'rufo.gabrillo@gmail.col', '$2y$11$s1UDEEfxg3.Vo89qO/Huf.8lFNfnEqYyyvMBwgAB90KgYWlsAXUDe', '77de68daecd823babbb58edb1c8e14d7106e83bb', '2', '1');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_branch`
--

DROP TABLE IF EXISTS `tbl_branch`;
CREATE TABLE IF NOT EXISTS `tbl_branch` (
  `id` varchar(60) NOT NULL,
  `branch_name` varchar(300) NOT NULL,
  `branch_location` varchar(1000) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_branch`
--

INSERT INTO `tbl_branch` (`id`, `branch_name`, `branch_location`) VALUES
('b6589fc6ab0dc82cf12099d1c2d40ab994e8410c', 'Dagupan Branch', 'Dagupan Pangasinan');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_customer`
--

DROP TABLE IF EXISTS `tbl_customer`;
CREATE TABLE IF NOT EXISTS `tbl_customer` (
  `id` varchar(60) NOT NULL,
  `given_name` varchar(100) NOT NULL,
  `middle_name` varchar(100) NOT NULL,
  `family_name` varchar(100) NOT NULL,
  `date_of_birth` varchar(60) NOT NULL,
  `gender` varchar(20) NOT NULL,
  `address` varchar(1000) NOT NULL,
  `email` varchar(100) NOT NULL,
  `contact_number` varchar(20) NOT NULL,
  `occupation` varchar(300) NOT NULL,
  `picture` varchar(70) NOT NULL,
  `status` varchar(1) NOT NULL,
  `date_registered` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_customer`
--

INSERT INTO `tbl_customer` (`id`, `given_name`, `middle_name`, `family_name`, `date_of_birth`, `gender`, `address`, `email`, `contact_number`, `occupation`, `picture`, `status`, `date_registered`) VALUES
('b6589fc6ab0dc82cf12099d1c2d40ab994e8410c', 'Rufo', 'Narcisi', 'Gabrillo', '1993-01-26', 'Male', 'Calasiao', 'rufo.gabrillo@yahoo.com', '09484993958', 'Web developer', 'avatar.png', '1', '2017-11-30 17:12:17');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_handle`
--

DROP TABLE IF EXISTS `tbl_handle`;
CREATE TABLE IF NOT EXISTS `tbl_handle` (
  `id` varchar(60) NOT NULL,
  `handled_by` varchar(60) NOT NULL,
  `handle_account` varchar(60) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_plan`
--

DROP TABLE IF EXISTS `tbl_plan`;
CREATE TABLE IF NOT EXISTS `tbl_plan` (
  `id` varchar(60) NOT NULL,
  `title` varchar(300) NOT NULL,
  `description` varchar(1000) NOT NULL,
  `price` varchar(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_plan`
--

INSERT INTO `tbl_plan` (`id`, `title`, `description`, `price`) VALUES
('b6589fc6ab0dc82cf12099d1c2d40ab994e8410c', 'Simple plan', 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?', '1000');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_regionaldirector`
--

DROP TABLE IF EXISTS `tbl_regionaldirector`;
CREATE TABLE IF NOT EXISTS `tbl_regionaldirector` (
  `id` varchar(60) NOT NULL,
  `given_name` varchar(100) NOT NULL,
  `middle_name` varchar(100) NOT NULL,
  `family_name` varchar(100) NOT NULL,
  `date_of_birth` varchar(60) NOT NULL,
  `gender` varchar(20) NOT NULL,
  `address` varchar(1000) NOT NULL,
  `email` varchar(100) NOT NULL,
  `contact_number` varchar(20) NOT NULL,
  `branch_id` varchar(60) NOT NULL,
  `picture` varchar(70) NOT NULL,
  `status` varchar(1) NOT NULL,
  `date_registered` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_regionaldirector`
--

INSERT INTO `tbl_regionaldirector` (`id`, `given_name`, `middle_name`, `family_name`, `date_of_birth`, `gender`, `address`, `email`, `contact_number`, `branch_id`, `picture`, `status`, `date_registered`) VALUES
('77de68daecd823babbb58edb1c8e14d7106e83bb', 'Rufo', 'Narcisi', 'Gabrillo', '1993-01-26', 'Male', 'Calasiao', 'rufo.gabrillo@gmail.col', '09484993958', 'branch', 'avatar.png', '1', '2017-11-30 18:11:35');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_relationshipmanager`
--

DROP TABLE IF EXISTS `tbl_relationshipmanager`;
CREATE TABLE IF NOT EXISTS `tbl_relationshipmanager` (
  `id` varchar(60) NOT NULL,
  `given_name` varchar(100) NOT NULL,
  `middle_name` varchar(100) NOT NULL,
  `family_name` varchar(100) NOT NULL,
  `date_of_birth` varchar(60) NOT NULL,
  `gender` varchar(20) NOT NULL,
  `address` varchar(1000) NOT NULL,
  `email` varchar(100) NOT NULL,
  `contact_number` varchar(20) NOT NULL,
  `branch_id` varchar(60) NOT NULL,
  `picture` varchar(70) NOT NULL,
  `status` varchar(1) NOT NULL,
  `date_registered` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_relationshipmanager`
--

INSERT INTO `tbl_relationshipmanager` (`id`, `given_name`, `middle_name`, `family_name`, `date_of_birth`, `gender`, `address`, `email`, `contact_number`, `branch_id`, `picture`, `status`, `date_registered`) VALUES
('b6589fc6ab0dc82cf12099d1c2d40ab994e8410c', 'Rufo', 'Narcisi', 'Gabrillo', '1993-01-26', 'Male', 'Calasiao', 'rufo.gabrillo@gmail.co', 'contact', 'branch', 'avatar.png', '1', '2017-11-30 16:36:19'),
('356a192b7913b04c54574d18c28d46e6395428ab', 'Rufo', 'Narcisi', 'Gabrillo', '1993-01-26', 'Male', 'Calasiao', 'rufo.gabrillo@gmail.com', '09484993958', 'branch', 'avatar.png', '1', '2017-11-30 16:43:40');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_retailbankinghead`
--

DROP TABLE IF EXISTS `tbl_retailbankinghead`;
CREATE TABLE IF NOT EXISTS `tbl_retailbankinghead` (
  `id` varchar(60) NOT NULL,
  `given_name` varchar(100) NOT NULL,
  `middle_name` varchar(100) NOT NULL,
  `family_name` varchar(100) NOT NULL,
  `date_of_birth` varchar(60) NOT NULL,
  `gender` varchar(20) NOT NULL,
  `address` varchar(1000) NOT NULL,
  `email` varchar(100) NOT NULL,
  `contact_number` varchar(20) NOT NULL,
  `profilte` varchar(100) NOT NULL,
  `status` varchar(1) NOT NULL,
  `date_registered` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_retailbankinghead`
--

INSERT INTO `tbl_retailbankinghead` (`id`, `given_name`, `middle_name`, `family_name`, `date_of_birth`, `gender`, `address`, `email`, `contact_number`, `profilte`, `status`, `date_registered`) VALUES
('da4b9237bacccdf19c0760cab7aec4a8359010b0', 'Rufo', 'Narcisi', 'Gabrillo', '1/26/1993', 'Male', 'Macabito Calasiao Pangasinan', 'rufo.gabrillo@rnrdigitalconsultancy.com', '09484993958', 'avatar.png', '1', '11/28/2017');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_sale`
--

DROP TABLE IF EXISTS `tbl_sale`;
CREATE TABLE IF NOT EXISTS `tbl_sale` (
  `id` varchar(60) NOT NULL,
  `plan_id` varchar(300) NOT NULL COMMENT 'same as policy number',
  `date_acquired` varchar(1000) NOT NULL,
  `customer_id` varchar(10) NOT NULL,
  `rm_id` varchar(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
