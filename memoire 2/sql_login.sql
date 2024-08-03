-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jun 07, 2023 at 01:44 AM
-- Server version: 10.4.18-MariaDB
-- PHP Version: 8.0.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sql_login`
--

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `Date` text NOT NULL,
  `username` text NOT NULL,
  `roomnumber` int(28) NOT NULL,
  `service` text DEFAULT NULL,
  `status` text DEFAULT 'waiting'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`Date`, `username`, `roomnumber`, `service`, `status`) VALUES
('1:46:17 PM', 'jjjjj', 7, '', 'waiting'),
('1:48:22 PM', 'sikada', 4, '', 'waiting'),
('1:55:42 PM', 'jjjjj', 4, '', 'waiting'),
('4:26:57 PM', 'jjjjj', 5, '', 'waiting'),
('4:28:05 PM', 'jjjjj', 7, '', 'waiting'),
('4:29:47 PM', 'jjjjj', 7, '', 'waiting'),
('4:31:18 PM', 'jjjjj', 7, 'uu', 'waiting'),
('8:37:02 PM', 'jjjjj', 8, 'marker', 'ongoing'),
('11:04:25 PM', 'jjjjj', 8, 'oo', 'waiting'),
('11:11:32 PM', 'jjjjj', 8, 'papers', 'waiting');

-- --------------------------------------------------------

--
-- Table structure for table `usr`
--

CREATE TABLE `usr` (
  `id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` text NOT NULL,
  `fullname` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `usr`
--

INSERT INTO `usr` (`id`, `email`, `password`, `fullname`) VALUES
(50, '3333@gmail.com', '6666', 'john bender'),
(65, '1111@com', '3333', 'jjjjj'),
(66, '1111', '2222', ''),
(67, 'abderrahmane.zidou@univ-constantine2.dz', '8888', 'abderrahmane zidou'),
(77, 'fares.bencheikh@univ-constantine2.dz', '9999', 'Fares BENCHEIKH EL HOCINE'),
(78, '4444@gmail.com', '7777', 'sikada'),
(79, '2222@gmail.com', '5555', 'akira');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `usr`
--
ALTER TABLE `usr`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `usr`
--
ALTER TABLE `usr`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=80;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
