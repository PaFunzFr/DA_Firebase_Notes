import { Injectable, inject } from '@angular/core';
import { Note } from '../interfaces/note.interface'
import { Firestore, collection, doc, onSnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';


interface Item {

}
@Injectable({
  providedIn: 'root'
})
export class NoteListService {

  unsubList;
  unsubSingle;

  firestore: Firestore = inject(Firestore);



  constructor() {
    // referenz auf sammlung
    this.unsubList = onSnapshot(this.getNotesRef(), (list) => {  // onSnapshot(Referenz)
      list.forEach((element) => {
        console.log(element);
        console.log(element.data());
      });
    });
  
    // referenz auf dokument
    this.unsubSingle = onSnapshot(this.getSingleTrashRef("notes", "PNs3O5bpyxQqyRTtpTM6"), (element) => {
      if (element.exists()) {
        const data = element.data();
        console.log('das ist der Wert');
        console.log(data['title']);
        console.log(element.id);
      } else {
        console.log("Dokument existiert nicht.");
      }
    });

  }

  ngDestroy(): void {
    this.unsubList;

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
}
