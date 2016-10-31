class CreateGigs < ActiveRecord::Migration
  def change
    create_table :gigs do |t|
      t.integer :price
      t.datetime :date
      t.references :artist, index: true, foreign_key: true
      t.references :venue, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
