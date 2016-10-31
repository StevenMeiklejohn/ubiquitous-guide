class CreateCharacters < ActiveRecord::Migration
  def change
    create_table :characters do |t|
      t.string :name
      t.string :species
      t.string :catchphrase
      t.references :show, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
