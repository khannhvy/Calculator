import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { useState } from 'react';
import { Vibration } from 'react-native';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentNumber, setCurrentNumber] = useState('');
  const [lastNumber, setLastNumber] = useState('');
  const [keyboard, setKeyboard] = useState('default'); 
  const [selectedFunction, setSelectedFunction] = useState(null);
  const [openParentheses, setOpenParentheses] = useState(0);

  const defaultKeyboard = ['Mode', 'C', '%', '/', '7', '8', '9', '*', '4', '5', '6', '-', '1', '2', '3', '+', '+/-', '0', '.', '='];
  const secondaryKeyboard = ['Back', 'sin', 'cos', 'tan', 'log', 'ln', 'sqrt', 'e', 'π', '(', ')', '^', '!'];

  const switchKeyboard = () => {
    setKeyboard((prevKeyboard) => (prevKeyboard === 'default' ? 'secondary' : 'default'));
  };

  function calculator() {
    let result;
    if (currentNumber === '') {
      result = 0;
    } else if (selectedFunction) {
      const adjustedNumber = currentNumber.endsWith('(') ? currentNumber + '0)' : currentNumber;
      const angle = parseFloat(adjustedNumber.replace(/[^0-9.]/g, ''));
  
      if (!isNaN(angle)) {
        switch (selectedFunction) {
          case 'sin':
            result = Math.sin(angle * Math.PI / 180);
            break;
          case 'cos':
            result = Math.cos(angle * Math.PI / 180);
            break;
          case 'tan':
            result = Math.tan(angle * Math.PI / 180);
            break;
          case 'log':
            if (angle > 0) {
              result = Math.log10(angle);
            } else {
              result = 'Error'; 
            }
            break;
          case 'ln':
            if (angle > 0) {
              result = Math.log(angle);
            } else {
              result = 'Error';
            }
            break;
          case 'sqrt':
            if (angle > 0) {
              result = Math.sqrt(angle);
            } else {
              result = 'Error';
            }
            break;
          default:
            result = NaN;
        }
        setCurrentNumber(result.toString());
        setSelectedFunction(null); 
      } else {
        setCurrentNumber('Error');
      }
    } else {
      try {
        if (currentNumber.includes('^')) {
          const [base, exponent] = currentNumber.split('^').map(Number);
          result = Math.pow(base, exponent).toString();
        }else if (currentNumber.includes('!')) {
          const number = parseInt(currentNumber.replace('!', ''));
          result = giaithua(number).toString();
        }else {
          result = eval(currentNumber).toString();
        }
        setCurrentNumber(result);
      } catch (e) {
        setCurrentNumber('Error');
      }
    }
  }

  function soam() {
    Vibration.vibrate(35);
    if (currentNumber) {
      setCurrentNumber((parseFloat(currentNumber) * -1).toString());
    }
  }

  function phantram() {
    Vibration.vibrate(35);
    if (currentNumber) {
      setCurrentNumber((parseFloat(currentNumber) / 100).toString());
    }
  }

  function soe() {
    Vibration.vibrate(35);
    if (currentNumber) {
      setCurrentNumber((parseFloat(currentNumber) * Math.E).toString());
    }
  }

  function sopi() {
    Vibration.vibrate(35);
    if (currentNumber) {
      setCurrentNumber((parseFloat(currentNumber) * Math.PI).toString());
    }
  }

  function giaithua(n) {
    if (n < 0) return 'Error'; 
    if (n === 0 || n === 1) return 1; 
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result = result*i;
    }
    return result;
  }

  function handleInput(buttonPressed) {
    if (['+', '-', '*', '/'].includes(buttonPressed)) {
      Vibration.vibrate(35);
    }
    switch (buttonPressed) {
      case 'DEL':
        Vibration.vibrate(35);
        setCurrentNumber(currentNumber.substring(0, currentNumber.length - 1));
        return;
      case 'C':
        Vibration.vibrate(35);
        setLastNumber('');
        setCurrentNumber('');
        setSelectedFunction(null); 
        return;
      case '=':
        Vibration.vibrate(35);
        setLastNumber(currentNumber + '=');
        calculator();
        return;
      case '+/-':
        soam();
        return;
      case '%':
        phantram();
        return;
      case 'Mode': 
        switchKeyboard();
        return;
      case 'Back': 
        if (keyboard === 'secondary') {
          switchKeyboard();
        }
        return;
      case 'sin':
      case 'cos':
      case 'tan':
      case 'log':
      case 'ln':
      case 'sqrt':
        if (currentNumber.includes('sin(') || currentNumber.includes('cos(') || currentNumber.includes('tan(') ||
          currentNumber.includes('log(') || currentNumber.includes('ln(') || currentNumber.includes('sqrt(')) {
        const newExpression = currentNumber.replace(/(sin|cos|tan|log|ln|sqrt)\(/, buttonPressed + '(');
        setCurrentNumber(newExpression); //thaythe
      } else {
        setCurrentNumber(buttonPressed + '('); 
      }
      
      setSelectedFunction(buttonPressed);
      setOpenParentheses(openParentheses + 1);
      return;
      case 'e':
        soe();
        return;
      case 'π':
        sopi();
        return;
      case '(':
        setCurrentNumber(currentNumber + '(');
        setOpenParentheses(openParentheses + 1); 
        return;
      case ')':
        if (openParentheses > 0) {
          setCurrentNumber(currentNumber + ')');
          setOpenParentheses(openParentheses - 1); 
        }
        return;
      case '^':
        setCurrentNumber(currentNumber + '^'); 
        return;
      case '!':
        setCurrentNumber(currentNumber + '!'); 
        return;
      default:
        if (keyboard === 'default') {
          setCurrentNumber(currentNumber + buttonPressed);
        } else {
          console.log('Nút bàn phím phụ không được xử lý:', buttonPressed);
        }
    }
  }

  const buttons = keyboard === 'default' ? defaultKeyboard : secondaryKeyboard;

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? '#1E1E1E' : '#fff' }]}>
      <View style={styles.result}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <TouchableOpacity style={styles.themeButton} onPress={() => setDarkMode(!darkMode)}>
            <Entypo name={darkMode ? 'light-up' : 'moon'} size={24} color={darkMode ? 'white' : 'black'} />
         </TouchableOpacity>
         <TouchableOpacity style={styles.delButton} onPress={() => handleInput('DEL')}>
           <Text style={styles.delButtonText}>DEL</Text>
         </TouchableOpacity>
       </View>
      <Text style={styles.historyText}>{lastNumber}</Text>
      <Text style={styles.resultText}>{currentNumber}</Text>
    </View>
      <View style={styles.buttons}>
        {buttons.map((button) => (
          <TouchableOpacity
            key={button}
            style={[
              styles.button,
              { backgroundColor: ['Mode', 'Back', '%', '=', '/', '*', '-', '+', '+/-'].includes(button) ? '#00b9d6' : (darkMode ? '#414853' : '#ededed') }
            ]}
            onPress={() => handleInput(button)}
          >
            <Text style={[
              styles.textButton,
              { color: ['Mode', 'Back', '%', '=', '/', '*', '-', '+', '+/-'].includes(button) ? 'white' : '#7c7c7c' }
            ]}>
              {button}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 5,
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
  result: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
  },
  resultText: {
    color: '#00b9d6',
    fontSize: 40,
  },
  historyText: {
    color: '#7c7c7c',
    fontSize: 20,
    marginBottom: 10,
    marginRight: 5,
  },
  themeButton: { // darkmode
    position: 'absolute',
    bottom:35,
    left: 20,
    backgroundColor: '#e5e5e5',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 30,
  },
  delButton: {
    position: 'absolute',
    top: 180,
    right: 20,
    backgroundColor: '#bbb', 
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  delButtonText: {
    color: 'black', 
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttons: {
    flex: 2.3,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
  },
  button: {
    flexBasis: '22%',
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    minHeight: 80,
  },
  textButton: {
    fontSize: 28,
    color: '#7c7c7c',
  },
});
