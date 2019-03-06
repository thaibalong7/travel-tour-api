-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th3 06, 2019 lúc 04:23 PM
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `admins`
--

INSERT INTO `admins` (`id`, `username`, `name`, `password`) VALUES
(1, 'admin', 'ADMIN', '$2a$10$YhVl2OqbcNyQKarX8pb6..XsXpOgNZmXslgtZnKrcIOZ45rxVSkJm'),
(2, 'nnlinh97', 'nnlinh', '$2a$10$JyHUnzm6z5/l1NdQR0IJjOrpMnGbm456hRqMa2a2CN26vrTLThrZe');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `blacklist_tokens`
--

CREATE TABLE IF NOT EXISTS `blacklist_tokens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `token` text COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

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
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `locations`
--

INSERT INTO `locations` (`id`, `latitude`, `longitude`, `name`, `address`, `description`, `featured_img`, `status`, `fk_type`) VALUES
(1, 10.866021, 106.803017, 'Khu du lịch Suối Tiên', '120 Xa lộ Hà Nội, Phường Tân Phú, Quận 9, Hồ Chí Minh 700000, Việt Nam', '\r\nCông viên giải trí có nhiều khu vui chơi và hoạt động dưới nước đa dạng được xây dựa trên hình tượng Đức Phật.', 'SuoiTien.jpg', 'active', 2),
(2, 10.806031, 106.667915, 'Chùa Phổ Quang', '64/3 Huỳnh Lan Khanh, phường 2, quận Tân Bình, Tp . Hồ Chí Minh', 'Chùa Phổ Quang tọa lạc ở số 64/3 Huỳnh Lan Khanh, phường 2, quận Tân Bình, Tp . Hồ Chí Minh  (số cũ 64/3 đường Phổ Quang phường 2, quận Tân Bình). Chùa thuộc hệ phái Bắc tông. Nằm gần cuối con đường nhỏ, gắn liền với những thăng trầm của lịch sử, đây là địa điểm thu hút nhiều du khách đến tham quan. Cảnh quan nơi đây rất đẹp và thanh tịnh.\r\n\r\nMột trong những đặc điểm khiến chùa Phổ Quang trở thành nơi được nhiều du khách yêu thích tìm đến chính là nét thanh bình, yên ả khó tìm thấy giữa lòng thành phố đông đúc người, xe. Đứng ở đây vào bất cứ thời điểm nào trong ngày cũng có thể nghe được tiếng chim kêu ríu rít, mọi âu lo phiền muộn cùng những bon chen tất bật gác bỏ lại bên ngoài. Nét đẹp ngày nay ở chùa Phổ Quang hài hòa, gắn liền với cảnh vật xung quanh. Có lẽ vì thế mà hàng năm chùa Phổ Quang chào đón rất nhiều du khách tìm đến chiêm bái, vãn cảnh, thả mình vào không gian thoáng tịnh.\r\n', 'ChuaPhoQuang.jpg', 'active', 19),
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
(27, 10.767623, 106.693916, 'Trippy.vn', '220 Đường Đề Thám, Phường Phạm Ngũ Lão, Quận 1, Hồ Chí Minh 700000, Việt Nam', 'Trung tâm lữ hành Quốc tế Trippy', NULL, 'active', 18),
(28, 10.753528, 106.661179, 'Miếu Bà Thiên Hậu - Tuệ Thành Hội quán', '710 Nguyễn Trãi, Phường 11, Quận 5, Hồ Chí Minh, Việt Nam', 'Ngôi chùa thờ nữ thần biển từ thế kỷ 18 này có kiến ​​trúc Trung Hoa đầy màu sắc, trang trí công phu.', 'Chua_Ba_Thien_Hau.jpg', 'active', 19),
(30, 10.768344, 106.694313, 'VIET FUN TRAVEL Company Ltd', '28/13 Bùi Viện, Phường Phạm Ngũ Lão, Quận 1, Hồ Chí Minh, Việt Nam', 'Văn phòng Viet Fun Travel', NULL, 'active', 18),
(31, 11.936261, 108.437660, 'Nhà Thờ Con Gà ', '7A1, Đường Lê Đại Hành, Phường 3, Thành Phố Đà Lạt, Tỉnh Lâm Đồng\r\n', 'Nhà thờ chính tòa Ðà Lạt là một nhà thờ công giáo ở Việt Nam. Đây là nhà thờ chính tòa của vị giám mục Giáo phận Đà Lạt, cũng là nhà thờ lớn nhất Đà Lạt, một trong những công trình kiến trúc tiêu biểu và cổ xưa nhất của thành phố này do người Pháp để lại.\r\n', '1.png', 'active', 13),
(32, 11.930179, 108.429581, 'Dinh Bảo Đại', '13 Triệu Việt Vương, Phường 4, Thành phố Đà Lạt, Lâm Đồng, Việt Nam\r\n', 'Ngôi dinh thự cổ được chính vua Bảo Đại  vị vua cuối cùng của Việt Nam xây dựng để nghỉ ngơi và làm việc tại Đà Lạt.', '2.png', 'active', 15),
(33, 11.903660, 108.434471, 'Thiền viện Trúc Lâm, Hồ Tuyền Lâm', 'núi Phụng Hoàng, Phường 3, Tp. Đà Lạt, Lâm Đồng, Việt Nam', 'Du ngoạn bằng cáp treo qua đồi Rôbin, ngắm cảnh rừng thông, hồ Tuyền Lâm và núi Phượng Hoàng từ trên cao.', '3.png', 'active', 19),
(34, 11.981397, 108.453827, 'Showroom hoa nghệ thuật', '7A/1 Đào Đà Lạt, Mai Anh Đào, Phường 8, Thành phố Đà Lạt, Lâm Đồng, Việt Nam', 'Chiêm ngưỡng các bình hoa khô được cắm nghệ thuật khéo léo với công nghệ sấy khô nhưng vẫn giữ nguyên màu sắc và hình dáng.', '4.png', 'active', 17),
(35, 11.945831, 108.412415, 'Làng hoa Vạn Thành ', 'Unnamed Road, Phường 5, Thành phố Đà Lạt, Lâm Đồng, Việt Nam', 'Là một trong những làng hoa lớn của Đà Lạt - một địa điểm du lịch ấn tượng của Đà lạt. Đoàn tìm hiểu và chiêm ngưỡng các loài hoa đẹp, quý: đồng tiền, cẩm chướng, ly ly, hoa lan, thạch thảo, vương quốc của hoa hồng với những vườn hoa hồng nhung, hồng ánh trăng, hồng cánh sen…Tham quan Vườn bí đỏ khổng lồ; Vườn dâu sạch trồng theo công nghệ Nhật Bản; Vườn cà chua bi,...\r\n', '5.png', 'active', 17),
(36, 12.006024, 108.380913, 'Thung lũng vàng', 'Unnamed Road, Lát, Lạc Dương, Lâm Đồng, Việt Nam', 'Hồ Dan Kia, Vườn đá Tứ linh,  Suối thác, rừng thông,... ', '6.png', 'active', 17),
(37, 12.019278, 108.424355, 'Langbiang', 'Langbian, Thị trấn Lạc Dương, Lạc Dương, Lâm Đồng, Việt Nam', 'oàn đi qua xã Lát, đi qua các vườn rau sạch đến Khu Du lịch Langbiang - Chinh phục đỉnh Langbiang bằng xe jeep (tự túc).', '7.png', 'active', 17),
(38, 11.941599, 108.453941, 'Ga xe lửa', 'Quang Trung, Phường 9, Thành phố Đà Lạt, Lâm Đồng, Việt Nam', 'Nhà ga cổ đẹp nhất Đông Dương, mang nét hài hòa giữa kiến trúc phương Tây và kiểu nhà rông Tây nguyên truyền thống.', '8.png', 'active', 17),
(39, 11.944258, 108.499474, 'Chùa Linh Phước', 'Unnamed Road, Phường 11, Thành phố Đà Lạt, Lâm Đồng, Việt Nam', 'Còn gọi là Chùa Ve chai - Một ngôi chùa đẹp được xây dựng công phu với kiến trúc nghệ thuật độc đáo làm từ ve chai.', '9.png', 'active', 19),
(40, 11.935385, 108.440933, 'Khách sạn Lucky Clover', '51-5 Hà Huy Tập, Phường 3, Thành phố Đà Lạt, Lâm Đồng, Việt Nam', 'Đặt phòng Khách Sạn nhanh chóng, tiện lợi, giá rẻ, đầy đủ tiện nghi. Hỗ trợ đưa đón Miễn Phí. Đặt trước có Phòng. Giá luôn Ưu đãi. Đi lại thuận lợi. Phòng đa dạng.', '10.png', 'active', 14),
(41, 11.876680, 108.470268, 'Thác Prenn', '20 Đường cao tốc Liên Khương - Prenn, Phường 3, Thành phố Đà Lạt, Lâm Đồng', 'Nằm ngay dưới chân đèo Prenn, trên đoạn đường từ Thành phố Hồ Chí Minh lên Đà Lạt. thác Prenn là một trong những đoạn thác còn giữ được vẻ hoang sơ của núi rừng Tây Nguyên, là một trong những khu du lịch sinh thái về rừng, suối.', '11.png', 'active', 17),
(42, 11.689610, 108.263924, 'Thác Pongour', 'Thôn Tân Nghĩa, Đức Trọng, Lâm Đồng', 'Thác Pongour, còn gọi là thác Bảy tầng là một ngọn thác tại huyện Đức Trọng, tỉnh Lâm Đồng, nằm cách Đà Lạt 50 km về hướng Nam. Thác đổ từ độ cao gần 40 mét, trải rộng hơn 100 mét, qua hệ thống đá bậc thang bảy tầng.', '12.png', 'active', 17),
(43, 11.640416, 107.742035, 'Thác Dambri', 'Thôn 14, Lý Thái Tổ, Đambri, Đam Bri, tp. Bảo Lộc, Lâm Đồng', 'Đambri là một thác nước đẹp, cao nhất vùng Lâm Đồng. Nguồn nước của dòng thác từ trê dsdasg 17 km, nằm giữa khung cảnh rừng nguyên sinh hoang sơ, hùng vĩ với nhiều loài động vật, thực vật quý hiếm.', '13.png', 'active', 17),
(44, 12.216125, 109.241158, 'Vinpearl Land Nha Trang', 'Vịnh Nha Trang, Việt Nam', 'Toạ lạc trên đảo Hòn Tre xinh đẹp giữa biển khơi và bãi biển trong xanh quanh năm, Vinpearl Land được biết đến như điểm đến du lịch Nha Trang – “thiên đường của miền nhiệt đới” hấp dẫn mọi du khách. Khi đặt chân đến địa điểm du lịch này, bạn sẽ được lưu trú tại khu nghỉ dưỡng, khách sạn Vinpearl Land Nha Trang 5 sao hàng đầu, chiêm ngưỡng những khu vườn tuyệt đẹp mang trong mình một ốc đảo xanh, hồ bơi nước ngọt lý tưởng, phố mua sắm bậc nhất.', '14.png', 'active', 2),
(45, 12.358465, 109.277626, 'Vịnh Ninh Vân', 'Vũng Ninh Vân, Tx. Ninh Hòa, Việt Nam', 'vịnh Ninh Vân đẹp như một nàng tiên mơ màng giữa chốn biển xanh bao la. Nằm trên bán đảo Hòn Mèo, vịnh Ninh Vân cách thành phố Nha Trang khoảng 60km, nên du khách có thể di chuyển bằng tàu cao tốc tới đây, đồng thời có thể ngắm toàn cảnh vịnh biển Nha Trang tuyệt đẹp từ trên tàu. ', '15.png', 'active', 17),
(46, 12.207174, 109.214653, 'Viện Hải dương học Nha Trang', 'Cầu Đá - Hòn Một, Vĩnh Hoà, Thành phố Nha Trang, Khánh Hòa, Việt Nam', 'Viện Hải dương học Nha Trang là nơi nghiên cứu đời sống các loài động thực vật biển tại thành phố Nha Trang tỉnh Khánh Hòa.  Lưu ý bạn có thể đặt ngay các khách sạn gần Viện hải Dương học để thuận tiện cho việc vui chơi, tham quan du lịch tại đây.', '16.png', 'active', 15),
(47, 12.246796, 109.188065, 'Nhà thờ Đá Nha Trang', '1 Thái Nguyên, Phước Tân, Tp. Nha Trang, Khánh Hòa 650000, Việt Nam', 'Nhà thờ Đá Nha Trang là một địa danh nổi tiếng của thành phố, nơi đây mang nhiều giá trị lịch sử và văn hóa hơn  một nhà thờ tôn giáo thông thường. Như một nhân chứng lịch sử, Nhà thờ Đá đã chứng kiến bao sự đổi thay theo thời gian của thành phố này, và giờ đây, chính nó cũng là cảnh quan xinh đẹp, góp phần làm nên sức hút cho thành phố biển  mộng mơ.', '17.png', 'active', 13),
(48, 16.026552, 108.032661, 'Bà Nà Hills', 'Hòa Vang, Đà Nẵng, Việt Nam', 'Với một chuyến cáp treo Bà Nà, bạn sẽ tiến đến khung cảnh thiên nhiên đẹp tựa chốn bồng lai tiên cảnh. Vừa là một phương tiện giúp bạn tiết kiệm thời gian, từ cáp treo bạn cũng có cơ hội ngắm nhìn núi non, mây trời và những công trình đặc sắc của Bà Nà Hills.', '18.png', 'active', 17),
(49, 16.095369, 108.243256, 'Bảo tàng 3D TrickEye', '183-125 Trần Nhân Tông, Sơn Trà, Đà Nẵng, Việt Nam', 'Không chỉ được chiêm ngưỡng các tác phẩm 3D, hoạt động thú vị và chủ yếu ở Art in Paradise chính là tạo dáng và chụp ảnh. Bạn có thể hóa thân thành những nhân vật cổ tích trong thế giới thần tiên, đặt chân vào khu rừng bí ẩn giữa những lăng mộ Ai Cập cổ đại hay hóa thân thành những chú chim đại bàng tung cánh…', '19.png', 'active', 15),
(50, 15.874937, 108.341583, 'Ký Ức Hội An Show', 'Cẩm Châu, Hội An, Quảng Nam, Việt Nam', 'Trở về với miền Faifo trong những khung cảnh mang đậm màu sắc hoài cổ của Ký Ức Hội An Show. Đây cũng là chương trình duy nhất đang giữ 2 kỷ lục “Sân khấu ngoài trời lớn nhất Việt Nam” và “Chương trình biểu diễn nghệ thuật thường nhật có số lượng diễn viên tham gia đông nhất” gần 500 người.', '20.png', 'active', 2),
(51, 10.343408, 107.074318, 'Bãi Trước vũng tàu', 'Phường 1, Tp. Vũng Tàu, Bà Rịa - Vũng Tàu, Việt Nam', 'Trung tâm của thành phố Vũng Tàu nằm ở bãi trước, nơi đây tập trung khá nhiều cao ốc và các khu mua bán sầm uất. Du khách thường chọn bãi tắm ở khu vực bãi sau vì bãi trước ô nhiễm hơn do mật độ dân cư sinh sống và du khách tập trung đông đúc. Tuy nhiên, bãi trước sẽ là nơi lý tưởng để bạn ngắm hoàng hôn hoặc đi dạo.', '21.png', 'active', 17),
(52, 10.500100, 107.479095, 'Hồ Cốc', 'Bưng Riềng, Xuyên Mộc, Bà Rịa - Vũng Tàu, Việt Nam', 'Là điểm du lịch hấp dẫn du khách bởi nét hoang sơ nguyên thủy hiếm có. Biển ở đây nước trong xanh in đáy cát quanh năm, khu bãi tắm cát trắng trải rộng, độ dốc thoai thoải và đặc biệt đẹp thơ mộng nhờ các tảng đá nằm trong bãi tắm tạo nên những đợt sóng biển tung bọt trắng xóa.', '22.png', 'active', 17),
(53, 10.374046, 107.071320, 'Thích Ca Phật Đài Vũng Tàu', 'Hẻm 365 Trần Phú, Phường 5, Thành phố Vũng Tầu, Bà Rịa - Vũng Tàu, Việt Nam', 'Đây là một ngôi chùa nằm trên sườn núi Lớn của thành phố Vũng Tàu. Vẻ đẹp của ngôi chùa kết hợp rất khéo léo giữa kiến trúc tôn giáo và phong cảnh thiên nhiên. Đáng chú ý nhất là ngọn tháp Bát Giác cao 19m và tượng Phật Thích Ca ngồi thiền trên tòa sen xây bên lưng chừng núi, du khách đứng từ xa có thể chiêm ngưỡng được.\r\n', '23.png', 'active', 19),
(54, 10.326448, 107.084534, 'Tượng Đức Chúa dang tay Vũng Tàu', 'Núi Nhỏ, Phường 2, Tp. Vũng Tàu, Bà Rịa - Vũng Tàu, Việt Nam', 'Tượng Chúa Ki-Tô hay Tượng Đức Chúa dang tay đứng trên đỉnh Núi Nhỏ của thành phố Vũng Tàu, được xây từ năm 1974. Bức tượng này cao 32 m, sải tay dài 18,3 m trên độ cao 170 m nhìn ra biển, bên trong có cầu thang 133 bậc lên tận 2 tay của tượng. Bức tượng có thể xem như một phiên bản tương tự tượng chúa dang tay tại thành phố Rio de Janeiro ở Brasil.', '24.png', 'active', 17),
(55, 10.350637, 107.067848, 'Bạch Dinh Vũng Tàu', 'Đường lên Bạch Dinh, Phường 1, Thành phố Vũng Tầu, Bà Rịa - Vũng Tàu, Việt Nam', 'Năm 1898, Toàn quyền Đông Dương Paul Doumer đã cho xây Bạch Dinh (Villa Blanche) trên nền pháo đài Phước Thắng nơi từng khai hỏa bắn vào tàu chiến Pháp gần 50 năm trước. Bạch Dinh là một công trình kiến trúc La Mã 3 tầng, cao 19 m, lưng tựa vào Núi Lớn. Tại đây hiện còn lưu giữ 19 khẩu thần công.', '25.png', 'active', 15),
(56, 10.777020, 106.703552, 'Nhà hát Thành Phố Hồ Chí Minh', '7 Công Trường Lam Sơn, Bến Nghé, Quận 1, Hồ Chí Minh, Việt Nam', 'nhà hát được xây dựng vào năm 1897 theo phong cách kiến trúc tân cổ điển. Nhà hát có kiến trúc cổ kính, uy nghi với một trệt, hai tầng lầu, 1.800 ghế, hệ thống âm thanh ánh sáng hiện đại.', NULL, 'active', 2),
(57, 10.762955, 106.682236, 'Đại học Khoa Học Tự Nhiên Đại Học Quốc Gia, TPHCM', '227 đường Nguyễn Văn Cừ, Phường 4, Quận 5, Hồ Chí Minh, Việt Nam', '', NULL, 'active', 18),
(58, 16.067415, 108.224823, 'Sun River Hotel', '132-134-136 Bạch Đằng, Quận Hải Châu, TP. Đà Nẵng', 'Khách sạn với 50 phòng đạt chuẩn 3 sao, được thiết kế theo phong cách hiện đại, nội thất sang trọng, trang nhã. Tại Sun River, quý khách sẽ được tận hưởng những cảm giác ấn tượng và khó quên. Hệ thống phòng tiêu chuẩn 3 sao với tầm nhìn thoáng đãng giúp quý khách thoải mái ngắm nhìn bao quát dòng sông Hàn hoặc toàn cảnh thành phố. Để đáp ứng đầy đủ nhất các nhu cầu về nghỉ ngơi, ẩm thực, giải trí và công việc của quý khách, khách sạn cung cấp những tiện nghi và dịch vụ đa dạng như: nhà hàng, bar & cafe ...\r\n', '28.png', 'active', 14);

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
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `routes`
--

INSERT INTO `routes` (`id`, `arrive_time`, `leave_time`, `day`, `detail`, `fk_location`, `fk_tour`) VALUES
(1, '07:00:00', '07:30:00', 0, 'Tập trung chuẩn bị xuất phát', 27, 1),
(2, '09:15:00', '10:15:00', 0, 'Di chuyển đến Dinh Độc Lập.', 22, 1),
(3, '11:05:00', '11:35:00', 0, 'Tham quan Bưu điện Thành phố.', 26, 1),
(4, '10:20:00', '11:00:00', 0, 'Dạo chơi ở Nhà thờ Đức Bà.', 25, 1),
(5, '08:10:00', '09:00:00', 0, 'Tham quan Bảo tàng chứng tích chiến tranh trên đường Võ Văn Tần.', 16, 1),
(6, '12:00:00', '12:00:00', 0, 'Đoàn về lại điểm đón ban đầu, kết thúc hành trình.', 27, 1),
(7, '08:00:00', '08:30:00', 0, 'Khởi hành từ văn phòng Viet Fun Travel bắt đầu Tour Du Lịch Tham Quan Sài Gòn 1 Ngày', 30, 2),
(8, '09:10:00', '10:00:00', 0, 'Quý khách đến tham quan Bảo tàng chiến tích chiến tranh', 16, 2),
(9, '10:20:00', '12:00:00', 0, 'Tham quan chùa Bà Thiên Hậu. \r\n11h20 sẽ di chuyển sang chợ Bình Tây để tham quan và ăn trưa, mua quà lưu niệm', 28, 2),
(10, '13:00:00', '14:00:00', 0, 'Buổi chiều, tham quan Dinh Thống Nhất, nơi trước đây là tổng hành dinh của Mỹ đặt tại miền Nam Việt Nam.', 22, 2),
(11, '14:15:00', '14:45:00', 0, 'Tham quan nhà thờ Đức Bà', 25, 2),
(12, '15:00:00', '16:00:00', 0, 'Tham quan bưu điện thành phố', 26, 2),
(13, '17:00:00', '17:00:00', 0, 'Quý khách kết thúc Tour Du Lịch Tham Quan Sài Gòn 1 Ngày tại văn phòng. Chia tay quý khách và hẹn gặp lại.\r\n', 30, 2),
(14, '10:00:00', '10:00:00', 1, NULL, 51, 3),
(15, '18:00:00', '06:00:00', 1, NULL, 40, 3),
(16, '07:30:00', '09:00:00', 2, NULL, 31, 3),
(17, '09:30:00', '11:30:00', 2, NULL, 33, 3),
(18, '13:30:00', '15:30:00', 2, NULL, 32, 3),
(19, '16:00:00', '18:00:00', 2, NULL, 34, 3),
(20, '19:00:00', '06:00:00', 2, NULL, 40, 3),
(21, '07:00:00', '08:30:00', 3, NULL, 38, 3),
(22, '09:00:00', '11:00:00', 3, NULL, 35, 3),
(23, '12:00:00', '14:00:00', 3, NULL, 40, 3),
(24, '21:00:00', '21:00:00', 3, NULL, 51, 3),
(25, '07:30:00', '07:30:00', 1, NULL, 57, 4),
(26, '08:00:00', '09:30:00', 1, NULL, 25, 4),
(27, '09:30:00', '11:30:00', 1, NULL, 26, 4),
(28, '13:30:00', '15:00:00', 1, NULL, 56, 4),
(29, '15:00:00', '15:00:00', 1, NULL, 57, 4),
(30, '07:00:00', '07:00:00', 1, NULL, 26, 5),
(31, '14:00:00', '15:00:00', 1, NULL, 41, 5),
(32, '16:00:00', '17:30:00', 1, NULL, 33, 5),
(33, '18:00:00', '06:00:00', 1, NULL, 40, 5),
(34, '07:30:00', '09:30:00', 2, NULL, 36, 5),
(35, '10:00:00', '11:35:00', 2, NULL, 32, 5),
(36, '14:00:00', '16:00:00', 2, NULL, 35, 5),
(37, '16:30:00', '18:30:00', 2, NULL, 34, 5),
(38, '19:00:00', '06:30:00', 2, NULL, 40, 5),
(39, '08:00:00', '09:00:00', 3, NULL, 31, 5),
(40, '09:30:00', '11:30:00', 3, NULL, 38, 5),
(41, '14:00:00', '15:30:00', 3, NULL, 39, 5),
(42, '16:30:00', '18:30:00', 3, NULL, 37, 5),
(43, '19:30:00', '05:00:00', 3, NULL, 40, 5),
(44, '10:00:00', '13:00:00', 4, NULL, 58, 5),
(45, '13:30:00', '14:30:00', 4, NULL, 49, 5),
(46, '16:00:00', '19:00:00', 4, NULL, 50, 5),
(47, '20:30:00', '08:00:00', 4, NULL, 58, 5),
(48, '09:00:00', '17:00:00', 5, NULL, 48, 5),
(49, '16:00:00', '07:30:00', 5, NULL, 58, 5),
(50, '19:00:00', '19:00:00', 6, NULL, 26, 5);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tours`
--

