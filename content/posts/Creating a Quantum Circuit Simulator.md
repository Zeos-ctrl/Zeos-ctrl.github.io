---
title: Blog post
date: 2025-12-03
draft: false
tags:
  - blog
  - quantum
  - rust
---
Recently, I've been researching quantum mechanics, especially around quantum computing and I've been following a textbook on quantum machine learning. After using Python libraries like Cirq for the creation of circuits, I had the thought of creating a library in a ~~a~~ language  I enjoy using like Rust. The goal of the first draft of the simulator was to create a simple Bell state circuit. This project has a bunch of parts; I needed to create:

1. A representation of complex numbers
2. The quantum state representation that will be updated throughout the circuit
3. A circuit struct to hold all the gates in order that will be applied to the state
4. A simulator that will apply those gates step by step to the state and return the result

To top this all off, I decided to add a further restriction of using as few external libraries as possible.

# Qubit representation

In its most basic form, a quantum computer measures the change of the state of a quantum bit over the evolution of the circuit. In classical computing a bit is the most fundamental unit of information and is represented as a "1" or "0". The quantum counterpart of this classical unit is a quantum bit, or qubit, which can be represented in the same way as the classical bit but with the added dimension of superposition where it can be both a "1" and "0" at the same time.

In quantum mechanics the states corresponding to "1" and "0" are two-dimensional state vectors $\vec{0}$ and $\vec{1}$ where $\vec{0} = \begin{bmatrix}1\\0\end{bmatrix}$ and $\vec{1} = \begin{bmatrix}0\\1\end{bmatrix}$. A superposition of the states is represented as the linear combination of these two states being $\ket{\psi} = \alpha\ket{0} + \beta\ket{1}$. This may look complicated however lets imagine those two state vectors represent directions on a 2D graph where, $\ket{0}$ is the X axis and $\ket{1}$ is the Y axis. The overall state is the direction in which the sum of the two vectors is. Lets say we have a value of 0.5 in the x axis and 0.5 in the y axis, imagine travelling 0.5 units in the x axis and then the y axis, now from that position return to the origin and we have found the sum of these two vectors, now the ratio between the angle of that sum and the axis is the probability of the qubit being in state 0 or 1 which in this case is 50/50. If we travelled 1 unit in the X axis and 0 in the Y axis the state would be 0 with 100% probability. If we extend this idea to include a Z axis we would end up with the Bloch sphere representation of the qubit. 

So as we have just seen we can represent a qubit as a complex number, this means to start coding this simulator in rust we need a struct for a complex number to represent each qubit. This is quite easy as we can create a struct called Complex and have two properties of real and imaginary to represent the number. We store the values as f64 as a 64-bit floating point number as the multiplier is usually a fraction such as $\frac{1}{\sqrt{2}}$ as we will see a bit later.

```rust
/// Complex number representation, these are the representation
/// of Qubits within the circuit.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Complex {
    /// Real part to the number
    pub real: f64,
    /// Imaginary part of the number
    pub imag: f64,
}
```
Our complex number struct needs to do more than just hold the values of the qubit, we also need to do math on it. As such we implement the following functions; 
1. We need a constructor for the struct which we call `new` and this takes in the real and imaginary part of the number. 
2. The add function calculates the sum between two complex numbers and returns a third. 
3. The subtract function does the opposite of the add function.
4. The multiply function calculates the product between two complex numbers.
5. The scale function multiplies the complex number by a scalar.
6. The magnitude squared function is possibly the most important one and is used to calculate the probability of the qubit in the state vector.
7. The conjugate function is used to calculate the complex conjugate of the qubit and is used in certain gates as a flip operator.
8. Finally the exp calculates the complex exponential of the complex number and is used in the quantum Fourier transform circuit.
```rust
impl Complex {
    /// Creates a new complex number with the specified real and
    /// imaginary counterparts.
    pub fn new(real: f64, imag: f64) -> Self {
        ...
    }

    /// Addition operation between two complex numbers.
    /// num1 = a + bi
    /// num2 = c + di 
    /// result = (a + c) + (b + d)i
    pub fn add(&self, other: &Complex) -> Complex {
        ...
    }

    /// Subtraction operation between two complex numbers.
    /// num1 = a + bi
    /// num2 = c + di 
    /// result = (a - c) + (b - d)i
    pub fn subtract(&self, other: &Complex) -> Complex {
        ...
    }

    /// Multiplication operation between two complex numbers.
    /// num1 = a + bi
    /// num2 = c + di 
    /// result = (ac - bd) + (ad + bc)i
    pub fn multiply(&self, other: &Complex) -> Complex {
        ...
    }

    /// Scale the complex number by a scalar value.
    /// num1 = a + bi
    /// scalar = x
    /// result = (x * a) + (x * b)i
    pub fn scale(&self, scalar: f64) -> Complex {
        ...
    }

    /// Calculate the magnitude squared of the complex number.
    /// Used to get the probability of the quantum state vector.
    /// num1 = a + bi
    /// result = |a|^2 + (|b|^2)i
    pub fn magnitude_squared(&self) -> f64 {
        ...
    }

    /// Calculate the complex conjugate (flip the sign on the imaginary part)
    /// num1 = a + bi
    /// result = a - bi
    pub fn conjugate(&self) -> Complex {
        ...
    }

    /// Compute the complex exponential e^(a+bi)
    /// Using Euler's formula: e^(a+bi) = e^a * (cos(b) + i*sin(b))
    pub fn exp(&self) -> Complex {
        ...
    }
}
```
Im leaving out some of the internals of the functions from brevity of this blog post, however if your interested, the link to the GitHub project will be at the bottom.
# Quantum State

