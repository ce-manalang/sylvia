# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end
team = Team.create(name: "SR Team")

User.create(
  first_name: Faker::Name.first_name,
  last_name: Faker::Name.last_name,
  email: "user@example.com",
  password: "password",
  password_confirmation: "password",
  team: team
)

users = 5.times.map do
  User.create(
    first_name: Faker::Name.first_name,
    last_name: Faker::Name.last_name,
    email: Faker::Internet.email,
    password: "password",
    password_confirmation: "password",
    team: team
  )
end

list = List.create(name: Faker::Hipster.sentence, team: team)

tasks = 5.times.map do 
  completed = Faker::Boolean.boolean(true_ratio: 0.2)
  list.tasks.create(
    creator: users.sample,
    name: Faker::Hipster.sentence,
    completed_at: completed ? Time.current : nil,
    completer: completed ? users.sample : nil
  )
end

10.times do
  Comment.create(user: users.sample, commentable: tasks.sample, body: Faker::Hipster.paragraph)
end