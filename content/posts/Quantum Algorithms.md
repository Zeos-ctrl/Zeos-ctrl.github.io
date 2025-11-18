---
tags:
  - quantum
  - algorithms
---
# Introduction to Quantum Computing

Recently I picked up a textbook in Quantum Machine learning with python as it sounded interesting, and after finishing my Msc in Physics i felt like now was the time to get into it. In the textbook the author introduces the "Qubit", a probabilistic bit that can be either a 1, 0 or a superposition between the two. Think of Schrodinger cat; The cat is either alive or dead, but until you open the box it is in a mixture of the two states. These quantum effects are what give us the phenomena of the double slit experiment where electrons can seem to go through both holes at once and there is a great video explaining this by Veritasium on YouTube (https://www.youtube.com/watch?v=qJZ1Ez28C-A).

Quantum computing has been a field of research for many years, with The first experimental quantum computer was a 2-qubit nuclear magnetic resonance (NMR) device created in 1998, which demonstrated the feasibility of quantum computation by solving Deutsch's problem (well get to this problem later). Since then companies Google have created quantum hardware using superconductivity which requires a massive setup that is cooled to sub-zero to achieve 105 Qubits (https://blog.google/technology/research/google-willow-quantum-chip/).

We are still many years away from having these systems in your home, and they are mainly useful for a small number of tasks as they are non-deterministic. If you give the system the same input, due to the very randomness of quantum mechanics, you are very unlikely to get the same output. Due to how they compute values however, we get an effect called quantum parallelisation.

In quantum parallelisation, a function is effectively evaluated over many possible inputs at once, because the quantum state of the system can represent a superposition of all those inputs simultaneously. Instead of checking each possibility one at a time, as a classical computer must, the quantum system evolves in a way that encodes information about all possibilities in a single operation. This gives us a probability distribution over the output of the function.

The catch is that when we finally measure the system, the superposition collapses, and we only observe one outcome. The art of quantum algorithm design is figuring out how to manipulate the system so that the correct or useful answers are much more likely to appear when measurement happens.

While this kind of computation doesn’t give us “infinite speed,” it does offer speedups for very specific classes of problems, particularly those involving search, optimisation, and simulation of quantum systems themselves. In chapter 3 of the text book, we are introduced to a suite of quantum algorithms that exploit the non-deterministic nature of quantum computing to solve functions.

There are two main libraries set up to simulate quantum computing logic as we can't just go out to the shop to buy our own quantum chip set. The first library, and the one I will be coding in the most, is **Cirq** from Google (https://quantumai.google/cirq) and the second is **Qiskit** from IBM (https://www.ibm.com/quantum/qiskit). The textbook came out in 2021 and since then these libraries have changes, as such some of these coding examples won't be the same as in the book as they needed to be updated.

# Simulation of a Hadamard Gate

The first circuit is a simple Hadamard gate to put a single qubit into a superposition. In Cirq the Hadamard gate is denoted with the function **H**. What this circuit does, is we initalise a Qubit in the state $\ket{0}$ and after going through the gate it has both states 0 and 1. After we run a measurement on the superposition, we force it into either the 1 state or the 0 state.

```python
# Import the Cirq package
import cirq
# Define a Qubit
qubit = cirq.GridQubit(0,0)

# Create a Circuit in cirq
circuit = cirq.Circuit([cirq.H(qubit),
						cirq.measure(qubit,key='m')])
print("Circuit Follows")
print(circuit)
sim = cirq.Simulator()
output = sim.run(circuit, repetitions=100)
print("Measurement Output:")
print(output)
print("Histogram stats follow")
print(output.histogram(key='m'))
```

Output:

```shell
Circuit Follows
(0, 0): ───H───M('m')───
Measurement Output:
m=1110000111010001111111111000001001010000111001111110001000100110011000011110110010100111101101110101
Histogram stats follow
Counter({1: 54, 0: 46})
```

Qiskit  stands for Quantum Information Science Kit and has 4 main components in its quantum computing stack.

1. *Qiskit Terra*: This provides all the essential components for building quantum circuits.
2. *Qiskit Aer*: This is for the development of noise models for simulating realistic noisy simulations that can occur in real quantum computing devices. This also provides a C++ simulator framework.
3. *Qiskit Ignis*: This is a framework for analysing and minimising noise in quantum circuits.
4. *Qiskit Agua*: This contains cross-domain algorithms and logic to run these algorithms on a quantum real device or simulator.
We can create the same program in this framework:


```python
import numpy as np
from qiskit import QuantumCircuit
from qiskit_aer import Aer
from qiskit.visualization import plot_histogram

# Use Aer's simulator
simulator = Aer.get_backend('aer_simulator')

# Create a Quantum Circuit with 1 qubit and 1 classical bit
circuit = QuantumCircuit(1, 1)

# Add a Hadamard gate on qubit 0
circuit.h(0)

# Measure qubit 0 into classical bit 0
circuit.measure(0, 0)

# Execute the circuit
job = simulator.run(circuit, shots=100)

# Get the results
result = job.result()

# Extract counts
counts = result.get_counts()
print(f"\nTotal count for 0 and 1 are: {counts}")

# Draw the circuit
print(circuit.draw(output='text'))

# Plot histogram
plot_histogram(counts).show()
```

Output

```shell
Total count for 0 and 1 are: {'1': 58, '0': 42}
     ┌───┐┌─┐
  q: ┤ H ├┤M├
     └───┘└╥┘
c: 1/══════╩═
           0
```

As you can see, the outputs of each program give us around a 50/50 split of 1's and 0s. This means the qubit we created in a basis state of 0, after measurement had a 50/50 chance of flipping. It should be noted with more simulations, this number would grow closer to a true 50/50 split, instead of a 58/42 split for Qiskit.

The Hadamard transformation is a fundamental building block of quantum computing and will be used in every single following example. Take your time to look over the syntax of the code above to get a feel for how the circuit is initialised and the journey of the qubit through the system.

# Bell State Creation and Measurement

The Bell State is a mechanism to cause entanglement between two Qubits, which means when they are in a superposition if we measure Qubit A as a 1 then we know Qubits B is also a 1. This is one of four possible Bell states;

| Bell State | Name | Circuit | Mathematical Form | Measurement Correlations |
|------------|------|---------|-------------------|-------------------------|
| \|Φ⁺⟩ | Phi Plus | H on q₀, then CNOT(q₀,q₁) | $\frac{1}{\sqrt{2}}(\|00\rangle + \|11\rangle)$ | Both qubits always match: 00 or 11 |
| \|Φ⁻⟩ | Phi Minus | H on q₀, CNOT(q₀,q₁), then Z on q₀ | $\frac{1}{\sqrt{2}}(\|00\rangle - \|11\rangle)$ | Both qubits always match: 00 or 11 |
| \|Ψ⁺⟩ | Psi Plus | H on q₀, CNOT(q₀,q₁), then X on q₁ | $\frac{1}{\sqrt{2}}(\|01\rangle + \|10\rangle)$ | Qubits always opposite: 01 or 10 |
| \|Ψ⁻⟩ | Psi Minus | H on q₀, CNOT(q₀,q₁), then X on q₁, then Z on q₀ | $\frac{1}{\sqrt{2}}(\|01\rangle - \|10\rangle)$ | Qubits always opposite: 01 or 10 |

The Bell State was named after John Bells 1964 theorem which proved that quantum entanglement produces correlations that can't be explained by classical physics.

In the following we create the Bell state by first applying the Hadamard transform H on the qubit A initialised in state $\ket{\psi_A}=\ket{0}$ to create the superposition state $\ket{\psi}_A=\dfrac{1}{\sqrt{2}}(\ket{0}+\ket{1})$ followed by applying the controlled NOT gate (CNOT) on qubit B initialised at state $\ket{\psi}_B = \ket{0}$ based on qubit A as the control bit.


```python
import cirq
# Define the two qubits using LineQubit
q_register = [cirq.LineQubit(i) for i in range(2)]
# Define the Cirquit with a Hadamard gate on the qubit 0 followed by the CNOT
# operation
cirquit = cirq.Circuit([cirq.H(q_register[0]), cirq.CNOT(q_register[0], q_register[1])])
# Measure both the qubits
cirquit.append(cirq.measure(*q_register,key='z'))
print("Circuit")
print(cirquit)
# Define the simulator
sim = cirq.Simulator()
# Simulate the cirquit for 100 iterations
output = sim.run(cirquit, repetitions=100)
print("Measurement Output")
print(output.histogram(key='z'))
```

Output:

```shell
Circuit
0: ───H───@───M('z')───
          │   │
1: ───────X───M────────
Measurement Output
Counter({0: 51, 3: 49})
```

In Qiskit:

```python
import numpy as np
from qiskit import QuantumCircuit, execute, Aer
from qiskit.visualization import plot_histogram

# Use AER's qasm_simulator
simulator = Aer.get_backend('qasm_simulator')

# Create a Quantum Circuit acting on the q register
circuit = QuantumCircuit(2,2)

# Add a H gate on qubit 0
circuit.h(0)

# Add a CX gate on control qubit 0 and target qubit 1
circuit.cx(0,1)

# Map the quantum mesurement to the classical bits
circuit.measure([0,1], [0,1])

# Execute the circuit on the qasm simulator
job = execute(circuit, simulator, shots=100)

# Grab results from the job
results = job.result()

# Return counts
counts = result.get_counts(circuit)
print(f"\nTotal count for 00 and 11 are: {counts}")

# Draw the circuit
print(circuit.draw(output='text'))
```

Output:

``` shell
Total count for 00 and 11 are: {'11': 42, '00': 58}
     ┌───┐     ┌─┐   
q_0: ┤ H ├──■──┤M├───
     └───┘┌─┴─┐└╥┘┌─┐
q_1: ─────┤ X ├─╫─┤M├
          └───┘ ║ └╥┘
c: 2/═══════════╩══╩═
                0  1 
```


As we can see, we end up with a near 50/50 spread of entangled particles. If we had 100 particles and not 100 entanglements we know the circuit is incorrect. 

# Quantum Teleportation

Quantum teleportation is the method of transmitting quantum states between a sender and a receiver without any communication channel. In quantum teleportation Alice and Bob get their control bit to share a Bell state through quantum entanglement. The following are the associated steps:

1. Initialise the control qubits Q2 and Q3 to the state $\ket{0}$ and the qubit Q1 to the state $\ket{\psi}$ to be transmitted.
2. Create the bell state $\dfrac{1}{\sqrt{2}}(\ket{00}+\ket{11})$ between Q2 and Q3 by first applying Hadamard transform H on Q2 followed by the CNOT operation on Q3 where Q2 acts as the control bit.
3. Once the Bell state is established between Alice's and Bob's control qubits Q2 and Q3, apply the CNOT operator on Alice's two-qubit Q1 and Q2 where Q1 acts as the control qubit and Q2 acts as the target qubit
4. Apply the Hadamard transform on qubit Q1 followed by measurement of Alice's qubit Q1 and Q2. We denote the measurement states of Q1 and Q2 as M1 and M2.
5. Apply the CNOT operator on Bob's qubit Q3 based on the measured state M2 as the control qubit. Finally, apply the conditional Z operator on Bob's qubit Q3 measured state M1.
6. At this stage, Bob's qubit Q3 has the state $\ket{\psi}$ that Alice has transmitted.

I should add, this isn't literal teleportation, what this circuit does is share a quantum state without telling the other person explicitly what that state is. This also doesn't send information faster than light as we still need to send a classical signal to the other person telling them to take a measurement.


```python
import cirq

def quantum_teleportation(qubit_to_send_op='H',
                         num_copies=100):
    Q1, Q2, Q3 = [cirq.LineQubit(i) for i in range(3)]
    cirquit = cirq.Circuit()
    """
    Q1: Alice State qubit to be sent to Bob
    Q2: Alices control qubit
    Q3: Bobs control qubit

    Set a state for Q1 based on qubit_to_send_op:
    Implemented operators H,X,Y,Z,I
    """

    if qubit_to_send_op == 'H':
        cirquit.append(cirq.H(Q1))
    elif qubit_to_send_op == 'X' or qubit_to_send_op == 'Y':
        cirquit.append(cirq.X(Q1))
    elif qubit_to_send_op == 'I':
        cirquit.append(cirq.I(Q1))
    else:
        raise NotImplementedError("Yet to be implemented.")

    # Entangle Alice and Bobs conterol qubits: Q2 and Q3
    cirquit.append(cirq.H(Q2))
    cirquit.append(cirq.CNOT(Q2, Q3))
    # CNOT Alices data Qubit Q1 with control Qubit Q2
    cirquit.append(cirq.CNOT(Q1, Q2))
    # Transform Alices data with Qubit Q1
    # on +/- basis using Hadamard Transform
    cirquit.append(cirq.H(Q1))
    # Measure Alices qubit Q1 and Q2
    cirquit.append(cirq.measure(Q1, Q2))
    # Do a CNOT on Bobs qubit Q3 using Alices contol qubit Q2 after measurement
    cirquit.append(cirq.CNOT(Q2, Q3))
    # DO a Conditioned Z Operation on Bobs qubit Q3 using Alices control qubit Q1 after measurement
    cirquit.append(cirq.CZ(Q1, Q3))
    # Measure the final transmitted state to Bob in Q3
    cirquit.append(cirq.measure(Q3, key='Z'))
    print("Circuit")
    print(cirquit)
    sim = cirq.Simulator()
    output = sim.run(cirquit, repetitions=num_copies)
    print("Measurement Output")
    print(output.histogram(key='Z'))

quantum_teleportation(qubit_to_send_op='H')
```

Output:

```shell
Circuit
0: ───H───────@───H───M───────@────────────
              │       │       │
1: ───H───@───X───────M───@───┼────────────
          │               │   │
2: ───────X───────────────X───@───M('Z')───
Measurement Output
Counter({1: 52, 0: 48})
```

From the measurement outcome, we see that Alice has transmitted the equal superposition state to Bob.

## Quantum Random Number Generator

Quantum systems are inherently non-deterministic, as such they become better generators for true random numbers as they do not rely on an initial seed. The following is an illustration of a random integer number generator routine using multiple qubits:

1. Determine the number of qubits required to represent the range of integer values to be sampled. For instance, if we have to sample from the eight integer numbers from 0-7, we would require $log_2(8)=3$ qubits.
2. Create an equal superposition state by applying a Hadamard transform on each of the qubits initially in the $\ket{0}$ state. The equal superposition state is given by the following: $$\ket{\psi}=H^{\otimes n}\ket{0}^\otimes=\dfrac{1}{2^{\frac{n}{2}}}\sum_{x=0}^{2^n-1}\ket{x}$$ Here $\ket{x}$ stands for the integer value for the computational basis state.
3. Map the computational basis states to the actual integers and store the mapping in a dictionary. If the range of integral numbers to sample starts from zero, the dictionary from the computational basis state to actual integers can be just the binary to decimal transformation.
4. We can make measurements on the equal superposition state $\ket{\psi}$ and map the measured basis state to the integer value using the dictionary map.

```python
import cirq
import numpy as np

def rng(low=0, high=2**10, m=10):
    """
    :param low: lower bound of numbers to be generated
    :param high: upper bound of numbers to be generated
    :param m: number of random numbers to output
    :return: list of random numbers
    """
    # Determine the number of Qubits required
    q_required = int(np.ceil(np.log2(high-low)))
    print(q_required)
    
    # Define the qubits
    Q_reg = [cirq.LineQubit(c) for c in range(q_required)]
    
    # Define the circuit
    circuit = cirq.Circuit()
    circuit.append([cirq.H(Q_reg[c]) for c in range(q_required)])
    circuit.append(cirq.measure(*Q_reg, key='z'))
    print(circuit)
    
    # Simulate the circuit
    sim = cirq.Simulator()
    
    num_gen = 0
    output = []
    while num_gen < m:
        result = sim.run(circuit, repetitions=1)
        rand_number = result.data['z'][0] + low
        if rand_number < high:
            output.append(rand_number)
            num_gen += 1
    return output

output = rng()
print(output)
```

Output:

```shell
10
0: ───H───M('z')───
          │
1: ───H───M────────
          │
2: ───H───M────────
          │
3: ───H───M────────
          │
4: ───H───M────────
          │
5: ───H───M────────
          │
6: ───H───M────────
          │
7: ───H───M────────
          │
8: ───H───M────────
          │
9: ───H───M────────
[np.int64(536), np.int64(1015), np.int64(564), np.int64(831), np.int64(439), np.int64(576), np.int64(926), np.int64(475), np.int64(386), np.int64(1016)]
```

We are given 10 random numbers as outputs between our upper and lower bounds.

## Deutsch-Jozsa Algorithm

The Deutsch-Jozsa algorithm determines if a function is balanced, meaning the function responds with exactly half of the outputs being a 1 and the other half being a 0, or constant if the function responds with 100% 1s or 0s. This problem was designed to prove that quantum computers could provide an exponential speed-up over their classical, deterministic counterparts.

We are given a black box function, where we cannot see how it works and can only give it an input and receive an output. For this algorithm, we need to create an oracle to evaluate the function. The following code is an example of this algorithm.

```python
import cirq
import numpy as np

def oracle(data_reg, y_reg, circuit, is_balanced=True, oracle_type=0):
    """
    Creates an oracle for the function.
    For balanced: implements a function that outputs 1 for half the inputs
    For constant: implements a function that outputs 0 or 1 for all inputs
    """
    if is_balanced:
        # Example balanced oracle: f(x) = x_0 XOR x_1 (for 2+ qubits)
        # This can be implemented with CNOTs
        for i in range(len(data_reg)):
            circuit.append(cirq.CNOT(data_reg[i], y_reg))
    else:
        # Constant function
        if oracle_type == 1:
            # Constant 1: flip the target
            circuit.append(cirq.X(y_reg))
        # Constant 0: do nothing
    return circuit

def deutsch_jozsa(domain_size: int,
                  func_type_to_simulate: str = "balanced",
                  copies: int = 1):
    """
    Deutsch-Jozsa algorithm implementation
    """
    reqd_num_qubits = int(np.ceil(np.log2(domain_size)))
    data_reg = [cirq.LineQubit(c) for c in range(reqd_num_qubits)]
    y_reg = cirq.LineQubit(reqd_num_qubits)
    
    circuit = cirq.Circuit()
    
    # Prepare target qubit in |-> state
    circuit.append(cirq.X(y_reg))
    circuit.append(cirq.H(y_reg))
    
    # Apply Hadamard to all input qubits
    circuit.append([cirq.H(data_reg[c]) for c in range(reqd_num_qubits)])
    
    # Apply oracle
    if func_type_to_simulate == 'balanced':
        is_balanced = True
    else:
        is_balanced = False
    circuit = oracle(data_reg, y_reg, circuit, is_balanced=is_balanced)
    
    # Apply Hadamard to input qubits again
    circuit.append([cirq.H(data_reg[c]) for c in range(reqd_num_qubits)])
    
    # Measure input qubits
    circuit.append(cirq.measure(*data_reg, key='result'))
    
    print("Circuit Diagram:")
    print(circuit)
    
    # Run simulation
    sim = cirq.Simulator()
    result = sim.run(circuit, repetitions=copies)
    
    # Interpret results
    measurements = result.measurements['result']
    all_zeros = np.all(measurements == 0)
    
    print(f"Measurements: {result.histogram(key='result')}")
    if all_zeros:
        print("Result: CONSTANT function")
    else:
        print("Result: BALANCED function")
    
    return all_zeros  # True if constant, False if balanced

print("Execute Deutsch-Jozsa for a Balanced Function:")
deutsch_jozsa(domain_size=4, func_type_to_simulate='balanced', copies=1000)
print("\nExecute Deutsch-Jozsa for a Constant Function:")
deutsch_jozsa(domain_size=4, func_type_to_simulate='constant', copies=1000)
```

Output:

```bash
Execute Deutsch-Jozsa for a Balanced Function:
Circuit Diagram:
0: ───H───────@───H───────M('result')───
              │           │
1: ───H───────┼───@───H───M─────────────
              │   │
2: ───X───H───X───X─────────────────────
Measurements: Counter({3: 1000})
Result: BALANCED function

Execute Deutsch-Jozsa for a Constant Function:
Circuit Diagram:
0: ───H───H───M('result')───
              │
1: ───H───H───M─────────────

2: ───X───H─────────────────
Measurements: Counter({0: 1000})
Result: CONSTANT function
```

For a constant function, all computational basis states acquire the same global phase, so the final Hadamards cause constructive interference back to the |00⟩ state, yielding measurement outcome 0. For a balanced function, exactly half the basis states pick up a positive phase and half pick up a negative phase (opposite signs). When the final Hadamards are applied, this creates destructive interference for the |00⟩ component and constructive interference for other states, guaranteeing a non-zero measurement (in this case, binary 11 = decimal 3). Measuring 0 means constant, measuring anything else means balanced with 100% certainty from just one execution.

# Grovers Algorithm

The last algorithm ill be writing about is Grovers algorithm.One of the potential advantages of quantum systems is the speed at witch it can access database elements. Grover's algorithm is an algorithm that can provide a quadratic speedup in searching items from a database using the *amplitude amplification trick*.

Imagine you have an unsorted database with N items, and exactly one of them is the "winner" you're searching for. Classically, you'd need to check about N/2 items on average. Grover's algorithm works in two repeated steps that **amplify the probability amplitude** of the marked item:
 1. Just like in Deutsch-Jozsa, an oracle applies a phase flip to the state you're looking for. If you're searching for |winner⟩, it applies: |winner⟩ → -|winner⟩ (flips its phase to negative). All other states stay positive. So you start with equal superposition over all N items, then selectively flip the phase of just the winner. Now the winner has negative amplitude while everything else is positive.
 2. Next you apply an operation that inverts all ampliitudes about their average value. If one item has a negative amplitude and all the others are positive, the average is slightly below the positive values. When inverting around this average, the negative amplitude (below average) flips to become more positive than it was, and the positive amplitudes (above average) decrease slightly.
 These two steps are repeated √N times and the winners amplitude grows to nearly 1 while the others shrink to nearly 0. Then when we measure the result, we get the winner with a high probability. In the following oracle we set the database element to be at '01' so we should get that item with 100% accuracy afterwards.

```python
import cirq
import numpy as np

def oracle(input_qubits, target_qubit, circuit, secret_element='01'):
    print(f"Element to be searched: {secret_element}")
    # Flip the qubits corresponding to the bits containing 0
    for i, bit in enumerate(secret_element):
        if int(bit) == 0:
            circuit.append(cirq.X(input_qubits[i]))
    # Do a conditional NOT using all input qubits as control qubits
    circuit.append(cirq.TOFFOLI(*input_qubits, target_qubit))
    # Revert the input qubits to the secret state prior to flipping
    for i, bit in enumerate(secret_element):
        if int(bit) == 0:
            circuit.append(cirq.X(input_qubits[i]))
    return circuit

def grovers_algorithm(num_qubits=2, copies=1000):
    # Define input and output qubits
    input_qubits = [cirq.LineQubit(i) for i in range(num_qubits)]
    target_qubit = cirq.LineQubit(num_qubits)
    circuit = cirq.Circuit()
    # Create equal Superposition state
    circuit.append([cirq.H(input_qubits[i]) for i in range(num_qubits)])
    # Take target qubit to minus state
    circuit.append([cirq.X(target_qubit), cirq.H(target_qubit)])
    # Pass the qubit through the Oracle
    circuit = oracle(input_qubits, target_qubit, circuit)
    # Construct Grover operator
    circuit.append(cirq.H.on_each(*input_qubits))
    circuit.append(cirq.X.on_each(*input_qubits))
    circuit.append(cirq.H.on(input_qubits[1]))
    circuit.append(cirq.CNOT(input_qubits[0], input_qubits[1]))
    circuit.append(cirq.H.on(input_qubits[1]))
    circuit.append(cirq.X.on_each(*input_qubits))
    circuit.append(cirq.H.on_each(*input_qubits))

    # Measure the result
    circuit.append(cirq.measure(*input_qubits, key='Z'))
    print("Grovers algorithm follows")
    print(circuit)
    sim = cirq.Simulator()
    result = sim.run(circuit, repetitions=copies)
    out = result.histogram(key='Z')

    out_result = {}
    for k in out.keys():
        new_key = "{0:b}".format(k)
        if len(new_key) < num_qubits:
            new_key = (num_qubits - len(new_key)) * '0' + new_key
        out_result[new_key] = out[k]
    print(out_result)

grovers_algorithm(2)
```

Output:

```output
Element to be searched: 01
Grovers algorithm follows
0: ───H───X───@───X───H───X───@───X───H───────M('Z')───
              │               │               │
1: ───H───────@───H───X───H───X───H───X───H───M────────
              │
2: ───X───H───X────────────────────────────────────────
{'01': 1000}
```

From the output we can see that Grover's algorithm has converged to the winner with 100 percent probability. Now we might look at this and think there is no use case for such an algorithm as we already require an oracle that knows the location of the item. This isn't 100% accurate. The oracle doesn't know where the item is but it can recognise it using the function. Suppose you're searching for a solution to a Sudoku puzzle. You don't know the solution (that's what you're searching for!), but given any candidate solution, you can verify if it's correct by checking the Sudoku rules. The oracle implements this verification. So the oracle is not "tell me where the answer is" (that would be cheating!), but "given a candidate answer, tell me if it's correct"

The main advantage of this over a classical search algorithm is in quantum parallelisation. We can put all N items into a superposition simultaneously, and when we apply the oracle, it evaluates all N items simultaneously in that superposition. 

## Conclusion

We have seen some background to quantum computing as well as some examples of quantum algorithms. The true promise of quantum computing is quantum parallelisation, as we saw in the Grovers algorithm example.

 We've progressed from the fundamental building blocks of quantum computation, the Hadamard gate creating superposition, to algorithms that exploit quantum mechanics for computational advantage. The Bell states demonstrated quantum entanglement, showing how measuring one qubit instantaneously determines the state of its entangled partner. Quantum teleportation illustrated how quantum states can be transmitted using entanglement and classical communication, while our quantum random number generator showed the inherently non-deterministic nature of quantum measurement.

The Deutsch-Jozsa and Grover's algorithms represent the paradigm shift that quantum computing offers. Rather than checking possibilities sequentially as classical computers must, these algorithms leverage quantum superposition to evaluate multiple inputs simultaneously, then use interference (constructive and destructive) to amplify correct answers while suppressing incorrect ones. The Deutsch-Jozsa algorithm achieves this in a single query with 100% certainty, while Grover's algorithm provides a quadratic speedup for unstructured search, requiring only √N operations instead of N.

While we're still years away from having quantum computers in our homes, and current applications remain limited to specific problem domains, the theoretical foundations and simulation tools like Cirq and Qiskit allow us to  prepare for the quantum future.