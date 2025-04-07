import { Injectable, inject } from '@angular/core';
import { Note } from '../interfaces/note.interface'
import { Firestore, collection, doc, onSnapshot, collectionData, addDoc, updateDoc } from '@angular/fire/firestore';
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

  async addNote(item: {}) {
    try {
      await addDoc (this.getNotesRef(), item);
    } catch (error) {
      console.error(error);
    }
  }

  async updateNote(note: Note) {
    if (note.id) { // wenn note.id existiert führe aus
      try {
        let docRef = this.getSingleNoteRef(this.getColIdFromNote(note), note.id);
        await updateDoc((docRef), this.getCleanJson(note));
      } catch (error) {
        console.error(error);
      }
    }
  }

  // quasi interface von note
  getCleanJson(note:Note):{} {
    return {
      type: note.type,
      title: note.title,
      content: note.content,
      marked: note.marked
    }
  }

  // => get collection ID
  getColIdFromNote(note: Note): "notes" | "trash" {
    if(note.type == "note") {
      return "notes"
    } else {
      return "trash"
    }
  }

  // was macht das? => recherche
  ngDestroy(): void {
    this.unsubTrash;
    this.unsubNotes;
  }

  normalNotes: Note[] = [];
  trashNotes: Note[] = [];

  // nutzen von collection => doku firebase
  // liest komplette collection => notes | trash
  getNotesRef() {
    return collection(this.firestore, 'notes');
  }
  getTrashRef() {
    return collection(this.firestore, 'trash');
  }

  // nutzen von doc() => doku firebase
  // liest ein einzelnes document aus => note | trash
  // colId = collectionID / docId = documentID
  getSingleTrashRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId)
  }

  getSingleNoteRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId)
  }

  // setzt die Daten in das Note-Objekt
  setNoteObject(obj: any, id: string): Note {
    return {
      id: id,
      type: obj.type || "note",
      title: obj.title || "",
      content: obj.content || "",
      marked: obj.marked || false
    };
  }

  // liest alle Notes aus der DB und speichert in Array trashNotes
  subTrashList() {
    onSnapshot(this.getTrashRef(), (list) => {  // onSnapshot(Referenz) => =subscribe => holt echtzeit Infos aus getTrashRef
      this.trashNotes = []; // leert Array => refresh
      list.forEach((element) => {
        this.trashNotes.push(this.setNoteObject(element.data(), element.id)); // füllt Array mit Datenbank Infos
      });
    });
  }

  // liest alle Notes aus der DB und speichert in Array normalNotes
  subNotesList() {
    onSnapshot(this.getNotesRef(), (list) => {  // onSnapshot(Referenz)
      this.normalNotes = [];
      list.forEach((element) => {
        this.normalNotes.push(this.setNoteObject(element.data(), element.id));
      });
    });
  }

}

