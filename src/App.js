import React, { useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  const [game, setGame] = React.useState(new Chess());

  function safeGameMutate(modify) {
    setGame((currentGame) => {
      // Crear una nueva instancia de Chess con el estado actual
      const newGame = new Chess(currentGame.fen());
      // Aplicar la modificación
      modify(newGame);
      // Devolver la nueva instancia
      return newGame;
    });
  }

  // Efecto para mostrar el turno inicial
  React.useEffect(() => {
    showNotification(`Mueven las ${game.turn() === 'w' ? 'blancas' : 'negras'}`);
  }, []); // Solo se ejecuta una vez al montar el componente

  function showNotification(message, isWarning = false) {
    const options = {
      position: "top-center",
      autoClose: isWarning ? 3000 : 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      style: {
        background: isWarning ? '#ff6b6b' : '#4CAF50',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '1.1em',
        textAlign: 'center',
        padding: '15px 25px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
      }
    };
    
    toast(message, options);
  }

  function onDrop(sourceSquare, targetSquare) {
    try {
      let moveSucceeded = false;
      let nextTurn = null;
      let isCheck = false;
      let isCheckmate = false;
      
      safeGameMutate((game) => {
        try {
          // Guardar el turno actual antes del movimiento
          const currentTurn = game.turn();
          
          // Intentar hacer el movimiento
          const move = game.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: 'q', // Siempre promociona a reina por simplicidad
          });
          
          if (move) {
            moveSucceeded = true;
            // Verificar estado del juego
            isCheck = game.isCheck();
            isCheckmate = game.isCheckmate();
            nextTurn = game.turn();
            
            // Mostrar notificaciones
            setTimeout(() => {
              if (isCheckmate) {
                showNotification(`¡Jaque Mate! ${currentTurn === 'w' ? 'Blancas' : 'Negras'} ganan`, true);
              } else if (isCheck) {
                showNotification(`¡Jaque! Mueven las ${nextTurn === 'w' ? 'blancas' : 'negras'}`, true);
              } else {
                showNotification(`Mueven las ${nextTurn === 'w' ? 'blancas' : 'negras'}`);
              }
            }, 100);
          } else {
            moveSucceeded = false;
          }
        } catch (e) {
          // Si hay un error, el movimiento es inválido
          moveSucceeded = false;
        }
      });
      
      return moveSucceeded; // Devuelve true solo si el movimiento fue válido
    } catch (e) {
      console.error('Error al procesar el movimiento:', e);
      return false; // Devuelve false si hubo algún error inesperado
    }
  }

  // Usamos un tamaño fijo que será controlado por CSS
  const boardSize = 600; // Este valor será sobrescrito por CSS

  return (
    <div className="app">
      <header>
        <h1>Ajedrez en React version 222</h1>
      </header>
      <div className="chessboard-container">
        <div style={{ width: '100%', height: '100%' }}>
          <Chessboard 
            position={game.fen()} 
            onPieceDrop={onDrop}
            boardWidth={boardSize}
            customBoardStyle={{
              width: '100%',
              height: '100%',
              borderRadius: '4px',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)'
            }}
            customDarkSquareStyle={{ backgroundColor: '#779556' }}
            customLightSquareStyle={{ backgroundColor: '#ebecd0' }}
            customSquareStyles={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          />
        </div>
        <ToastContainer 
          position="top-center"
          autoClose={2000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastStyle={{
            fontSize: '1.1em',
            fontWeight: 'bold',
            textAlign: 'center',
            padding: '12px 24px',
            borderRadius: '8px',
          }}
        />
      </div>
    </div>
  );
}

export default App;