The quantum state vector stores all possible outcomes for an n-qubit system. For a 2-qubit system, when we perform a measurement and collapse the wave function, we could end up with one of 4 states: "00", "01", "10" or "11". During the circuit when qubits are in superposition, we don't know what the measurement will yield. Each basis state has a corresponding complex amplitude stored in the state vector. The probability of measuring each state is calculated as the magnitude squared of its amplitude. The simulator uses this state vector to track how the quantum system transforms as gates are applied throughout the circuit.

```rust
// The Quantum State Vector that holds the state of the system for 2^n qubits
#[derive(Clone)]
pub struct QuantumState {
    pub amplitudes: Vec<Complex>,
    pub num_qubits: usize,
}
```

In this simulator we need a quantum state vector to hold the state of the system which will be transformed over the length of the circuit. For this struct we need the number of qubits in the system (used to calculate the length of the state vector), and the amplitudes of the system which is a vector of complex numbers.

1. During the `new` function we initialise the system to have n qubits all in the state |0⟩. Specifically, we create a state vector of length 2^n, where the first amplitude is set to 1+0i (representing the |00...0⟩ state) and all other amplitudes are set to 0+0i. This function then returns the fresh state vector.
2. We have a function called `normalize` to ensure the sum of all |amplitude|² equals 1. This maintains the fundamental requirement that all measurement probabilities must sum to 1. After certain operations (or due to floating-point errors), the state may need renormalization.
3. The `measure` function implements probabilistic measurement. It calculates the probability for each basis state using |amplitude|², then picks a random value by choosing a random number between 0-1 and iterating over every state, accumulating their probabilities until the cumulative sum exceeds the generated random number. The basis state whose probability pushed the cumulative sum over the random number is the chosen "winner" which becomes the measurement outcome.
```rust
impl QuantumState {
    /// Create state with n qubits, all in |0⟩
    pub fn new(num_qubits: usize) -> QuantumState {
        let size = 2_usize.pow(num_qubits as u32);    
        let mut amplitudes = Vec::new();

        for i in 0..size {
            if i == 0 {
                amplitudes.push(Complex::new(1.0, 0.0));
            } else {
                amplitudes.push(Complex::new(0.0, 0.0));
            }
        }

        QuantumState { amplitudes, num_qubits }
    }

    /// Ensure sum of all amplitudes in the Quantum State equal 1, |amplitude|² = 1
    pub fn normalize(&mut self) {
        let mut sum = 0.0;
        
        // Calculate sum of |amplitude|²
        for amplitude in &self.amplitudes {
            sum += amplitude.magnitude_squared()
        }
        
        // Handle edge case
        if sum == 0.0 {
            return; // Can't normalize zero vector
        }
        
        let norm = f64::sqrt(sum);
        
        // Scale each amplitude
        for amplitude in &mut self.amplitudes {
            *amplitude = amplitude.scale(1.0 / norm);
        }
    }

    /// Measure all qubits, return bitstring (e.g., "01" for 2 qubits)
    pub fn measure(&self) -> String {
        let mut rng = rand::rng();
        let r: f64 = rng.random();
        
        let mut cumulative = 0.0;
        let mut chosen_index = 0;
        
        // Loop through amplitudes and find which index to measure
        for (index, amplitude) in self.amplitudes.iter().enumerate() {
            cumulative += amplitude.magnitude_squared();
            
            if r < cumulative {
                chosen_index = index;
                break;
            }
        }

        format!("{:0width$b}", chosen_index, width = self.num_qubits)
    }

}
```

