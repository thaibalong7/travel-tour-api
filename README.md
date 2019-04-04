# Server Tour Travel


**I\. Migrate Data:**

Các bước để migrate data (sử dụng db mới với name là *travel-tour-db*, không dùng db cũ nữa):

- Cài đặt sequelize CLI: `npm install -g sequelize-cli`

- Tạo mới database: `sequelize db:create travel-tour-db`

- Vào thư mục app: `cd app`

- Run lệnh: `sequelize db:migrate` (lệnh này để migrate phiên bản data mới nhất - tức là tạo các bảng rỗng cho db)

- Run lệnh: `sequelize db:seed:all` (lệnh này để seeding data ban đầu - tức là tạo dữ liệu cho các bảng)

- Run `npm start`

--------
>**Chú ý**

>- Khi nào db có sự thay đổi về mặt thiết kế thì chạy lại lệnh `sequelize db:migrate` để cập nhật version mới

>- Cập nhật dữ liệu: run lệnh `sequelize db:seed:undo:all` để xóa toàn bộ dữ liệu trong các bảng, run tiếp lệnh `sequelize db:seed:all` để seeding dữ liệu mới

>- Run `sequelize --help` để tìm hiểu thêm các câu lệnh khác của sequelize-cli

>- Doc *sequelize-cli*: [Migration doc](https://sequelize.readthedocs.io/en/latest/docs/migrations/)
