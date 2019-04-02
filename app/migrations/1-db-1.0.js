'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "requests", deps: []
 * createTable "admins", deps: []
 * createTable "type_passenger", deps: []
 * createTable "types", deps: []
 * createTable "transports", deps: []
 * createTable "tours", deps: []
 * createTable "blacklist_tokens", deps: []
 * createTable "payment_method", deps: []
 * createTable "users", deps: []
 * createTable "tour_turns", deps: [tours]
 * createTable "book_tour_contact_info", deps: [users]
 * createTable "book_tour_history", deps: [book_tour_contact_info, tour_turns, payment_method]
 * createTable "locations", deps: [types]
 * createTable "verification_token", deps: [users]
 * createTable "ratings", deps: [tours, users]
 * createTable "tour_images", deps: [tours]
 * createTable "price_passenger", deps: [tour_turns, type_passenger]
 * createTable "comments", deps: [tours, users]
 * createTable "passengers", deps: [book_tour_history, type_passenger]
 * createTable "request_cancel_booking", deps: [book_tour_history, users]
 * createTable "routes", deps: [locations, tours, transports]
 *
 **/

var info = {
    "revision": 1,
    "name": "db-1.0",
    "created": "2019-04-02T09:41:47.519Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "createTable",
        params: [
            "requests",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "autoIncrement": true
                },
                "name": {
                    "type": Sequelize.STRING,
                    "field": "name"
                },
                "email": {
                    "type": Sequelize.STRING,
                    "field": "email"
                },
                "message": {
                    "type": Sequelize.TEXT,
                    "field": "message"
                }
            },
            {
                "charset": "utf8"
            }
        ]
    },
    {
        fn: "createTable",
        params: [
            "admins",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "autoIncrement": true
                },
                "username": {
                    "type": Sequelize.STRING,
                    "field": "username",
                    "allowNull": false
                },
                "name": {
                    "type": Sequelize.STRING,
                    "field": "name",
                    "allowNull": false
                },
                "password": {
                    "type": Sequelize.STRING,
                    "field": "password",
                    "allowNull": false
                }
            },
            {
                "charset": "utf8"
            }
        ]
    },
    {
        fn: "createTable",
        params: [
            "type_passenger",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "autoIncrement": true
                },
                "name": {
                    "type": Sequelize.STRING,
                    "field": "name",
                    "allowNull": false
                }
            },
            {
                "charset": "utf8"
            }
        ]
    },
    {
        fn: "createTable",
        params: [
            "types",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "autoIncrement": true
                },
                "name": {
                    "type": Sequelize.STRING,
                    "field": "name",
                    "allowNull": false
                },
                "marker": {
                    "type": Sequelize.TEXT,
                    "field": "marker",
                    "allowNull": true
                }
            },
            {
                "charset": "utf8"
            }
        ]
    },
    {
        fn: "createTable",
        params: [
            "transports",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "autoIncrement": true
                },
                "name_vn": {
                    "type": Sequelize.STRING,
                    "field": "name_vn",
                    "allowNull": false
                },
                "name_en": {
                    "type": Sequelize.STRING,
                    "field": "name_en",
                    "allowNull": false
                }
            },
            {
                "charset": "utf8"
            }
        ]
    },
    {
        fn: "createTable",
        params: [
            "tours",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "autoIncrement": true
                },
                "name": {
                    "type": Sequelize.STRING,
                    "field": "name",
                    "allowNull": false
                },
                "description": {
                    "type": Sequelize.TEXT,
                    "field": "description",
                    "allowNull": true
                },
                "detail": {
                    "type": Sequelize.TEXT,
                    "field": "detail",
                    "allowNull": true
                },
                "featured_img": {
                    "type": Sequelize.TEXT,
                    "field": "featured_img",
                    "allowNull": true
                },
                "policy": {
                    "type": Sequelize.TEXT,
                    "field": "policy",
                    "allowNull": true
                }
            },
            {
                "charset": "utf8"
            }
        ]
    },
    {
        fn: "createTable",
        params: [
            "blacklist_tokens",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "autoIncrement": true,
                    "primaryKey": true,
                    "allowNull": false
                },
                "token": {
                    "type": Sequelize.TEXT,
                    "field": "token"
                }
            },
            {
                "charset": "utf8"
            }
        ]
    },
    {
        fn: "createTable",
        params: [
            "payment_method",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "autoIncrement": true
                },
                "name": {
                    "type": Sequelize.STRING,
                    "field": "name",
                    "allowNull": false
                }
            },
            {
                "charset": "utf8"
            }
        ]
    },
    {
        fn: "createTable",
        params: [
            "users",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "autoIncrement": true
                },
                "username": {
                    "type": Sequelize.STRING,
                    "field": "username"
                },
                "fullname": {
                    "type": Sequelize.STRING,
                    "field": "fullname"
                },
                "password": {
                    "type": Sequelize.STRING,
                    "field": "password",
                    "allowNull": false
                },
                "address": {
                    "type": Sequelize.TEXT,
                    "field": "address",
                    "allowNull": true
                },
                "sex": {
                    "type": Sequelize.ENUM('male', 'female', 'other'),
                    "field": "sex",
                    "allowNull": true
                },
                "birthdate": {
                    "type": Sequelize.DATEONLY,
                    "field": "birthdate",
                    "allowNull": true
                },
                "phone": {
                    "type": Sequelize.STRING,
                    "field": "phone"
                },
                "email": {
                    "type": Sequelize.STRING,
                    "field": "email"
                },
                "avatar": {
                    "type": Sequelize.STRING,
                    "field": "avatar"
                },
                "isActive": {
                    "type": Sequelize.BOOLEAN,
                    "field": "isActive",
                    "defaultValue": false
                },
                "type": {
                    "type": Sequelize.ENUM('facebook', 'local'),
                    "field": "type"
                }
            },
            {
                "charset": "utf8"
            }
        ]
    },
    {
        fn: "createTable",
        params: [
            "tour_turns",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "autoIncrement": true
                },
                "start_date": {
                    "type": Sequelize.DATEONLY,
                    "field": "start_date",
                    "allowNull": false
                },
                "end_date": {
                    "type": Sequelize.DATEONLY,
                    "field": "end_date",
                    "allowNull": false
                },
                "num_current_people": {
                    "type": Sequelize.INTEGER,
                    "field": "num_current_people",
                    "defaultValue": 0
                },
                "num_max_people": {
                    "type": Sequelize.INTEGER,
                    "field": "num_max_people",
                    "allowNull": false
                },
                "price": {
                    "type": Sequelize.INTEGER,
                    "field": "price",
                    "defaultValue": 0
                },
                "discount": {
                    "type": Sequelize.INTEGER,
                    "field": "discount",
                    "defaultValue": 0
                },
                "view": {
                    "type": Sequelize.INTEGER,
                    "field": "view",
                    "defaultValue": 0
                },
                "status": {
                    "type": Sequelize.ENUM('public', 'private'),
                    "field": "status"
                },
                "fk_tour": {
                    "type": Sequelize.INTEGER,
                    "field": "fk_tour",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "tours",
                        "key": "id"
                    },
                    "allowNull": true
                }
            },
            {
                "charset": "utf8"
            }
        ]
    },
    {
        fn: "createTable",
        params: [
            "book_tour_contact_info",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "autoIncrement": true
                },
                "email": {
                    "type": Sequelize.STRING,
                    "field": "email"
                },
                "fullname": {
                    "type": Sequelize.STRING,
                    "field": "fullname"
                },
                "phone": {
                    "type": Sequelize.STRING,
                    "field": "phone"
                },
                "address": {
                    "type": Sequelize.TEXT,
                    "field": "address",
                    "allowNull": true
                },
                "fk_user": {
                    "type": Sequelize.INTEGER,
                    "field": "fk_user",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "users",
                        "key": "id"
                    },
                    "allowNull": true
                }
            },
            {
                "charset": "utf8"
            }
        ]
    },
    {
        fn: "createTable",
        params: [
            "book_tour_history",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "autoIncrement": true
                },
                "book_time": {
                    "type": Sequelize.DATE,
                    "field": "book_time",
                    "allowNull": false
                },
                "status": {
                    "type": Sequelize.ENUM('booked', 'paid', 'cancelled'),
                    "field": "status",
                    "defaultValue": "booked"
                },
                "num_passenger": {
                    "type": Sequelize.INTEGER,
                    "field": "num_passenger",
                    "defaultValue": 0,
                    "allowNull": false
                },
                "total_pay": {
                    "type": Sequelize.INTEGER,
                    "field": "total_pay",
                    "defaultValue": 0,
                    "allowNull": false
                },
                "code": {
                    "type": Sequelize.TEXT,
                    "field": "code"
                },
                "fk_contact_info": {
                    "type": Sequelize.INTEGER,
                    "field": "fk_contact_info",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "book_tour_contact_info",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "fk_tour_turn": {
                    "type": Sequelize.INTEGER,
                    "field": "fk_tour_turn",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "tour_turns",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "fk_payment": {
                    "type": Sequelize.INTEGER,
                    "field": "fk_payment",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "payment_method",
                        "key": "id"
                    },
                    "allowNull": true
                }
            },
            {
                "charset": "utf8"
            }
        ]
    },
    {
        fn: "createTable",
        params: [
            "locations",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "autoIncrement": true
                },
                "latitude": {
                    "type": Sequelize.FLOAT,
                    "field": "latitude",
                    "allowNull": false
                },
                "longitude": {
                    "type": Sequelize.FLOAT,
                    "field": "longitude",
                    "allowNull": false
                },
                "name": {
                    "type": Sequelize.STRING,
                    "field": "name",
                    "unique": true,
                    "allowNull": false
                },
                "address": {
                    "type": Sequelize.TEXT,
                    "field": "address",
                    "allowNull": false
                },
                "description": {
                    "type": Sequelize.TEXT,
                    "field": "description",
                    "allowNull": false
                },
                "featured_img": {
                    "type": Sequelize.TEXT,
                    "field": "featured_img",
                    "allowNull": true
                },
                "status": {
                    "type": Sequelize.ENUM('active', 'inactive'),
                    "field": "status",
                    "defaultValue": "active"
                },
                "fk_type": {
                    "type": Sequelize.INTEGER,
                    "field": "fk_type",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "types",
                        "key": "id"
                    },
                    "allowNull": true
                }
            },
            {
                "charset": "utf8"
            }
        ]
    },
    {
        fn: "createTable",
        params: [
            "verification_token",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "autoIncrement": true,
                    "allowNull": false
                },
                "token": {
                    "type": Sequelize.STRING,
                    "field": "token",
                    "allowNull": false
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "createdAt",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updatedAt",
                    "allowNull": false
                },
                "user_id": {
                    "type": Sequelize.INTEGER,
                    "field": "user_id",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "users",
                        "key": "id"
                    },
                    "allowNull": true
                }
            },
            {
                "charset": "utf8"
            }
        ]
    },
    {
        fn: "createTable",
        params: [
            "ratings",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "autoIncrement": true
                },
                "rate": {
                    "type": Sequelize.INTEGER,
                    "field": "rate",
                    "allowNull": false
                },
                "fk_tour": {
                    "type": Sequelize.INTEGER,
                    "field": "fk_tour",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "tours",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "fk_user": {
                    "type": Sequelize.INTEGER,
                    "field": "fk_user",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "users",
                        "key": "id"
                    },
                    "allowNull": true
                }
            },
            {
                "charset": "utf8"
            }
        ]
    },
    {
        fn: "createTable",
        params: [
            "tour_images",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "autoIncrement": true
                },
                "name": {
                    "type": Sequelize.TEXT,
                    "field": "name",
                    "allowNull": false
                },
                "fk_tour": {
                    "type": Sequelize.INTEGER,
                    "field": "fk_tour",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "tours",
                        "key": "id"
                    },
                    "allowNull": true
                }
            },
            {
                "charset": "utf8"
            }
        ]
    },
    {
        fn: "createTable",
        params: [
            "price_passenger",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "autoIncrement": true
                },
                "percent": {
                    "type": Sequelize.INTEGER,
                    "field": "percent",
                    "defaultValue": 100
                },
                "fk_tourturn": {
                    "type": Sequelize.INTEGER,
                    "field": "fk_tourturn",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "tour_turns",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "fk_type_passenger": {
                    "type": Sequelize.INTEGER,
                    "field": "fk_type_passenger",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "type_passenger",
                        "key": "id"
                    },
                    "allowNull": true
                }
            },
            {
                "charset": "utf8"
            }
        ]
    },
    {
        fn: "createTable",
        params: [
            "comments",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "autoIncrement": true
                },
                "content": {
                    "type": Sequelize.TEXT,
                    "field": "content",
                    "allowNull": false
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "createdAt",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updatedAt",
                    "allowNull": false
                },
                "fk_tour": {
                    "type": Sequelize.INTEGER,
                    "field": "fk_tour",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "tours",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "fk_user": {
                    "type": Sequelize.INTEGER,
                    "field": "fk_user",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "users",
                        "key": "id"
                    },
                    "allowNull": true
                }
            },
            {
                "charset": "utf8"
            }
        ]
    },
    {
        fn: "createTable",
        params: [
            "passengers",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "autoIncrement": true
                },
                "fullname": {
                    "type": Sequelize.STRING,
                    "field": "fullname",
                    "allowNull": false
                },
                "phone": {
                    "type": Sequelize.STRING,
                    "field": "phone",
                    "allowNull": true
                },
                "birthdate": {
                    "type": Sequelize.DATEONLY,
                    "field": "birthdate",
                    "allowNull": true
                },
                "sex": {
                    "type": Sequelize.ENUM('male', 'female', 'other'),
                    "field": "sex",
                    "allowNull": true
                },
                "passport": {
                    "type": Sequelize.STRING,
                    "field": "passport",
                    "allowNull": true
                },
                "fk_book_tour": {
                    "type": Sequelize.INTEGER,
                    "field": "fk_book_tour",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "book_tour_history",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "fk_type_passenger": {
                    "type": Sequelize.INTEGER,
                    "field": "fk_type_passenger",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "type_passenger",
                        "key": "id"
                    },
                    "allowNull": true
                }
            },
            {
                "charset": "utf8"
            }
        ]
    },
    {
        fn: "createTable",
        params: [
            "request_cancel_booking",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "autoIncrement": true
                },
                "status": {
                    "type": Sequelize.ENUM('pending', 'solved'),
                    "field": "status",
                    "defaultValue": "pending"
                },
                "message": {
                    "type": Sequelize.TEXT,
                    "field": "message"
                },
                "fk_book_tour": {
                    "type": Sequelize.INTEGER,
                    "field": "fk_book_tour",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "book_tour_history",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "fk_user": {
                    "type": Sequelize.INTEGER,
                    "field": "fk_user",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "users",
                        "key": "id"
                    },
                    "allowNull": true
                }
            },
            {
                "charset": "utf8"
            }
        ]
    },
    {
        fn: "createTable",
        params: [
            "routes",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "autoIncrement": true
                },
                "arrive_time": {
                    "type": Sequelize.TIME,
                    "field": "arrive_time"
                },
                "leave_time": {
                    "type": Sequelize.TIME,
                    "field": "leave_time"
                },
                "day": {
                    "type": Sequelize.INTEGER,
                    "field": "day",
                    "allowNull": false
                },
                "detail": {
                    "type": Sequelize.TEXT,
                    "field": "detail",
                    "allowNull": true
                },
                "title": {
                    "type": Sequelize.TEXT,
                    "field": "title",
                    "allowNull": true
                },
                "fk_location": {
                    "type": Sequelize.INTEGER,
                    "field": "fk_location",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "locations",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "fk_tour": {
                    "type": Sequelize.INTEGER,
                    "field": "fk_tour",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "tours",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "fk_transport": {
                    "type": Sequelize.INTEGER,
                    "field": "fk_transport",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "transports",
                        "key": "id"
                    },
                    "allowNull": true
                }
            },
            {
                "charset": "utf8"
            }
        ]
    }
];

module.exports = {
    pos: 0,
    up: function(queryInterface, Sequelize)
    {
        var index = this.pos;
        return new Promise(function(resolve, reject) {
            function next() {
                if (index < migrationCommands.length)
                {
                    let command = migrationCommands[index];
                    console.log("[#"+index+"] execute: " + command.fn);
                    index++;
                    queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                }
                else
                    resolve();
            }
            next();
        });
    },
    info: info
};
