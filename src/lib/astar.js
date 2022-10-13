export function astar(grid, startNode, finishNode) {
  if (!startNode || !finishNode || startNode === finishNode) {
    return false
  }
  let unvisitedNodes = [] //open list
  let visitedNodesInOrder = [] //closed list
  startNode.distance = 0
  unvisitedNodes.push(startNode)

  while (unvisitedNodes.length !== 0) {
    unvisitedNodes.sort((a, b) => a.totalDistance - b.totalDistance)
    let closestNode = unvisitedNodes.shift()
    if (closestNode === finishNode) return visitedNodesInOrder

    closestNode.isVisited = true
    visitedNodesInOrder.push(closestNode)

    let neighbours = getNeighbours(closestNode, grid)
    for (let neighbour of neighbours) {
      let distance = closestNode.distance + 1
      //f(n) = g(n) + h(n)
      if (neighbourNotInUnvisitedNodes(neighbour, unvisitedNodes)) {
        unvisitedNodes.unshift(neighbour)
        neighbour.distance = distance
        neighbour.totalDistance =
          distance + manhattenDistance(neighbour, finishNode)
        neighbour.previousNode = closestNode
      } else if (distance < neighbour.distance) {
        neighbour.distance = distance
        neighbour.totalDistance =
          distance + manhattenDistance(neighbour, finishNode)
        neighbour.previousNode = closestNode
      }
    }
  }
  return visitedNodesInOrder
}

function getNeighbours(node, grid) {
  let neighbours = []
  let { row, col } = node
  if (col !== grid[0].length - 1) neighbours.push(grid[row][col + 1])
  if (row !== grid.length - 1) neighbours.push(grid[row + 1][col])
  if (col !== 0) neighbours.push(grid[row][col - 1])
  if (row !== 0) neighbours.push(grid[row - 1][col])
  return neighbours.filter(
    (neighbour) => !neighbour.isWall && !neighbour.isVisited
  )
}

function neighbourNotInUnvisitedNodes(neighbour, unvisitedNodes) {
  for (let node of unvisitedNodes) {
    if (node.row === neighbour.row && node.col === neighbour.col) {
      return false
    }
  }
  return true
}

function manhattenDistance(node, finishNode) {
  let x = Math.abs(node.row - finishNode.row)
  let y = Math.abs(node.col - finishNode.col)
  return x + y
}

export function getNodesInShortestPathOrderAstar(finishNode) {
  let nodesInShortestPathOrder = []
  let currentNode = finishNode
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode)
    currentNode = currentNode.previousNode
  }
  return nodesInShortestPathOrder
}

export const getInitialGrid = (numRows, numColumns) => {
  let grid = []
  for (let row = 0; row < numRows; row++) {
    let currentRow = []
    for (let col = 0; col < numColumns; col++) {
      currentRow.push(createNode(row, col))
    }
    grid.push(currentRow)
  }
  return grid
}

const createNode = (row, col) => {
  return {
    row,
    col,
    isStart: false,
    isFinish: false,
    distance: Infinity,
    totalDistance: Infinity,
    isVisited: false,
    isShortest: false,
    isWall: false,
    previousNode: null,
  }
}

// export const getNewGridWithWalls = (grid, row, col) => {
//   let newGrid = grid.slice()
//   let node = grid[row][col]
//   let newNode = {
//     ...node,
//     isWall: !node.isWall,
//   }
//   newGrid[row][col] = newNode
//   return newGrid
// }

export const getNewGridWithMaze = (grid, walls) => {
  let newGrid = grid.slice()
  for (let wall of walls) {
    let node = grid[wall[0]][wall[1]]
    let newNode = {
      ...node,
      isWall: true,
    }
    newGrid[wall[0]][wall[1]] = newNode
  }
  return newGrid
}

export function randomMaze(grid, startNode, finishNode) {
  if (!startNode || !finishNode || startNode === finishNode) {
    return false
  }
  let walls = []
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if (
        (row === startNode.row && col === startNode.col) ||
        (row === finishNode.row && col === finishNode.col)
      )
        continue
      if (Math.random() < 0.33) {
        walls.push([row, col])
      }
    }
  }
  walls.sort(() => Math.random() - 0.5)
  return walls
}