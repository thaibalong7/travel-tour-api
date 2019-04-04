'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        /*
          Add altering commands here.
          Return a promise to correctly handle asynchronicity.
    
          Example:
          return queryInterface.createTable('users', { id: Sequelize.INTEGER });
        */
        return Promise.all([
            queryInterface.addColumn(
                // passengers belongsTo book_tour_history
                'passengers', // name of Source model
                'fk_book_tour', // name of the key we're adding 
                {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'book_tour_history', // name of Target model
                        key: 'id', // key in Target model that we're referencing
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'SET NULL',
                }
            ),
            queryInterface.addColumn(
                // passengers belongsTo type_passenger
                'passengers', // name of Source model
                'fk_type_passenger', // name of the key we're adding 
                {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'type_passenger', // name of Target model
                        key: 'id', // key in Target model that we're referencing
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'SET NULL',
                }
            ),
            queryInterface.addColumn(
                // price_passenger belongsTo tour_turns
                'price_passenger', // name of Source model
                'fk_tourturn', // name of the key we're adding 
                {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'tour_turns', // name of Target model
                        key: 'id', // key in Target model that we're referencing
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'SET NULL',
                }
            ),
            queryInterface.addColumn(
                // price_passenger belongsTo type_passenger
                'price_passenger', // name of Source model
                'fk_type_passenger', // name of the key we're adding 
                {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'type_passenger', // name of Target model
                        key: 'id', // key in Target model that we're referencing
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'SET NULL',
                }
            ),
            queryInterface.addColumn(
                // ratings belongsTo tours
                'ratings', // name of Source model
                'fk_tour', // name of the key we're adding 
                {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'tours', // name of Target model
                        key: 'id', // key in Target model that we're referencing
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'SET NULL',
                }
            ),
            queryInterface.addColumn(
                // ratings belongsTo users
                'ratings', // name of Source model
                'fk_user', // name of the key we're adding 
                {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'users', // name of Target model
                        key: 'id', // key in Target model that we're referencing
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'SET NULL',
                }
            ),
            queryInterface.addColumn(
                // request_cancel_booking belongsTo book_tour_history
                'request_cancel_booking', // name of Source model
                'fk_book_tour', // name of the key we're adding 
                {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'book_tour_history', // name of Target model
                        key: 'id', // key in Target model that we're referencing
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'SET NULL',
                }
            ),
            queryInterface.addColumn(
                // request_cancel_booking belongsTo users
                'request_cancel_booking', // name of Source model
                'fk_user', // name of the key we're adding 
                {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'users', // name of Target model
                        key: 'id', // key in Target model that we're referencing
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'SET NULL',
                }
            )
        ])
    },

    down: (queryInterface, Sequelize) => {
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.
    
          Example:
          return queryInterface.dropTable('users');
        */
        return Promise.all([
            queryInterface.removeColumn(
                'passengers', // name of Source model
                'fk_book_tour' // key we want to remove
            ),
            queryInterface.removeColumn(
                'passengers', // name of Source model
                'fk_type_passenger' // key we want to remove
            ),
            queryInterface.removeColumn(
                'price_passenger', // name of Source model
                'fk_tourturn' // key we want to remove
            ),
            queryInterface.removeColumn(
                'price_passenger', // name of Source model
                'fk_type_passenger' // key we want to remove
            ),
            queryInterface.removeColumn(
                'ratings', // name of Source model
                'fk_tour' // key we want to remove
            ),
            queryInterface.removeColumn(
                'ratings', // name of Source model
                'fk_user' // key we want to remove
            ),
            queryInterface.removeColumn(
                'request_cancel_booking', // name of Source model
                'fk_book_tour' // key we want to remove
            ),
            queryInterface.removeColumn(
                'request_cancel_booking', // name of Source model
                'fk_user' // key we want to remove
            ),
        ])
    }
};