CREATE TABLE IF NOT EXISTS `tours` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `description` text COLLATE utf8_unicode_ci,
  `detail` text COLLATE utf8_unicode_ci NOT NULL,
  `featured_img` text COLLATE utf8_unicode_ci,
  `policy` text COLLATE utf8_unicode_ci,
  `price` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `tours`
--

INSERT INTO `tours` (`id`, `name`, `description`, `detail`, `featured_img`, `policy`, `price`) VALUES
(1, 'Tour tham quan Sài Gòn (nửa ngày)', 'Tham quan những địa danh mang đậm dấu ấn lịch sử như Bảo tàng chứng tích chiến tranh, Dinh Độc Lập.\r\nTìm hiểu nét văn hóa và một số kiến trúc độc đáo - điều tạo nên một phần linh hồn mảnh đất Sài Gòn: Nhà thờ Đức Bà, Bưu điện thành phố.\r\n\r\nBạn được trải nghiệm những gì?\r\nHành trình bắt đầu với chuyến thăm Bảo tàng chứng tích chiến tranh - top 5 trong số 25 bảo tàng hấp dẫn nhất châu Á. Đến với bảo tàng, bạn sẽ giật mình nhận ra đằng sau một cuộc sống hòa bình, yên ổn - mà bạn tưởng chừng như hiển nhiên này - là cả một chặng đường lịch sử thấm đẫm máu và nước mắt của dân tộc. Bảo tàng chứng tích chiến tranh như một nốt lặng tĩnh tâm giữa chốn phồn hoa đô hội, giúp bạn thêm yêu, thêm trân trọng cuộc sống thanh bình này.\r\n\r\nĐiểm dừng chân tiếp theo của Tour tham quan Sài Gòn chính là Dinh Độc Lập - một di tích quốc gia đặc biệt, dấu son quyền lực của của quá khứ. Dinh Độc Lập còn cuốn hút bạn bởi những câu chuyện lịch sử thú vị về sự hình thành, sự tồn tại, ý nghĩa văn hóa trong lối kiến trúc độc đáo và những dấu mốc lịch sử của đất nước mà nó đã mang trong mình hàng trăm năm qua. Chỉ vài giờ tham quan ngắn ngủi nhưng đủ giúp bạn hình dung về một giai đoạn lịch sử đầy biến động, và thêm tự hào về chiến thắng lịch sử vẻ vang của dân tộc Việt Nam.\r\n\r\nCuối hành trình, hãy trở về trung tâm thành phố để thăm Nhà thờ Đức Bà. Nơi giao hòa giữa nét cổ xưa và hiện đại, giữa kiến trúc phương Tây và văn hóa phương Đông. Bạn sẽ không khỏi trầm trồ thán phục trước màu gạch nơi đây vẫn giữ nguyên vẹn màu hồng tươi, chẳng bám chút bụi rêu, dẫu trải qua bao nắng mưa, thử thách. Nếu muốn tận hưởng hết vẻ đẹp của Nhà thờ Đức Bà, hãy dành chút thời gian ngồi lại, thưởng thức thú vui cà phê bệt trong ánh đèn lung linh phản chiếu từ các tòa cao ốc, cùng hòa nhịp sống với người Sài Gòn khi đêm về. Lúc đó bạn sẽ nhận ra Nhà thờ Đức Bà tựa như một nốt nhạc bình yên giữa bản nhạc xô bồ, vội vã của đất Sài Gòn này.', 'Buổi sáng:  Xe và hướng dẫn viên Trung tâm lữ hành Quốc tế Trippy đón Quý khách tại điểm hẹn, khởi hành đi tham quan. Tham quan Bảo tàng chứng tích chiến tranh trên đường Võ Văn Tần. Di chuyển đến Dinh Độc Lập. Dạo chơi ở Nhà thờ Đức Bà. Tham quan Bưu điện Thành phố. Buổi trưa:  Đoàn về lại điểm đón ban đầu, kết thúc hành trình.', NULL, NULL, 200000),
(2, 'Tham Quan Sài Gòn - TP. HCM 1 Ngày', 'Sài Gòn - Tp.HCM là trung tâm du lịch lớn nhất nước, thu hút hàng năm 70% lượng khách quốc tế đến Việt Nam. Với nhịp sống sôi động, các công trình kiến trúc Pháp cổ: Nhà thờ Đức Bà, Dinh Thống Nhất, Ủy ban nhân dân thành phố, Bưu điện thành phố; khu phố người Hoa và vô số các khu vui chơi, giải trí đã tạo nên sức hấp dẫn của Sài gòn.\r\n\r\nNỔI BẬT:\r\n\r\nCụm kiến trúc thời Pháp + Mỹ: Dinh Thống Nhất, Nhà Thờ Đức Bà, Bưu Điện Thành Phố, Uỷ Ban Nhân Dân Thành Phố. Khu vực hoạt động của người Hoa ở Sài Gòn: Chợ Lớn, chợ Bình Tây.\r\nBảo tàng chiến tích chiến tranh.', '', NULL, NULL, 550000),
(3, 'Vũng Tàu - Đà Lạt', 'Tour Đà Lạt - Vũng tàu giá rẻ của công ty, với các địa điểm du lịch hàng đầu Việt Nam sẽ khiến bạn và gia đình có những giây phút đáng nhớ trong cuộc đời.', 'Ngày 1: Vũng Tàu - Đà Lạt - Khách sạn. (Ăn sáng, trưa chiều).\r\nNgày 2: Khách sạn - Nhà thờ Con Gà - Thiền viện Trúc Lâm - Dinh Bảo Đại - Showroom hoa nghệ thuật  - Khách sạn. (Ăn sáng, trưa).\r\nNgày 3: Khách sạn - Ga xe lửa cổ - Làng hoa Vạn Thành - Khách sạn (Đà lạt) - Vũng Tàu (Ăn sáng, trưa ,chiều).', NULL, 'Nếu Quý khách hủy tour từ 5 ngày trở lên so với ngày khởi hành, chịu phí: 10%\r\nNếu Quý khách hủy sau 2 ngày đến trước ngày đi 24 tiếng: 50%.\r\nNếu Quý khách hủy trong vòng 24 giờ: chịu phí 100 %.', 5000000),
(4, 'Thành phố Hồ Chí Minh 1 ngày', 'Hành trình du lịch Sài Gòn 1 ngày đưa du khách đến với thành phố mang tên Bác, từ lâu đã là trung tâm văn hóa, kinh tế của Việt Nam, thành phố này còn có có tên gọi khác là Hòn Ngọc Viễn Đông. Đến thành phố Hồ Chí Minh, thành phố có hơn 300 tuổi đời, bạn sẽ thấy những tòa nhà cao tầng, khu vui chơi giải trí, trung tâm mua sắm. Bên cạnh đó những phồn hoa chốn đô thị thì bạn cũng có thể thấy những biệt thự cổ kính, chợ truyền thống lâu đời…\r\n', 'Đại học Khoa Học Tự Nhiên - Nhà thờ Chánh Tòa Đức Bà Sài Gòn - Bưu điện TPHCM - Nhà hát TPHCM - Đại học Khoa học Tự Nhiên (Ăn trưa)', NULL, 'Nếu Quý khách hủy tour: chịu phí 100 %.\r\n', 100000),
(5, 'TPHCM - Đà Lạt - Đà Nẵng', 'Tour TPHCM - Đà Lạt - Đà Nẵng sẽ dừng chân tại một thành phố du lịch nổi tiếng được mệnh danh là Thành phố ngàn thông, Thành phố hoa anh đào, Thành phố mù sương... Cho dù với tên gọi nào thì Đà Lạt vẫn luôn có sức quyến rũ đặc biệt đối với du khách bốn phương bởi khí hậu mát mẻ, không khí trong lành, khung cảnh nên thơ và những truyền thuyết tình yêu lãng mạn. Và  đến với dải đất miền Trung với nhiều nắng gió lại là nơi lưu giữ những giá trị văn hóa con người tạo dựng. Trên dải đất hẹp từ Quảng Bình tới Quảng Nam hình thành nên con đường du lịch di sản miền Trung đã trở thành điểm đến thu hút đông đảo du khách trong và ngoài nước. Hành trình khám phá bức tranh miền Trung xinh đẹp, của Đà Nẵng nổi tiếng với bờ biển dài, quyến rũ; của Hội An nơi phố cổ bình yên, cổ kính; của đất Huế kinh thành lộng lẫy chốn hoàng cung… tất cả tạo ấn tượng cho du khách tham quan. ', 'Ngày 1: Bưu điện TPHCM - Thác Prenn - Thiền viện Trúc Lâm - Khách sạn (Ăn trưa, Ăn tối).\r\nNgày 2 : Khách sạn - Thũng lũng vàng - Dinh Bảo Đại - Làng Hoa Vạn Thành - Showroom hoa nghệ thuật  - Khách sạn. (Ăn sáng, trưa, tối).\r\nNgày 3: Khách sạn - Nhà thờ Con Gà - Ga xe lửa - Chùa Linh Phước - Langbiang - Khách sạn (Ăn sáng, trưa, tối).\r\nNgày 4: Khách sạn (Đà Lạt) - Khách sạn (Đà Nẵng) - Bảo tàng 3D TrickEye - Ký Ức Hội An Show - Khách sạn (Ăn sáng, trưa, tối).\r\nNgày 5: Khách sạn - Bà Nà Hills - Khách sạn (Ăn sáng, trưa, tối).\r\nNgày 6: Khách sạn(Đà Nẵng) -  Bưu điện TPHCM (Ăn sáng, trưa, tối).', NULL, 'Nếu Quý khách hủy tour từ 7 ngày trở lên so với ngày khởi hành, chịu phí: 10%\r\nNếu Quý khách hủy sau 3 ngày đến trước ngày đi 2 ngày: 50%.\r\nNếu Quý khách hủy trong vòng 2 ngày: chịu phí 100 %.\r\n', 13000000);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tour_images`
--

CREATE TABLE IF NOT EXISTS `tour_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` text COLLATE utf8_unicode_ci NOT NULL,
  `fk_tour` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_tour` (`fk_tour`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tour_turns`
--

CREATE TABLE IF NOT EXISTS `tour_turns` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `num_current_people` int(11) DEFAULT NULL,
  `num_max_people` int(11) NOT NULL,
  `fk_tour` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_tour` (`fk_tour`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `tour_turns`
--

INSERT INTO `tour_turns` (`id`, `start_date`, `end_date`, `num_current_people`, `num_max_people`, `fk_tour`) VALUES
(1, '2019-02-24', '2019-02-24', 1, 15, 1),
(2, '2019-03-02', '2019-03-02', 0, 15, 1),
(3, '2019-03-02', '2019-03-02', 0, 20, 2),
(4, '2019-03-09', '2019-03-09', 0, 20, 2),
(5, '2019-03-04', '2019-03-06', 0, 60, 3),
(6, '2019-03-08', '2019-03-08', 0, 30, 4),
(7, '2019-03-10', '2019-03-15', 0, 50, 5);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `types`
--

CREATE TABLE IF NOT EXISTS `types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `marker` text COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `types`
--

INSERT INTO `types` (`id`, `name`, `marker`) VALUES
(1, 'Quán ăn - Nhà hàng', 'restaurant'),
(2, 'Khu vui chơi giải trí', 'amusement'),
(3, 'Chợ', 'market'),
(4, 'Chợ đêm', 'marketnight'),
(5, 'Cafe - Trà sữa', 'cafe_and_milk_tea'),
(6, 'Trạm xe buýt', 'bus_stop'),
(7, 'Cây xăng', 'gas_station'),
(8, 'Khu mua sắm - Trung tâm thương mại', 'mall'),
(9, 'Thể thao', 'sport'),
(10, 'Công an', 'police'),
(11, 'Bệnh viện', 'hospital'),
(12, 'Ngân hàng', 'bank'),
(13, 'Nhà thờ', 'church'),
(14, 'Khách sạn', 'hotel'),
(15, 'Bảo tàng', 'museum'),
(16, 'Công viên', 'park'),
(17, 'Điểm thu hút khách du lịch', 'tourist_area'),
(18, 'Điểm xuất phát - kết thúc tour', 'start_end'),
(19, 'Chùa', 'temple');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `fullname` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `sex` enum('male','female','other') COLLATE utf8_unicode_ci DEFAULT NULL,
  `birthdate` datetime DEFAULT NULL,
  `phone` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `avatar` text COLLATE utf8_unicode_ci,
  `type` enum('facebook','local') COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `username`, `fullname`, `password`, `sex`, `birthdate`, `phone`, `email`, `avatar`, `type`) VALUES
(1, 'tblong', 'Thái Bá Long', '$2a$10$FBxM.3qOWiBOChTtQUNuju26KiU/aQicH5IGnqFwhchXcD4o.xbnK', 'male', NULL, '0123456789', NULL, NULL, 'local'),
(3, 'thaibalong', 'Thái Bá Long 2', '$2a$10$8SBPUyrj4QpJ8sHJbP1oAelXSTnNUDZX6YyvG3b0adczBWoeEDD9y', 'male', NULL, NULL, 'tblong@gmail.com', NULL, 'local'),
(4, 'nguoila', 'Người Lạ Ơi', '$2a$10$e4s.xPY2iZZ6nvD9wnZZcOHCC3kjycEQhkkZ79qieZ4PkvpAK/Zi.', 'male', NULL, '0702524116', 'la@gmail.com', NULL, 'local'),
(5, 'nguoila', 'Người Lạ Ơi 02', '$2a$10$k3u4SQeoH1k..vxPcbbIkuTtcopvtqoWJykbYQzah0yQ5InD452Sm', 'female', NULL, '0802524116', 'la02@gmail.com', NULL, 'local'),
(7, 'nnlinh97', 'Người Lạ', '$2a$10$o48sRtWBKq/t5xuBrXCcM.klfGp8d7LrEW7HEXnk.XBD1Ck5rQeuG', 'male', '1997-10-14 00:00:00', '0102524119', 'la0003@gmail.com', '7-anh avatar dep 2.jpg', 'local'),
(9, '', 'new usser', '$2a$10$wtLa/mR.hZ1Oq/lFaebywelUSTyo8MxtQ7jEU56nGyDKJbCztMBWG', 'male', NULL, '0102521548', 'newuser@gmail.com', NULL, 'local'),
(10, '', 'Thái Bá Long', '$2a$10$R7Mqj0M77zkhYwZJY8U71.nMthj2iTjwexvro2PURyjqwFUfAYI.e', NULL, NULL, NULL, 'thaibalong7@gmail.com', 'https://graph.facebook.com/15465484654864521000/picture?width=100', 'facebook'),
(11, '', 'Thái Bá Long', '$2a$10$v530GHSlF3cw1BgKITihduKVKz/RtaHjkhEFmQCJMJ0IfCd04PdlC', NULL, NULL, NULL, 'thaibalong9@gmail.com', 'https://graph.facebook.com/154654846548641500000/picture?width=100', 'facebook');

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
-- Các ràng buộc cho bảng `tour_images`
--
ALTER TABLE `tour_images`
  ADD CONSTRAINT `tour_images_ibfk_1` FOREIGN KEY (`fk_tour`) REFERENCES `tours` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `tour_turns`
--
ALTER TABLE `tour_turns`
  ADD CONSTRAINT `tour_turns_ibfk_1` FOREIGN KEY (`fk_tour`) REFERENCES `tours` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