# Required Gates

As a basic test for this circuit we want to create a bell state circuit. The bell state is a simple circuit to create entanglement between two qubits. Entanglement makes it so the two qubits are correlated - a measurement of one qubit will give you **information** about the other's state. Specifically, in this Bell state, if you measure the first qubit and get |0⟩, the second qubit will also be |0⟩; if you get |1⟩, the second will also be |1⟩. The Bell state is represented by $\ket{\psi} = \frac{1}{\sqrt{2}}\ket{00} + \frac{1}{\sqrt{2}}\ket{11}$. This circuit is simple (in quantum mechanical terms) and only requires two gates; the Hadamard gate to create a superposition in one of the qubits, and the controlled NOT gate to entangle the second qubit with the first one.

In our circuit we treat gates as a queue of operations that are executed by the simulator, like a queue of people at a fast food restaurant. The gates are stored as a vector on enums where each enum variant has its own corresponding function. The enum variants are initialised with the information required for their function, for example, the Hadamard variant stores the target qubit index.
```rust
/// Quantum gates supported by the simulator.
///
/// All gates are represented with their target qubit index (0-indexed).
/// Multi-qubit gates like CNOT also specify control qubits.
#[derive(Debug, Clone, Copy)]
pub enum Gate {
    /// Hadamard gate - creates superposition
    /// Transforms |0⟩ → (1/√2)(|0⟩ + |1⟩) and |1⟩ → (1/√2)(|0⟩ - |1⟩)
    Hadamard { target: usize },
    
    /// Controlled-NOT gate - flips target if control is |1⟩
    CNOT { control: usize, target: usize },
}
```
The Hadamard gate implementation takes the quantum state and the target qubit index as inputs. The algorithm works by identifying and transforming pairs of amplitudes in the state vector. We loop through all amplitude indices. For each index `i`, we use a bitwise mask `(i & (1 << target_qubit)) == 0` to check if the bit at position `target_qubit` is 0. If it is, we pair this index with `j = i + 2^target_qubit`, which represents the same basis state but with the target qubit flipped to 1.

When applying a single-qubit gate in a multi-qubit system, we only transform amplitudes for basis states that differ in the target qubit. For example, applying Hadamard to qubit 0 in a 2-qubit system means we process pairs like (|00⟩, |01⟩) and (|10⟩, |11⟩) - states that differ only in qubit 0's value. For each pair of amplitudes {$\alpha$, $\beta$}, we apply the Hadamard matrix:

1. Store the current values of both amplitudes
2. Calculate new values: $\alpha' = (1/\sqrt{2})(\alpha + \beta)$ and $\beta' = (1/\sqrt{2})(\alpha - \beta)$
3. Update both amplitudes in the state vector

By only processing indices where the target bit is 0, we ensure each pair is processed exactly once, avoiding redundant calculations.
```rust
/// Applies a Hadamard gate to the specified qubit.
///
/// The Hadamard gate creates superposition, transforming:
/// - |0⟩ → (1/√2)(|0⟩ + |1⟩)
/// - |1⟩ → (1/√2)(|0⟩ - |1⟩)
pub fn apply_hadamard(state: &mut QuantumState, target_qubit: usize) {
    let num_amplitudes = state.amplitudes.len();
    
    for i in 0..num_amplitudes {
        // Check if bit at position target_qubit in i is 0 using a bitwise mask
        if (i & (1 << target_qubit)) == 0 {
            let j = i + (1 << target_qubit);  // Same as i + 2^target_qubit

            let old_i = state.amplitudes[i];
            let old_j = state.amplitudes[j];

            let factor = 1.0 / f64::sqrt(2.0);

            // Compute new values
            let new_i = old_i.add(&old_j).scale(factor);
            let new_j = old_i.subtract(&old_j).scale(factor);

            // Update the state
            state.amplitudes[i] = new_i;
            state.amplitudes[j] = new_j;
            
        }
    } 
}

```
The controlled-NOT (CNOT) gate flips the target qubit if and only if the control qubit is |1⟩. The implementation follows a similar pattern to the Hadamard gate but with different logic. We loop through all amplitude indices in the state vector. For each index, we check two conditions:
- Is the control qubit bit set to 1? `(i & (1 << control_qubit)) != 0`
- Is the target qubit bit set to 0? `(i & (1 << target_qubit)) == 0`
If both conditions are true, we've found an amplitude pair that needs swapping.

