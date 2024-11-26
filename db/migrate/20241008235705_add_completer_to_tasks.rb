class AddCompleterToTasks < ActiveRecord::Migration[7.2]
  def change
    add_reference :tasks, :completer, foreign_key: { to_table: :users }
  end
end
