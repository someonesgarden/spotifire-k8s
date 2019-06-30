const Sequelize = require('sequelize');
const keys = require('../../../keys');
const sequelize = new Sequelize(keys.mysqlDatabase,keys.mysqlUser,keys.mysqlPassword,
    {
        host:keys.mysqlHost,
        dialect:'mysql'
    });

const Lyrics = sequelize.define('lyrics', {
    id         : { field: 'id',         type: Sequelize.INTEGER(11),   primaryKey:true, autoIncrement: true  }, // INT(11)      NOT NULL  PRIMARY KEY  AUTO_INCREMENT
    artist     : { field: 'artist' ,    type: Sequelize.STRING(100),   allowNull: false                      }, // VARCHAR(100) NOT NULL
    song       : { field: 'song' ,      type: Sequelize.STRING(100),   allowNull: false                      }, // VARCHAR(100) NOT NULL
    type       : { field: 'type' ,      type: Sequelize.STRING(10),    allowNull: false                      }, // VARCHAR(100) NOT NULL
    thumb      : { field: 'thumb' ,     type: Sequelize.STRING(255)                                          }, // VARCHAR(100) NOT NULL
    link       : { field: 'link' ,      type: Sequelize.STRING(125)                                          }, // VARCHAR(100) NOT NULL
    isrc       : { field: 'isrc' ,      type: Sequelize.STRING(30)                                           }, // VARCHAR(100) NOT NULL
    spotifyid  : { field: 'spotifyid',  type: Sequelize.STRING(30)                                           }, // VARCHAR(100) NOT NULL
    spotifytype: { field: 'spotifytype',type: Sequelize.STRING(10)                                           }, // VARCHAR(100) NOT NULL
    lyrics     : { field: 'lyrics',     type: Sequelize.STRING(500)                                          }, // VARCHAR(500) DEFAULT NULL
    morphs     : { field: 'morphs',     type: Sequelize.STRING(500)                                          }, // VARCHAR(500) DEFAULT NULL
    createdAt  : { field: 'created_at', type: Sequelize.DATE                                                 }, // DATETIME     NOT NULL  DEFAULT CURRENT_TIMESTAMP
    updatedAt  : { field: 'updated_at', type: Sequelize.DATE                                                 }  // DATETIME     NOT NULL  DEFAULT CURRENT_TIMESTAMP  ON UPDATE CURRENT_TIMESTAMP
});

module.exports = {
    Lyrics:Lyrics
}
