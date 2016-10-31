class CreateAccounts < ActiveRecord::Migration
  def change
    create_table :accounts do |t|
      t.string :acc_type
      t.integer :balance
      t.integer :user_id

      t.timestamps null: false
    end
  end
end
