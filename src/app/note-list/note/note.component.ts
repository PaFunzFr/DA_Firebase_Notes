import { Component, Input } from '@angular/core';
import { Note } from '../../interfaces/note.interface';
import { NoteListService } from '../../firebase-services/note-list.service'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-note',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './note.component.html',
  styleUrl: './note.component.scss'
})
export class NoteComponent {
  @Input() note!:Note;
  edit = false;
  hovered = false;
  
  constructor(private noteService: NoteListService){}

  changeMarkedStatus(){
    this.note.marked = !this.note.marked;
    this.saveNote();
  }

  deleteHovered(){
    if(!this.edit){
      this.hovered = false;
    }
  }

  openEdit(){
    this.edit = true;
  }

  closeEdit(){
    this.edit = false;
    this.saveNote();
  }

  moveToTrash(){
    if(this.note.id && this.note.type != 'trash') {
      this.note.type = 'trash';
      let docId = this.note.id; // id wird in docId gespeichert
      delete this.note.id; // alte id wird gelöscht
      this.noteService.addNote(this.note, 'trash'); // move to trash // mit alter id
      this.noteService.deleteNote("notes", docId); // delete note from notes
    }
  }

  restoreFromTrash(){
    if(this.note.id && this.note.type == 'trash') {
      this.note.type = 'note';
      let docId = this.note.id; // id wird in docId gespeichert
      delete this.note.id; // alte id wird gelöscht
      this.noteService.addNote(this.note, 'note'); // move to trash // mit alter id
      this.noteService.deleteNote("trash", docId); // delete note from notes
    }
  }

  moveToNotes(){
    if(this.note.id && this.note.type == 'trash') {
      this.note.type = 'note';
      let docId = this.note.id; // id wird in docId gespeichert
      delete this.note.id; // alte id wird gelöscht
      this.noteService.addNote(this.note, 'note'); // move to notes // mit alter id
      this.noteService.deleteNote("trash", docId); // delete note from trash
    }
  }

  deleteNote(){
    if(this.note.id && this.note.type == 'trash') {
      this.noteService.deleteNote("trash", this.note.id); // delete note
    }
  }

  saveNote(){
    this.noteService.updateNote(this.note);
  }
}
