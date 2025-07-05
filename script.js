document.addEventListener('DOMContentLoaded', function() {
    const calculator = {
        displayValue: '0',
        firstOperand: null,
        waitingForSecondOperand: false,
        operator: null,
    };

    // DOM Elements
    const previousOperandElement = document.getElementById('previous-operand');
    const currentOperandElement = document.getElementById('current-operand');
    const buttons = document.querySelectorAll('button');

    // Update calculator display
    function updateDisplay() {
        currentOperandElement.textContent = calculator.displayValue;
        
        // Show previous operation if exists
        if (calculator.firstOperand !== null && calculator.operator) {
            previousOperandElement.textContent = 
                `${calculator.firstOperand} ${calculator.operator}`;
        } else {
            previousOperandElement.textContent = '';
        }
    }

    // Reset calculator
    function resetCalculator() {
        calculator.displayValue = '0';
        calculator.firstOperand = null;
        calculator.waitingForSecondOperand = false;
        calculator.operator = null;
        updateDisplay();
    }

    // Input a digit
    function inputDigit(digit) {
        const { displayValue, waitingForSecondOperand } = calculator;

        if (waitingForSecondOperand === true) {
            calculator.displayValue = digit;
            calculator.waitingForSecondOperand = false;
        } else {
            calculator.displayValue = 
                displayValue === '0' ? digit : displayValue + digit;
        }
    }

    // Input a decimal point
    function inputDecimal(dot) {
        if (calculator.waitingForSecondOperand) {
            calculator.displayValue = '0.';
            calculator.waitingForSecondOperand = false;
            return;
        }

        if (!calculator.displayValue.includes(dot)) {
            calculator.displayValue += dot;
        }
    }

    // Handle operators
    function handleOperator(nextOperator) {
        const { firstOperand, displayValue, operator } = calculator;
        const inputValue = parseFloat(displayValue);

        if (operator && calculator.waitingForSecondOperand) {
            calculator.operator = nextOperator;
            updateDisplay();
            return;
        }

        if (firstOperand === null) {
            calculator.firstOperand = inputValue;
        } else if (operator) {
            const result = calculate(firstOperand, inputValue, operator);
            calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
            calculator.firstOperand = result;
        }

        calculator.waitingForSecondOperand = true;
        calculator.operator = nextOperator;
        updateDisplay();
    }

    // Perform calculation
    function calculate(firstOperand, secondOperand, operator) {
        switch (operator) {
            case '+':
                return firstOperand + secondOperand;
            case '-':
                return firstOperand - secondOperand;
            case '×':
                return firstOperand * secondOperand;
            case '÷':
                return firstOperand / secondOperand;
            default:
                return secondOperand;
        }
    }

    // Delete last digit
    function deleteLastDigit() {
        if (calculator.displayValue.length === 1 || 
            (calculator.displayValue.length === 2 && calculator.displayValue.startsWith('-'))) {
            calculator.displayValue = '0';
        } else {
            calculator.displayValue = calculator.displayValue.slice(0, -1);
        }
    }

    // Handle button clicks
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const { target } = event;

            if (target.classList.contains('number')) {
                inputDigit(target.textContent);
                updateDisplay();
                return;
            }

            if (target.id === 'decimal') {
                inputDecimal(target.textContent);
                updateDisplay();
                return;
            }

            if (target.classList.contains('operator')) {
                handleOperator(target.textContent);
                return;
            }

            if (target.id === 'equals') {
                if (calculator.firstOperand !== null && calculator.operator) {
                    handleOperator('=');
                    calculator.operator = null;
                }
                return;
            }

            if (target.id === 'clear') {
                resetCalculator();
                return;
            }

            if (target.id === 'delete') {
                deleteLastDigit();
                updateDisplay();
                return;
            }
        });
    });

    // Keyboard support
    document.addEventListener('keydown', event => {
        const { key } = event;

        if (/\d/.test(key)) {
            event.preventDefault();
            inputDigit(key);
            updateDisplay();
        } else if (key === '.') {
            event.preventDefault();
            inputDecimal(key);
            updateDisplay();
        } else if (key === '+' || key === '-' || key === '*' || key === '/') {
            event.preventDefault();
            const operatorMap = {
                '+': '+',
                '-': '-',
                '*': '×',
                '/': '÷'
            };
            handleOperator(operatorMap[key]);
        } else if (key === 'Enter' || key === '=') {
            event.preventDefault();
            if (calculator.firstOperand !== null && calculator.operator) {
                handleOperator('=');
                calculator.operator = null;
            }
        } else if (key === 'Escape') {
            event.preventDefault();
            resetCalculator();
        } else if (key === 'Backspace') {
            event.preventDefault();
            deleteLastDigit();
            updateDisplay();
        }
    });

    // Initial display update
    updateDisplay();
});