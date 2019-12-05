import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { Proposition } from 'src/app/questions/interfaces/proposition.interface';
import { DataJson } from './../../interfaces/data-json.interface';
import { Question } from './../../questions/interfaces/question.interface';

@Injectable()
export class QuizzService {
  public questions: Array<DataJson>;

  private _score = 0; // tslint:disable-line
  private readonly nbQuestions: number = 5;

  get score(): number {
    return this._score;
  }

  set score(score: number) {
    this._score = score;
  }

  constructor(private http: HttpClient) {}

  public buildNewQuizz(): Observable<Question[]> {
    return this.http.get<DataJson[]>('http://localhost:3000/questions').pipe(
      filter(questions => questions.length > 0),
      tap(questions => (this.questions = questions)),
      tap((questions: any[]) => this.shuffle(questions)),
      map(questions => questions.slice(0, this.nbQuestions)),
      map(questions => {
        return questions.map(q => this.buildQuestion(q));
      })
    );
  }

  private shuffle(questions: any[]): Array<any> {
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }
    return questions;
  }

  private buildQuestion(data: DataJson): Question {
    let propositions: Array<Proposition> = [];
    const newQuestion: Question = {
      header: '',
      propositions: []
    };

    this.questions = this.shuffle(this.questions);
    let questionsWithSameContinent = this.questions.filter(question => {
      return (
        data.continent === question.continent && question.pays !== data.pays
      );
    });

    questionsWithSameContinent = questionsWithSameContinent.slice(0, 3);

    newQuestion.header = `Quelle est la capitale du pays: "${data.pays}" ?`;
    const proposition: Proposition = {
      label: data.capitale,
      correct: true
    };

    questionsWithSameContinent.forEach(question => {
      propositions.push({
        label: question.capitale,
        correct: false
      });
    });

    propositions.push(proposition);
    propositions = this.shuffle(propositions);
    newQuestion.propositions = propositions;
    return newQuestion;
  }
}
