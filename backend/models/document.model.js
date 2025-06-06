const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Document = sequelize.define('Document', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    document: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    document_type: {
      type: DataTypes.ENUM(
        'user_image', 
        'mark_sheet_10', 
        'mark_sheet_12',
        'aadhar_back_document',
        'aadhar_front_document'
      ),
      allowNull: false,
    },
   
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'users_documents',
    timestamps: true, // Automatically manage `created_at` and `updated_at`
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return Document;
};