The CNOT gate only acts when the control is $\ket{1}$. When it does act, it swaps amplitudes for basis states that differ in the target qubit. By checking if the target bit is 0, we process each pair exactly once - swapping index `i` with `j = i ^ (1 << target_qubit)` (using XOR to flip just the target bit). For example, in the basis state |10⟩ (control=1, target=0), the CNOT swaps its amplitude with |11⟩ (control=1, target=1). But for |00⟩ (control=0), nothing happens because the control bit isn't 1.
```rust
/// Applies a CNOT gate to the specified qubit.
///
/// The CNOT gate flips the target qubit if the control bit is |1⟩:
///
/// If our control bit is 0 and the target bit is 1 we have this truth
/// table;
///
/// - |00> -> |00>
/// - |01> -> |01>
/// - |10> -> |11>
/// - |11> -> |10>
pub fn apply_cnot(state: &mut QuantumState, control_qubit: usize, target_qubit: usize) {
    let num_amplitudes = state.amplitudes.len();

    for i in 0..num_amplitudes {
        // First check: is the control bit set to 1?
        if (i & (1 << control_qubit)) != 0 {
            // only process when target bit is 0
            if (i & (1 << target_qubit)) == 0 {
                // Calculate the swap partner
                let j = i ^ (1 << target_qubit);  // XOR flips the target bit
                
                // Swap amplitudes[i] and amplitudes[j]
                state.amplitudes.swap(i, j);
            }
        }
    }
}
```

# Circuit Struct

The circuit struct holds the information about the queue of gates and the number of qubits in the system. It needs to contain functions to add gates in order and be able to display the entire circuit to see what is going on.
```rust
/// A quantum circuit consisting of a sequence of gates applied to qubits.
pub struct Circuit {
    num_qubits: usize,
    gates: Vec<Gate>,
}
```
For the circuit struct implementation we have functions to:
1. Create a new circuit which creates an empty gate vector and a specified number of qubits for the system to keep a track of.
2. A function which adds a gate to the queue, this takes a gate enum with the target information and pushes it to the vector.
3. Some display functions for getting the number of qubits in the struct and a list of the gates for displaying the circuit.
```rust
impl Circuit {
    /// Creates a new quantum circuit with the specified number of qubits.
    ///
    /// All qubits are initialized to |0⟩ when the circuit is executed.
    pub fn new(num_qubits: usize) -> Self {
        Circuit { num_qubits, gates: Vec::new() }
    }
    
    /// Adds a gate to the circuit.
    ///
    /// Gates are executed in the order they are added.
    pub fn add_gate(&mut self, gate: Gate) {
        self.gates.push(gate)
    }
    
    /// Returns the number of qubits in the circuit.
    pub fn num_qubits(&self) -> usize {
        self.num_qubits
    }
    
    /// Returns a slice of all gates in the circuit.
    pub fn gates(&self) -> &[Gate] {
        &self.gates
    }
}
```
Finally, we want a way to display the circuit using the `println!` macro. We can implement the `fmt::Display` trait for the Circuit struct to enable this. This implementation creates a vector of strings with one per qubit to track, and initialises the start of those strings by labelling the qubit number and appending "─" to represent a quantum wire. For each gate in the circuit, an identifier is pushed to the relevant string to specify whether the qubit has been changed by the gate or it's been left alone with a wire segment. This vector of strings is then written to the console line-by-line, creating an ASCII circuit diagram.
```rust
impl fmt::Display for Circuit {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        // Create a vector of strings, one per qubit
        let mut lines: Vec<String> = Vec::new();
        
        // Initialize each line with the qubit label
        for i in 0..self.num_qubits {
            lines.push(format!("q{}: ─", i));
        }
        
        // Process each gate
        for gate in self.gates() {
            match gate {
                Gate::Hadamard { target } => {
                    for i in 0..self.num_qubits {
                        match i {
                            i if i == *target => {
                                lines[i].push('H');
                                lines[i].push('─');
                            },
                            _ => {
                                lines[i].push('─');
                                lines[i].push('─');
                            }
                        }
                    }
                },
                Gate::CNOT { control, target } => {
                    for i in 0..self.num_qubits {
                        match i {
                            i if i == *target => {
                                lines[i].push('C');
                                lines[i].push('─')
                            },
                            i if i == *control => {
                                lines[i].push('●');
                                lines[i].push('─')
                            },
                            _ => {
                                lines[i].push('─');
                                lines[i].push('─')
                            }
                        }
                    }
                },
        
        for line in lines {
            writeln!(f, "{}", line)?;
        }
        Ok(())
    }
}
```

