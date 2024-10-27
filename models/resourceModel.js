'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Resource extends Model {
    static associate(models) {
    }
  }

  Resource.init({
    paintype: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        this.setDataValue('paintype', value.trim());
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        this.setDataValue('title', value.trim());
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    imglink: {
      type: DataTypes.STRING,
      allowNull: true
    },
    videolink: {
      type: DataTypes.STRING,
      allowNull: true
    },
    downloadlinks: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    weblinks: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Resource'
  });

  return Resource;
};
