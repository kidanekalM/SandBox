import matplotlib.pyplot as plt

def DDALine(x1, y1, x2, y2, color='b.'):
    dx = x2 - x1
    dy = y2 - y1

    # Calculate steps required for generating pixels
    steps = abs(dx) if abs(dx) > abs(dy) else abs(dy)

    # Calculate increment in x & y for each step
    Xinc = dx / float(steps)
    Yinc = dy / float(steps)

    x = x1
    y = y1
    for i in range(int(steps) + 1):
        plt.plot(round(x), round(y), color)
        x += Xinc
        y += Yinc

def main():
    x1 = int(input("Enter X1: "))
    y1 = int(input("Enter Y1: "))
    x2 = int(input("Enter X2: "))
    y2 = int(input("Enter Y2: "))
    DDALine(x1, y1, x2, y2)
    plt.gca().set_aspect('equal', adjustable='box')
    plt.show()

if __name__ == "__main__":
    main()
