class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :confirmable, :lockable

  has_many :dreams, dependent: :destroy

  validate :password_complexity

  def dreams_from_year(year)
    dreams.where(dreamed_at: Date.new(year, 1, 1).beginning_of_year..Date.new(year, 12, 31).end_of_year)
  end

  private

  def password_complexity
    return if password.blank? || password =~ /(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/

    errors.add :password, 'Password must contain: 1 uppercase, 1 lowercase, 1 digit and 1 special character'
  end
end
