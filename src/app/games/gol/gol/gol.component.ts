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
  height= 1000;
  width= 1000;
  resolution = 20;
  row = 0;
  column = 0;
  grid =[];
  cell = {};
  positions = ['TOP', 'TOP_RIGHT', 'RIGHT', 'BOTTOM_RIGHT', 'BOTTOM', 'LEFT_BOTTOM', 'LEFT', 'LEFT_TOP']
  timerInterval;

  constructor() {
  }
  getCord(event){

    // let rect = this.ctx.canvas.getBoundingClientRect();
    // let x = event.x / this.resolution;
    // console.log(event.clientX )
    // console.log(event)
  }

  drawLiveCell(x, y){
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(x, y, this.resolution - 1, this.resolution -1);
    this.ctx.strokeRect(x, y, this.resolution, this.resolution);
    this.ctx.strokeStyle = '#dadada';
  }

  drawDeadCell(x, y){
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(x, y, this.resolution-1, this.resolution-1);
    this.ctx.strokeRect(x, y, this.resolution, this.resolution);
    this.ctx.strokeStyle = '#dadada';
  }

   createGrid(){

    for(let i = 0; i < this.row; i++){
      for(let j = 0; j < this.column; j++)
      {
          let value = Math.ceil(Math.random() * 2);
          let cell = {
            index: i* this.column + j,
            alive: value == 1 ? true : false,
            row: i,
            col: j
          }
          let x = i * this.resolution;
          let y = j * this.resolution;
          value === 1 ? this.drawLiveCell(x, y) : this.drawDeadCell(x, y);
          this.grid.push(cell);
      }
    }
    this.startGame();
   }

   ngOnInit(): void {
     // this.ctx = this.canvas.nativeElement.getContext('2d');
    this.row = this.width/this.resolution;
    this.column = this.height/this.resolution;
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.createGrid()
   }

   setCanvasStyle(){
     return{
      //  'width': `${this.width}px`,
      //  'height': `${this.height}px`
     }
   }

   activateCell(cell){
     this.grid[cell.index] = {...cell, alive: true}
   }

   determineCellFate(newGenerationGrid, cell, numberOfNeigborAlive, index){

    let x = cell.row * this.resolution;
    let y = cell.col * this.resolution;
    if(cell.alive){
      cell = newGenerationGrid[index]
      if(numberOfNeigborAlive === 2 || numberOfNeigborAlive === 3){
        newGenerationGrid[index].alive = true;
        this.drawLiveCell(x, y);
      }
      else if(numberOfNeigborAlive > 3){
        newGenerationGrid[index].alive = false;
        this.drawDeadCell(x, y);
      }
      else{
        newGenerationGrid[index].alive = false;
        this.drawDeadCell(x, y);
      }
    }
    else if(!newGenerationGrid[index].alive){
      console.log('red')
      if(numberOfNeigborAlive === 3){
        newGenerationGrid[index].alive = true;
        this.drawLiveCell(x, y);
      }
    }
    return newGenerationGrid;
   }

   startGame(){
    this.timerInterval = setInterval(() => {
        let newGenerationGrid = JSON.parse(JSON.stringify(this.grid));
        for(let i = 0; i < newGenerationGrid.length; i++)
        {
            let cell = this.grid[i];
            let numberOfNeigborAlive = this.checkNeighborAlive(cell);
            newGenerationGrid = this.determineCellFate(newGenerationGrid, cell, numberOfNeigborAlive, i);
        }
        this.grid = JSON.parse(JSON.stringify(newGenerationGrid));
   }, 100);
   }

   stopGame(){
    clearInterval(this.timerInterval);
   }

   checkNeighborAlive(cell){
      let numberOfNeigborAlive = 0;

      this.positions.forEach(position => {
        let neighbor = this.getNeighbor(cell, position)
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

   getNeighbor(cell, position){
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
