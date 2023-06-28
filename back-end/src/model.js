const sequelize = require("./config");
const { DataTypes } = require("sequelize");

// Define models
const Bucket = sequelize.define("Bucket", {
  bucket_name: { type: DataTypes.STRING, allowNull: false, unique: true },
  max_volume: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  empty_volume: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  exist_balls: {
    type: DataTypes.JSON,
    allowNull: true,
  },
});

const Ball = sequelize.define("Ball", {
  color: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  volume: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

const BallBucket = sequelize.define("BallBucket", {
  ball_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  bucket_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
});

module.exports = { Bucket, Ball, BallBucket };
