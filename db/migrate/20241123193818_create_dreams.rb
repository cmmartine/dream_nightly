class CreateDreams < ActiveRecord::Migration[7.0]
  def change
    create_table :dreams do |t|
      t.references :user, null: false, foreign_key: true
      t.text :body
      t.text :ai_interpretation
      t.boolean :lucid

      t.timestamps
    end
  end
end
