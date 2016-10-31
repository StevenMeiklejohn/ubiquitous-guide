class CreateShows < ActiveRecord::Migration
  def change
    create_table :shows do |t|
      t.string :name
      t.integer :year
      t.string :location
      t.string :image

      t.timestamps null: false
    end
  end
end
