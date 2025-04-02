import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"notes-66dc3","appId":"1:579854407537:web:09f9957e59732be2f888d0","storageBucket":"notes-66dc3.firebasestorage.app","apiKey":"AIzaSyAw9ItJmfl4vwRM1LqJZTPIhZoX1jpZve8","authDomain":"notes-66dc3.firebaseapp.com","messagingSenderId":"579854407537"}))),
    importProvidersFrom(provideFirestore(() => getFirestore()))]
};
