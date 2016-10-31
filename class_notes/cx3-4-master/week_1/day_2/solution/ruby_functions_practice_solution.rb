def return_10()
  return 10
end

def add(first_number,second_number)
  first_number + second_number
end

def subtract(first_number,second_number)
  first_number - second_number
end

def multiply(first_number,second_number)
  first_number * second_number
end

def divide(first_number,second_number)
  first_number / second_number
end

def length_of_string(input_string)
  input_string.length
end

def join_string(string_1, string_2)
  string_1 + string_2
end

def add_string_as_number(string_1, string_2)
  string_1.to_i + string_2.to_i
end

def number_to_full_month_name(number)
  month_name = ""
  case number
    when 1
      month_name = "January"
    when 3
      month_name = "March"
    when 9
      month_name = "September"
  end
  month_name
end

def number_to_short_month_name(number)
  number_to_full_month_name(number).slice(0,3)
end

def volume_of_cube(length_of_side)
  length_of_side ** 3
end

def volume_of_sphere(radius)
  (4.0 / 3.0) * Math::PI * (radius ** 3)
end

require 'date'
def days_to_christmas
  today = Date.today
  christmas = Date.new(today.year, 12, 25)
  sleeps = (christmas - today).to_i
end

def age_of_person(date_of_birth_string)
  date_of_birth = Date.parse(date_of_birth_string)
  today = Date.today
  age = today.year - date_of_birth.year
  birthday_has_passed = today.month > date_of_birth.month || ( today.month == date_of_birth.month && date_of_birth.day > today.day )
  age -= 1 unless birthday_has_passed
  age
end