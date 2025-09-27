class AddDreamedAtToDreams < ActiveRecord::Migration[7.0]
  def change
    add_column :dreams, :dreamed_at, :datetime, null: false
  end
end