# Simulator

The final part of this project is the actual simulator which will apply all the gate functions to a state vector in order. This struct doesn't need to store any information so we just need a default implementation for it.
```rust
/// Simulator for the quantum circuit
pub struct Simulator;

impl Default for Simulator {
    fn default() -> Self {
        Simulator::new()
    }
}
```
When we want to run the simulator on the circuit, we pass in a reference to the circuit and the number of times to run the measurement. This then runs the internal `run_once` function n times. Inside `run_once`, we create a fresh quantum state initialised to |00...0⟩, then for each gate in the circuit, we match the enum and apply the corresponding gate function to the quantum state. This process is repeated until the circuit is completed and then the state is finally measured and the result of that measurement is stored in a results vector. After the n runs are completed, the vector is returned with the result of every trial.

```rust
impl Simulator {
    /// Returns a new Simulator object to run a circuit.
    pub fn new() -> Self {
        Simulator
    }

    /// Run circuit n_shots times, return measurement results.
    pub fn run(&self, circuit: &Circuit, n_shots: usize) -> Vec<String> {
        let mut results = Vec::new();

        for _ in 0..n_shots {
            results.push(self.run_once(circuit));
        }

        results
    }

    // Helper: Execute circuit once and return final measurement
    fn run_once(&self, circuit: &Circuit) -> String {
        let mut state = QuantumState::new(circuit.num_qubits());
        for gate in circuit.gates() {
            match gate {
                Gate::Hadamard { target } => {
                    gates::apply_hadamard(&mut state, *target);
                },
                Gate::CNOT { control, target } => {
                    gates::apply_cnot(&mut state, *control, *target);
                },
            }
        }
        state.measure()
    }

    /// Run circuit with the trace active to see the journey of the quantum state through
    /// the circuit.
    pub fn run_with_trace(&self, circuit: &Circuit) -> ExecutionTrace {
        let mut trace = ExecutionTrace { steps: Vec::new() };
        let mut state = QuantumState::new(circuit.num_qubits());
        
        // Capture initial state
        trace.steps.push(TraceStep {
            description: "Initial state".to_string(),
            state: state.clone(), // We need to clone the state
        });
        
        // Apply each gate and capture state after each
        for gate in circuit.gates() {
            match gate {
                Gate::Hadamard { target } => {
                    gates::apply_hadamard(&mut state, *target);
                    trace.steps.push(TraceStep {
                        description: format!("Applied Hadamard to qubit {}", *target),
                        state: state.clone()
                    });
                },
                Gate::CNOT { control, target } => {
                    gates::apply_cnot(&mut state, *control, *target);
                    trace.steps.push(TraceStep {
                        description: format!("Applied CNOT (control: {}, target: {})", *control, *target),
                        state: state.clone()
                    });
                },
            }
        }
        let result = state.measure();

        let measured_index = usize::from_str_radix(&result, 2).unwrap();

        // Set all amplitudes to 0, then set measured state to 1
        for i in 0..state.amplitudes.len() {
            if i == measured_index {
                state.amplitudes[i] = Complex::new(1.0, 0.0);
            } else {
                state.amplitudes[i] = Complex::new(0.0, 0.0);
            }
        }

        trace.steps.push(TraceStep {
            description: format!("Measurement result: {}", result),
            state: state.clone(),
        });

        trace
    }
}
```

I wasn't satisfied with just this however, and wanted to see how the state evolves over time in the simulator. I created the `run_with_trace` function **for** this. This function works in the same way as the `run` function but a trace is also created to follow the state through the circuit. After every gate is applied, a copy of the current state is created and added to a struct called `TraceStep` along with a description of what just happened. These `TraceStep` structs are stored in an `ExecutionTrace` struct as a vector and with its display implementation, a trace of the state is created that allows a researcher to see what happened to the quantum state at every step.

