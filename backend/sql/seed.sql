-- Seed data for Deeplyy Dating App
-- Password for all seed users: "password123" (bcrypt hash)

INSERT INTO users (id, email, password_hash, name, age, bio, gender, location, photos, interests, is_premium, is_online) VALUES
('a1111111-1111-1111-1111-111111111111', 'sophia@test.com', '$2b$10$onwBLC9.gLuIZClRQWKWz..B0r34/g40RiCfa/bl6uLarMYm2Smu2', 'Sophia', 25, 'Adventure seeker ☕ Coffee addict 🐶 Love dogs ', 'female', 'Istanbul', ARRAY['https://ui-avatars.com/api/?name=Sophia&background=FF6B6B&color=fff&size=400'], ARRAY['Travel', 'Coffee', 'Dogs', 'Photography'], false, true),
('a2222222-2222-2222-2222-222222222222', 'emma@test.com', '$2b$10$onwBLC9.gLuIZClRQWKWz..B0r34/g40RiCfa/bl6uLarMYm2Smu2', 'Emma', 23, 'Yoga lover 🏖️ Beach vibes 🎨 Artist at heart ', 'female', 'Ankara', ARRAY['https://ui-avatars.com/api/?name=Emma&background=A855F7&color=fff&size=400'], ARRAY['Yoga', 'Beach', 'Art', 'Wine'], true, true),
('a3333333-3333-3333-3333-333333333333', 'olivia@test.com', '$2b$10$onwBLC9.gLuIZClRQWKWz..B0r34/g40RiCfa/bl6uLarMYm2Smu2', 'Olivia', 27, 'Music is my therapy 🏋️ Gym rat 🍳 Foodie ', 'female', 'Izmir', ARRAY['https://ui-avatars.com/api/?name=Olivia&background=38BDF8&color=fff&size=400'], ARRAY['Music', 'Fitness', 'Cooking', 'Podcasts'], false, false),
('a4444444-4444-4444-4444-444444444444', 'ava@test.com', '$2b$10$onwBLC9.gLuIZClRQWKWz..B0r34/g40RiCfa/bl6uLarMYm2Smu2', 'Ava', 24, 'Cat mom 📚 Bookworm 🎬 Netflix addict ', 'female', 'Bursa', ARRAY['https://ui-avatars.com/api/?name=Ava&background=4ADE80&color=fff&size=400'], ARRAY['Cats', 'Reading', 'Movies', 'Coffee'], false, true),
('a5555555-5555-5555-5555-555555555555', 'isabella@test.com', '$2b$10$onwBLC9.gLuIZClRQWKWz..B0r34/g40RiCfa/bl6uLarMYm2Smu2', 'Isabella', 26, 'Dancing through life 🍷 Wine lover ✈️ Travel bug ', 'female', 'Antalya', ARRAY['https://ui-avatars.com/api/?name=Isabella&background=FBBF24&color=fff&size=400'], ARRAY['Dancing', 'Wine', 'Travel', 'Festivals'], true, false),
('a6666666-6666-6666-6666-666666666666', 'mia@test.com', '$2b$10$onwBLC9.gLuIZClRQWKWz..B0r34/g40RiCfa/bl6uLarMYm2Smu2', 'Mia', 22, 'Surfer girl 🎡 Festival lover 🌸 Free spirit ', 'female', 'Bodrum', ARRAY['https://ui-avatars.com/api/?name=Mia&background=F472B6&color=fff&size=400'], ARRAY['Surfing', 'Festivals', 'Vegan', 'Music'], false, true),
('a7777777-7777-7777-7777-777777777777', 'charlotte@test.com', '$2b$10$onwBLC9.gLuIZClRQWKWz..B0r34/g40RiCfa/bl6uLarMYm2Smu2', 'Charlotte', 28, 'Hiking enthusiast 🐕 Dog person 🎮 Gamer ', 'female', 'Istanbul', ARRAY['https://ui-avatars.com/api/?name=Charlotte&background=818CF8&color=fff&size=400'], ARRAY['Hiking', 'Dogs', 'Gaming', 'Sports'], false, true),
('a8888888-8888-8888-8888-888888888888', 'luna@test.com', '$2b$10$onwBLC9.gLuIZClRQWKWz..B0r34/g40RiCfa/bl6uLarMYm2Smu2', 'Luna', 21, 'Guitar player 📸 Photo lover ☕ Coffee snob ', 'female', 'Istanbul', ARRAY['https://ui-avatars.com/api/?name=Luna&background=34D399&color=fff&size=400'], ARRAY['Guitar', 'Photography', 'Coffee', 'Art'], false, false)
ON CONFLICT (id) DO UPDATE SET 
    email = EXCLUDED.email,
    password_hash = EXCLUDED.password_hash,
    name = EXCLUDED.name,
    age = EXCLUDED.age,
    bio = EXCLUDED.bio,
    gender = EXCLUDED.gender,
    location = EXCLUDED.location,
    photos = EXCLUDED.photos,
    interests = EXCLUDED.interests,
    is_premium = EXCLUDED.is_premium,
    is_online = EXCLUDED.is_online;

-- Some seed swipes (these users liked the test user)
-- Will be populated when a test user registers and others "like" them
