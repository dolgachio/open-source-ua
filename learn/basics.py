#!/usr/bin/env python3
"""
Here I will learn and test my scripts.
"""

print('Hello, World!')

"""
Function definition
"""
def func():
    return 42
print(func())


"""Varriables definition"""
name = 'Stan'
type(name) == str
isinstance(name, str)
int
float
bool
dict
list

my_age = int('20')
print(f"this is an age: {my_age}")
print(isinstance(my_age, bool))

"""Operators"""
age = 8
age += 8
print('age',  age)

a = 5
b = 7
string_value = 'hey, I am a string'

a == b
b != a
a < b
b > a
a <= b
b >= a

"""Logical operators"""
is_admin = True
is_authorized = False

if (is_admin and is_authorized):
    print('I am an authorized admin')
elif (is_authorized): 
    print('test')
else: 
    print('no I am not')


if is_admin or is_authorized:
    print('you are good')
    
if not is_authorized:
    print('something')

print(is_authorized or [1, 2, 3])
print(age and [5, 6, 7])

def is_adult(age):
    return True if age > 18 else False
