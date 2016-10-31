class CreateMissions < ActiveRecord::Migration
  def change
    create_table :missions do |t|
      t.string :name
      t.string :objective
      t.references :user, index: true, foreign_key: true
      t.integer :admin_id
      t.string :status

      t.timestamps null: false
    end
  end
end
