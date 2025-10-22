# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)
#   rubocop:disable Layout/LineLength

if Rails.env.development?
  user_to_destroy = User.find_by(email: 'testuser@test.com')

  if user_to_destroy
    user_to_destroy.dreams.destroy_all
    user_to_destroy.destroy
  end

  user1 = User.create!(email: 'testuser@test.com', password: 'Testuser1!', password_confirmation: 'Testuser1!', confirmed_at: Time.now - 1.day)
  User.create!(email: 'testuser2@test.com', password: 'Testuser2!', password_confirmation: 'Testuser2!', confirmed_at: Time.now - 1.day)

  dream_description1 = 'I had a dream while sleeping, it involved something crazy'
  dream_description2 = 'I was in the woods walking along a path, it was a bright sunny day. Then bear started to chase me'
  dream_description3 = 'A zombie apocalypse just broke out while I was shopping for groceries. I threw a can of peeled tomatoes at a zombie that was coming down the aisle towards me and then ran for it'
  dream_description4 = 'Driving down a long stretch of highway and decided to stop off at the next exit to get some food. I pulled off and went to the drive through. When I got to the window, a T-rex was standing there waiting to give me the food'
  dream_description5 = 'I was playing Mount and Blade Warband multiplayer. I was climbing up a ladder with my axe and shield in hand, ready to start swinging at the top.'
  dream_description6 = 'I was flying over this long winding river with a flock of other people who could all apparently fly as well. I landed in the river on the other side of some trees and turned into a crab and started scuttling along the river bank.'
  dream_description7 = 'I was walking through a museum where all the paintings were animated. One portrait winked at me and whispered, "You are late." Suddenly, the walls melted into a forest and I was holding a lantern made of glass feathers.'
  dream_description8 = 'I was on a train that never stopped. Each car was themed differently—one was a jungle, another a library with floating books, and one was filled with mirrors that didnt reflect me but showed scenes from my childhood.'
  dream_description9 = 'I was baking a cake in a kitchen that kept shifting locations. One moment I was in a cozy cabin, the next I was on a boat in the middle of a storm. The cake kept changing flavors every time I looked away—chocolate, then lemon, then something glowing and blue.'
  dream_description10 = 'I was attending a lecture in a massive amphitheater carved into the side of a mountain. The professor was a talking owl wearing a tweed jacket, explaining quantum mechanics using floating holograms of dancing particles. Suddenly, the mountain cracked open and revealed a hidden city inside, where everyone communicated through musical notes. I wandered into a library made of crystal and opened a book that played back one of my forgotten memories like a movie. As I tried to leave, the owl stopped me and said, "You havent asked the right question yet."'

  create_for_days = [-5, -4, -3, -2, -1, 0]
  dreams_hours = [0, 1.1, 2.2, 3.3, 4.4, 5.5, 20.6, 21.7, 22.8, 23.9]

  dreams_descriptions = [
    dream_description1,
    dream_description2,
    dream_description3,
    dream_description4,
    dream_description5,
    dream_description6,
    dream_description7,
    dream_description8,
    dream_description9,
    dream_description10
  ]

  create_for_days.each do |num|
    rand(1..10).times do
      rand_dream = rand(0..9)
      rand_hour = rand(0..9)
      new_dream = Dream.new(
        body: dreams_descriptions[rand_dream],
        user_id: user1.id
      )
      new_other_month_dream = Dream.new(
        body: dreams_descriptions[rand_dream],
        user_id: user1.id
      )

      new_dream.dreamed_at = DateTime.new(DateTime.now.year, DateTime.now.month, DateTime.now.day, dreams_hours[rand_hour]) + num.day
      new_dream.save!

      new_other_month_dream.dreamed_at = DateTime.new(DateTime.now.year, rand(1..DateTime.now.month), DateTime.now.day, dreams_hours[rand_hour]) + num.day
      new_other_month_dream.save!
    end
  end
end
# rubocop:enable Layout/LineLength
