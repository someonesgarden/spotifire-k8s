const Sequelize = require('sequelize');
const keys = require('../../../keys');
const sequelize = new Sequelize(keys.mysqlDatabase,keys.mysqlUser,keys.mysqlPassword,
    {
        host:keys.mysqlHost,
        dialect:'mysql'
    });

const Initials = sequelize.define('initials', {
    id         : { field: 'id',         type: Sequelize.INTEGER(11),    primaryKey:true, autoIncrement: true  }, // INT(11)      NOT NULL  PRIMARY KEY  AUTO_INCREMENT
    initial    : { field: 'initial' ,    type: Sequelize.STRING(5),     allowNull: false                      }, // VARCHAR(5) NOT NULL
    spotifyids : { field: 'spotifyids' , type: Sequelize.STRING(500),   allowNull: false                      }, // TEXT NOT NULL
    createdAt  : { field: 'created_at', type: Sequelize.DATE                                                 }, // DATETIME     NOT NULL  DEFAULT CURRENT_TIMESTAMP
    updatedAt  : { field: 'updated_at', type: Sequelize.DATE                                                 }  // DATETIME     NOT NULL  DEFAULT CURRENT_TIMESTAMP  ON UPDATE CURRENT_TIMESTAMP
});

module.exports = {
    Initials:Initials
}
