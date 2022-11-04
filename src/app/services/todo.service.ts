import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { trace } from '@angular/fire/compat/performance';


@Injectable({
  providedIn: 'root'
})
export class TodoService {
  item$: Observable<any[]>;

  constructor(
    private afs: AngularFirestore
  ) {
    const collection = afs.collection<any>('task', ref =>
      ref.orderBy('updatedAt', 'desc')
    );
    this.item$ = collection.snapshotChanges().pipe(
      trace('task'),
      map(it => it.map(change => ({
        ...change.payload.doc.data(),
        id: change.payload.doc.id,
      }))),
    );
  }

  update(item: any) {
    return this.afs.collection('task').add({
      ...item,
      createdOn: new Date().toDateString(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  }
}
