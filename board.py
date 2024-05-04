import numpy as np

class Board:
    def __init__(self, size):
        self.size = size
        self.board = np.zeros((size, size), dtype=int)

    def toggle_square(self, row, col):
        self.board[row, col] = 1 - self.board[row, col]
        if row > 0:
            self.board[row-1, col] = 1 - self.board[row-1, col]
        if row < self.size - 1:
            self.board[row+1, col] = 1 - self.board[row+1, col]
        if col > 0:
            self.board[row, col-1] = 1 - self.board[row, col-1]
        if col < self.size - 1:
            self.board[row, col+1] = 1 - self.board[row, col+1]

    def is_solved(self):
        return np.all(self.board == 1)

    def reset(self):
        self.board = np.zeros((self.size, self.size), dtype=int)