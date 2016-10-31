class CreateMissions < ActiveRecord::Migration
  def change
    create_table :missions do |t|
      t.string :name
      t.string :objective
      t.references :user_id, index: true, foreign_key: true
      t.string :User_id

      t.timestamps null: false
    end
  end
end
