import numpy as np

N = 5  # Dimension of the grid

def construct_matrix(N):
    # Create an N*N x N*N matrix
    A = np.zeros((N*N, N*N), dtype=int)
    
    for row in range(N):
        for col in range(N):
            # Calculate the index in the matrix
            index = row * N + col
            
            # Affect itself
            A[index, index] = 1
            
            # Affect neighbors
            if row > 0:    # Up
                A[index, index - N] = 1
            if row < N-1:  # Down
                A[index, index + N] = 1
            if col > 0:    # Left
                A[index, index - 1] = 1
            if col < N-1:  # Right
                A[index, index + 1] = 1

    return A

def mod2_gaussian_elimination(A, b):
    A = np.copy(A)
    b = np.copy(b)
    n = len(b)

    for i in range(n):
        # Make A[i, i] = 1
        if A[i, i] == 0:
            # Find a row j > i to swap with
            for j in range(i+1, n):
                if A[j, i] == 1:
                    A[[i, j]] = A[[j, i]]  # Swap rows
                    b[i], b[j] = b[j], b[i]
                    break
        
        # Eliminate all other 1s in this column
        for j in range(n):
            if j != i and A[j, i] == 1:
                A[j] = (A[j] + A[i]) % 2
                b[j] = (b[j] + b[i]) % 2

    return b  # This is now the solution vector

# Main
A = construct_matrix(N)
b = np.ones(N*N, dtype=int)  # Target state vector (all 1s)
solution = mod2_gaussian_elimination(A, b)

print("Solution (click pattern):")
print(solution.reshape((N, N)))
