import sympy as sp

def solve_equations(size):
    vars = sp.symbols(f'{"".join(f"x{1}{j} " for j in range(1, size+1))}')
    equations = [F(size+1, k) for k in range(1, size+1)]
    soln = sp.solve(equations, vars, binary=True)
    return soln

def F(m, k):
    if m == 1:
        return vars[k-1]
    else:
        return F(m-1, k) ^ F(m-1, k-1) ^ F(m-1, k+1)