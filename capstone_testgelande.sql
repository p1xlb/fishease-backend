-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Nov 29, 2024 at 12:59 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `capstone_testgelande`
--

-- --------------------------------------------------------

--
-- Table structure for table `diseases`
--

CREATE TABLE `diseases` (
  `disease_id` int(11) NOT NULL,
  `disease_name` varchar(255) NOT NULL,
  `description` mediumtext NOT NULL,
  `affected_fish` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `diseases`
--

INSERT INTO `diseases` (`disease_id`, `disease_name`, `description`, `affected_fish`) VALUES
(1, 'Bacterial diseases - Aeromoniasis', 'One of the most common infections in freshwater fish is caused by the rod-shaped bacteria Aeromonas, which is also a gram negative, facultatively anaerobic, lactose-fermenting bacterium.\r\n\r\nThis bacterial pathogen is common in Goldfish, Ciclids and many other Tropical Fish. This bacterial infection can show itself in a wide variety of symptoms. Affected fish may have shallow or deep ulcers somewhere on the body, but may exhibit other signs such as exophthalmia (pop-eye), areas of bloody spots, and a distended abdomen. Infected fish with open sores appear to spread the disease to other fish, and sub clinical carriers may exist, shedding bacteria in their feces.\r\n\r\nAeromonas infections are probably the most common bacterial disease to infect Tropical Freshwater Fish.\r\nMortality rates are often low (10% or less) and losses may occur over a period of time (2 to 3 weeks or longer). In these instances, some factor; often water quality induced stress has caused the fish to become more susceptible to the bacteria.\r\n\r\n(https://www.americanaquariumproducts.com/aeromonas--vibrio.html#Aeromonas)', 'Tropical Freshwater Fish,'),
(2, 'Bacterial gill disease', 'Bacterial gill disease (BGD) is a common external infection of hatchery-\r\nreared salmonids and occasionally of warm water species reared under intensive\r\nconditions.\r\n\r\nAffected fish are usually lethargic and a loss of appetite occurs. Large\r\nnumbers of diseased fish gather near the screen or outlet of the pond. Acute\r\nepizootics may result in a 20 to 50% mortality in 24 hours.\r\n\r\nMaintenance of a high quality environment is of utmost importance in the\r\nprevention of bacterial gill disease. According to Wood (1974), fish should be\r\nreared in a system with no reuse of water until they reach a size of at least 100\r\nfish/lb. Population level should be kept at lowest feasible levels to reduce the\r\neffects of crowding. The applicaton of good sanitation practices is important.\r\nClean ponds provided with an adequate flow of clean water coupled with prompt\r\nremoval of dead or weak fish will reduce incidence of the disease.\r\n\r\nAvoid crowding and handling of fish during periods of high susceptibility.\r\nPractice good sanitation and keep waste products as low as possible\r\n\r\n(https://www.glfc.org/pubs/SpecialPubs/sp83_2/pdf/chap20.pdf)', 'Salmon, Common Carp, Young fishes,'),
(3, 'Bacterial red disease', 'Epizootic ulcerative syndrome (EUS), or \'red spot disease\', is a disease that can affect many species of fish. EUS is caused by a fungus (Aphanomyces invadans) and presents as red lesions (sores) or deep ulcers. Aphanomyces invadans, a fungus belonging to the same scientific classification as diatoms and brown algae. The fungus tends to proliferate during periods of low temperature, especially after heavy rainfall. Secondary bacterial infections are often also associated with red spot disease.\r\n\r\nRed spot disease may appear as small pin-sized red dots, larger red patches, or even bloody streaks on the fish’s body or fins. Some fish develop lesions that can develop into open sores or ulcers.\r\n\r\nsigns of red spot disease:\r\n\r\n- Erythema: A superficial reddening caused by dilation of the capillaries in the skin, often due to injury or irritation\r\n- Hyperemia: Increased blood flow through the vessels in the skin caused by acute inflammation.\r\n- Ulcers: Open sores or wounds on the external surface of the fish’s body.\r\n- Erosions: Degradation or fraying of the skin and/or fins.\r\n\r\nIn addition to red spots, infected fish may display changes in behavior such as:\r\n\r\n- Reduced appetite\r\n- Low activity\r\n- Hiding more than usual\r\n- Gasping for air\r\n- Erratic swimming.\r\n\r\nWhen secondary bacterial infections are present, infected fish may exhibit:\r\n\r\n- Fin rotting\r\n- Loss of color\r\n- Bloating\r\n\r\n(https://be.chewy.com/how-to-treat-a-fish-with-red-spots/, https://www.dpi.nsw.gov.au/dpi/bfs/aquatic-biosecurity/aquatic-pests-and-diseases/aquatic-animal-health/disease-issues-in-wild-fish-and-wild-shellfish/red-spot-disease)', 'Bream, Mullet, Whiting, '),
(4, 'Fungal diseases Saprolegniasis', 'Saprolegniasis, also known as winter fungus, is a disease caused by fungi usually in the genus Saprolegnia. Found in freshwater fish and fish eggs, saprolegniasis is a secondary infection typically seen when water temperatures dip below 59°F and then begin to increase in the early spring. A fish suffering from saprolegniasis will exhibit cotton-like growths on the skin and gills, depigmented skin, and sunken eyes. In more severe cases, the cotton-like growths can extend into the muscle tissue. Infected fish will begin to die slowly over time.\r\n\r\nDuring months where rapid change in water temperature is common, extra measures should be taken to prevent or detect saprolegniasis, Saprolegniasis can be prevented by avoiding rough handling, crowded stocking conditions, and poor water quality. To prevent further spread and reduce overall mortality, fish should be harvested as soon as saprolegniasis is observed.\r\n\r\n(https://fisheries.tamu.edu/2020/01/24/saprolegniasis/)', 'Freshwater fish, fish eggs, '),
(5, 'Healthy Fish', 'Your fish is likely to be in good condition!', ''),
(6, 'Parasitic diseases', 'All of the major groups of animal parasites are found in fish, and apparently healthy wild fish often carry heavy parasite burdens. Parasites with direct life cycles can be important pathogens of cultured fish; parasites with indirect life cycles frequently use fish as intermediate hosts. Knowledge of specific fish hosts greatly facilitates identification of parasites with marked host and tissue specificity, whereas others are recognized because of their common occurrence and lack of host specificity. Examination of fresh smears or biopsies that contain living parasites is often diagnostic.\r\n\r\nFish is directly or indirectly affected by different kinds of\r\nparasites, which cause high mortality in this species. Four\r\nmajor groups of parasites that cause infections in fish are:\r\nProtozoa (ciliates, flagellates, microsporidians,\r\nmyxozoans), platyhelminthes (monogenean, digenean,\r\ncestodes), nemathelminthes, and acanthocephala.\r\n\r\nEctoparasites on freshwater fish may be eliminated by immersion of the infected host into high NaCl concentrations. Similarly, marine parasites succumb when exposed to freshwater dependent on their ability to adjust to the change of salinity. Parasites as free-living invertebrates may show different tolerance to changing salinities. Thus, some are euryhaline and others stenohaline. The osmotic stress induced by a change of salinity may kill a range of protozoans (amoebae, flagellates, ciliates) and metazoans (monogeneans). Freshwater treatments are regularly applied to reduce populations of marine amoebae such as Neoparamoeba perurans on gills causing amoebic gill disease (AGD) in maricultured Atlantic salmon.\r\n\r\n(https://www.msdvetmanual.com/exotic-and-laboratory-animals/aquarium-fish/parasitic-diseases-of-fish, https://uniquescientificpublishers.com/wp-content/uploads/2021/10/203-215.pdf, https://pmc.ncbi.nlm.nih.gov/articles/PMC10090776/)', 'any fish is susceptible'),
(7, 'Viral diseases White tail disease', 'Fin erosion occurs when the fins of afflicted fish become degraded from a variety of sources, which can include abrasion with rough surfaces, fin damage from aggressive encounters between fish, nutritional deficiencies, and bacterial infection. Fin erosion has become a concern in fisheries management because of aesthetic and fish survival issues. Preven-tative measures for controlling fin erosion in hatcheries include: (i) feeding fish to satiation, (ii) increasing water velocities such that the energetic costs of fighting outweigh the gains, (iii) duoculture to reduce intraspecific aggression, (iv) use of a sand or cobble substrate on the bottom of rearing raceways and tanks to reduce abrasion, and (v) tank design.\r\n\r\nFor fin and tail rot disease caused by bacterial infection, the present study was conducted to isolate and identify the bacterial pathogen causing the disease, to conduct artificial infection challenge for confirmation of the pathogen and to know the antibiotic sensitivity pattern of the isolates. Bacteria were isolated from the lesions of diseased fish on Cytophaga agar medium where they developed characteristic yellowish pigmented colonies. They were identified as Flavobacterium columnare based on biochemical characterization tests\r\n\r\n(https://www.tandfonline.com/doi/abs/10.1080/10641260390255745, https://scialert.net/fulltext/?doi=jbs.2010.800.804)', 'Carp, Perch, tropical freshwater fish, ');

-- --------------------------------------------------------

--
-- Table structure for table `entry_history`
--

CREATE TABLE `entry_history` (
  `id_entry` varchar(255) NOT NULL,
  `user_id` int(11) NOT NULL,
  `img_url` varchar(255) DEFAULT NULL,
  `disease_name` varchar(100) DEFAULT NULL,
  `confidence_score` float DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `request_completed` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `token` varchar(64) NOT NULL,
  `expires_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hashed` varchar(255) NOT NULL,
  `name` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `diseases`
--
ALTER TABLE `diseases`
  ADD PRIMARY KEY (`disease_id`);

--
-- Indexes for table `entry_history`
--
ALTER TABLE `entry_history`
  ADD PRIMARY KEY (`id_entry`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `idx_user_id` (`user_id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD CONSTRAINT `password_reset_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
