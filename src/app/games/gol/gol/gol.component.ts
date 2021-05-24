import { element } from 'protractor';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-gol',
  templateUrl: './gol.component.html',
  styleUrls: ['./gol.component.scss']
})
export class GolComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D;
  height= 500;
  width= 500;
  resolution = 10;
  row = 0;
  column = 0;
  grid =[];
  cell = {};

  timerInterval;
  constructor() {

  }


   createGrid(){
      for(let i = 0; i < this.row; i++){
        for(let j = 0; j < this.column; j++)
        {
            let value = 0;
            let cell = {
              index: i* this.column + j,
              alive: value == 1 ? true : false,
              row: i,
              col: j
            }
            this.grid.push(cell);
        }
      }
   }

   ngOnInit(): void {
     // this.ctx = this.canvas.nativeElement.getContext('2d');
    this.row = this.width/this.resolution;
    this.column = this.height/this.resolution;
    this.createGrid()
   }

   setGridStyle(){
     return {
       'display': 'grid',
       'grid-template-columns': `repeat(${this.column}, 1fr)`,
       'grid-template-row': `repeat(${this.row}, 1fr)`,
       'justify-items': 'center',
       'gap': '0px 0px',
       'margin': "0 auto",
       'width': `${this.width}px`,
       'height': `${this.height}px`,
     };
   }

   setCellStyle(){
     return {
       'border': '1px solid grey',
       'text-align': 'center',
       'width': `${this.resolution}px`,
       'height': `${this.resolution}px`
     }
   }
   clickCell(cell){
     this.activateCell(cell)
   }

   activateCell(cell){
     this.grid[cell.index] = {...cell, alive: true}
    // let nb = this.checkNeighborAlive(cell)
    // console.log(nb)
    // //  console.table(this.grid)
    // //  console.log(this.grid)
   }

   startGame(){
    this.timerInterval = setInterval(() => {
        this.grid.forEach((currentCell, index) => {
          let numberOfNeigborAlive = this.checkNeighborAlive(currentCell);
          if(currentCell.alive){
            if(numberOfNeigborAlive < 2){
              this.grid[index].alive = false;
            }
            else if(numberOfNeigborAlive === 2 || numberOfNeigborAlive === 3){
              this.grid[index].alive = true;
            }
            else if(numberOfNeigborAlive > 3){
              this.grid[index].alive = false;
            }
            else{
              this.grid[index].alive = false;
            }
          }
          else if(!currentCell.alive){
            if(numberOfNeigborAlive === 3){
              this.grid[index].alive = true;
            }
          }
      })
     }, 1000);
   }

   stopGame(){
    clearInterval(this.timerInterval);
   }

   checkNeighborAlive(cell){

    let numberOfNeigborAlive = 0;

    let leftNeighbor = this.getNeighborLeft(cell);
    if(leftNeighbor.exist && leftNeighbor.alive){
      numberOfNeigborAlive++;
    }

    let rightNeighbor = this.getNeighborRight(cell);
    if(rightNeighbor.exist && rightNeighbor.alive){
      numberOfNeigborAlive++;
    }

    let aboveNeighbor = this.getNeighborAbove(cell);
    if(aboveNeighbor.exist && aboveNeighbor.alive){
      numberOfNeigborAlive++;
    }

    let belowNeighbor = this.getNeighborBelow(cell);
    if(belowNeighbor.exist && belowNeighbor.alive){
      numberOfNeigborAlive++
    }

    let topRightNeighbor = this.getNeighborTopRight(cell);
    if(topRightNeighbor.exist && topRightNeighbor.alive)
    {
      numberOfNeigborAlive++;
    }

    let topLeftNeighbor = this.getNeighborTopLeft(cell);
    if(topLeftNeighbor.exist && topLeftNeighbor.alive)
    {
      numberOfNeigborAlive++;
    }

    let bottomRightNeighbor = this.getNeighborBottomRight(cell);
    if(bottomRightNeighbor.exist && bottomRightNeighbor.alive)
    {
      numberOfNeigborAlive++;
    }

    let bottomLeftNeighbor = this.getNeighborBottomLeft(cell);
    if(bottomLeftNeighbor.exist && bottomLeftNeighbor.alive)
    {
      numberOfNeigborAlive++
    }
    console.log(numberOfNeigborAlive)
    return numberOfNeigborAlive;
   }

   checkRowAndColumn(row, column){
     if(row < 0){return false}
     if(column < 0){return false}
     if(column > this.column -1){return false}
     if(row > this.row - 1){return false}
     return true;
   }

  getNeighborAbove(cell){
    let neighborIndex = cell.index - this.row
    let neighborStatus = {
      x: cell.row -1,
      y: cell.col,
      alive: this.checkRowAndColumn(cell.row -1, cell.col) ? this.grid[neighborIndex].alive : false,
      exist: this.checkRowAndColumn(cell.row -1, cell.col)
    }
    return neighborStatus;
  }

  getNeighborTopRight(cell){
    let neighborIndex = (cell.index - this.row) + 1;
    let neighborStatus = {
      x: cell.row -1,
      y: cell.col + 1,
      alive: this.checkRowAndColumn(cell.row -1, cell.col + 1) ? this.grid[neighborIndex].alive : false,
      exist: this.checkRowAndColumn(cell.row -1, cell.col + 1)
    }
    return neighborStatus;
  }

  getNeighborTopLeft(cell){
    let neighborIndex = (cell.index - this.row) - 1;
    let neighborStatus = {
      x: cell.row -1,
      y: cell.col - 1,
      alive: this.checkRowAndColumn(cell.row -1, cell.col - 1) ? this.grid[neighborIndex].alive : false,
      exist: this.checkRowAndColumn(cell.row -1, cell.col - 1)
    }
    return neighborStatus;
  }

  getNeighborBottomRight(cell){
    let neighborIndex = (cell.index + this.row) + 1;
    let neighborStatus = {
      x: cell.row + 1,
      y: cell.col + 1,
      alive: this.checkRowAndColumn(cell.row + 1, cell.col + 1) ? this.grid[neighborIndex].alive : false,
      exist: this.checkRowAndColumn(cell.row + 1, cell.col + 1)
    }
    return neighborStatus;
  }

  getNeighborBottomLeft(cell){
    let neighborIndex = (cell.index + this.row) - 1;
    let neighborStatus = {
      x: cell.row + 1,
      y: cell.col - 1,
      alive: this.checkRowAndColumn(cell.row + 1, cell.col - 1) ? this.grid[neighborIndex].alive : false,
      exist: this.checkRowAndColumn(cell.row + 1, cell.col - 1)
    }
    return neighborStatus;
  }

  getNeighborBelow(cell){
    let neighborIndex = cell.index + this.row;

    let neighborStatus = {
      x: cell.row +1,
      y: cell.col,
      alive: this.checkRowAndColumn(cell.row +1, cell.col) ? this.grid[neighborIndex].alive : false,
      exist: this.checkRowAndColumn(cell.row +1, cell.col)
    }
    return neighborStatus;
  }

  getNeighborLeft(cell){
    let neighborIndex = cell.index - 1;

    let neighborStatus = {
      x: cell.row,
      y: cell.col - 1,
      alive: this.checkRowAndColumn(cell.row, cell.col -1) ? this.grid[neighborIndex].alive : false,
      exist: this.checkRowAndColumn(cell.row, cell.col -1)
    }
    return neighborStatus;
  }

  getNeighborRight(cell){
    let neighborIndex = cell.index + 1;

    let neighborStatus = {
      x: cell.row,
      y: cell.col - 1,
      alive: this.checkRowAndColumn(cell.row, cell.col + 1) ? this.grid[neighborIndex].alive : false,
      exist: this.checkRowAndColumn(cell.row, cell.col + 1)
    }
    return neighborStatus;
  }

}
