import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { FaceSnap } from '../models/face-snap.model';

@Injectable({
  providedIn: 'root',
})
export class FaceSnapsService {
  constructor(private http: HttpClient) {}

  getAllFaceSnaps(): Observable<FaceSnap[]> {
    return this.http.get<FaceSnap[]>('http://localhost:3000/facesnaps');
  }

  getFaceSnapById(faceSnapId: number): Observable<FaceSnap> {
    return this.http.get<FaceSnap>(
      `http://localhost:3000/facesnaps/${faceSnapId}`
    );
  }

  snapFaceSnapById(
    faceSnapId: number,
    snapType: 'snap' | 'unsnap'
  ): Observable<FaceSnap> {
    return this.getFaceSnapById(faceSnapId).pipe(
      map((faceSnap) => ({
        ...faceSnap,
        snaps: faceSnap.snaps + (snapType === 'snap' ? 1 : -1),
      })),
      switchMap((updatedFaceSnap) =>
        this.http.put<FaceSnap>(
          `http://localhost:3000/facesnaps/${faceSnapId}`,
          updatedFaceSnap
        )
      )
    );
  }

  addFaceSnap(formValue: {
    title: string;
    description: string;
    imageUrl: string;
    location?: string;
  }): Observable<FaceSnap> {
    return this.getAllFaceSnaps().pipe(
      // trier les facesnaps par id
      map((facesnaps) =>
        [...facesnaps].sort((a: FaceSnap, b: FaceSnap) => a.id - b.id)
      ),
      // le dernier du tableau (id max)
      map((sortedFAceSnaps) => sortedFAceSnaps[sortedFAceSnaps.length - 1]),
      // ajouter 1 à son id et générer nouveau faceSnap
      map((previousFaceSnap) => ({
        ...formValue,
        snaps: 0,
        createdDate: new Date(),
        id: previousFaceSnap.id + 1,
      })),
      // envoyer au serveur
      switchMap((newFacesnap) =>
        this.http.post<FaceSnap>('http://localhost:3000/facesnaps', newFacesnap)
      )
    );
  }
}
