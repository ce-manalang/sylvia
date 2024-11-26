class AddTeamsToApplication < ActiveRecord::Migration[7.2]
  def change
    add_reference :users, :team, foreign_key: true, null: false
    add_reference :lists, :team, foreign_key: true, null: false
  end
end
