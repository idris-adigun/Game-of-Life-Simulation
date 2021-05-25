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
  positions = ['TOP', 'TOP_RIGHT', 'RIGHT', 'BOTTOM_RIGHT', 'BOTTOM', 'LEFT_BOTTOM', 'LEFT', 'LEFT_TOP']

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
   }

   startGame(){
    this.timerInterval = setInterval(() => {
      let prevGridGeneration = JSON.parse(JSON.stringify(this.grid));
      prevGridGeneration.forEach((currentCell, index) => {
        let numberOfNeigborAlive = this.checkNeighborAlive(currentCell);
        if(currentCell.alive){
          if(numberOfNeigborAlive < 2){
            prevGridGeneration[index].alive = false;
          }
          else if(numberOfNeigborAlive === 2 || numberOfNeigborAlive === 3){
            prevGridGeneration[index].alive = true;
          }
          else if(numberOfNeigborAlive > 3){
            prevGridGeneration[index].alive = false;
          }
          else{
            prevGridGeneration[index].alive = false;
          }
        }
        else if(!currentCell.alive){
          if(numberOfNeigborAlive === 3){
            prevGridGeneration[index].alive = true;
          }
        }
      });
      this.grid = JSON.parse(JSON.stringify(prevGridGeneration));
   }, 1000);
   }

   stopGame(){
    clearInterval(this.timerInterval);
   }

   checkNeighborAlive(cell){
      let numberOfNeigborAlive = 0;

      this.positions.forEach(position => {
        let neighbor = this.getNeighbors(cell, position)
        if(neighbor.exist && neighbor.alive){
          numberOfNeigborAlive++;
        }
      })
      return numberOfNeigborAlive;
   }

   checkRowAndColumn(row, column){
     if(row < 0){return false}
     if(column < 0){return false}
     if(column > this.column -1){return false}
     if(row > this.row - 1){return false}
     return true;
   }

   getNeighbors(cell, position){
      let cordinates = this.getPositionCordinate(cell, position);
      let neighborStatus = {
        x: cordinates.x,
        y: cordinates.y,
        alive: this.checkRowAndColumn(cordinates.x, cordinates.y) ? this.grid[cordinates.index].alive : false,
        exist: this.checkRowAndColumn(cordinates.x, cordinates.y)
      }
      return neighborStatus;

   }

   getPositionCordinate(cell, position){
      let cord : any;
      position === 'TOP' ? cord = {x: cell.row -1, y: cell.col, index: cell.index - this.row} : '';
      position === 'TOP_RIGHT' ? cord = {x: cell.row -1, y: cell.col + 1, index: (cell.index - this.row) + 1} : '';
      position === 'RIGHT' ? cord = {x: cell.row, y: cell.col + 1, index: cell.index + 1} : '';
      position === 'BOTTOM_RIGHT' ? cord = {x: cell.row + 1, y: cell.col + 1, index: (cell.index + this.row) + 1} : '';
      position === 'BOTTOM' ? cord = {x: cell.row +1, y: cell.col, index: cell.index + this.row} : '';
      position === 'LEFT_BOTTOM' ? cord = {x: cell.row +1, y: cell.col -1, index: (cell.index + this.row) -1} : '';
      position === 'LEFT' ? cord = {x: cell.row, y: cell.col -1, index: cell.index - 1} : '';
      position === 'LEFT_TOP' ? cord = {x: cell.row -1, y: cell.col - 1, index: (cell.index - this.row) - 1} : '';
      return cord;
   }

}
