class Cell:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __eq__(self, other):
        return self.x == other.x and self.y == other.y

    def __hash__(self):
        return hash((self.x, self.y))

    def __str__(self):
        return f"({self.x}, {self.y})"

    def __repr__(self):
        return f"Cell({self.x}, {self.y})"

class Maze:
    def __init__(self, filename):
        with open(filename, 'r') as f:
            self.maze = [[char for char in line.strip()] for line in f.readlines()]
            self.start = None
            self.end = None
            self.doors = {}
            self.keys = {}
            for i, row in enumerate(self.maze):
                for j, char in enumerate(row):
                    if char == '@':
                        self.start = Cell(i, j)
                    elif char == '*':
                        self.end = Cell(i, j)
                    elif char.isalpha():
                        if char.isupper():
                            self.doors[char] = Cell(i, j)
                        elif char.islower():
                            self.keys[char] = Cell(i, j)

    def is_valid(self, cell, keys):
        if cell.x < 0 or cell.x >= len(self.maze) or cell.y < 0 or cell.y >= len(self.maze[0]):
            return False
        char = self.maze[cell.x][cell.y]
        if char == '#':
            return False
        if char.isupper() and char.lower() not in keys:
            return False
        return True

    def get_neighbors(self, cell):
        return [
            Cell(cell.x + 1, cell.y),
            Cell(cell.x - 1, cell.y),
            Cell(cell.x, cell.y + 1),
            Cell(cell.x, cell.y - 1)
        ]

    def solve(self):
        queue = [(self.start, set(), [])]
        visited = set()

        while queue:
            current, keys, path = queue.pop(0)

            if current == self.end:
                return path

            state = (current, frozenset(keys))
            if state in visited:
                continue
            visited.add(state)

            for neighbor in self.get_neighbors(current):
                if self.is_valid(neighbor, keys):
                    new_keys = keys.copy()
                    char = self.maze[neighbor.x][neighbor.y]
                    if char.islower():
                        new_keys.add(char)

                    # Direction of movement
                    if neighbor.x > current.x:
                        direction = 'D'
                    elif neighbor.x < current.x:
                        direction = 'U'
                    elif neighbor.y > current.y:
                        direction = 'R'
                    else:
                        direction = 'L'

                    new_path = path + [direction]
                    queue.append((neighbor, new_keys, new_path))

        return None
