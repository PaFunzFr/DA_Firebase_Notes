import { Injectable, inject } from '@angular/core';
import { Note } from '../interfaces/note.interface'
import { Firestore, collection, doc, onSnapshot, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';


interface Item {

}
@Injectable({
  providedIn: 'root'
})
export class NoteListService {

  unsubTrash;
  unsubNotes;
  item$;
  items;

  firestore: Firestore = inject(Firestore);

  constructor() {
    this.unsubNotes = this.subNotesList();
    this.unsubTrash = this.subTrashList();
    this.item$ = collectionData(this.getNotesRef());
    this.items = this.item$.subscribe();

    // referenz auf sammlung
    // vorteil zugriff auf u.a. die ID
    // this.unsubList = onSnapshot(this.getNotesRef(), (list) => {  // onSnapshot(Referenz)
    //   list.forEach((element) => {
    //     console.log(element);
    //     console.log(element.data());
    //     console.log(this.setNoteObject(element.data(), element.id));
        
    //   });
    // });
  
    // referenz auf dokument
    // this.unsubSingle = onSnapshot(this.getSingleTrashRef("notes", "PNs3O5bpyxQqyRTtpTM6"), (element) => {
    //   if (element.exists()) {
    //     const data = element.data();
    //     console.log('das ist der Wert');
    //     console.log(data['title']);
    //     console.log(element.id);
    //   } else {
    //     console.log("Dokument existiert nicht.");
    //   }
    // });

  }

  ngDestroy(): void {
    this.unsubTrash;
    this.unsubNotes;
  }

  normalNotes: Note[] = [];
  trashNotes: Note[] = [];

  getNotesRef() {
    return collection(this.firestore, 'notes');
  }
  getTrashRef() {
    return collection(this.firestore, 'trash');
  }

  getSingleTrashRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId)
  }

  setNoteObject(obj: any, id: string): Note {
    return {
      id: id,
      type: obj.type || "note",
      title: obj.title || "",
      content: obj.content || "",
      marked: obj.marked || false
    };
  }

  subTrashList() {
    onSnapshot(this.getTrashRef(), (list) => {  // onSnapshot(Referenz) => =subscribe => holt echtzeit Infos aus getTrashRef
      this.trashNotes = []; // leert Array => refresh
      list.forEach((element) => {
        this.trashNotes.push(this.setNoteObject(element.data(), element.id)); // füllt Array mit Datenbank Infos
      });
    });
  }

  subNotesList() {
    onSnapshot(this.getNotesRef(), (list) => {  // onSnapshot(Referenz)
      this.normalNotes = [];
      list.forEach((element) => {
        this.normalNotes.push(this.setNoteObject(element.data(), element.id));
      });
    });
  }

}

