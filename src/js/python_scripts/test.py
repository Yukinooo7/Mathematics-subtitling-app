import sys

# print(len(sys.argv))
# print(sys.argv[1])
# print("hello world")

# def saySth():
#     return sys.argv[1]

# saySth()
print(sys.argv)
f = open(sys.argv[1], 'r')
# print(f)
for line in f:
    print(line)