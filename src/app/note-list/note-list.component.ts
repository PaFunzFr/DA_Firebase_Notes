import { Component, inject } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import { NoteListService } from '../firebase-services/note-list.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NoteComponent } from './note/note.component';

@Component({
  selector: 'app-note-list',
  standalone: true,
  imports: [FormsModule, CommonModule, NoteComponent],
  templateUrl: './note-list.component.html',
  styleUrl: './note-list.component.scss'
})
export class NoteListComponent {

  noteList = inject(NoteListService);

  favFilter: "all" | "fav" = "all";
  status: "notes" | "trash" = "notes";

  constructor() { 
    
  }

  getList(target: string): Note[] { // target ist der Filter
    if (target == "notes") {
      if (this.favFilter == "all") {
        return this.noteList.normalNotes; // holt das array aus dem service      return this.noteList.normalNotes; // holt das array aus dem service
      } else {
        return this.noteList.favNotes; // holt das array aus dem service
      }
    }  else  {
      return this.noteList.trashNotes; 
    }
  }

  changeFavFilter(filter:"all" | "fav"){
    this.favFilter = filter;
  }

  changeTrashStatus(){
    if(this.status == "trash"){
      this.status = "notes";
    } else {
      this.status = "trash";
      this.favFilter = "all";
    }
  }


}
