import React, { useState, useEffect } from "react";
import Draggable from "react-draggable";
import "./animations.css";

const GlassmorphismMenuWithDraggableCalculator = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [calc, setCalc] = useState({
    display: "0",
    operation: null,
    firstValue: null,
    waitingForSecondValue: false,
  });
  const [animation, setAnimation] = useState("");

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const menuItems = [
    { icon: "🏠", text: "Início", href: "#home" },
    { icon: "👥", text: "Sobre", href: "#about" },
    { icon: "⚙️", text: "Serviços", href: "#services" },
    { icon: "📞", text: "Contato", href: "#contact" },
  ];

  const handleNumberClick = (number) => {
    setAnimation("pulse");
    setTimeout(() => setAnimation(""), 300);
    if (calc.waitingForSecondValue) {
      setCalc({
        ...calc,
        display: number.toString(),
        waitingForSecondValue: false,
      });
    } else {
      setCalc({
        ...calc,
        display:
          calc.display === "0"
            ? number.toString()
            : calc.display + number.toString(),
      });
    }
  };

  const handleOperationClick = (operation) => {
    setAnimation("shake");
    setTimeout(() => setAnimation(""), 300);
    if (calc.firstValue === null) {
      setCalc({
        ...calc,
        firstValue: parseFloat(calc.display),
        operation,
        waitingForSecondValue: true,
      });
    } else if (calc.waitingForSecondValue) {
      setCalc({ ...calc, operation });
    } else {
      const result = performCalculation();
      setCalc({
        display: result.toString(),
        firstValue: result,
        operation,
        waitingForSecondValue: true,
      });
    }
  };

  const performCalculation = () => {
    const first = calc.firstValue;
    const second = parseFloat(calc.display);
    switch (calc.operation) {
      case "+":
        return first + second;
      case "-":
        return first - second;
      case "*":
        return first * second;
      case "/":
        return first / second;
      default:
        return second;
    }
  };

  const handleEquals = () => {
    if (!calc.operation || calc.waitingForSecondValue) return;
    const result = performCalculation();
    setCalc({
      display: result.toString(),
      firstValue: null,
      operation: null,
      waitingForSecondValue: false,
    });
  };

  const handleClear = () => {
    setCalc({
      display: "0",
      operation: null,
      firstValue: null,
      waitingForSecondValue: false,
    });
  };

  const CalculatorButton = ({ onClick, children, className = "" }) => (
    <button
      onClick={onClick}
      className={`w-full h-12 rounded-lg ${
        isDarkMode ? "bg-gray-700 text-white" : "bg-purple-200 text-purple-800"
      } hover:opacity-80 transition-all duration-300 transform hover:scale-105 active:scale-95 ${className}`}
    >
      {children}
    </button>
  );

  return (
    <div
      className={`relative min-h-screen ${
        isDarkMode
          ? "bg-gray-900"
          : "bg-gradient-to-br from-purple-400 via-pink-500 to-red-500"
      } overflow-hidden transition-colors duration-300`}
    >
      {/* Fundo animado */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white bg-opacity-10"
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 10 + 5}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Calculadora Interativa e Arrastável */}
      <Draggable handle=".drag-handle">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div
            className={`w-64 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl p-4 shadow-lg transition-all duration-300 ${animation}`}
          >
            <div className="drag-handle cursor-move h-6 bg-gray-200 bg-opacity-50 rounded-t-lg mb-2 flex items-center justify-center">
              <div className="w-16 h-1 bg-gray-400 rounded-full"></div>
            </div>
            <div
              className={`mb-4 p-2 rounded-lg ${
                isDarkMode
                  ? "bg-gray-800 text-white"
                  : "bg-purple-100 text-purple-800"
              } text-right text-2xl transition-colors duration-300`}
            >
              {calc.display}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {["7", "8", "9", "/"].map((btn) => (
                <CalculatorButton
                  key={btn}
                  onClick={() =>
                    isNaN(btn)
                      ? handleOperationClick(btn)
                      : handleNumberClick(parseInt(btn))
                  }
                >
                  {btn}
                </CalculatorButton>
              ))}
              {["4", "5", "6", "*"].map((btn) => (
                <CalculatorButton
                  key={btn}
                  onClick={() =>
                    isNaN(btn)
                      ? handleOperationClick(btn)
                      : handleNumberClick(parseInt(btn))
                  }
                >
                  {btn}
                </CalculatorButton>
              ))}
              {["1", "2", "3", "-"].map((btn) => (
                <CalculatorButton
                  key={btn}
                  onClick={() =>
                    isNaN(btn)
                      ? handleOperationClick(btn)
                      : handleNumberClick(parseInt(btn))
                  }
                >
                  {btn}
                </CalculatorButton>
              ))}
              <CalculatorButton onClick={() => handleNumberClick(0)}>
                0
              </CalculatorButton>
              <CalculatorButton onClick={handleClear}>C</CalculatorButton>
              <CalculatorButton onClick={handleEquals}>=</CalculatorButton>
              <CalculatorButton onClick={() => handleOperationClick("+")}>
                +
              </CalculatorButton>
            </div>
          </div>
        </div>
      </Draggable>

      {/* Menu Glassmorphism */}
      <nav
        className={`
        fixed top-0 left-0 right-0 z-50
        ${
          isDarkMode ? "bg-gray-800 bg-opacity-80" : "bg-white bg-opacity-20"
        } backdrop-filter backdrop-blur-lg
        border border-white border-opacity-30 shadow-lg
        ${isMobile ? (isOpen ? "h-full" : "h-16") : "h-16"}
        transition-all duration-300 ease-in-out
      `}
        aria-label="Primary Navigation"
      >
        {isMobile && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="absolute top-3 right-4 p-2 text-white"
            aria-expanded={isOpen}
            aria-controls="menu-list"
          >
            {isOpen ? "✕" : "☰"}
            <span className="sr-only">
              {isOpen ? "Fechar menu" : "Abrir menu"}
            </span>
          </button>
        )}
        <ul
          id="menu-list"
          className={`
          ${
            isMobile
              ? `flex flex-col items-center justify-center space-y-8 ${
                  isOpen ? "opacity-100 visible mt-16" : "opacity-0 invisible"
                }`
              : "flex flex-row justify-end items-center h-full px-4 space-x-6"
          }
          transition-all duration-300
        `}
        >
          {menuItems.map((item, index) => (
            <li key={index}>
              <a
                href={item.href}
                className="flex items-center text-white hover:text-purple-200 focus:text-purple-200 transition-colors duration-300 outline-none focus:ring-2 focus:ring-purple-300"
              >
                <span className="mr-2" aria-hidden="true">
                  {item.icon}
                </span>
                <span className={isMobile ? "text-2xl" : "text-lg"}>
                  {item.text}
                </span>
              </a>
            </li>
          ))}
          <li>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="text-white hover:text-purple-200 focus:text-purple-200 transition-colors duration-300 outline-none focus:ring-2 focus:ring-purple-300"
              aria-label={
                isDarkMode ? "Ativar modo claro" : "Ativar modo escuro"
              }
            >
              {isDarkMode ? "☀️" : "🌙"}
            </button>
          </li>
        </ul>
      </nav>

      {/* Efeito de partículas flutuantes */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.1,
              animation: `float ${
                Math.random() * 10 + 5
              }s infinite ease-in-out ${Math.random() * 5}s`,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default GlassmorphismMenuWithDraggableCalculator;
