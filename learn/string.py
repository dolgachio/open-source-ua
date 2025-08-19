#!/usr/bin/env python3

print("""
      I am many years old.
      Or am I?
      """)

upper = 'upper'
lower = 'lower'
good_boy = 'good boy'
are_we_chars = 'are_we_chars'
some_string = 'some_string'

print(upper, upper.upper())
print(lower, lower.lower())
print(good_boy, good_boy.title())
print(are_we_chars, are_we_chars.isalpha())
print(len([1, 2, 3]))
print(len('some string with mane vars'))

some_string.lower()
some_string.islower()
some_string.upper()
some_string.isupper()
some_string.isalpha()
some_string.isalnum()

some_string.startswith('some')
some_string.endswith('pupupu')

print('bool', bool(-1))

splitter = some_string.split('_')

print(splitter)
