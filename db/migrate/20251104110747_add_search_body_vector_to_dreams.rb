class AddSearchBodyVectorToDreams < ActiveRecord::Migration[7.0]
  def up
    add_column :dreams, :search_body_vector, :tsvector
    add_index :dreams, :search_body_vector, using: :gin
  end

  def down
    remove_index :dreams, :search_body_vector
    remove_column :dreams, :search_body_vector
  end
end
