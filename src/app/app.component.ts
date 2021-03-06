import { Component } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  voted: boolean;

  constructor(private af: AngularFirestore, router: Router) {
    af.collection('/games')
      .valueChanges()
      .subscribe(v => {
        this.game = new Game(v[0]);
        this.haveJoined =
          this.game.developers.some(d => this.name && d.name === this.name) ||
          this.game.scrumMasters.some(sm => this.name && sm.name === this.name);
        if (this.game.developers.length) {
          this.average = this.game.developers
            .map(d => d.points)
            .reduce((p, c) => p + c) / this.game.developers.filter(d => d.points && d.points > 0).length;
          this.percentVoted = (this.game.developers.filter(d => d.points && d.points > 0).length / this.game.developers.length) * 100;
        }
        if (this.game.hackers.includes(this.name)) {
          window.location.href = "assets/fuckYourself.html";

        }
        if (this.game.flipped) {
          this.points = null;
          this.voted = false;
        }
      });

    this.game1Ref = this.af.collection('/games').doc('/game1');
    this.game1Ref.get().subscribe(g => (this.game = new Game(g.data())));

  }
  gameName: string;
  name: string;
  game: Game;
  game1Ref: AngularFirestoreDocument;
  points: number;
  role = 'dev';
  haveJoined: boolean;
  average: number;
  percentVoted: number;
  voter = new ReplaySubject();
  flip() {
    if (this.game.flipped) {
      this.game.developers.forEach(d => (d.points = null));
    }
    this.game.flipped = !this.game.flipped;
    this.game1Ref.set(this.game.toObj());
  }
  canJoin() {
    return (
      (this.role === 'dev' &&
        this.game.developers.every(d => d.name !== this.name)) ||
      (this.role === 'sm' &&
        this.game.scrumMasters.every(sm => sm.name !== this.name))
    );
  }
  join() {
    if (this.game.hackers.includes(this.name)) {
      window.location.href = "assets/fuckYourself.html";

    }
    if (this.canJoin()) {
      if (this.role === 'dev') {
        this.game.developers.push({ name: this.name, points: 0 });
      } else {
        this.game.scrumMasters = this.game.scrumMasters || [];
        this.game.scrumMasters.push({ name: this.name });
      }
      this.game1Ref.set(this.game.toObj());
    } else {
      this.haveJoined = true;
    }
  }
  leave() {
    this.game.developers = [];
    this.game1Ref.set(this.game.toObj());
  }
  startNewGame() {
    this.game = new Game(new Player(this.name));
    this.game1Ref.set(this.game.toObj());
  }
  vote() {
    this.game.developers.find(d => d.name === this.name).points = this.points;
    this.game1Ref.set(this.game.toObj());
    this.voted = true;

  }
  onEnter(event) {
    if (event.key == 'Enter') {
      this.vote()
    }
  }
}

export class Game {
  constructor(g) {
    Object.assign(this, g);
  }
  hackers: string[] = [];
  flipped = false;
  developers: Developer[] = [];
  scrumMasters: Player[] = [];
  toObj() {
    return Object.assign({}, this);
  }
  setScrumMaster(scrumMaster: Player) {
    this.scrumMasters.push(scrumMaster);
  }
}

export class Player {
  constructor(public name: string) { }
}
export class Developer extends Player {
  points: number;
}
