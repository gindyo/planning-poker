import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AngularFireModule } from "@angular/fire";
import { AngularFirestore } from "@angular/fire/firestore";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";;
import { MatListModule } from "@angular/material/list";
const config = {
  apiKey: "AIzaSyD1r9EGAT7n73Kf-qPXbIqFSZVWX9bqlMQ",
  authDomain: "planning-pocker-6b6a6.firebaseapp.com",
  databaseURL: "https://planning-pocker-6b6a6.firebaseio.com",
  projectId: "planning-pocker-6b6a6",
  storageBucket: "",
  messagingSenderId: "1001464673332"
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    MatListModule,
    MatInputModule,
    MatButtonModule,
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(config)
  ],
  providers: [AngularFirestore],
  bootstrap: [AppComponent]
})
export class AppModule { }