```rust
/// Struct to hold information of the current step for tracing.
/// Holds a description of the step as well as the Quantum State.
pub struct TraceStep {
    pub description: String,
    pub state: QuantumState,
}

/// Holds multiple TraceSteps to be iterated over when read.
pub struct ExecutionTrace {
    pub steps: Vec<TraceStep>,
}

impl fmt::Display for ExecutionTrace {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        for (step_num, step) in self.steps.iter().enumerate() {
            writeln!(f, "Step {}: {}", step_num, step.description)?;
            
            // Convert state to ket notation
            let ket = state_to_ket(&step.state);
            writeln!(f, "  State: {}", ket)?;
            writeln!(f)?; // blank line between steps
        }
        Ok(())
    }
}

fn state_to_ket(state: &QuantumState) -> String {
    let mut terms = Vec::new();
    
    for (index, amplitude) in state.amplitudes.iter().enumerate() {
        // Skip near-zero amplitudes
        if amplitude.magnitude_squared() < 1e-10 {
            continue;
        }
        
        // Convert index to binary basis state
        let basis = format!("{:0width$b}", index, width = state.num_qubits);
        
        // Format the coefficient (just the real part for now, assuming imaginary ≈ 0)
        let coeff = amplitude.real;
        
        terms.push(format!("{:.4}|{}⟩", coeff, basis));
    }
    
    terms.join(" + ")
}
```

# Results

Putting this all together, we end up with a working quantum circuit simulator that can track the quantum state vector and calculate the probability of a measurement. The following is an example of the Bell state creation code;
- We start by initialising a mutable circuit with 2 qubits.
- With the mutable circuit we add a Hadamard gate targeting qubit 0.
- We then apply a controlled NOT gate on qubit 1 with qubit 0 being the control bit.
- A simulator struct is created and the circuit is ran 1000 times.
- The result vector is iterated over and we count the number of times the system is measured as "00" or "11". As the qubits are entangled these should be the only outputs.

Looking at the outputs of the code we can see the circuit diagram printed with the 2 qubits and the specified gates acting on them. From our measurements we get about a 50/50 chance of either measurement which is the expected behaviour, and this means the simulator works!
```rust
use phobos::{Circuit, Gate, Simulator, plot_histogram};

fn main() {
    // Create a Bell state circuit
    let mut circuit = Circuit::new(2);
    circuit.add_gate(Gate::Hadamard { target: 0 });
    circuit.add_gate(Gate::CNOT { control: 0, target: 1 });
    
    println!("Circuit:");
    println!("{}", circuit);
    
    // Run the circuit
    let sim = Simulator::new();
    let results = sim.run(&circuit, 1000);
    
    // Count outcomes
    let mut count_00 = 0;
    let mut count_11 = 0;
    
    for result in &results {
        match result.as_str() {
            "00" => count_00 += 1,
            "11" => count_11 += 1,
            _ => {}
        }
    }

    println!("\nResults from 1000 measurements:");
    println!("00: {} ({:.1}%)", count_00, count_00 as f64 / 10.0);
    println!("11: {} ({:.1}%)", count_11, count_11 as f64 / 10.0);

    println!("\nProbability Distribution:");
    plot_histogram(&results, circuit.num_qubits());
}
```

```bash
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 6.99s
     Running `target/debug/examples/bell_state`
Circuit:
q0: ─H─●─
q1: ───C─


Results from 1000 measurements:
00: 485 (48.5%)
11: 515 (51.5%)

Probability Distribution:
00: ❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚
01:
10:
11: ❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚❚
```

If we ran this with the `run_with_trace` function, the following would have been the output. We can see the state evolving over time to get the final measurement. It should be noted, we display 0.7071 instead of 1/$\sqrt{2}$  for an easier display function, as they can be used interchangeably.

```bash
Circuit Trace:
Step 0: Initial state
  State: 1.0000|00⟩

Step 1: Applied Hadamard to qubit 0
  State: 0.7071|00⟩ + 0.7071|01⟩

Step 2: Applied CNOT (control: 0, target: 1)
  State: 0.7071|00⟩ + 0.7071|11⟩

Step 3: Measurement result: 00
  State: 1.0000|00⟩
```

This project is still under development and can be found on my GitHub or with this link https://github.com/Zeos-ctrl/phobos

In the future I want to expand this project to also include some quantum machine learning processes, however this requires building a classical machine learning library in rust to mirror it. This classical project is ongoing and can be followed at https://github.com/Zeos-ctrl/deimos