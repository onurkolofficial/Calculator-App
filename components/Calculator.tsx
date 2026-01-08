
import React, { useState, useRef, useEffect, useCallback } from 'react';
import CalculatorButton from './CalculatorButton';
import { Operation, CalculationHistory } from '../types';
import { translations, Language, ButtonColor } from '../translations';

interface CalculatorProps {
  onCalculate: (calc: CalculationHistory) => void;
  selectedCalculation?: CalculationHistory | null;
  theme: 'dark' | 'light';
  language: Language;
  buttonColor?: ButtonColor;
}

const Calculator: React.FC<CalculatorProps> = ({ 
  onCalculate, 
  selectedCalculation, 
  theme, 
  language,
  buttonColor = 'default'
}) => {
  const t = translations[language];
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<Operation>(null);
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  
  const [lastOperand, setLastOperand] = useState<number | null>(null);
  const [lastOperation, setLastOperation] = useState<Operation>(null);
  
  const [currentExpression, setCurrentExpression] = useState<string>('');
  const [finishedExpression, setFinishedExpression] = useState<string>('');
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const MAX_CHARS = 12; // Slightly reduced for larger font

  useEffect(() => {
    if (selectedCalculation) {
      setDisplay(selectedCalculation.result);
      setFinishedExpression(`${selectedCalculation.expression} =`);
      setCurrentExpression('');
      setPrevValue(null);
      setOperation(null);
      setLastOperation(null);
      setLastOperand(null);
      setShouldResetDisplay(true);
    }
  }, [selectedCalculation]);

  const handleKeyboard = useCallback((e: KeyboardEvent) => {
    const key = e.key;
    if (/[0-9]/.test(key)) handleNumber(key);
    if (key === '.') handleNumber('.');
    if (key === 'Enter' || key === '=') { e.preventDefault(); handleEqual(); }
    if (key === 'Backspace') handleBackspace();
    if (key === 'Escape') clear();
    if (key === '+') handleOperation('+');
    if (key === '-') handleOperation('-');
    if (key === '*') handleOperation('*');
    if (key === '/') handleOperation('/');
    if (key === '^') handleOperation('^');
  }, [display, prevValue, operation, shouldResetDisplay]);

  useEffect(() => {
    const listener = (e: KeyboardEvent) => handleKeyboard(e);
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [handleKeyboard]);

  const formatDisplay = (val: string) => {
    if (val === 'Infinity' || val === '-Infinity' || val === 'NaN') return t.error;
    if (val.length > MAX_CHARS) {
      const num = parseFloat(val);
      if (!isNaN(num)) {
        return num.toExponential(6).replace(/\.?0+e/, 'e'); 
      }
      return val.slice(0, MAX_CHARS);
    }
    // Add commas
    const parts = val.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join('.');
  };

  const handleNumber = (num: string) => {
    if (display.length >= MAX_CHARS && !shouldResetDisplay) return;

    if (display === '0' || shouldResetDisplay) {
      setDisplay(num === '.' ? '0.' : num);
      setShouldResetDisplay(false);
      
      if (finishedExpression) {
        setFinishedExpression('');
        setCurrentExpression('');
        setPrevValue(null);
        setOperation(null);
      }
    } else {
      if (num === '.' && display.includes('.')) return;
      setDisplay(display + num);
    }
  };

  const handleBackspace = () => {
    if (shouldResetDisplay) return;
    if (display.length === 1 || (display.length === 2 && display.startsWith('-'))) {
      setDisplay('0');
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const computeResult = (a: number, b: number, op: Operation): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return b !== 0 ? a / b : NaN;
      case '^': return Math.pow(a, b);
      default: return b;
    }
  };

  const handleOperation = (op: Operation) => {
    const currentNum = parseFloat(display);
    
    if (finishedExpression) {
      setFinishedExpression('');
      setCurrentExpression(display + " " + op + " ");
      setPrevValue(currentNum);
      setOperation(op);
      setShouldResetDisplay(true);
      setLastOperand(null);
      setLastOperation(null);
      return;
    }

    if (prevValue === null) {
      setPrevValue(currentNum);
      setCurrentExpression(currentNum + " " + op + " ");
    } else if (operation && !shouldResetDisplay) {
      const result = computeResult(prevValue, currentNum, operation);
      setPrevValue(result);
      setDisplay(String(result));
      setCurrentExpression(prev => prev + currentNum + " " + op + " ");
    } else if (operation && shouldResetDisplay) {
      setCurrentExpression(prev => prev.slice(0, -3) + " " + op + " ");
    }

    setOperation(op);
    setShouldResetDisplay(true);
    setLastOperand(null);
    setLastOperation(null);
  };

  const handleEqual = () => {
    const currentNum = parseFloat(display);

    if (!operation && lastOperation !== null && lastOperand !== null) {
      const result = computeResult(currentNum, lastOperand, lastOperation);
      setFinishedExpression(`${currentNum} ${lastOperation} ${lastOperand} =`);
      setDisplay(String(result));
      onCalculate({
        id: Date.now().toString(),
        expression: `${currentNum} ${lastOperation} ${lastOperand}`,
        result: String(result),
        timestamp: new Date()
      });
      setShouldResetDisplay(true);
      return;
    }

    if (prevValue === null || !operation) return;
    
    const result = computeResult(prevValue, currentNum, operation);
    let resultStr = String(result);
    if (resultStr.includes('.')) {
       const rounded = parseFloat(result.toFixed(10));
       resultStr = String(rounded);
    }

    setFinishedExpression(`${currentExpression}${currentNum} =`);
    onCalculate({
      id: Date.now().toString(),
      expression: currentExpression + currentNum,
      result: resultStr,
      timestamp: new Date()
    });
    
    setDisplay(resultStr);
    setLastOperand(currentNum);
    setLastOperation(operation);
    setPrevValue(null);
    setOperation(null);
    setShouldResetDisplay(true);
    setCurrentExpression('');
  };

  const clear = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperation(null);
    setLastOperand(null);
    setLastOperation(null);
    setShouldResetDisplay(false);
    setCurrentExpression('');
    setFinishedExpression('');
  };

  const handleScientific = (type: string) => {
    const val = parseFloat(display);
    let result = 0;
    let label = '';
    
    switch(type) {
      case 'sqrt': result = Math.sqrt(val); label = `√(${val})`; break;
      case 'sqr': result = val * val; label = `(${val})²`; break;
      case 'sin': result = Math.sin(val); label = `sin(${val})`; break;
      case 'cos': result = Math.cos(val); label = `cos(${val})`; break;
      case 'tan': result = Math.tan(val); label = `tan(${val})`; break;
      case 'log': result = Math.log10(val); label = `log(${val})`; break;
      case 'ln': result = Math.log(val); label = `ln(${val})`; break;
      case 'pi': result = Math.PI; label = 'π'; break;
      case 'e': result = Math.E; label = 'e'; break;
      default: return;
    }
    
    const resultStr = String(Number(result.toFixed(8)));
    setFinishedExpression(`${label} =`);
    setDisplay(resultStr);
    onCalculate({
      id: Date.now().toString(),
      expression: label,
      result: resultStr,
      timestamp: new Date()
    });
    setShouldResetDisplay(true);
    setPrevValue(null);
    setOperation(null);
    setCurrentExpression('');
  };

  const handleNegate = () => {
    setDisplay(prev => String(parseFloat(prev) * -1));
  };

  const onScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const page = Math.round(scrollLeft / clientWidth);
      setCurrentPage(page);
    }
  };

  return (
    <div className="w-full max-w-[360px] md:max-w-[500px] mx-auto transition-all duration-300">
      
      {/* Display Area */}
      <div className="flex flex-col items-end justify-end mb-6 min-h-[140px] px-2">
        <div className="text-slate-400 dark:text-slate-500 text-sm md:text-base font-medium h-6 mb-1 tracking-wide">
          {finishedExpression || currentExpression}
        </div>
        <div className="text-5xl md:text-7xl font-light text-slate-800 dark:text-white tracking-tight break-all text-right w-full">
          {formatDisplay(display)}
        </div>
      </div>

      <div className="relative">
        <div 
          ref={scrollRef}
          onScroll={onScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-0"
        >
          {/* Page 1: Standard */}
          <div className="w-full flex-none snap-center px-1">
            <div className="grid grid-cols-4 gap-3 md:gap-4">
              <CalculatorButton label="AC" onClick={clear} variant="action" />
              <CalculatorButton label="⌫" onClick={handleBackspace} variant="action" />
              <CalculatorButton label="%" onClick={() => setDisplay(prev => String(parseFloat(prev) / 100))} variant="action" />
              <CalculatorButton label="÷" onClick={() => handleOperation('/')} variant="operator" />

              <CalculatorButton label="7" onClick={() => handleNumber('7')} buttonColor={buttonColor} />
              <CalculatorButton label="8" onClick={() => handleNumber('8')} buttonColor={buttonColor} />
              <CalculatorButton label="9" onClick={() => handleNumber('9')} buttonColor={buttonColor} />
              <CalculatorButton label="×" onClick={() => handleOperation('*')} variant="operator" />

              <CalculatorButton label="4" onClick={() => handleNumber('4')} buttonColor={buttonColor} />
              <CalculatorButton label="5" onClick={() => handleNumber('5')} buttonColor={buttonColor} />
              <CalculatorButton label="6" onClick={() => handleNumber('6')} buttonColor={buttonColor} />
              <CalculatorButton label="−" onClick={() => handleOperation('-')} variant="operator" />

              <CalculatorButton label="1" onClick={() => handleNumber('1')} buttonColor={buttonColor} />
              <CalculatorButton label="2" onClick={() => handleNumber('2')} buttonColor={buttonColor} />
              <CalculatorButton label="3" onClick={() => handleNumber('3')} buttonColor={buttonColor} />
              <CalculatorButton label="+" onClick={() => handleOperation('+')} variant="operator" />

              <CalculatorButton label="." onClick={() => handleNumber('.')} buttonColor={buttonColor} />
              <CalculatorButton label="0" onClick={() => handleNumber('0')} buttonColor={buttonColor} />
              <CalculatorButton label="+/-" onClick={handleNegate} buttonColor={buttonColor} />
              <CalculatorButton label="=" onClick={handleEqual} variant="equal" />
            </div>
          </div>

          {/* Page 2: Scientific */}
          <div className="w-full flex-none snap-center px-1">
            <div className="grid grid-cols-4 gap-3 md:gap-4">
              <CalculatorButton label="sin" onClick={() => handleScientific('sin')} variant="special" />
              <CalculatorButton label="cos" onClick={() => handleScientific('cos')} variant="special" />
              <CalculatorButton label="tan" onClick={() => handleScientific('tan')} variant="special" />
              <CalculatorButton label="log" onClick={() => handleScientific('log')} variant="special" />
              
              <CalculatorButton label="ln" onClick={() => handleScientific('ln')} variant="special" />
              <CalculatorButton label="√" onClick={() => handleScientific('sqrt')} variant="special" />
              <CalculatorButton label="x²" onClick={() => handleScientific('sqr')} variant="special" />
              <CalculatorButton label="xʸ" onClick={() => handleOperation('^')} variant="special" />
              
              <CalculatorButton label="(" onClick={() => handleNumber('(')} variant="special" />
              <CalculatorButton label=")" onClick={() => handleNumber(')')} variant="special" />
              <CalculatorButton label="π" onClick={() => handleScientific('pi')} variant="special" />
              <CalculatorButton label="e" onClick={() => handleScientific('e')} variant="special" />
            </div>
          </div>
        </div>

        {/* Page Indicator */}
        <div className="flex justify-center gap-2 mt-6">
          <div className={`h-1 transition-all duration-300 rounded-full cursor-pointer ${currentPage === 0 ? 'w-4 bg-slate-800 dark:bg-white' : 'w-1 bg-slate-300 dark:bg-slate-800'}`} onClick={() => scrollRef.current?.scrollTo({left: 0, behavior: 'smooth'})} />
          <div className={`h-1 transition-all duration-300 rounded-full cursor-pointer ${currentPage === 1 ? 'w-4 bg-slate-800 dark:bg-white' : 'w-1 bg-slate-300 dark:bg-slate-800'}`} onClick={() => scrollRef.current?.scrollTo({left: 1000, behavior: 'smooth'})} />
        </div>
      </div>
    </div>
  );
};

export default Calculator;
