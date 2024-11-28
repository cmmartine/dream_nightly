# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)
#   rubocop:disable Layout/LineLength
user1 = User.create!(email: 'testuser@test.com', password: 'Testuser1!', password_confirmation: 'Testuser1!')

dream_description1 = 'I had a dream while sleeping, it involved something crazy'
dream_description2 = 'I was in the woods walking along a path, it was a bright sunny day. Then bear started to chase me'
dream_description3 = 'A zombie apocalypse just broke out while I was shopping for groceries. I threw a can of peeled tomatoes at a zombie that was coming down the aisle towards me and then ran for it'
dream_description4 = 'Driving down a long stretch of highway and decided to stop off at the next exit to get some food. I pulled off and went to the drive through. When I got to the window, a T-rex was standing there waiting to give me the food'
dream_description5 = 'I was playing Mount and Blade Warband multiplayer. I was climbing up a ladder with my axe and shield in hand, ready to start swinging at the top.'
dream_description6 = 'I was flying over this long winding river with a flock of other people who could all apparently fly as well. I landed in the river on the other side of some trees and turned into a crab and started scuttling along the river bank.'

Dream.create!(body: dream_description1, user_id: user1.id, created_at: Time.now - 1.day)
Dream.create!(body: dream_description2, user_id: user1.id, created_at: Time.now - 1.day)
Dream.create!(body: dream_description3, user_id: user1.id)
Dream.create!(body: dream_description4, user_id: user1.id)
Dream.create!(body: dream_description5, user_id: user1.id, created_at: Time.now + 1.day)
Dream.create!(body: dream_description6, user_id: user1.id, created_at: Time.now + 1.day)
#   rubocop:enable Layout/LineLength
