import random

def generate():
    code = ""
    for i in range(6):
        num = random.randint(0, 9)
        code += str(num)
    return code
