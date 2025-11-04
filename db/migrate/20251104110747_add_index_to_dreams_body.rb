class AddIndexToDreamsBody < ActiveRecord::Migration[7.0]
  def change
    add_index :dreams, :body
  end
end
