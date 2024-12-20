// solver.js
function solvePuzzle() {
    let solved = false;
  
    // A function to check if all ends have valid connections
    function checkConnections() {
      // Check all ends and ensure they are connected correctly
      for (const end of data.ends) {
        const endCell = getCell(end.position[0], end.position[1]);
        const img = endCell.querySelector('img');
        const rotation = parseInt(img.style.transform.split('rotate(')[1].split('deg')[0]);
        const connections = getConnection(img.getAttribute('src'), rotation);
        
        // Validate that the end's side is correctly connected
        if (!connections.includes(end.side)) {
          return false;
        }
      }
      return true;
    }
  
    // A function to check if all tails are connected correctly
    function checkTails() {
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
          const cell = data.tails[i][j];
          if (cell) {
            const img = document.querySelector(`[ct_garland_xy_info="x_${i}_y_${j}"] img`);
            const rotation = parseInt(img.style.transform.split('rotate(')[1].split('deg')[0]);
            const connections = getConnection(img.getAttribute('src'), rotation);
  
            // Ensure the connections are valid for each tail
            if (connections.length === 0 || !checkAdjacentConnections(i, j, connections)) {
              return false;
            }
          }
        }
      }
      return true;
    }
  
    // Helper function to check adjacent connections
    function checkAdjacentConnections(x, y, connections) {
      // Check the four possible adjacent directions: top, right, bottom, left
      const adjacentCells = [
        { dx: -1, dy: 0, side: 't' },
        { dx: 1, dy: 0, side: 'b' },
        { dx: 0, dy: 1, side: 'r' },
        { dx: 0, dy: -1, side: 'l' }
      ];
  
      for (const { dx, dy, side } of adjacentCells) {
        const nx = x + dx;
        const ny = y + dy;
  
        if (nx >= 0 && nx < 5 && ny >= 0 && ny < 5) {
          const adjCell = data.tails[nx][ny];
          if (adjCell) {
            const adjImg = document.querySelector(`[ct_garland_xy_info="x_${nx}_y_${ny}"] img`);
            const adjRotation = parseInt(adjImg.style.transform.split('rotate(')[1].split('deg')[0]);
            const adjConnections = getConnection(adjImg.getAttribute('src'), adjRotation);
  
            if (!adjConnections.includes(side)) {
              return false;
            }
          }
        }
      }
      return true;
    }
  
    // A function to rotate the pieces until all connections are correct
    function rotatePieces() {
      let rotated = false;
      let attempts = 0;
  
      while (attempts < 100) {  // Try 100 iterations max
        rotated = false;
        for (let i = 0; i < 5; i++) {
          for (let j = 0; j < 5; j++) {
            const cell = data.tails[i][j];
            if (cell) {
              const img = document.querySelector(`[ct_garland_xy_info="x_${i}_y_${j}"] img`);
              const rotation = parseInt(img.style.transform.split('rotate(')[1].split('deg')[0]);
              const connections = getConnection(img.getAttribute('src'), rotation);
  
              // Rotate the piece if it's not connected properly
              if (!checkAdjacentConnections(i, j, connections)) {
                const newRotation = (rotation + 90) % 360;
                img.setAttribute('style', `transform: rotate(${newRotation}deg)`);
                const newConnections = getConnection(img.getAttribute('src'), newRotation);
                updateProperty(i, j, { rotation: newRotation, connections: newConnections });
                rotated = true;
              }
            }
          }
        }
  
        // Break if we have a solution
        if (checkConnections() && checkTails()) {
          solved = true;
          break;
        }
        
        attempts++;
      }
  
      return rotated;
    }
  
    // Start the solving process
    while (!solved) {
      if (!rotatePieces()) {
        break;  // Exit if no progress is made in one iteration
      }
    }
  
    return solved;
  }
  
  // Call this function to start solving the puzzle
  
  