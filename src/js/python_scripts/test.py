import sys

# print(len(sys.argv))
# print(sys.argv[1])
# print("hello world")

# def saySth():
#     return sys.argv[1]

# saySth()

f = open(sys.argv[1], 'r')
for line in f:
    print(line)