-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th2 26, 2019 lúc 09:31 AM
-- Phiên bản máy phục vụ: 10.1.38-MariaDB
-- Phiên bản PHP: 7.3.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `sequelize_passport`
--
CREATE DATABASE IF NOT EXISTS `sequelize_passport` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `sequelize_passport`;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `admins`
--

CREATE TABLE IF NOT EXISTS `admins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `admins`
--

INSERT INTO `admins` (`id`, `username`, `name`, `password`) VALUES
(1, 'admin', 'ADMIN', '$2a$10$YhVl2OqbcNyQKarX8pb6..XsXpOgNZmXslgtZnKrcIOZ45rxVSkJm');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `book_tour_history`
--

CREATE TABLE IF NOT EXISTS `book_tour_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `book_time` datetime NOT NULL,
  `status` text COLLATE utf8_unicode_ci NOT NULL,
  `fk_tour_turn` int(11) DEFAULT NULL,
  `fk_user` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_tour_turn` (`fk_tour_turn`),
  KEY `fk_user` (`fk_user`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `book_tour_history`
--

INSERT INTO `book_tour_history` (`id`, `book_time`, `status`, `fk_tour_turn`, `fk_user`) VALUES
(1, '2019-02-25 11:20:00', '', 1, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `comments`
--

CREATE TABLE IF NOT EXISTS `comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` text COLLATE utf8_unicode_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `fk_tour` int(11) DEFAULT NULL,
  `fk_user` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_tour` (`fk_tour`),
  KEY `fk_user` (`fk_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `locations`
--

CREATE TABLE IF NOT EXISTS `locations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `latitude` float(10,6) NOT NULL,
  `longitude` float(10,6) NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `address` text COLLATE utf8_unicode_ci NOT NULL,
  `description` text COLLATE utf8_unicode_ci NOT NULL,
  `featured_img` text COLLATE utf8_unicode_ci,
  `status` enum('active','inactive') COLLATE utf8_unicode_ci DEFAULT 'active',
  `fk_type` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `fk_type` (`fk_type`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `locations`
--

INSERT INTO `locations` (`id`, `latitude`, `longitude`, `name`, `address`, `description`, `featured_img`, `status`, `fk_type`) VALUES
(1, 10.866021, 106.803017, 'Khu du lịch Suối Tiên', '120 Xa lộ Hà Nội, Phường Tân Phú, Quận 9, Hồ Chí Minh 700000, Việt Nam', '\r\nCông viên giải trí có nhiều khu vui chơi và hoạt động dưới nước đa dạng được xây dựa trên hình tượng Đức Phật.', 'SuoiTien.jpg', 'active', 2),
(2, 10.806031, 106.667915, 'Chùa Phổ Quang', '64/3 Huỳnh Lan Khanh, phường 2, quận Tân Bình, Tp . Hồ Chí Minh', 'Chùa Phổ Quang tọa lạc ở số 64/3 Huỳnh Lan Khanh, phường 2, quận Tân Bình, Tp . Hồ Chí Minh  (số cũ 64/3 đường Phổ Quang phường 2, quận Tân Bình). Chùa thuộc hệ phái Bắc tông. Nằm gần cuối con đường nhỏ, gắn liền với những thăng trầm của lịch sử, đây là địa điểm thu hút nhiều du khách đến tham quan. Cảnh quan nơi đây rất đẹp và thanh tịnh.\r\n\r\nMột trong những đặc điểm khiến chùa Phổ Quang trở thành nơi được nhiều du khách yêu thích tìm đến chính là nét thanh bình, yên ả khó tìm thấy giữa lòng thành phố đông đúc người, xe. Đứng ở đây vào bất cứ thời điểm nào trong ngày cũng có thể nghe được tiếng chim kêu ríu rít, mọi âu lo phiền muộn cùng những bon chen tất bật gác bỏ lại bên ngoài. Nét đẹp ngày nay ở chùa Phổ Quang hài hòa, gắn liền với cảnh vật xung quanh. Có lẽ vì thế mà hàng năm chùa Phổ Quang chào đón rất nhiều du khách tìm đến chiêm bái, vãn cảnh, thả mình vào không gian thoáng tịnh.\r\n', 'ChuaPhoQuang.jpg', 'active', 13),
(3, 10.784394, 106.684029, 'Bệnh viện Tai Mũi Họng Thành phố Hồ Chí Minh', '155-157 Trần Quốc Thảo, Phường 9, Quận 3, Hồ Chí Minh 70010, Việt Nam', 'Bệnh viện chuyên tai mũi họng', 'BenhVienTaiMuiHong.jpg', 'active', 11),
(4, 10.781772, 106.705444, 'Silverland Sakyo Hotel & Spa, Ho Chi Minh City', '10A Lê Thánh Tôn, Bến Nghé, Quận 1, Hồ Chí Minh, Việt Nam', 'Silverland Sakyo Hotel & Spa nằm ở trung tâm Thành phố Hồ Chí Minh, hòa quyện tâm hồn Sài Gòn với thanh thản trong văn hoá Nhật Bản. Khách sạn có hồ bơi trên sân thượng, 2 nhà hàng và quán bar ngay trong khuôn viên. Quý khách có thể tận hưởng các liệu pháp trẻ hoá tại KL Spa hoặc đơn giản chỉ cần thư giãn ở khu vực tiếp khách. Internet miễn phí cũng được cung cấp cho khách.  Khách sạn đầy đủ tiện nghi này nằm trong bán kính 600 m từ UBND thành phố Hồ Chí Minh và Bưu điện Thành phố. Sân bay Quốc tế Tân Sơn Nhất chỉ cách khách sạn 7 km. Dịch vụ đưa/đón sân bay có thể được thu xếp với một khoản phí nhỏ.  Các phòng nghỉ tại đây có lối bài trí sang trọng và được gắn máy điều hòa toàn bộ. Tủ lạnh mini, TV màn hình phẳng và tiện nghi pha trà/cà phê cũng được cung cấp trong phòng. Phòng tắm riêng đi kèm máy sấy tóc và áo choàng tắm sang trọng. Một số phòng còn có bồn tắm riêng.  Khách có thể thưởng thức một tách trà trong khi thư giãn trên sân hiên hoặc tận hưởng dịch vụ mát-xa truyền thống. Cả tiện nghi phòng xông hơi khô và phòng xông hơi ướt, dịch vụ thu đổi ngoại tệ, lễ tân 24 giờ và trung tâm dịch vụ doanh nhân đều được cung cấp tại đây.  Silverland Jolie Restaurant phục vụ tiệc tự chọn với một loạt các món ăn kiểu châu Á và quốc tế, đồng thời quý khách có thể thưởng thức các món ăn kiểu Nhật Bản chính thống tại Sakyo Sushi & Hot Pot Restaurant. Dịch vụ phòng cũng được cung cấp.  Quận 1 là lựa chọn tuyệt vời cho du khách thích bảo tàng, chợ và hoạt động giải trí về đêm.  Đây là khu vực ở TP. Hồ Chí Minh mà khách yêu thích, theo các đánh giá độc lập.  Chỗ nghỉ này là một trong những vị trí được đánh giá tốt nhất ở TP. Hồ Chí Minh! Khách thích nơi đây hơn so với những chỗ nghỉ khác trong khu vực.', 'Silverland-Sakyo-Hotel-Spa.jpg', 'active', 14),
(5, 10.766179, 106.642029, 'Công viên Văn hóa Đầm Sen', 'Số 3 Hòa Bình, Phường 3, Quận 11, Hồ Chí Minh, Việt Nam', 'Tổ hợp vui chơi giải trí cho gia đình với các hoạt động cưỡi ngựa, công viên nước, rạp chiếu phim & sở thú.', NULL, 'active', 2),
(6, 10.778731, 106.665154, 'Big C Miền Đông', '268 Tô Hiến Thành, Phường 15, Quận 10, Hồ Chí Minh, Việt Nam', '', 'big-c-mien-dong.jpg', 'active', 8),
(7, 10.763482, 106.679153, 'Hotel Equatorial Ho Chi Minh City', '242 Trần Bình Trọng, Phường 4, Quận 5, Hồ Chí Minh, Việt Nam', '', NULL, 'active', 14),
(8, 10.772550, 106.697983, 'Chợ Bến Thành', 'Chợ, Lê Lợi, Phường Bến Thành, Quận 1, Hồ Chí Minh, Việt Nam', 'Chợ nổi tiếng để mua đồ thủ công, lưu niệm, quần áo & hàng hóa khác đồng thời thưởng thức ẩm thực địa phương.', 'ChoBenThanh.jpg', 'active', 3),
(9, 10.767679, 106.695381, 'Lotteria Trần Hưng Đạo', '95A Đường Trần Hưng Đạo, Phường Cầu Ông Lãnh, Quận 1, Hồ Chí Minh, Việt Nam', '', NULL, 'active', 1),
(10, 10.775460, 106.685692, 'Papas\' Chicken CMT8', '199A Cách Mạng Tháng 8, Phường 4, Quận 3, Hồ Chí Minh, Việt Nam', '', NULL, 'active', 1),
(11, 10.771538, 106.680664, 'Siêu thị AEON Citimart Cao Thắng', '96 Cao Thắng, phường 4, quận 3, Phường 4, Hồ Chí Minh, Việt Nam', '', NULL, 'active', 8),
(12, 10.770068, 106.689873, 'Watcha Cafe Nguyễn Trãi', '150/27 Nguyễn Trãi, Phường Bến Thành, Quận 1, Phường Phạm Ngũ Lão, Hồ Chí Minh, 700000, Việt Nam', '', NULL, 'active', 5),
(13, 10.778895, 106.674530, 'Sorrento Cafe', '91/6 Hoà Hưng, Phường 12, Quận 10, Hồ Chí Minh, Việt Nam', '', 'SorrentoCafeHoaHung.jpg', 'active', 5),
(14, 10.773831, 106.704895, 'Phố đi bộ Nguyễn Huệ', '22 Nguyễn Huệ, Bến Nghé, Quận 1, Hồ Chí Minh 700000, Việt Nam', 'Đường Nguyễn Huệ là một đường phố trung tâm tại Quận 1, Thành phố Hồ Chí Minh, nối liền Trụ sở Ủy ban Nhân dân Thành phố với bến Bạch Đằng, bờ sông Sài Gòn.\r\n\r\nNơi đây khởi thủy là con kênh dẫn nước từ sông Sài Gòn vào thành Gia Định (còn gọi thành Bát Quái) do Nguyễn Ánh xây dựng năm 1790. Ban đầu, nó có tên là Kinh Lớn (nghĩa là \"con kênh to lớn\") vì là con kênh trọng yếu giúp thuyền bè chạy thẳng vào thành. Thời Pháp thuộc, người Pháp cũng gọi Kinh Lớn với tên tương tự trong tiếng Pháp là Grand. Người Việt đôi khi còn gọi Kinh Lớn là Kinh Chợ Vải vì nơi đây hoạt động buôn bán vải vóc khá nhộn nhịp. Sau đó, Kinh Lớn được đổi tên thành kênh Charner theo tên đô đốc Charner - người ban hành quy định giới hạn địa phận thành phố này. Hai đường xe chạy hai bên bờ kênh mang tên Rigault de Genouilly và Charner (mặc dù đường Charner cũng được gọi là Canton do có nhiều người Hoa vùng Quảng Đông tập trung buôn bán vải vóc).\r\n\r\nVì lưu lượng hàng hóa vận chuyển tấp nập nên Kinh Lớn dần dần trở nên ô nhiễm nặng khiến người Pháp phải cho lấp kênh đào này, cùng với con đường ở hai bờ để trở thành đại lộ rộng lớn mang tên Đại lộ Charner vào năm 1887. Tuy nhiên, người Sài Gòn khi đó lại thường gọi bằng cái tên dân gian là đường Kinh Lấp (nghĩa là \"con kênh bị lấp đất\"). Đến năm 1956, con đường này được đổi tên thành Đại lộ Nguyễn Huệ và được sử dụng cho đến ngày nay.\r\n\r\nCho đến cuối thế kỷ 20, con đường này vẫn là chợ hoa xuân chính của người dân thành phố mỗi dịp Tết Nguyên Đán. Đây là nơi tập trung mua bán hoa tết cây cảnh nên con đường này khi đó còn được gọi là Chợ Tết Nguyễn Huệ. Nhà vườn tập kết hoa ở bến Bạch Đằng sau đó phân bổ vào từng ô đã quy định sẵn trên đường Nguyễn Huệ. Sau một thời gian gián đoạn, từ Tết Giáp Thân năm 2004, chợ hoa Nguyễn Huệ đã khôi phục nhưng với diện mạo mới. Không còn cảnh mua bán, chào mời, mặc cả, con đường với hoa là hoa nhưng được bày biện, sắp đặt công phu, chỉ dành cho việc thưởng ngoạn của khách du xuân. Và cũng từ năm này, cứ vào dịp Tết, đường Nguyễn Huệ có một cái tên khác, đó là đường hoa Nguyễn Huệ.\r\n\r\nTháng 4 năm 2015, chính quyền Thành phố Hồ Chí Minh khánh thành công trình quảng trường đi bộ Nguyễn Huệ với chiều dài 670 mét, rộng 64 mét. Toàn bộ trục đường từ trụ sở Ủy ban Nhân dân Thành phố đến Bến Bạch Đằng được lát đá granite với 2 đài phun nước và hệ thống cây xanh. Bên dưới quảng trường có hệ thống ngầm gồm trung tâm theo dõi, trung tâm điều khiển nhạc nước, ánh sáng, hệ thống nhà vệ sinh hiện đại… Mỗi ngày có hàng nghìn lượt người đến tham quan, vui chơi, chụp ảnh tại phố đi bộ Nguyễn Huệ. Mặc dù nhiều người gọi là phố đi bộ, nhưng thực tế xe cộ vẫn được chạy trên hai bên đường của đại lộ Nguyễn Huệ (ngoại trừ buổi tối thứ Bảy và Chủ nhật)', NULL, 'active', 16),
(15, 10.407799, 106.889526, 'Khu căn cứ Vàm Sát Đảo Khỉ', 'Long Hoà, Cần Giờ, Hồ Chí Minh, Việt Nam', '', 'VamSatDaoKhi.jpg', 'active', 17),
(16, 10.779387, 106.692345, 'Bảo Tàng Chứng Tích Chiến Tranh', '28 Võ Văn Tần, Phường 6, Quận 3, Hồ Chí Minh 700000, Việt Nam', 'Bảo tàng tưởng niệm trưng bày các bức ảnh, vũ khí & vật phẩm khác từ các cuộc chiến tại Việt Nam & Đông Dương.\r\n', NULL, 'active', 15),
(17, 10.774764, 106.666206, 'Bệnh viện Nhân dân 115', '527 Sư Vạn Hạnh, Phường 12, Quận 10, Hồ Chí Minh, Việt Nam', '', 'BenhVien115.jpg', 'active', 11),
(19, 10.773343, 106.700890, 'Trung Tâm Thương Mại Sài Gòn Center', '65 Lê Lợi, Bến Nghé, Quận 1, Hồ Chí Minh, Việt Nam\r\n\r\n', 'Saigon Centre là một khu phức hợp cao ốc do Công ty Keppel Land Watco I đầu tư tại Thành phố Hồ Chí Minh. Dự án này nằm ở quận 1.  Giai đoạn 1 đã hoàn tất. Giai đoạn 2 đã hoàn tất. Phức hợp này sẽ gồm 3 tòa nhà. Tòa nhà giai đoạn 1 đang sử dụng. Tòa nhà mới cao 193m, gồm 39 tầng và 4 tầng hầm. Năm 2016, khối đế của tòa nhà cũ đã được cải tạo lại cho đồng bộ với tòa số 2 lúc đó đang xây. Tòa nhà số 2 hoàn thành vào năm 2017.', 'SaiGonCenter.jpg', 'active', 8),
(20, 10.900893, 106.818581, 'Du lịch Sinh thái Thủy Châu', '55 ĐT743A, Bình An, Dĩ An, Bình Dương, Việt Nam\r\n\r\n', 'Khu du lịch Thủy Châu nằm tại Bình Thắng, Dĩ An, Bình Dương, chỉ cách trung tâm thành phố Sài Gòn chừng 20km nên rất thuận tiện cho các bạn trẻ lẫn gia đình ở Sài Gòn và các khu vực lân cận Bình Dương dã ngoại mỗi dịp cuối tuần.\r\n    Toàn bộ không gian từ rừng cây đến suối đá, từ hồ bơi đến thác nước róc rách đều nhân tạo nhưng với sự đầu tư kỹ lưỡng và có diện tích lên đến 18 héc-ta, khu du lịch Thủy Châu như khu vườn xanh tự nhiên ‘mọc’ lên kề thành phố mà bấy lâu người ta vẫn vô tình bỏ qua. Vừa bước vào cổng, ai cũng có một cảm giác chung đó chính là sự trong trẻo, mát lành và hoàn toàn không có tiếng ồn khó chịu của còi xe, của khói bụi', NULL, 'active', 17),
(21, 10.870391, 106.825790, 'Khu Du Lịch Suối Mơ', 'Đường 11, Long Thạnh Mỹ, Quận 9, Hồ Chí Minh, Việt Nam', 'Tọa lạc tại xã Trà Cổ, huyện Tân Phú, tỉnh Đồng Nai, Công viên Suối Mơ được ví như thiên đường “biển trên rừng” với kiến tạo thiên nhiên ấn tượng cùng dòng suối trong vắt, những ngọn thác mát lạnh kết hợp tuyệt mỹ với khu hồ tắm rộng với diện tích lên đến 150.000 m².\r\nĐể đến với Suối Mơ, bạn sẽ mất khoảng 3 giờ di chuyển bằng xe máy từ Sài Gòn. Tham khảo lộ trình như sau: Xuất phát theo hướng QL1 khoảng hơn 64 km đến Ngã 3 Dầu Dây, sau đó rẽ trái theo QL 20 hướng lên Đà Lạt khoảng 48 km nữa, qua cột số 48 UBND huyện Định Quán khoảng 700m rồi rẽ phải chạy sâu vào bên trong là đến Suối Mơ.\r\n', 'suoi-mo-park.jpg', 'active', 17),
(22, 10.777874, 106.696632, 'Dinh Độc Lập', '135 Nam Kỳ Khởi Nghĩa, Phường Bến Thành, Quận 1, Hồ Chí Minh 700000, Việt Nam', 'Di tích lịch sử về chiến tranh Việt Nam cho phép tham quan văn phòng chính phủ, phòng chỉ huy và hiện vật.\r\n', 'Dinh_Doc_Lap.JPG', 'active', 17),
(23, 10.769716, 106.699265, 'Bảo tàng Mỹ thuật Thành phố Hồ Chí Minh', '97A Phó Đức Chính, Phường Nguyễn Thái Bìn, Quận 1, Hồ Chí Minh, Việt Nam', 'Bảo tàng Mỹ thuật Thành phố Hồ Chí Minh tọa lạc tại số 97 Phó Đức Chính, Quận 1, Thành phố Hồ Chí Minh, Việt Nam; được thành lập năm 1987 và đi vào hoạt động năm 1991. Tòa nhà bao gồm 3 tầng, trưng bày các tác phẩm hội họa, điêu khắc, cổ vật có giá trị mỹ thuật cao. Đây là một trong những trung tâm mỹ thuật lớn nhất nước\r\nĐây là một tòa nhà tráng lệ kết hợp hài hòa lối kiến trúc Á Đông (Trung Quốc) và châu Âu (Pháp), do ông Rivera (một kiến trúc sư người Pháp) thiết kế vào năm 1929, và xây xong vào năm 1934. Chủ tòa nhà này là ông Hui Bon Hoa (hay còn gọi là Hứa Bổn Hòa, tục gọi chú Hỏa; 1845-1901), là một thương nhân giàu có và nổi tiếng của đất Sài Gòn xưa. Ông cũng đã là chủ của nhiều công trình nổi tiếng khác như Khách sạn Majestic, Bệnh viện Từ Dũ, Trung tâm cấp cứu Sài Gòn, chùa Phụng Sơn v.v...[1]\r\n\r\nNăm 1987, tòa nhà được lập thành Bảo tàng Mỹ thuật Thành phố Hồ Chí Minh, nhưng vì thiếu hiện vật nên đến năm 1992 mới đi vào hoạt động. Đến nay, nó đã trở thành một trung tâm mỹ thuật lớn của Việt Nam, lưu trữ rất nhiều tác phẩm hội họa, điêu khắc và cổ vật mỹ thuật trong lịch sử đất nước và nhân loại, gồm cả những tác phẩm có giá trị cao như bức tranh sơn mài Vườn xuân Bắc Trung Nam của danh họa Nguyễn Gia Trí.\r\n\r\n', 'Bao_Tang_My_Thuat_HCM.jpg', 'active', 15),
(24, 10.788048, 106.704697, 'Bảo tàng Lịch sử Việt Nam', '2 Nguyễn Bỉnh Khiêm, Bến Nghé, Quận 1, Hồ Chí Minh, Việt Nam', 'Bảo tàng Lịch sử thành phố Hồ Chí Minh tọa lạc tại số 2 đường Nguyễn Bỉnh Khiêm, phường Bến Nghé, Quận 1, bên cạnh Thảo Cầm Viên Sài Gòn. Đây là nơi bảo tồn và trưng bày hàng chục ngàn hiện vật quý được sưu tầm trong và ngoài nước Việt Nam.\r\n\r\n', 'bao_tang_lich_su_viet_nam.jpg', 'active', 15),
(25, 10.779823, 106.699036, 'Nhà thờ Đức Bà Sài Gòn', '01 Công xã Paris, Bến Nghé, Quận 1, Quận 1 Hồ Chí Minh, Việt Nam', 'Nhà thờ Công giáo được xây dựng bằng gạch Pháp vào những năm 1880 và có các tháp chuông Rô-măng cao 58m.', 'nha_tho_duc_ba.jpg', 'active', 13),
(26, 10.779880, 106.699905, 'Bưu Điện Trung Tâm Thành Phố', 'Số 125 Công xã Paris, Bến Nghé, Quận 1, Hồ Chí Minh 710009, Việt Nam', 'Bưu điện trung tâm hoành tráng hoàn thành năm 1891, với sảnh chính có mái vòm & mặt sơn mang dấu ấn thời gian.', 'buu-dien-trung-tam-sai-gon.jpg', 'active', 17),
(27, 10.767623, 106.693916, 'Trippy.vn', '220 Đường Đề Thám, Phường Phạm Ngũ Lão, Quận 1, Hồ Chí Minh 700000, Việt Nam', 'Trung tâm lữ hành Quốc tế Trippy', NULL, 'active', NULL),
(28, 10.753528, 106.661179, 'Miếu Bà Thiên Hậu - Tuệ Thành Hội quán', '710 Nguyễn Trãi, Phường 11, Quận 5, Hồ Chí Minh, Việt Nam', 'Ngôi chùa thờ nữ thần biển từ thế kỷ 18 này có kiến ​​trúc Trung Hoa đầy màu sắc, trang trí công phu.', 'Chua_Ba_Thien_Hau.jpg', 'active', 13);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ratings`
--

CREATE TABLE IF NOT EXISTS `ratings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `rate` int(11) NOT NULL,
  `fk_tour` int(11) DEFAULT NULL,
  `fk_user` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_tour` (`fk_tour`),
  KEY `fk_user` (`fk_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `routes`
--

CREATE TABLE IF NOT EXISTS `routes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `arrive_time` time NOT NULL,
  `leave_time` time NOT NULL,
  `day` int(11) NOT NULL,
  `detail` text COLLATE utf8_unicode_ci,
  `fk_location` int(11) DEFAULT NULL,
  `fk_tour` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_location` (`fk_location`),
  KEY `fk_tour` (`fk_tour`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `routes`
--

INSERT INTO `routes` (`id`, `arrive_time`, `leave_time`, `day`, `detail`, `fk_location`, `fk_tour`) VALUES
(1, '07:00:00', '07:30:00', 0, 'Tập trung chuẩn bị xuất phát', 27, 1),
(2, '08:10:00', '09:00:00', 0, 'Tham quan Bảo tàng chứng tích chiến tranh trên đường Võ Văn Tần.', 16, 1),
(3, '09:15:00', '10:15:00', 0, 'Di chuyển đến Dinh Độc Lập.', 22, 1),
(4, '10:20:00', '11:00:00', 0, 'Dạo chơi ở Nhà thờ Đức Bà.', 25, 1),
(5, '11:05:00', '11:35:00', 0, 'Tham quan Bưu điện Thành phố.', 26, 1),
(6, '12:00:00', '12:00:00', 0, 'Đoàn về lại điểm đón ban đầu, kết thúc hành trình.', 27, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tours`
--

CREATE TABLE IF NOT EXISTS `tours` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `description` text COLLATE utf8_unicode_ci,
  `policy` text COLLATE utf8_unicode_ci,
  `price` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `tours`
--

INSERT INTO `tours` (`id`, `name`, `description`, `policy`, `price`) VALUES
(1, 'Tour tham quan Sài Gòn (nửa ngày)', 'Tham quan những địa danh mang đậm dấu ấn lịch sử như Bảo tàng chứng tích chiến tranh, Dinh Độc Lập.\r\nTìm hiểu nét văn hóa và một số kiến trúc độc đáo - điều tạo nên một phần linh hồn mảnh đất Sài Gòn: Nhà thờ Đức Bà, Bưu điện thành phố.\r\n\r\nBạn được trải nghiệm những gì?\r\nHành trình bắt đầu với chuyến thăm Bảo tàng chứng tích chiến tranh - top 5 trong số 25 bảo tàng hấp dẫn nhất châu Á. Đến với bảo tàng, bạn sẽ giật mình nhận ra đằng sau một cuộc sống hòa bình, yên ổn - mà bạn tưởng chừng như hiển nhiên này - là cả một chặng đường lịch sử thấm đẫm máu và nước mắt của dân tộc. Bảo tàng chứng tích chiến tranh như một nốt lặng tĩnh tâm giữa chốn phồn hoa đô hội, giúp bạn thêm yêu, thêm trân trọng cuộc sống thanh bình này.\r\n\r\nĐiểm dừng chân tiếp theo của Tour tham quan Sài Gòn chính là Dinh Độc Lập - một di tích quốc gia đặc biệt, dấu son quyền lực của của quá khứ. Dinh Độc Lập còn cuốn hút bạn bởi những câu chuyện lịch sử thú vị về sự hình thành, sự tồn tại, ý nghĩa văn hóa trong lối kiến trúc độc đáo và những dấu mốc lịch sử của đất nước mà nó đã mang trong mình hàng trăm năm qua. Chỉ vài giờ tham quan ngắn ngủi nhưng đủ giúp bạn hình dung về một giai đoạn lịch sử đầy biến động, và thêm tự hào về chiến thắng lịch sử vẻ vang của dân tộc Việt Nam.\r\n\r\nCuối hành trình, hãy trở về trung tâm thành phố để thăm Nhà thờ Đức Bà. Nơi giao hòa giữa nét cổ xưa và hiện đại, giữa kiến trúc phương Tây và văn hóa phương Đông. Bạn sẽ không khỏi trầm trồ thán phục trước màu gạch nơi đây vẫn giữ nguyên vẹn màu hồng tươi, chẳng bám chút bụi rêu, dẫu trải qua bao nắng mưa, thử thách. Nếu muốn tận hưởng hết vẻ đẹp của Nhà thờ Đức Bà, hãy dành chút thời gian ngồi lại, thưởng thức thú vui cà phê bệt trong ánh đèn lung linh phản chiếu từ các tòa cao ốc, cùng hòa nhịp sống với người Sài Gòn khi đêm về. Lúc đó bạn sẽ nhận ra Nhà thờ Đức Bà tựa như một nốt nhạc bình yên giữa bản nhạc xô bồ, vội vã của đất Sài Gòn này.\r\n\r\nLịch trình\r\n\r\nBuổi sáng:\r\n\r\nXe và hướng dẫn viên Trung tâm lữ hành Quốc tế Trippy đón Quý khách tại điểm hẹn, khởi hành đi tham quan.\r\nTham quan Bảo tàng chứng tích chiến tranh trên đường Võ Văn Tần.\r\nDi chuyển đến Dinh Độc Lập.\r\nDạo chơi ở Nhà thờ Đức Bà.\r\nTham quan Bưu điện Thành phố.\r\nBuổi trưa:\r\n\r\nĐoàn về lại điểm đón ban đầu, kết thúc hành trình.\r\n', NULL, 20000);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tour_turns`
--

CREATE TABLE IF NOT EXISTS `tour_turns` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `num_current_people` int(11) DEFAULT NULL,
  `num_max_people` int(11) NOT NULL,
  `fk_tour` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_tour` (`fk_tour`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `tour_turns`
--

INSERT INTO `tour_turns` (`id`, `start_date`, `end_date`, `num_current_people`, `num_max_people`, `fk_tour`) VALUES
(1, '2019-02-28 00:00:00', '2019-02-28 00:00:00', 1, 15, 1),
(2, '2019-03-02 00:00:00', '2019-03-02 00:00:00', 0, 15, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `types`
--

CREATE TABLE IF NOT EXISTS `types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `marker` text COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `types`
--

INSERT INTO `types` (`id`, `name`, `marker`) VALUES
(1, 'Quán ăn - Nhà hàng', NULL),
(2, 'Khu vui chơi giải trí', NULL),
(3, 'Chợ', NULL),
(4, 'Chợ đêm', NULL),
(5, 'Cafe - Trà sữa', NULL),
(6, 'Trạm xe buýt', NULL),
(7, 'Cây xăng', NULL),
(8, 'Khu mua sắm - Trung tâm thương mại', NULL),
(9, 'Thể thao', NULL),
(10, 'Công an', NULL),
(11, 'Bệnh viện', NULL),
(12, 'Ngân hàng', NULL),
(13, 'Nhà thờ - Chùa', NULL),
(14, 'Khách sạn', NULL),
(15, 'Bảo tàng', NULL),
(16, 'Công viên', NULL),
(17, 'Điểm thu hút khách du lịch', NULL),
(18, 'Điểm xuất phát - kết thúc tour', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `sex` enum('male','female','other') COLLATE utf8_unicode_ci DEFAULT NULL,
  `birthdate` datetime DEFAULT NULL,
  `phone` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `username`, `name`, `password`, `sex`, `birthdate`, `phone`) VALUES
(1, 'tblong', 'Thái Bá Long', '$2a$10$FBxM.3qOWiBOChTtQUNuju26KiU/aQicH5IGnqFwhchXcD4o.xbnK', 'male', NULL, NULL);

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `book_tour_history`
--
ALTER TABLE `book_tour_history`
  ADD CONSTRAINT `book_tour_history_ibfk_1` FOREIGN KEY (`fk_tour_turn`) REFERENCES `tour_turns` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `book_tour_history_ibfk_2` FOREIGN KEY (`fk_user`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`fk_tour`) REFERENCES `tours` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`fk_user`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `locations`
--
ALTER TABLE `locations`
  ADD CONSTRAINT `locations_ibfk_1` FOREIGN KEY (`fk_type`) REFERENCES `types` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `ratings`
--
ALTER TABLE `ratings`
  ADD CONSTRAINT `ratings_ibfk_1` FOREIGN KEY (`fk_tour`) REFERENCES `tours` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `ratings_ibfk_2` FOREIGN KEY (`fk_user`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `routes`
--
ALTER TABLE `routes`
  ADD CONSTRAINT `routes_ibfk_1` FOREIGN KEY (`fk_location`) REFERENCES `locations` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `routes_ibfk_2` FOREIGN KEY (`fk_tour`) REFERENCES `tours` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `tour_turns`
--
ALTER TABLE `tour_turns`
  ADD CONSTRAINT `tour_turns_ibfk_1` FOREIGN KEY (`fk_tour`) REFERENCES `tours` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
